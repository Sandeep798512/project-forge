import React from 'react';
import { BRAND } from '../config/brand.config';
import { SEOHead } from '../components/common/SEOHead';

export const Terms: React.FC = () => {
  return (
    <div className="py-16 bg-background min-h-screen">
      <SEOHead
        title="Terms of Service & Licensing | CampusGet"
        description="CampusGet terms of service, acceptable academic use, intellectual property rights, and digital licensing guidelines."
        canonicalPath="/terms"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-gray-400 mt-2">Last updated: September 10, 2026 • Effective Date: September 10, 2026</p>
        </div>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">1. Platform Purpose & Legitimate Use</h2>
          <p>
            {BRAND.name} provides digital software project packages, source code archives, technical documentation, setup guides, viva/technical preparation resources, and developer customization materials. All materials offered on this platform are intended strictly for legitimate educational, self-learning, software customization, developer skill enhancement, and personal portfolio demonstration purposes.
          </p>
          <p className="text-amber-300/90 font-medium">
            CampusGet does NOT endorse, market, or permit academic dishonesty, plagiarism, misrepresentation of authorship, or fraudulent submission of unadapted materials under false claims.
          </p>
          <p>
            Purchasers are responsible for reviewing, testing, understanding, and adapting any source code or technical materials before using or presenting them. CampusGet makes no promises or guarantees regarding academic grades, examination scores, placement guarantees, or institutional project acceptance.
          </p>
        </section>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">2. User Responsibilities & Institutional Compliance</h2>
          <p>By registering, purchasing, or using CampusGet materials, you agree that you are solely responsible for:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Ensuring that your intended use complies with applicable laws, local regulations, and your academic institution or employer policies.</li>
            <li>Reviewing, compiling, and testing all source code in your local development or staging environment prior to deployment.</li>
            <li>Maintaining independent offline backups of all downloaded packages and project files.</li>
            <li>Securing your account credentials, API keys, and local development or server hosting environments.</li>
            <li>Refraining from uploading illegal, infringing, or malicious content through support channels or custom project forms.</li>
          </ul>
        </section>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">3. Product Information & Technical Dependencies</h2>
          <p>
            CampusGet strives to provide accurate product listings, including technology stacks, major dependencies, included deliverables, and difficulty levels. However, software execution depends on third-party frameworks, hosting environments, runtime versions, operating system configurations, and external API providers.
          </p>
          <p>
            CampusGet does not guarantee that every ready-made package will execute identically across all operating systems or unconfigured environments without appropriate local environment setup as specified in the product documentation.
          </p>
        </section>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">4. Digital Delivery, Access Guarantee & Strict No-Refund Policy</h2>
          <p>
            Digital project packages, source code archives, database scripts, and eBooks are non-tangible electronic goods delivered upon successful payment verification via Razorpay. Verified purchasers receive access via their authenticated account dashboard (<a href="/dashboard/purchases" className="text-primary-400 hover:underline">/dashboard/purchases</a>).
          </p>
          <p className="text-amber-300/90 font-medium">
            Due to the intrinsic nature of digital software and educational materials, which can be immediately viewed, copied, and saved once accessed, all sales are strictly final. If a user has accessed or downloaded the files even a single time, returns and refunds are strictly not permitted.
          </p>
          <p>
            If a customer completes payment via Razorpay but digital access is not immediately unlocked due to network latency or technical issues, CampusGet technical support guarantees direct provisioning of the source code and files to the customer's dashboard or registered WhatsApp (<a href={`https://wa.me/${BRAND.whatsappNumber}`} className="text-emerald-400 hover:underline">+{BRAND.whatsappNumber}</a>) within <strong>1 to 2 business days</strong>. Because 100% delivery is guaranteed within 1 to 2 business days, orders cannot be cancelled or refunded once paid.
          </p>
        </section>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">5. Custom Project Request & Service Workflow</h2>
          <p>
            CampusGet allows users to submit requests for custom software development or package customization. Submitting a custom project request form does NOT constitute an automatically accepted contract or legally binding commitment by CampusGet.
          </p>
          <p>The custom project service workflow follows a clear multi-step process:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li><strong>Request Submitted:</strong> User submits project requirements via the designated platform form.</li>
            <li><strong>Technical Review:</strong> CampusGet reviews feasibility, technical scope, and legal/policy compliance.</li>
            <li><strong>Scope & Quote Proposal:</strong> CampusGet provides a proposed scope, delivery timeline estimate, and pricing quote.</li>
            <li><strong>Customer Acceptance:</strong> The customer reviews and explicitly accepts the proposed scope and terms.</li>
            <li><strong>Payment & Confirmation:</strong> Payment terms are confirmed and processed.</li>
            <li><strong>Work Execution:</strong> Technical work commences according to the agreed milestone plan.</li>
          </ol>
          <p>
            CampusGet reserves the right to decline custom requests that involve illegal activity, credential theft, malware, copyright infringement, or academic deception.
          </p>
        </section>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">6. Prohibited Activities & Security</h2>
          <p>Users are strictly prohibited from using CampusGet or its materials for:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Reselling, sublicensing, or publicly redistributing raw, un-customized project ZIP packages on public marketplaces, forums, or code repositories.</li>
            <li>Attempting to bypass authentication, download token expiration, or access control mechanisms.</li>
            <li>Submitting malware, stolen confidential code, API secrets, or unauthorized third-party credentials.</li>
            <li>Engaging in fraudulent chargebacks, bank disputes, or cancellation attempts on delivered or guaranteed digital goods without allowing the 1-2 business days fulfillment window.</li>
            <li>Unauthorized account sharing or automated scraping of platform resources.</li>
          </ul>
        </section>

        <section className="space-y-4 bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60">
          <h2 className="text-xl font-bold text-white">7. Neutral Limitation of Liability & Contact</h2>
          <p>
            To the maximum extent permitted under applicable law, CampusGet operates as a provider of educational digital resources and software tools. CampusGet shall not be liable for indirect, incidental, or consequential damages resulting from third-party hosting failures, improper code execution, or institutional decisions.
          </p>
          <p>
            For questions regarding these Terms of Service, please contact our support team at <a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline">{BRAND.supportEmail}</a> or via our official WhatsApp helpdesk.
          </p>
        </section>
      </div>
    </div>
  );
};
