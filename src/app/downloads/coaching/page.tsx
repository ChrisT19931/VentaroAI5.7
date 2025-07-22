'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CoachingDownloadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectType: '',
    currentHosting: '',
    techStack: '',
    timeline: '',
    specificChallenges: '',
    preferredTimes: '',
    timezone: '',
    additionalInfo: ''
  });

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) {
        router.push('/login?redirect=/downloads/coaching');
        return;
      }

      try {
        // Check if user has purchased the coaching call
        const response = await fetch('/api/verify-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            productType: 'coaching'
          })
        });

        const data = await response.json();
        setHasAccess(data.hasAccess);
      } catch (error) {
        console.error('Error verifying access:', error);
        setHasAccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/coaching-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
          ...formData
        })
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="glass-card p-8">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-6">
              You don't have access to this coaching session. Please purchase the 1-on-1 Coaching Call first.
            </p>
            <div className="space-y-4">
              <Link href="/products/coaching" className="btn-primary inline-block">
                Purchase Coaching Call
              </Link>
              <br />
              <Link href="/account" className="text-blue-400 hover:text-blue-300">
                Check My Purchases
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-gray-300 mb-6">
              Your coaching session intake form has been submitted successfully.
            </p>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">📧 What Happens Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Email Confirmation (Within 2 hours)</h4>
                    <p className="text-gray-300 text-sm">You'll receive an email from <strong className="text-blue-400">chris.t@ventarosales.com</strong> confirming receipt of your information</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Session Scheduling (Within 24 hours)</h4>
                    <p className="text-gray-300 text-sm">We'll send you a calendar link with available time slots based on your preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Pre-Session Materials (3 days before)</h4>
                    <p className="text-gray-300 text-sm">Receive preparation checklist and meeting link via email</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-3">📞 Contact Information</h3>
              <p className="text-gray-300 text-sm">
                If you have any questions or need to make changes, contact us at:
                <br />
                <strong className="text-blue-400">chris.t@ventarosales.com</strong>
              </p>
            </div>

            <div className="text-center">
              <Link href="/account" className="text-blue-400 hover:text-blue-300 mr-6">
                ← Back to My Account
              </Link>
              <Link href="/products" className="text-blue-400 hover:text-blue-300">
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-2">Coaching Session Intake Form</h1>
            <p className="text-gray-300">Help us prepare for your personalized 1-on-1 session by sharing your specific needs and goals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Project Type *</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select your project type</option>
                  <option value="new-website">New Website Deployment</option>
                  <option value="existing-migration">Existing Site Migration</option>
                  <option value="e-commerce">E-commerce Store</option>
                  <option value="web-app">Web Application</option>
                  <option value="portfolio">Portfolio/Personal Site</option>
                  <option value="business">Business Website</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Current Hosting Situation</label>
                <select
                  name="currentHosting"
                  value={formData.currentHosting}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select current situation</option>
                  <option value="no-hosting">No hosting yet</option>
                  <option value="shared-hosting">Shared hosting</option>
                  <option value="vps">VPS/Cloud hosting</option>
                  <option value="dedicated">Dedicated server</option>
                  <option value="managed">Managed hosting</option>
                  <option value="unsure">Not sure</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Technology Stack</label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="e.g., React, WordPress, HTML/CSS, etc."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Deployment Timeline *</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP (Within 1 week)</option>
                  <option value="2-weeks">Within 2 weeks</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="flexible">Flexible timeline</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Specific Challenges or Questions *</label>
              <textarea
                name="specificChallenges"
                value={formData.specificChallenges}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe any specific issues you're facing or questions you have about deployment..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Preferred Session Times *</label>
                <textarea
                  name="preferredTimes"
                  value={formData.preferredTimes}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="List 3 preferred time slots (e.g., Mon 2-4pm, Wed 10am-12pm, Fri 3-5pm)"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Your Timezone *</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select timezone</option>
                  <option value="EST">Eastern Time (EST/EDT)</option>
                  <option value="CST">Central Time (CST/CDT)</option>
                  <option value="MST">Mountain Time (MST/MDT)</option>
                  <option value="PST">Pacific Time (PST/PDT)</option>
                  <option value="GMT">Greenwich Mean Time (GMT)</option>
                  <option value="CET">Central European Time (CET)</option>
                  <option value="other">Other (specify in additional info)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Additional Information</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any other details that would help us prepare for your session..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Note:</strong> After submitting this form, you'll receive an email from chris.t@ventarosales.com within 24 hours with scheduling options and pre-session materials.
              </p>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : '📧 Submit Intake Form'}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <Link href="/account" className="text-blue-400 hover:text-blue-300 mr-6">
              ← Back to My Account
            </Link>
            <Link href="/products" className="text-blue-400 hover:text-blue-300">
              Browse More Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}