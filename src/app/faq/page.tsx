import Link from 'next/link';

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'General Questions',
      faqs: [
        {
          question: 'What is AI Digital Product Store?',
          answer: 'AI Digital Product Store is an online marketplace specializing in high-quality digital products created with or powered by artificial intelligence. We offer a curated selection of digital assets, tools, templates, and resources for creators, businesses, and developers.'
        },
        {
          question: 'Do I need to create an account to make a purchase?',
          answer: 'Yes, you need to create an account to make purchases. This allows us to securely store your purchase history and provide you with access to your digital downloads at any time.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach our customer support team through our Contact page or by emailing chris.t@ventarosales.com. We typically respond within 24 hours during business days.'
        }
      ]
    },
    {
      title: 'Products & Licensing',
      faqs: [
        {
          question: 'What types of products do you offer?',
          answer: 'We offer a wide range of AI-powered digital products including design templates, code snippets, UI kits, productivity tools, creative assets, data analysis tools, and more. All our products are carefully vetted for quality and usefulness.'
        },
        {
          question: 'Can I use your products for commercial projects?',
          answer: 'Yes! All our products come with a commercial license, allowing you to use them in your business and client projects. However, you cannot resell or redistribute our products as-is.'
        },
        {
          question: 'Are there any usage restrictions?',
          answer: 'While our products come with a commercial license, you cannot resell, redistribute, or make our products available for download to others. Please refer to the specific license details included with each product for complete information.'
        },
        {
          question: 'Do you offer customization services for your products?',
          answer: 'We don\'t currently offer customization services for our standard products. However, we do have premium products that include customization options. Check the product description for details.'
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
          question: 'How do I download my purchased products?',
          answer: 'After completing your purchase, you\'ll receive an email with download instructions. You can also access your downloads at any time by logging into your account and visiting the "My Downloads" section.'
        },
        {
          question: 'How long do I have access to my purchased products?',
          answer: 'You have lifetime access to all purchased products. You can download them as many times as you need from your account page.'
        },
        {
          question: 'Are my payment details secure?',
          answer: 'Absolutely. We use Stripe, a PCI-compliant payment processor, to handle all transactions. Your payment information is encrypted and never stored on our servers.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'Do you offer refunds?',
          answer: 'Due to the digital nature of our products, we generally don\'t offer refunds once a product has been downloaded. However, we\'re committed to customer satisfaction and will address any issues on a case-by-case basis.'
        },
        {
          question: 'What if the product doesn\'t work as described?',
          answer: 'If you encounter any issues with a product not functioning as described, please contact our support team within 7 days of purchase. We\'ll work with you to resolve the issue or provide a replacement.'
        },
        {
          question: 'Can I get a refund if I purchased the wrong product?',
          answer: 'If you haven\'t downloaded the product yet, we may be able to process a refund or exchange. Please contact our support team as soon as possible after your purchase.'
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
          answer: 'Don\'t worry! You can re-download your purchased products at any time by logging into your account and visiting the "My Downloads" section.'
        },
        {
          question: 'Do you offer product updates?',
          answer: 'Yes, for products that receive updates, you\'ll have access to the latest versions at no additional cost. You\'ll be notified by email when significant updates are available.'
        },
        {
          question: 'What are the system requirements for your products?',
          answer: 'System requirements vary by product. Please check the individual product descriptions for specific requirements before making a purchase.'
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
            Can't find what you're looking for? <Link href="/contact" className="text-primary-600 hover:text-primary-500 font-medium">Contact our support team</Link>.
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
              href="mailto:chris.t@ventarosales.com" 
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Webinars & Events</h3>
            <p className="text-gray-600 mb-4">
              Join our live webinars to learn about new products and get expert tips.
            </p>
            <Link href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              See Upcoming Events
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Forum</h3>
            <p className="text-gray-600 mb-4">
              Connect with other users, share ideas, and get help from our community.
            </p>
            <Link href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              Join the Discussion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}