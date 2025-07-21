'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // In a real implementation, you would send this data to your backend
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitSuccess(true);
    } catch (error: any) {
      setSubmitError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions about our products or need assistance? We're here to help! Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">
              For general inquiries and support, reach out to us via email.
            </p>
            <a href="mailto:support@aidigitalstore.com" className="text-primary-600 hover:text-primary-500 font-medium">
              support@aidigitalstore.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Need immediate assistance? Chat with our support team during business hours.
            </p>
            <Link href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              Start a Chat
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">
              Prefer to speak with someone? Our customer service team is available Monday-Friday, 9am-5pm EST.
            </p>
            <a href="tel:+1-555-123-4567" className="text-primary-600 hover:text-primary-500 font-medium">
              +1 (555) 123-4567
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Message Sent!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setSubmitSuccess(false)}
                          className="text-sm font-medium text-green-600 hover:text-green-500"
                        >
                          Send another message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{submitError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1 input-field"
                    >
                      <option value="">Please select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Product Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 input-field"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="md:w-1/2 bg-primary-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How do I download my purchased products?</h3>
                  <p className="text-primary-100">
                    After completing your purchase, you'll receive an email with download instructions. You can also access your downloads from your account page.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-primary-100">
                    We accept all major credit cards, PayPal, and Apple Pay for secure and convenient transactions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-primary-100">
                    Due to the digital nature of our products, we generally don't offer refunds. However, we're committed to customer satisfaction and will address any issues on a case-by-case basis.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I use your products for commercial projects?</h3>
                  <p className="text-primary-100">
                    Yes! All our products come with a commercial license, allowing you to use them in your business and client projects.
                  </p>
                </div>
                <div className="pt-4">
                  <Link href="/faq" className="text-white font-medium hover:underline">
                    View all FAQs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Location</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Visit our headquarters in the heart of Silicon Valley.
          </p>
          <div className="bg-gray-200 rounded-lg h-96 mb-4">
            {/* This would be replaced with an actual map component in a real implementation */}
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Map Placeholder</p>
            </div>
          </div>
          <address className="not-italic text-gray-600">
            123 Tech Boulevard, Suite 456<br />
            San Francisco, CA 94107<br />
            United States
          </address>
        </div>
      </div>
    </div>
  );
}