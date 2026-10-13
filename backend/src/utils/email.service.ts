import nodemailer from 'nodemailer';
import { BRAND } from '../config/brand.config';

interface SendPasswordResetParams {
  to: string;
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

interface SendPasswordChangedParams {
  to: string;
  name: string;
}

/**
 * Check which email transport is configured
 */
const getEmailConfig = () => {
  const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  const isResend = Boolean(resendApiKey && resendApiKey.startsWith('re_'));

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

  const isSmtp = Boolean(smtpUser && smtpPass);

  return {
    isResend,
    resendApiKey,
    isSmtp,
    smtpHost: smtpHost || 'smtp.gmail.com',
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,
    fromEmail: process.env.EMAIL_FROM || BRAND.supportEmail || 'campusget.in@gmail.com',
  };
};

/**
 * Send email using Resend HTTPS API (Port 443 - 100% immune to Render firewall port blocks)
 */
const sendViaResend = async (
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // If using resend sandbox, default from to onboarding@resend.dev unless custom domain verified
    let sender = from;
    if (!sender.includes('@') || sender.endsWith('@gmail.com')) {
      sender = `CampusGet <onboarding@resend.dev>`;
    } else if (!sender.includes('<')) {
      sender = `CampusGet <${sender}>`;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error('[RESEND API ERROR]', data);
      return { success: false, error: data.message || 'Resend API failed' };
    }

    console.log(`[EMAIL SENT VIA RESEND] Message ID: ${data.id} to ${to}`);
    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('[RESEND FETCH ERROR]', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email using Nodemailer SMTP (Gmail, Brevo, SendGrid, Amazon SES, or custom SMTP)
 */
const sendViaSmtp = async (
  config: ReturnType<typeof getEmailConfig>,
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Helps avoid self-signed cert issues on cloud relays
      },
    });

    const info = await transporter.sendMail({
      from: `"CampusGet Support" <${config.smtpUser}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`[EMAIL SENT VIA SMTP] Message ID: ${info.messageId} to ${to}`);
    return { success: true, id: info.messageId };
  } catch (error: any) {
    console.error('[SMTP ERROR]', error);
    return { success: false, error: error.message };
  }
};

/**
 * HTML Template for Password Reset Email
 */
const buildPasswordResetHtml = (name: string, resetUrl: string, expiresInMinutes: number): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f19; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #111827; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 28px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                CampusGet
              </h1>
              <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 500;">
                Academic Marketplace & Project Portal
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                Password Reset Request
              </h2>

              <p style="margin: 0 0 16px 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
                Hello <strong style="color: #f3f4f6;">${name || 'Student/Developer'}</strong>,
              </p>

              <p style="margin: 0 0 24px 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
                We received a request to reset the password for your CampusGet account. To set a new password, click the secure button below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); text-align: center;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Callout -->
              <div style="background-color: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin: 24px 0;">
                <p style="margin: 0; color: #fbbf24; font-size: 13px; line-height: 1.5;">
                  ⏱️ <strong>Note:</strong> This link is secure and will expire in <strong>${expiresInMinutes} minutes</strong>. It can only be used once.
                </p>
              </div>

              <!-- Raw Link Fallback -->
              <p style="margin: 24px 0 8px 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                Button not working? Copy and paste this URL directly into your browser:
              </p>
              <p style="margin: 0 0 24px 0; word-break: break-all;">
                <a href="${resetUrl}" target="_blank" style="color: #10b981; font-size: 12px; text-decoration: underline;">
                  ${resetUrl}
                </a>
              </p>

              <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 28px 0;" />

              <!-- Security Disclaimer -->
              <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                🔒 If you did not make this request, you can safely ignore this email. Your account remains completely secure and your password will not be changed.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d131f; padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 12px;">
                © 2026 CampusGet. All rights reserved.
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 11px;">
                Support Helpdesk: ${BRAND.supportEmail}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Main function: Send Password Reset Email
 */
export const sendPasswordResetEmail = async ({
  to,
  name,
  resetUrl,
  expiresInMinutes = 30,
}: SendPasswordResetParams): Promise<{ success: boolean; message?: string }> => {
  const config = getEmailConfig();
  const subject = 'Reset Your CampusGet Password';
  const html = buildPasswordResetHtml(name, resetUrl, expiresInMinutes);
  const text = `Hi ${name},\n\nYou requested a password reset for your CampusGet account.\nClick the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in ${expiresInMinutes} minutes.\nIf you did not request this, please ignore this email.\n\n- CampusGet Support`;

  // 1. Try Resend if API key available (Best for Render/Cloud)
  if (config.isResend && config.resendApiKey) {
    const result = await sendViaResend(config.resendApiKey, config.fromEmail, to, subject, html, text);
    if (result.success) return { success: true };
  }

  // 2. Try SMTP if configured (Gmail App Password, Brevo, custom SMTP)
  if (config.isSmtp) {
    const result = await sendViaSmtp(config, to, subject, html, text);
    if (result.success) return { success: true };
  }

  // 3. Fallback when keys are not set yet
  console.warn(
    `[EMAIL SERVICE WARNING] No active email provider configured (Set RESEND_API_KEY or SMTP_USER/SMTP_PASS in environment).`
  );
  console.log(`[EMAIL DISPATCH PREVIEW]\nTo: ${to}\nReset URL: ${resetUrl}\nExpires: ${expiresInMinutes} mins\n`);

  return {
    success: false,
    message: 'Email provider not configured on server yet. Check server logs for preview link.',
  };
};

/**
 * Confirmation Email when Password is reset successfully
 */
export const sendPasswordChangedConfirmationEmail = async ({
  to,
  name,
}: SendPasswordChangedParams): Promise<void> => {
  const config = getEmailConfig();
  const subject = 'Your CampusGet Password Was Changed';
  const html = `
    <div style="background-color: #0b0f19; color: #f3f4f6; padding: 32px; font-family: sans-serif; max-width: 500px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
      <h2 style="color: #10b981; margin-top: 0;">Password Successfully Changed</h2>
      <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">Hello ${name},</p>
      <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">This is a quick security confirmation that your CampusGet account password was just successfully updated.</p>
      <p style="color: #ef4444; font-size: 13px; line-height: 1.5; background: rgba(239,68,68,0.1); padding: 10px; border-radius: 8px;">
        ⚠️ If you did not make this change, please contact developer support immediately at ${BRAND.supportEmail}.
      </p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">© 2026 CampusGet Support</p>
    </div>
  `;
  const text = `Hello ${name},\nYour CampusGet account password was successfully updated.\nIf you did not do this, please contact support immediately.\n- CampusGet`;

  try {
    if (config.isResend && config.resendApiKey) {
      await sendViaResend(config.resendApiKey, config.fromEmail, to, subject, html, text);
    } else if (config.isSmtp) {
      await sendViaSmtp(config, to, subject, html, text);
    }
  } catch (err) {
    console.error('[CONFIRMATION EMAIL ERROR]', err);
  }
};
