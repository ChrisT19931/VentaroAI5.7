'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Booking {
  id: string;
  created_at: string;
  user_email: string;
  user_name: string;
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  session_type: string;
  notes: string;
  status: 'pending_confirmation' | 'confirmed' | 'cancelled' | 'completed';
  meeting_link?: string;
  admin_notes?: string;
}

export default function CoachingBookingsAdmin() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/coaching-bookings', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, notes?: string, link?: string) => {
    try {
      const response = await fetch('/api/admin/coaching-bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bookingId,
          status,
          adminNotes: notes,
          meetingLink: link
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Booking ${status} successfully!`);
        fetchBookings(); // Refresh the list
        setShowModal(false);
        setSelectedBooking(null);
        setAdminNotes('');
        setMeetingLink('');
      } else {
        toast.error(data.error || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Error updating booking');
    }
  };

  const openBookingModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.admin_notes || '');
    setMeetingLink(booking.meeting_link || '');
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_confirmation':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'confirmed':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-900/30 text-red-300 border-red-500/30';
      case 'completed':
        return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="glass-card p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📅 Coaching Bookings Management</h1>
          <p className="text-gray-300">Manage and confirm coaching session bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-xl font-bold text-white mb-2">No Bookings Yet</h2>
            <p className="text-gray-300">No coaching session bookings have been made.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white">{booking.user_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-300 text-sm"><strong>Email:</strong> {booking.user_email}</p>
                        <p className="text-gray-300 text-sm"><strong>Session:</strong> {booking.session_type}</p>
                        <p className="text-gray-300 text-sm"><strong>Requested:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm"><strong>Date:</strong> {formatDate(booking.scheduled_date)}</p>
                        <p className="text-gray-300 text-sm"><strong>Time:</strong> {booking.scheduled_time} ({booking.timezone})</p>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="bg-gray-800/50 p-3 rounded-lg mb-4">
                        <p className="text-gray-300 text-sm"><strong>Customer Notes:</strong></p>
                        <p className="text-gray-300 text-sm mt-1">{booking.notes}</p>
                      </div>
                    )}
                    
                    {booking.admin_notes && (
                      <div className="bg-blue-900/30 p-3 rounded-lg mb-4">
                        <p className="text-blue-300 text-sm"><strong>Admin Notes:</strong></p>
                        <p className="text-blue-300 text-sm mt-1">{booking.admin_notes}</p>
                      </div>
                    )}
                    
                    {booking.meeting_link && (
                      <div className="bg-green-900/30 p-3 rounded-lg mb-4">
                        <p className="text-green-300 text-sm"><strong>Meeting Link:</strong></p>
                        <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="text-green-300 text-sm underline hover:text-green-200">
                          {booking.meeting_link}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => openBookingModal(booking)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Manage
                    </button>
                    
                    {booking.status === 'pending_confirmation' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Quick Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Management Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Manage Booking</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-300"><strong>Customer:</strong> {selectedBooking.user_name} ({selectedBooking.user_email})</p>
                <p className="text-gray-300"><strong>Date & Time:</strong> {formatDate(selectedBooking.scheduled_date)} at {selectedBooking.scheduled_time}</p>
                <p className="text-gray-300"><strong>Current Status:</strong> {selectedBooking.status.replace('_', ' ')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this booking..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed', adminNotes, meetingLink)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Confirm Booking
              </button>
              
              <button
                onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled', adminNotes, meetingLink)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel Booking
              </button>
              
              <button
                onClick={() => updateBookingStatus(selectedBooking.id, 'completed', adminNotes, meetingLink)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Mark Completed
              </button>
              
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBooking(null);
                  setAdminNotes('');
                  setMeetingLink('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}