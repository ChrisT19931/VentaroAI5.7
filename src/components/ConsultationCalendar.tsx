'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';

interface ConsultationCalendarProps {
  onBookingComplete?: (bookingId: string) => void;
}

export default function ConsultationCalendar({ onBookingComplete }: ConsultationCalendarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [businessType, setBusinessType] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  const [goals, setGoals] = useState('');
  const [notes, setNotes] = useState('');
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [submitting, setSubmitting] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes] = useState([
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]);

  useEffect(() => {
    // Generate available dates (next 30 days, excluding weekends)
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 45; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
      
      if (dates.length >= 30) break;
    }
    
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
    }
  }, [user]);

  const handleBooking = async () => {
    if (!user || !user.id || !user.email) {
      toast.error('Please log in to book a consultation');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    if (!userName.trim() || !userEmail.trim()) {
      toast.error('Please enter your name and email');
      return;
    }

    if (!businessType.trim() || !currentChallenges.trim() || !goals.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/consultation-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: userEmail.trim(),
          userName: userName.trim(),
          selectedDate,
          selectedTime,
          timezone,
          businessType: businessType.trim(),
          currentChallenges: currentChallenges.trim(),
          goals: goals.trim(),
          notes: notes.trim(),
          sessionType: 'AI Business Consultation'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('🎉 Consultation booked successfully! Check your email for confirmation.');
        
        // Reset form
        setSelectedDate('');
        setSelectedTime('');
        setBusinessType('');
        setCurrentChallenges('');
        setGoals('');
        setNotes('');
        
        // Call callback if provided
        if (onBookingComplete) {
          onBookingComplete(data.bookingId);
        }
      } else {
        toast.error(data.error || 'Failed to book consultation');
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      toast.error('Error booking consultation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!user) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
        <p className="text-gray-300 mb-4">Please sign in to book your consultation session.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Book Your AI Business Consultation</h2>
        <p className="text-gray-300">60-minute personalized session to accelerate your AI business success</p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Business Information */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Type / Industry *
          </label>
          <input
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., E-commerce, Consulting, SaaS, Local Service Business"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Challenges *
          </label>
          <textarea
            value={currentChallenges}
            onChange={(e) => setCurrentChallenges(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
            placeholder="What are your biggest challenges with AI implementation, website development, or business growth?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Goals & Objectives *
          </label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
            placeholder="What do you want to achieve? Revenue targets, automation goals, specific outcomes?"
            required
          />
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Select Date *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {availableDates.slice(0, 12).map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === date
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </button>
            ))}
          </div>
          {selectedDate && (
            <p className="text-sm text-blue-400 mt-2">
              Selected: {formatDate(selectedDate)}
            </p>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time * (Your timezone: {timezone})
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTime === time
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
            {selectedTime && (
              <p className="text-sm text-green-400 mt-2">
                Selected: {formatTime(selectedTime)} ({timezone})
              </p>
            )}
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
            placeholder="Any specific topics you'd like to discuss or questions you have?"
          />
        </div>

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Consultation Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
              <p><strong>Time:</strong> {formatTime(selectedTime)} ({timezone})</p>
              <p><strong>Duration:</strong> 60 minutes</p>
              <p><strong>Format:</strong> Video call (Google Meet link will be provided)</p>
              <p><strong>Focus:</strong> AI Business Strategy & Implementation</p>
            </div>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={submitting || !selectedDate || !selectedTime || !userName || !userEmail || !businessType || !currentChallenges || !goals}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
              Booking Consultation...
            </>
          ) : (
            '🚀 Book My AI Business Consultation'
          )}
        </button>

        <div className="text-center text-sm text-gray-400">
          <p>⚡ You'll receive email confirmation with Google Meet link</p>
          <p>📧 Both you and our team will be notified automatically</p>
        </div>
      </div>
    </div>
  );
} 