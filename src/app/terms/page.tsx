import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Tools & AI Prompts | Ventaro AI Digital Store 2025',
  description: 'Read our terms of service for AI tools, AI prompts, and digital products to make money online with AI in 2025. Legal terms for our AI business solutions and coaching services.',
  keywords: 'terms of service, AI tools terms, AI prompts legal, make money online terms, AI business legal, digital products terms, AI coaching terms',
  openGraph: {
    title: 'Terms of Service - Ventaro AI Digital Store 2025',
    description: 'Legal terms for AI tools, AI prompts, and digital products to make money online with AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - Ventaro AI Digital Store 2025',
    description: 'Legal terms for AI tools and prompts',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">
            Please read these terms carefully before using our AI tools, AI prompts, and digital products designed to help you make money online with AI in 2025.
          </p>
          <p className="text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="w-24 h-1 bg-gradient-accent mx-auto mt-4"></div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
            <p className="mb-4 text-gray-800">
              Welcome to Ventaro Digital Store. These Terms & Conditions ("Terms") govern your access to and use of our website, digital products, and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            <p className="mb-4 text-gray-800">
              Please read these Terms carefully. If you do not agree with these Terms, you must not access or use our services.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Product Access & Payment</h2>
            <p className="mb-4 text-gray-800">
              Access to our digital products is granted through secure payment processing via Stripe. Upon successful payment, you will receive immediate access to your purchased digital products. Account registration IS required for purchases.
            </p>
            <p className="mb-4 text-gray-800">
              <strong className="text-black">Payment Authentication:</strong> We use Stripe's secure payment system to authenticate purchases and grant access to digital products. Your payment information is processed securely and we do not store any payment details on our servers.
            </p>
            <p className="mb-4 text-gray-800">
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Purchases and Payments</h2>
            <p className="mb-4 text-gray-800">
              All purchases through our website are subject to product availability and the prices displayed at the time of purchase. We reserve the right to modify prices at any time without notice.
            </p>
            <p className="mb-4 text-gray-800">
              Payment for all purchases must be made at the time of order. We accept various payment methods as indicated on our website. You represent and warrant that you have the legal right to use any payment method you provide.
            </p>
            <div id="refund-policy" className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-bold text-black mb-2">Refund Policy</h3>
              <p className="text-red-600 font-semibold mb-2">⚠️ NO REFUNDS POLICY</p>
              <p className="text-gray-800">
                <strong className="text-black">ALL SALES ARE FINAL.</strong> Due to the digital nature of our products, ebooks, and coaching services, we do not offer refunds under any circumstances once a product has been purchased and delivered. This includes but is not limited to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-800">
                <li>Digital downloads (ebooks, guides, design files)</li>
                <li>Coaching calls and consultations (A$500 for a 60-minute session with full report)</li>
                <li>Training materials and courses</li>
                <li>Any other digital products or services</li>
              </ul>
              <p className="text-gray-800 mt-2">
                Please review all product descriptions carefully before purchasing. By completing your purchase, you acknowledge and agree to this no-refunds policy.
              </p>
              <p className="text-gray-800 mt-2">
                If you have questions about a purchase before making it, please contact our support team at <a href="mailto:chris.t@ventarosales.com" className="text-blue-600 hover:text-blue-800 transition-colors">chris.t@ventarosales.com</a>.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Digital Products and Licensing</h2>
            <p className="mb-4 text-gray-800">
              When you purchase a digital product from Ventaro, we grant you a non-exclusive, non-transferable license to use the product for your personal projects, subject to the specific license terms provided with each product.
            </p>
            <p className="mb-4 text-gray-800">
              Our products include ebooks, coaching materials, and design assets. Unless otherwise specified, you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Redistribute, share, or resell any digital product purchased from our store</li>
              <li>Claim ownership or authorship of our products</li>
              <li>Share our proprietary methodologies with third parties</li>
              <li>Record or redistribute coaching call content without written permission</li>
              <li>Include our products in templates or applications where the primary value is derived from the product itself</li>
            </ul>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Intellectual Property Rights</h2>
            <p className="mb-4 text-gray-800">
              All content, features, and functionality of our website, including but not limited to text, graphics, logos, icons, images, digital downloads, and software, are owned by Ventaro or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mb-4 text-gray-800">
              Our proprietary methodologies and design processes represent significant intellectual property. You may not copy, modify, distribute, sell, or lease any part of our services or included software, nor may you reverse engineer or attempt to extract our workflows, unless laws prohibit these restrictions or you have our written permission.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">User Content</h2>
            <p className="mb-4 text-gray-800">
              Our services may allow you to post, link, store, share, or otherwise make available certain information, text, graphics, videos, or other material. You retain ownership of any intellectual property rights that you hold in that content.
            </p>
            <p className="mb-4 text-gray-800">
              By posting content on our website or participating in our coaching programs, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing our services.
            </p>
            <p className="mb-4 text-gray-800">
              You represent and warrant that you own or have the necessary rights to post any content, and that your content does not violate the rights of any third party or any applicable law or regulation.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Prohibited Conduct</h2>
            <p className="mb-4 text-gray-800">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Violating any applicable law, regulation, or these Terms</li>
              <li>Using our services for any illegal or unauthorized purpose</li>
              <li>Attempting to reverse-engineer our methodologies</li>
              <li>Sharing, redistributing, or reselling our proprietary content</li>
              <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running our services</li>
              <li>Imposing an unreasonable or disproportionately large load on our infrastructure</li>
              <li>Uploading invalid data, viruses, worms, or other software agents through our services</li>
              <li>Collecting or harvesting any personally identifiable information from our services</li>
              <li>Using our services for solicitation purposes without our consent</li>
              <li>Impersonating another person or otherwise misrepresenting your affiliation with a person or entity</li>
              <li>Recording coaching calls without explicit written permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Disclaimer of Warranties</h2>
            <p className="mb-4 text-gray-800">
              Our services and products are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of our services or the information, content, or materials included therein.
            </p>
            <p className="mb-4 text-gray-800">
              We do not warrant that our services will be uninterrupted or error-free, that defects will be corrected, or that our services or the servers that make them available are free of viruses or other harmful components.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Limitation of Liability</h2>
            <p className="mb-4 text-gray-800">
              To the fullest extent permitted by applicable law, in no event will Ventaro, its affiliates, officers, directors, employees, agents, suppliers, or licensors be liable for any indirect, special, incidental, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Indemnification</h2>
            <p className="mb-4 text-gray-800">
              You agree to defend, indemnify, and hold harmless Ventaro, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of our services.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Governing Law</h2>
            <p className="mb-4 text-gray-800">
              These Terms and your use of our services shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any choice or conflict of law provision or rule.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Ongoing Support Services</h2>
            <p className="mb-4 text-gray-800">
              For customers who require additional assistance beyond our standard offerings, we provide optional ongoing support services:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-800 space-y-2">
              <li><strong>Priority Email Support:</strong> $100/week for priority email assistance and guidance</li>
              <li><strong>Live Screenshare Support:</strong> $300/hour for one-on-one screenshare sessions with direct implementation assistance</li>
            </ul>
            <p className="mb-4 text-gray-800">
              These support services are entirely optional and separate from our core product offerings. All support services are subject to availability and must be arranged in advance.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Changes to These Terms</h2>
            <p className="mb-4 text-gray-800">
              We may revise these Terms from time to time. The most current version will always be posted on our website. If a revision, in our sole discretion, is material, we will notify you via email through our subscription system or through our services. By continuing to access or use our services after those revisions become effective, you agree to be bound by the revised Terms.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Contact Us</h2>
            <p className="mb-4 text-gray-800">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4 text-gray-800">
              Email: <a href="mailto:chris.t@ventarosales.com" className="text-blue-600 hover:text-blue-800 transition-colors">chris.t@ventarosales.com</a>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}