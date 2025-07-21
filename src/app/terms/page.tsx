import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="w-24 h-1 bg-gradient-accent mx-auto mt-4"></div>
        </div>

        <div className="glass-card p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="mb-4 text-gray-300">
              Welcome to Ventaro AI Digital Store. These Terms & Conditions ("Terms") govern your access to and use of our website, digital products, and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            <p className="mb-4 text-gray-300">
              Please read these Terms carefully. If you do not agree with these Terms, you must not access or use our services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Account Registration & Email Subscription</h2>
            <p className="mb-4 text-gray-300">
              To access certain features of our services, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="mb-4 text-gray-300">
              <strong className="text-white">Email Subscription:</strong> By creating an account or making a purchase, you automatically subscribe to our email system. This includes product updates, AI design tips, exclusive offers, and educational content related to our AI-powered digital products. You may unsubscribe at any time using the link provided in our emails.
            </p>
            <p className="mb-4 text-gray-300">
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Purchases and Payments</h2>
            <p className="mb-4 text-gray-300">
              All purchases through our website are subject to product availability and the prices displayed at the time of purchase. We reserve the right to modify prices at any time without notice.
            </p>
            <p className="mb-4 text-gray-300">
              Payment for all purchases must be made at the time of order. We accept various payment methods as indicated on our website. You represent and warrant that you have the legal right to use any payment method you provide.
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-red-300 font-semibold mb-2">⚠️ NO REFUNDS POLICY</p>
              <p className="text-gray-300">
                <strong className="text-white">ALL SALES ARE FINAL.</strong> Due to the digital nature of our AI-designed products, ebooks, prompts, and coaching services, we do not offer refunds under any circumstances once a product has been purchased and delivered. This includes but is not limited to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-300">
                <li>Digital downloads (ebooks, prompt libraries, design files)</li>
                <li>Coaching calls and consultations</li>
                <li>AI training materials and courses</li>
                <li>Any other digital products or services</li>
              </ul>
              <p className="text-gray-300 mt-2">
                Please review all product descriptions carefully before purchasing. By completing your purchase, you acknowledge and agree to this no-refunds policy.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">AI-Designed Digital Products and Licensing</h2>
            <p className="mb-4 text-gray-300">
              When you purchase a digital product from Ventaro AI, we grant you a non-exclusive, non-transferable license to use the product for your personal or commercial projects, subject to the specific license terms provided with each product.
            </p>
            <p className="mb-4 text-gray-300">
              Our products include AI-generated content, prompts, ebooks, coaching materials, and design assets created using ChatGPT, Cursor, and other AI tools. Unless otherwise specified, you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300">
              <li>Redistribute, share, or resell any digital product purchased from our store</li>
              <li>Claim ownership or authorship of our AI-designed products</li>
              <li>Use our products to create derivative products for resale or distribution</li>
              <li>Share our proprietary AI prompts or methodologies with third parties</li>
              <li>Record or redistribute coaching call content without written permission</li>
              <li>Include our products in templates or applications where the primary value is derived from the product itself</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Intellectual Property Rights</h2>
            <p className="mb-4 text-gray-300">
              All content, features, and functionality of our website, including but not limited to text, graphics, logos, icons, images, AI-generated content, digital downloads, and software, are owned by Ventaro AI or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mb-4 text-gray-300">
              Our proprietary AI methodologies, prompt libraries, and design processes represent significant intellectual property. You may not copy, modify, distribute, sell, or lease any part of our services or included software, nor may you reverse engineer or attempt to extract our AI workflows, unless laws prohibit these restrictions or you have our written permission.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">User Content & AI Training</h2>
            <p className="mb-4 text-gray-300">
              Our services may allow you to post, link, store, share, or otherwise make available certain information, text, graphics, videos, or other material. You retain ownership of any intellectual property rights that you hold in that content.
            </p>
            <p className="mb-4 text-gray-300">
              By posting content on our website or participating in our coaching programs, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing our services and improving our AI methodologies.
            </p>
            <p className="mb-4 text-gray-300">
              You represent and warrant that you own or have the necessary rights to post any content, and that your content does not violate the rights of any third party or any applicable law or regulation.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Prohibited Conduct</h2>
            <p className="mb-4 text-gray-300">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300">
              <li>Violating any applicable law, regulation, or these Terms</li>
              <li>Using our services for any illegal or unauthorized purpose</li>
              <li>Attempting to reverse-engineer our AI prompts or methodologies</li>
              <li>Sharing, redistributing, or reselling our proprietary AI content</li>
              <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running our services</li>
              <li>Imposing an unreasonable or disproportionately large load on our infrastructure</li>
              <li>Uploading invalid data, viruses, worms, or other software agents through our services</li>
              <li>Collecting or harvesting any personally identifiable information from our services</li>
              <li>Using our services for any commercial solicitation purposes without our consent</li>
              <li>Impersonating another person or otherwise misrepresenting your affiliation with a person or entity</li>
              <li>Recording coaching calls without explicit written permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Disclaimer of Warranties</h2>
            <p className="mb-4 text-gray-300">
              Our AI-designed services and products are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of our services or the information, content, or materials included therein.
            </p>
            <p className="mb-4 text-gray-300">
              While our products are created using advanced AI tools and methodologies, we do not warrant that our services will be uninterrupted or error-free, that defects will be corrected, or that our services or the servers that make them available are free of viruses or other harmful components.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Limitation of Liability</h2>
            <p className="mb-4 text-gray-300">
              To the fullest extent permitted by applicable law, in no event will Ventaro AI, its affiliates, officers, directors, employees, agents, suppliers, or licensors be liable for any indirect, special, incidental, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Indemnification</h2>
            <p className="mb-4 text-gray-300">
              You agree to defend, indemnify, and hold harmless Ventaro AI, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of our services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Governing Law</h2>
            <p className="mb-4 text-gray-300">
              These Terms and your use of our services shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any choice or conflict of law provision or rule.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to These Terms</h2>
            <p className="mb-4 text-gray-300">
              We may revise these Terms from time to time. The most current version will always be posted on our website. If a revision, in our sole discretion, is material, we will notify you via email through our subscription system or through our services. By continuing to access or use our services after those revisions become effective, you agree to be bound by the revised Terms.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
            <p className="mb-4 text-gray-300">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4 text-gray-300">
              Email: <a href="mailto:support@ventaroai.com" className="text-gradient hover:text-white transition-colors">support@ventaroai.com</a>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="text-gradient hover:text-white font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}