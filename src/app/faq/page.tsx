import Link from 'next/link';

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'General Questions',
      faqs: [
        {
          question: 'What is Ventaro AI Digital Store?',
          answer: 'Ventaro AI Digital Store is an online marketplace specializing in high-quality digital products created with or powered by artificial intelligence. We offer a curated selection of digital assets, tools, templates, and resources for creators, businesses, and developers.'
        },
        {
          question: 'Do I need to create an account to make a purchase?',
          answer: 'Yes, you need to create an account to make purchases. This allows us to securely store your purchase history and provide you with access to your digital downloads at any time.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach our customer support team through our Contact page or by emailing support@ventaroai.com. We typically respond within 24 hours during business days.'
        }
      ]
    },
    {
      title: 'Products & Usage',
      faqs: [
        {
          question: 'What types of products do you offer?',
          answer: 'We offer a wide range of AI-powered digital products including our AI Tools Mastery Guide 2025, AI Prompts Arsenal 2025, and AI Business Strategy Sessions. All our products are carefully vetted for quality and usefulness.'
        },
        {
          question: 'Are there any usage restrictions?',
          answer: 'Our digital products are for personal use only. Please refer to the specific details included with each product for complete information.'
        },
        {
          question: 'Do you offer customization services for your products?',
          answer: 'We don&apos;t currently offer customization services for our standard products. However, our coaching calls provide personalized guidance tailored to your specific needs.'
        }
      ]
    },
    {
      title: 'Purchases & Downloads',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay for secure and convenient transactions.'
        },
        {
          question: 'How do I download my purchased digital products?',
          answer: 'After completing your purchase of digital products (AI Tools Mastery Guide 2025 and AI Prompts Arsenal 2025), you&apos;ll receive an email with download instructions. You can also access your downloads at any time by logging into your account and visiting the "My Downloads" section. For AI Business Strategy Sessions, we will be in touch to organize a suitable time.'
        },
        {
          question: 'How long do I have access to my purchased digital products?',
          answer: 'You have lifetime access to all purchased digital products. You can download them as many times as you need from your my-account page.'
        },
        {
          question: 'What is the download process for digital products?',
          answer: 'Our digital products (AI Tools Mastery Guide 2025 and AI Prompts Arsenal 2025) are available for immediate download after purchase. Simply click the download link in your confirmation email or access them from your account dashboard. Files are typically provided in PDF format for guides and text format for prompts.'
        },
        {
          question: 'Are my payment details secure?',
          answer: 'Absolutely. We use Stripe, a PCI-compliant payment processor, to handle all transactions. Your payment information is encrypted and never stored on our servers.'
        },
        {
          question: 'Do you offer shipping?',
          answer: 'No, we do not offer physical shipping as we are a 100% digital business. All products are delivered instantly via digital download after purchase, except for AI Business Strategy Sessions which are scheduled separately.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'Do you offer refunds?',
          answer: 'Due to the digital nature of our products, we do not offer refunds under any circumstances once a product has been purchased and delivered. Please review our Terms & Conditions page for our complete refund policy.'
        },
        {
          question: 'What if the product doesn\'t work as described?',
          answer: 'If you encounter any issues with a product not functioning as described, please contact our support team. While we don&apos;t offer refunds, we&apos;ll work with you to resolve any technical issues or provide additional support.'
        },
        {
          question: 'Where can I find your complete refund policy?',
          answer: 'Our complete refund policy is available in the Terms & Conditions page under the Refund Policy section. All sales are final for digital products including e-books, prompts, and coaching services.'
        }
      ]
    },
    {
      title: 'Technical Support',
      faqs: [
        {
          question: 'Do you provide technical support for products?',
          answer: 'We provide basic technical support to help you download and access your purchased products. For product-specific technical questions, we offer limited support as outlined in each product description.'
        },
        {
          question: 'What if I lose my download files?',
          answer: 'Don&apos;t worry! You can re-download your purchased products at any time by logging into your account and visiting the "My Downloads" section.'
        },
        {
          question: 'Do you offer product updates?',
          answer: 'Yes, for products that receive updates, you&apos;ll have access to the latest versions at no additional cost. You&apos;ll be notified by email when significant updates are available.'
        },
        {
          question: 'What are the system requirements for your products?',
          answer: 'System requirements vary by product. Please check the individual product descriptions for specific requirements before making a purchase.'
        }
      ]
    },
    {
      title: 'Special Offers',
      faqs: [
        {
          question: 'Do you have any current promotions?',
          answer: 'Yes! We currently have our AI Prompts Arsenal 2025 on sale for just A$10. These 30 professional AI prompts are perfect for content creation, marketing automation, and AI-powered business growth.'
        },
        {
          question: 'What does the AI Business Strategy Session include?',
          answer: 'Our AI Business Strategy Session includes a 60-minute personalized session with one of our AI experts, plus a comprehensive implementation report. For A$497, you get tailored advice, custom workflow optimization, and specific AI strategies for your business projects.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our products, purchasing process, and policies.
            Can&apos;t find what you&apos;re looking for? <Link href="/contact" className="text-primary-600 hover:text-primary-500 font-medium">Contact our support team</Link>.
          </p>
        </div>

        <div className="space-y-10">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
                <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary-600 text-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-lg text-primary-100 mb-6 max-w-3xl mx-auto">
            Our support team is ready to help you with any questions or concerns you might have about our products or services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact" 
              className="btn-white"
            >
              Contact Us
            </Link>
            <a 
              href="mailto:support@ventaroai.com" 
              className="btn-outline-white"
            >
              Email Support
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Base</h3>
            <p className="text-gray-600 mb-4">
              Browse our detailed guides and tutorials to get the most out of our products.
            </p>
            <Link href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              View Knowledge Base
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Special Offers</h3>
            <p className="text-gray-600 mb-4">
              Check out our current promotions and limited-time deals on our high-quality digital products.
            </p>
            <Link href="/products" className="text-primary-600 hover:text-primary-500 font-medium">
              View Current Deals
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Delivery</h3>
            <p className="text-gray-600 mb-4">
              Instant access to all products with secure digital delivery - no shipping required.
            </p>
            <span className="text-primary-600 font-medium">
              100% Digital Business
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}