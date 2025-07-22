import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Tools & AI Prompts | Ventaro AI Digital Store 2025',
  description: 'Read our privacy policy for AI tools, AI prompts, and digital products. Learn how we protect your data when you make money online with AI in 2025.',
  keywords: 'privacy policy, AI tools privacy, AI prompts privacy, make money online privacy, AI business privacy, digital products privacy, data protection',
  openGraph: {
    title: 'Privacy Policy - Ventaro AI Digital Store 2025',
    description: 'Privacy policy for AI tools, AI prompts, and digital products to make money online with AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Ventaro AI Digital Store 2025',
    description: 'Privacy policy for AI tools and prompts',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-gray-700 mb-4">
            Your privacy is important to us. Learn how we protect your information when you use our AI tools, AI prompts, and digital products to make money online with AI in 2025.
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
              At Ventaro Digital Store, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, purchase our digital products, and subscribe to our services.
            </p>
            <p className="mb-4 text-gray-800">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4 text-gray-800">
              We collect information that you provide directly to us when you register for an account, make a purchase, subscribe to our email system, participate in coaching calls, or communicate with us.
            </p>
            <p className="mb-4 text-gray-800">This information may include:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Personal identification information (name, email address, billing address)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>Purchase history and product downloads</li>
              <li>Email subscription preferences and engagement data</li>
              <li>Coaching call recordings and notes (with your consent)</li>
              <li>Communications you send to us</li>
            </ul>

            <p className="mb-4 text-gray-800">
              We also automatically collect certain information when you visit our website, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Log information (IP address, browser type, pages viewed)</li>
              <li>Device information (hardware model, operating system)</li>
              <li>Usage data (how you interact with our AI products and site)</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">How We Use Your Information</h2>
            <p className="mb-4 text-gray-800">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Process and fulfill your product orders</li>
              <li>Provide customer support and coaching services</li>
              <li>Send transactional emails (order confirmations, download links)</li>
              <li>Send email communications about product updates and exclusive offers</li>
              <li>Deliver coaching calls and educational content</li>
              <li>Improve our products and methodologies</li>
              <li>Analyze usage patterns to enhance our services</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
              <p className="text-blue-600 font-semibold mb-2">📧 Email Subscription</p>
              <p className="text-gray-800">
                By creating an account or making a purchase, you automatically subscribe to our email system. We use your email to send product updates, tutorials, exclusive offers, and educational content. You can unsubscribe at any time using the link in our emails.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">How We Share Your Information</h2>
            <p className="mb-4 text-gray-800">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Service providers (payment processors, email service providers, hosting services)</li>
              <li>Professional advisors (lawyers, accountants, insurers)</li>
              <li>Law enforcement or regulatory bodies when required by law</li>
              <li>Potential buyers in the event of a business sale or merger</li>
            </ul>
            <p className="mb-4 text-gray-800">
              <strong className="text-black">We do not sell your personal information to third parties.</strong> We maintain strict confidentiality regarding our methodologies and your personal data.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p className="mb-4 text-gray-800">
              We use cookies and similar tracking technologies to collect information about your browsing activities. These technologies help us analyze website traffic, customize content, improve your experience, and optimize our AI product recommendations.
            </p>
            <p className="mb-4 text-gray-800">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our site and may affect personalized AI product suggestions.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Data Security</h2>
            <p className="mb-4 text-gray-800">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Our AI-designed systems include advanced security protocols. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Data Retention</h2>
            <p className="mb-4 text-gray-800">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including providing ongoing access to your purchased AI products and maintaining your email subscription preferences, unless a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Your Rights</h2>
            <p className="mb-4 text-gray-800">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-800">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information (subject to our no-refunds policy)</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent (including email unsubscription)</li>
            </ul>
            <p className="mb-4 text-gray-800">
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Children's Privacy</h2>
            <p className="mb-4 text-gray-800">
              Our website and AI-designed products are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4 text-gray-800">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We will notify subscribers via email of any material changes. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-black mt-8 mb-4">Contact Us</h2>
            <p className="mb-4 text-gray-800">
              If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:chris.t@ventarosales.com" className="text-blue-600 hover:text-blue-800">chris.t@ventarosales.com</a>.
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