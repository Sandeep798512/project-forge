import React from 'react';
import { BRAND } from '../config/brand.config';
import { SEOHead } from '../components/common/SEOHead';

export const Privacy: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <SEOHead
        title="Privacy Policy | CampusGet"
        description="Learn how CampusGet handles and protects your data, Razorpay payment processing, and download privacy."
        canonicalPath="/privacy"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 10, 2026 • Effective Date: September 10, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              CampusGet collects only essential data necessary to deliver digital products, verify purchases, provide technical support, and maintain platform security:
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
            <h2 className="text-lg font-bold text-white">2. Payment Security & Third-Party Processing (Razorpay)</h2>
            <p>
              All online financial transactions are processed securely through certified payment processor partner <strong>Razorpay</strong> using bank-grade SSL encryption.
            </p>
            <p>
              Razorpay handles the actual transaction when you purchase a project package, documentation, or digital resource. Razorpay collects and processes your payment details directly under its own privacy policy, which we encourage you to review at{' '}
              <a
                href="https://razorpay.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-primary-400 hover:underline"
              >
                razorpay.com/privacy
              </a>
              .
            </p>
            <p className="text-emerald-400 font-medium">
              CampusGet NEVER collects, views, processes, or stores raw credit/debit card numbers, CVVs, net banking credentials, or UPI PINs on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. How Data Is Used & Tracker Disclosure</h2>
            <p>
              Collected data is used strictly to fulfill digital access entitlements, verify payment signatures, provision source code access to your dashboard or registered WhatsApp (within 1 to 2 business days in the event of gateway latency), manage referral rewards, respond to support inquiries, and comply with operational and legal recordkeeping requirements.
            </p>
            <p>
              We do not sell, rent, or trade customer personal information to third parties. We do not integrate any advertising networks or third-party advertising analytics trackers on the platform. Data is retained for as long as your account remains active or as required by operational, tax, and dispute resolution obligations under applicable law.
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
      <SEOHead
        title="Refund & Cancellation Policy | CampusGet"
        description="Review CampusGet refund, order cancellation, and technical download guarantee policy for digital projects and study materials."
        canonicalPath="/refund-policy"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Refund & Download Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: October 26, 2026 • Effective Date: October 26, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Nature of Digital Deliverables (Non-Tangible Digital Goods)</h2>
            <p>
              CampusGet operates exclusively as an online educational marketplace specializing in downloadable digital software project packages, full-stack source code archives, database schemas, presentation slide decks (.PPTX), comprehensive academic project reports (.PDF), placement preparation eBooks, and technical study materials.
            </p>
            <p className="text-emerald-400 font-medium">
              All deliverables offered on CampusGet are non-tangible, digital intellectual property. No physical goods or shipments are involved.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Strict No-Refund & No-Return Policy for Digital Goods</h2>
            <p>
              Due to the intrinsic nature of digital goods (source code, database scripts, eBooks, and documentation), which are immediately viewable, copyable, and usable upon receipt, <strong>ALL SALES ARE STRICTLY FINAL</strong>.
            </p>
            <div className="bg-background/80 border border-amber-500/30 rounded-xl p-4 text-amber-200 text-xs sm:text-sm leading-relaxed">
              <strong>Single-Download Finality Rule:</strong> If a customer or student has accessed the digital download link or downloaded any file/archive even a single time, return and refund are strictly impossible under any circumstances, as digital files cannot be revoked, returned, or un-seen once downloaded.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. 100% Guaranteed Access & Delivery Commitment (Within 1 to 2 Business Days)</h2>
            <p>
              In rare situations where a student completes their payment via Razorpay, but the source code or project package does not immediately appear in their <strong>"My Purchases"</strong> dashboard due to network interruptions, browser closure, or payment gateway webhook latency:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Your purchase is 100% safe:</strong> Payment confirmation is logged securely on our servers.</li>
              <li><strong>Guaranteed Fulfillment:</strong> Our technical support team will manually verify your payment reference and provision complete access to your <strong>"My Purchases"</strong> dashboard, or send the source code access links directly to your registered <strong>WhatsApp</strong> (<a href={`https://wa.me/${BRAND.whatsappNumber}`} className="text-emerald-400 hover:underline">+{BRAND.whatsappNumber}</a>) or email within <strong>1 to 2 business days</strong>.</li>
              <li><strong>No Cancellations Once Paid:</strong> Because CampusGet unconditionally guarantees full access and manual fulfillment within 1 to 2 business days, payments cannot be cancelled, reversed, or refunded once processed through Razorpay.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Order Cancellation & Payment Dispute Policy</h2>
            <p>
              Once a payment transaction is initiated or completed on the Razorpay payment gateway, the order cannot be cancelled by the customer. Customers agree that because digital fulfillment is guaranteed within 1 to 2 business days, initiating premature chargebacks, payment disputes, or cancellation claims with Razorpay or bank issuers without allowing the 1-2 business days support fulfillment window is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Eligible Reviewable Scenario: Duplicate Payment Only</h2>
            <p>
              The only scenario eligible for a monetary refund review is an unintended <strong>Duplicate Payment</strong>, where a customer was accidentally charged multiple times for the exact same order reference due to a payment gateway glitch:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Email <a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline">{BRAND.supportEmail}</a> or message our WhatsApp desk (<a href={`https://wa.me/${BRAND.whatsappNumber}`} className="text-emerald-400 hover:underline">+{BRAND.whatsappNumber}</a>).</li>
              <li>Provide both duplicate <strong>Order IDs / Razorpay Payment IDs</strong> and registered account details.</li>
              <li>Our team will verify gateway logs within 24-48 business hours. Upon confirmation, the duplicate excess transaction will be refunded back to the original source account via Razorpay within 5 to 7 business days as per banking timelines.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Payment Gateway Processing (Razorpay)</h2>
            <p>
              <strong>Razorpay</strong> is our authorized third-party payment processor — it securely handles the actual financial transaction whenever you purchase a project package, study notes, career roadmap, or digital resource on CampusGet.
            </p>
            <p>
              Razorpay collects and processes your payment details directly, under its own privacy policy and bank-grade security standards, which we encourage you to review at{' '}
              <a
                href="https://razorpay.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-primary-400 hover:underline"
              >
                razorpay.com/privacy
              </a>
              .
            </p>
            <p className="text-emerald-400 font-medium">
              CampusGet NEVER collects, views, processes, or stores raw credit/debit card numbers, CVVs, net banking credentials, or UPI PINs on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">7. No Advertising Networks & Tracker Policy</h2>
            <p>
              We do not integrate any third-party advertising networks or advertising analytics trackers in CampusGet. Your account, download, and purchase information is used strictly to fulfill digital services and is never monetized, rented, or shared with commercial marketing agencies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">8. Support-First Resolution</h2>
            <p>
              We encourage customers to reach out to our WhatsApp helpdesk (<a href={`https://wa.me/${BRAND.whatsappNumber}`} className="text-emerald-400 hover:underline">+{BRAND.whatsappNumber}</a>) or Email desk (<a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline">{BRAND.supportEmail}</a>) for any access or configuration inquiries. Our technical team is committed to ensuring you receive and successfully run your purchased software.
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
            <p>Unless explicitly authorized in writing by CampusGet, the customer MAY NOT:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Resell, sublicense, or distribute the raw, un-customized project package or source files to third parties.</li>
              <li>Publish the raw, unmodified project package on public repositories (e.g., GitHub, GitLab) as a competing free or commercial template.</li>
              <li>Share account credentials or protected download access links with unauthorized users.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Intellectual Property & Third-Party Dependencies</h2>
            <p>
              <strong>CampusGet Materials:</strong> CampusGet retains ownership of original proprietary package structure, curated technical documentation, setup guides, and original codebase architecture.
            </p>
            <p>
              <strong>Customer Modifications:</strong> The customer retains ownership of their independent, custom-authored modifications and additions built upon the code.
            </p>
            <p>
              <strong>Third-Party & Open-Source Libraries:</strong> Packages may utilize third-party open-source libraries, frameworks (e.g., React, Node.js, Express, Tailwind CSS), fonts, or icons. Such components remain governed by their respective open-source licenses (e.g., MIT, Apache 2.0). CampusGet does not claim original ownership over third-party open-source dependencies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Digital Goods Finality & Non-Refundability of License Fees</h2>
            <p>
              This Single-Developer Educational License grants immediate digital access to electronic software source code, database architectures, and academic eBooks. Because these digital assets can be instantly saved and used upon access, all license fees processed through Razorpay are strictly final and non-refundable once downloaded or accessed even a single time.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              In the event of temporary payment gateway delivery latency, CampusGet technical support guarantees manual provisioning of your licensed files to your customer dashboard or registered WhatsApp within 1 to 2 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const Disclaimer: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Disclaimer</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 26, 2026 • Effective Date: September 26, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <p>
              The software projects, source code, documentation, demonstrations, and related digital materials provided by CampusGet are intended primarily for <strong>educational, learning, development, and project demonstration purposes</strong>.
            </p>
            <p>
              CampusGet does not guarantee that every project will work without modification in every user's specific operating system, hardware configuration, software environment, hosting provider, database configuration, API version, or third-party service.
            </p>
            <p>
              Users may need to configure, modify, debug, update, or customize the source code according to their individual requirements and technical environment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Educational Use</h2>
            <p>
              CampusGet provides software project packages to help students and developers understand software development concepts, project architecture, implementation techniques, and related technologies.
            </p>
            <p>
              Purchasing a project does not guarantee academic marks, project approval, internship selection, employment, placement, or any particular academic or professional outcome. Users are responsible for understanding and complying with the academic rules and requirements of their educational institution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Third-Party Services and Components</h2>
            <p>
              Some projects may use third-party libraries, frameworks, APIs, cloud services, payment services, datasets, fonts, icons, or other external components.
            </p>
            <p>
              Such third-party components remain subject to their respective owners' terms, licenses, and policies. Users are responsible for reviewing and complying with applicable third-party terms when using, modifying, deploying, or redistributing a project.
            </p>
            <p>
              CampusGet does not claim ownership of third-party software, trademarks, or other intellectual property belonging to their respective owners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">User Responsibility</h2>
            <p>
              Users are responsible for reviewing, testing, configuring, and securing any source code before deploying it in a production environment or using it for real-world purposes.
            </p>
            <p>
              Users should not use demonstration or educational software in safety-critical, financial, medical, security-sensitive, or other high-risk environments without appropriate professional review, testing, security controls, and compliance measures.
            </p>
            <p>
              CampusGet is not responsible for problems resulting from unauthorized modifications, incorrect configuration, unsupported environments, misuse of the software, insecure deployment, or changes made by third-party services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Intellectual Property</h2>
            <p>
              Users must not represent CampusGet's materials, third-party materials, or other copyrighted components as their own where doing so would violate applicable intellectual-property rights or license terms.
            </p>
            <p>
              Where a project contains components subject to separate open-source or third-party licenses, those license terms continue to apply.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">No Guarantee of Specific Results</h2>
            <p>
              CampusGet provides digital software materials and related support according to the applicable product description and purchase terms. CampusGet does not guarantee a particular academic, business, financial, employment, or other outcome from the use of any project.
            </p>
            <p>
              By purchasing or using CampusGet materials, users acknowledge that software development involves configuration, testing, maintenance, and ongoing updates.
            </p>
            <p>
              For questions regarding a specific project's included features, licensing, or supported environment, users should contact CampusGet support before purchase or deployment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Digital Goods Nature & Sales Finality</h2>
            <p>
              All software packages, source codes, and technical eBooks offered on CampusGet are non-tangible digital goods. Once payment is processed via Razorpay and files are downloaded or accessed even a single time, returns and cancellations are strictly unavailable. If delivery is delayed due to network or technical glitches, our support team guarantees direct manual access delivery to your customer dashboard or registered WhatsApp within 1 to 2 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Shipping & Delivery Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: October 11, 2026 • Effective Date: October 11, 2026</p>
        </div>

        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. 100% Digital Delivery (No Physical Shipping)</h2>
            <p>
              CampusGet operates exclusively as an online educational marketplace for software development projects, academic study materials, previous year questions (PYQs), source codes, presentation slides (PPTs), and project documentation.
            </p>
            <p className="text-emerald-400 font-medium">
              All deliverables sold or provided on CampusGet are 100% digital goods. We do not dispatch, courier, or deliver any physical items, CDs, or printed books to postal addresses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Delivery Timeline & Fulfillment Process</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                <strong>Instant Access:</strong> Upon successful payment completion via Razorpay, digital access is provisioned immediately (within 0 to 60 seconds).
              </li>
              <li>
                <strong>Customer Dashboard:</strong> Purchased packages are instantly accessible from your <strong>My Purchases</strong> dashboard (<a href="/dashboard/purchases" className="text-primary-400 hover:underline">/dashboard/purchases</a>).
              </li>
              <li>
                <strong>Download Links:</strong> You can download your source code archives (.ZIP), documentation (.PDF), and presentation files directly to your device at any time.
              </li>
              <li>
                <strong>Email Confirmation:</strong> A payment receipt along with purchase reference details is dispatched to your registered email address automatically upon transaction success.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Shipping & Delivery Charges</h2>
            <p>
              Because all products are delivered electronically over the internet, <strong>shipping and delivery charges are completely ₹0 (Free)</strong> across all project packages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Technical Delivery Assistance</h2>
            <p>
              If you experience any network interruption during checkout, or if your download access is delayed past 5 minutes, please reach out directly to our developer helpdesk:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Email: <a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline">{BRAND.supportEmail}</a></li>
              <li>WhatsApp Support: <a href={`https://wa.me/${BRAND.whatsappNumber}`} className="text-emerald-400 hover:underline">+{BRAND.whatsappNumber}</a></li>
            </ul>
            <p className="text-xs text-gray-400">
              Our support team will verify your transaction reference and provision direct access links to your dashboard or registered WhatsApp within 1 to 2 business days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Delivery Guarantee & Non-Cancellable Orders</h2>
            <p>
              Because CampusGet guarantees 100% fulfillment and delivery within 1 to 2 business days even if automated unlocking experiences gateway delays, orders cannot be cancelled and payments cannot be refunded once completed through Razorpay. Once digital files are downloaded or accessed even a single time, all sales are strictly final.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
