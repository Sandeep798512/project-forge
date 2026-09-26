import React from 'react';
import { BRAND } from '../config/brand.config';

export const Privacy: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 10, 2026 • Effective Date: September 10, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              ProjectForge collects only essential data necessary to deliver digital products, verify purchases, provide technical support, and maintain platform security:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Account Profile Data:</strong> Full Name, Email Address, and encrypted/hashed account passwords.</li>
              <li><strong>Order & Transaction History:</strong> Purchased project package IDs, Order References, final transaction amounts, and coupon usage records.</li>
              <li><strong>Referral & Payout Info:</strong> Referral codes, referral counts, and optional UPI ID/Bank account details provided voluntarily for affiliate reward processing.</li>
              <li><strong>Support Communications:</strong> Support tickets, custom project request forms, and WhatsApp helpdesk inquiry logs.</li>
              <li><strong>Technical & Security Logs:</strong> IP address logs, browser user-agent strings, and download token authentication timestamps to prevent unauthorized link sharing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Payment Security & Third-Party Processing</h2>
            <p>
              All online financial transactions are processed securely through certified payment gateway partner <strong>Razorpay</strong> using bank-grade SSL encryption.
            </p>
            <p className="text-emerald-400 font-medium">
              ProjectForge NEVER collects, views, processes, or stores raw credit/debit card numbers, CVVs, net banking credentials, or UPI PINs on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. How Data Is Used & Retention Principles</h2>
            <p>
              Collected data is used strictly to fulfill digital access entitlements, verify payment signatures, manage referral rewards, respond to support inquiries, and comply with operational and legal recordkeeping requirements.
            </p>
            <p>
              We do not sell, rent, or trade customer personal information to third-party advertisers. Data is retained for as long as your account remains active or as required by operational, tax, and dispute resolution obligations under applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Account Deletion & Data Removal</h2>
            <p>
              You can delete your account at any time from your account settings.
            </p>
            <p>
              When you request account deletion, we will delete the personal information associated with your account from our active systems, including your account/profile information and other user data that is not required to be retained.
            </p>
            <p>
              Some information may be retained where necessary to comply with applicable legal, accounting, tax, fraud-prevention, security, dispute-resolution, or other legitimate requirements. Such information will be retained only for the period required for those purposes.
            </p>
            <p>
              Once the deletion process is completed, your deleted account and associated data cannot be recovered.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Your Privacy Rights & Contact</h2>
            <p>
              Users have the right to request access to their stored account data, request correction of inaccurate profile details, or request account deletion directly from their account settings as outlined above.
            </p>
            <p>
              For any privacy-related inquiries or data requests, please contact our designated privacy support contact at <a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline">{BRAND.supportEmail}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicy: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Refund & Download Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 10, 2026 • Effective Date: September 10, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Nature of Digital Deliverables</h2>
            <p>
              ProjectForge specializes in downloadable digital software project packages containing non-tangible source code, documentation, presentations, and technical resources. Upon successful server-side payment verification, digital access is immediately provisioned to your customer dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Order Cancellation</h2>
            <p>
              Orders may be cancelled prior to digital access delivery. Once payment verification is completed and digital download tokens have been generated/accessed, cancellation is subject to our refund evaluation rules below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Eligible Reviewable Refund Scenarios</h2>
            <p>ProjectForge evaluates refund requests on a fair, case-by-case basis under the following eligible technical scenarios:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Duplicate Payment:</strong> Multiple charges incurred for the exact same order due to a payment gateway glitch.</li>
              <li><strong>Unfulfilled Access:</strong> Payment was successfully charged but our system failed to grant entitlement and technical support cannot provision access within 24 business hours.</li>
              <li><strong>Corrupted Source Archive:</strong> The downloaded ZIP or file archive is corrupted/unreadable and ProjectForge support is unable to provide a working replacement archive.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Refund Request Process & Timeline</h2>
            <p>To request a refund review:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Email <a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline">{BRAND.supportEmail}</a> or open a ticket from your Customer Dashboard.</li>
              <li>Provide your <strong>Order ID</strong> (e.g., <code>ORD-17882873...</code>), registered email address, and a clear description of the technical issue.</li>
              <li>Our support team will review the transaction logs and archive integrity within 24-48 business hours.</li>
              <li>Approved refunds will be processed back to the original payment source via Razorpay within 5 to 7 business days as per standard banking timelines.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Support-First Resolution</h2>
            <p>
              We encourage customers to reach out to our WhatsApp or Email support prior to initiating payment disputes, as most delivery or setup questions can be resolved immediately by our technical support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const License: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Software License Agreement</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 10, 2026 • Effective Date: September 10, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Single-Developer Educational License</h2>
            <p>
              Unless explicitly stated otherwise on a specific package listing, each ready-made project purchase grants the customer a non-exclusive, non-transferable <strong>Single-Developer Educational License</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Permitted Rights & Customer Usage</h2>
            <p>Under this license, the customer is authorized to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Download, run, compile, and execute the source code locally or on private server environments.</li>
              <li>Study, analyze, modify, refactor, and expand upon the codebase for self-learning and skill development.</li>
              <li>Customise the user interface, branding, and functionality for personal developer portfolio demonstrations and job interview showcases.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. License Restrictions</h2>
            <p>Unless explicitly authorized in writing by ProjectForge, the customer MAY NOT:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Resell, sublicense, or distribute the raw, un-customized project package or source files to third parties.</li>
              <li>Publish the raw, unmodified project package on public repositories (e.g., GitHub, GitLab) as a competing free or commercial template.</li>
              <li>Share account credentials or protected download access links with unauthorized users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Intellectual Property & Third-Party Dependencies</h2>
            <p>
              <strong>ProjectForge Materials:</strong> ProjectForge retains ownership of original proprietary package structure, curated technical documentation, setup guides, and original codebase architecture.
            </p>
            <p>
              <strong>Customer Modifications:</strong> The customer retains ownership of their independent, custom-authored modifications and additions built upon the code.
            </p>
            <p>
              <strong>Third-Party & Open-Source Libraries:</strong> Packages may utilize third-party open-source libraries, frameworks (e.g., React, Node.js, Express, Tailwind CSS), fonts, or icons. Such components remain governed by their respective open-source licenses (e.g., MIT, Apache 2.0). ProjectForge does not claim original ownership over third-party open-source dependencies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
