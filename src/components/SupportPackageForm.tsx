'use client';

import { useState } from 'react';

interface SupportPackageFormProps {
  userEmail: string;
  userName: string;
}

export default function SupportPackageForm({ userEmail, userName }: SupportPackageFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    preferredDate: '',
    preferredTime: '',
    contactMethod: 'email',
    phoneNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/support-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userEmail,
          userName
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          subject: '',
          description: '',
          priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
          preferredDate: '',
          preferredTime: '',
          contactMethod: 'email',
          phoneNumber: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit support request');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      setError('Failed to submit support request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6 text-center">
        <div className="text-green-400 text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">Support Request Submitted!</h3>
        <p className="text-gray-300 mb-4">
          We've received your request and will respond within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Brief description of your issue"
            required
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      
      {/* Preferred Contact Method */}
      <div>
        <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-300 mb-2">
          Preferred Contact Method
        </label>
        <select
          id="contactMethod"
          value={formData.contactMethod}
          onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="email">Email</option>
          <option value="google-meet">Google Meet</option>
          <option value="phone">Phone Call</option>
        </select>
      </div>
      
      {/* Phone Number (conditional) */}
      {(formData.contactMethod === 'phone' || formData.contactMethod === 'google-meet') && (
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number {formData.contactMethod === 'phone' ? '*' : '(optional)'}
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required={formData.contactMethod === 'phone'}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Your phone number"
          />
        </div>
      )}
      
      {/* Preferred Date and Time */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-2">
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            value={formData.preferredDate}
            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-300 mb-2">
            Preferred Time
          </label>
          <input
            type="time"
            id="preferredTime"
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Please describe your issue or question in detail..."
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={submitting || !formData.subject.trim() || !formData.description.trim() || (formData.contactMethod === 'phone' && !formData.phoneNumber.trim())}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          '🚀 Submit Support Request'
        )}
      </button>
      
      <p className="text-xs text-gray-400 text-center">
        💡 We'll respond within 24 hours during business days
      </p>
    </form>
  );
}