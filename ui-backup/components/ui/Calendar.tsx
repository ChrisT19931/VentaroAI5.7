'use client';

import React, { useState, useEffect } from 'react';

type CalendarEvent = {
  /**
   * Unique identifier for the event
   */
  id: string | number;
  
  /**
   * Title of the event
   */
  title: string;
  
  /**
   * Start date and time of the event
   */
  start: Date;
  
  /**
   * End date and time of the event
   */
  end: Date;
  
  /**
   * Optional color for the event
   */
  color?: string;
  
  /**
   * Optional description for the event
   */
  description?: string;
  
  /**
   * Optional location for the event
   */
  location?: string;
  
  /**
   * Optional flag to mark the event as all-day
   */
  allDay?: boolean;
};

type CalendarProps = {
  /**
   * Initial date to display
   */
  initialDate?: Date;
  
  /**
   * View type for the calendar
   */
  view?: 'month' | 'week' | 'day' | 'agenda';
  
  /**
   * Array of events to display
   */
  events?: CalendarEvent[];
  
  /**
   * Callback when an event is clicked
   */
  onEventClick?: (event: CalendarEvent) => void;
  
  /**
   * Callback when a date is clicked
   */
  onDateClick?: (date: Date) => void;
  
  /**
   * Callback when the view changes
   */
  onViewChange?: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  
  /**
   * Callback when the date changes
   */
  onDateChange?: (date: Date) => void;
  
  /**
   * Whether to show the toolbar
   */
  showToolbar?: boolean;
  
  /**
   * Whether to show week numbers
   */
  showWeekNumbers?: boolean;
  
  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  
  /**
   * Whether to show all-day events
   */
  showAllDayEvents?: boolean;
  
  /**
   * Whether to show event time
   */
  showEventTime?: boolean;
  
  /**
   * Height of the calendar
   */
  height?: number | string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export default function Calendar({
  initialDate = new Date(),
  view = 'month',
  events = [],
  onEventClick,
  onDateClick,
  onViewChange,
  onDateChange,
  showToolbar = true,
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  showAllDayEvents = true,
  showEventTime = true,
  height = 'auto',
  className = '',
}: CalendarProps) {
  // State for current date and view
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentView, setCurrentView] = useState(view);
  
  // Update state when props change
  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);
  
  useEffect(() => {
    setCurrentView(view);
  }, [view]);
  
  // Helper functions for date manipulation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatEventTime = (event: CalendarEvent) => {
    if (event.allDay) return 'All day';
    return `${formatTime(event.start)} - ${formatTime(event.end)}`;
  };
  
  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (currentView === 'agenda') {
      newDate.setDate(newDate.getDate() - 7);
    }
    
    setCurrentDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (currentView === 'agenda') {
      newDate.setDate(newDate.getDate() + 7);
    }
    
    setCurrentDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (onDateChange) onDateChange(today);
  };
  
  // View change handler
  const handleViewChange = (newView: 'month' | 'week' | 'day' | 'agenda') => {
    setCurrentView(newView);
    if (onViewChange) onViewChange(newView);
  };
  
  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) onEventClick(event);
  };
  
  const handleDateClick = (date: Date) => {
    if (onDateClick) onDateClick(date);
  };
  
  // Filter events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Render toolbar
  const renderToolbar = () => {
    return (
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded-md">
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={goToPrevious}
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={goToNext}
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <h2 className="text-lg font-semibold">
          {currentView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {currentView === 'week' && `Week of ${formatDate(getStartOfWeek(currentDate))}`}
          {currentView === 'day' && formatDate(currentDate)}
          {currentView === 'agenda' && `Agenda: ${formatDate(currentDate)}`}
        </h2>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 border border-gray-300 rounded-md ${currentView === 'month' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 border border-gray-300 rounded-md ${currentView === 'week' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 border border-gray-300 rounded-md ${currentView === 'day' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 border border-gray-300 rounded-md ${currentView === 'agenda' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => handleViewChange('agenda')}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };
  
  // Get start of week for a given date
  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
    result.setDate(result.getDate() - diff);
    return result;
  };
  
  // Render month view
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonthIndex = getFirstDayOfMonth(currentDate);
    const adjustedFirstDayIndex = (firstDayOfMonthIndex - firstDayOfWeek + 7) % 7;
    
    // Create array of day names based on firstDayOfWeek
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const adjustedDayNames = [
      ...dayNames.slice(firstDayOfWeek),
      ...dayNames.slice(0, firstDayOfWeek)
    ];
    
    // Calculate previous month's days to display
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonthDate);
    
    // Calculate dates for the calendar grid
    const calendarDays: Date[] = [];
    
    // Add previous month's days
    for (let i = 0; i < adjustedFirstDayIndex; i++) {
      const day = prevMonthDays - adjustedFirstDayIndex + i + 1;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      calendarDays.push(date);
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      calendarDays.push(date);
    }
    
    // Add next month's days to fill the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      calendarDays.push(date);
    }
    
    return (
      <div className="bg-white rounded-md shadow-sm">
        <div className="grid grid-cols-7 border-b">
          {showWeekNumbers && (
            <div className="py-2 text-center text-sm font-medium text-gray-500 border-r">
              Week
            </div>
          )}
          {adjustedDayNames.map((day, index) => (
            <div key={index} className="py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className={`grid ${showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7'}`}>
          {showWeekNumbers && (
            <>
              {Array.from({ length: 6 }).map((_, weekIndex) => {
                const date = calendarDays[weekIndex * 7];
                return (
                  <div key={`week-${weekIndex}`} className="py-1 text-center text-sm text-gray-500 border-r border-b h-24">
                    {getWeekNumber(date)}
                  </div>
                );
              })}
            </>
          )}
          
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const dateEvents = getEventsForDate(date);
            
            return (
              <div
                key={index}
                className={`p-1 border-b ${index % 7 !== 6 ? 'border-r' : ''} h-24 overflow-hidden ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`text-right ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto' : ''}`}>
                  {date.getDate()}
                </div>
                
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
                  {dateEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-xs p-1 rounded truncate cursor-pointer"
                      style={{ backgroundColor: event.color || '#3788d8', color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dateEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays: Date[] = [];
    
    // Create array of days for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }
    
    // Create array of hours for the day
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="bg-white rounded-md shadow-sm overflow-auto" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
          <div className="py-2 text-center text-sm font-medium text-gray-500 border-r">
            Time
          </div>
          {weekDays.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`py-2 text-center text-sm font-medium ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mt-1' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {showAllDayEvents && (
          <div className="grid grid-cols-8 border-b">
            <div className="py-2 text-center text-sm font-medium text-gray-500 border-r">
              All day
            </div>
            {weekDays.map((date, dayIndex) => {
              const allDayEvents = events.filter(event => {
                const eventDate = new Date(event.start);
                return (
                  event.allDay &&
                  eventDate.getDate() === date.getDate() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getFullYear() === date.getFullYear()
                );
              });
              
              return (
                <div key={dayIndex} className="p-1 min-h-[60px] relative">
                  {allDayEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-xs p-1 mb-1 rounded truncate cursor-pointer"
                      style={{ backgroundColor: event.color || '#3788d8', color: 'white' }}
                      onClick={() => handleEventClick(event)}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="py-2 text-center text-sm text-gray-500 border-r">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map((date, dayIndex) => {
                const hourEvents = events.filter(event => {
                  if (event.allDay) return false;
                  
                  const eventStart = new Date(event.start);
                  return (
                    eventStart.getDate() === date.getDate() &&
                    eventStart.getMonth() === date.getMonth() &&
                    eventStart.getFullYear() === date.getFullYear() &&
                    eventStart.getHours() === hour
                  );
                });
                
                return (
                  <div key={dayIndex} className="p-1 h-16 relative border-r">
                    {hourEvents.map((event, eventIndex) => {
                      const eventDuration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
                      const heightPercentage = Math.min(100, (eventDuration / 60) * 100);
                      
                      return (
                        <div
                          key={eventIndex}
                          className="absolute left-0 right-0 mx-1 p-1 text-xs rounded truncate cursor-pointer overflow-hidden"
                          style={{
                            backgroundColor: event.color || '#3788d8',
                            color: 'white',
                            height: `${heightPercentage}%`,
                            zIndex: 10
                          }}
                          onClick={() => handleEventClick(event)}
                          title={`${event.title} (${formatEventTime(event)})`}
                        >
                          {event.title}
                          {showEventTime && (
                            <div className="text-xs opacity-80">
                              {formatTime(event.start)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render day view
  const renderDayView = () => {
    // Create array of hours for the day
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="bg-white rounded-md shadow-sm overflow-auto" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="grid grid-cols-2 border-b sticky top-0 bg-white z-10">
          <div className="py-2 text-center text-sm font-medium text-gray-500 border-r">
            Time
          </div>
          <div className="py-2 text-center text-sm font-medium">
            {formatDate(currentDate)}
          </div>
        </div>
        
        {showAllDayEvents && (
          <div className="grid grid-cols-2 border-b">
            <div className="py-2 text-center text-sm font-medium text-gray-500 border-r">
              All day
            </div>
            <div className="p-1 min-h-[60px]">
              {events
                .filter(event => {
                  const eventDate = new Date(event.start);
                  return (
                    event.allDay &&
                    eventDate.getDate() === currentDate.getDate() &&
                    eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear()
                  );
                })
                .map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="text-xs p-1 mb-1 rounded truncate cursor-pointer"
                    style={{ backgroundColor: event.color || '#3788d8', color: 'white' }}
                    onClick={() => handleEventClick(event)}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        )}
        
        <div className="relative">
          {hours.map((hour) => {
            const hourEvents = events.filter(event => {
              if (event.allDay) return false;
              
              const eventStart = new Date(event.start);
              return (
                eventStart.getDate() === currentDate.getDate() &&
                eventStart.getMonth() === currentDate.getMonth() &&
                eventStart.getFullYear() === currentDate.getFullYear() &&
                eventStart.getHours() === hour
              );
            });
            
            return (
              <div key={hour} className="grid grid-cols-2 border-b">
                <div className="py-2 text-center text-sm text-gray-500 border-r">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div className="p-1 h-16 relative">
                  {hourEvents.map((event, eventIndex) => {
                    const eventDuration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
                    const heightPercentage = Math.min(100, (eventDuration / 60) * 100);
                    
                    return (
                      <div
                        key={eventIndex}
                        className="absolute left-0 right-0 mx-1 p-1 text-xs rounded truncate cursor-pointer overflow-hidden"
                        style={{
                          backgroundColor: event.color || '#3788d8',
                          color: 'white',
                          height: `${heightPercentage}%`,
                          zIndex: 10
                        }}
                        onClick={() => handleEventClick(event)}
                        title={`${event.title} (${formatEventTime(event)})`}
                      >
                        {event.title}
                        {showEventTime && (
                          <div className="text-xs opacity-80">
                            {formatTime(event.start)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render agenda view
  const renderAgendaView = () => {
    // Get start and end dates for the agenda view (current date +/- 7 days)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 7);
    
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 7);
    
    // Filter events within the date range
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
    
    // Sort events by date
    const sortedEvents = [...filteredEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Group events by date
    const eventsByDate: Record<string, CalendarEvent[]> = {};
    
    sortedEvents.forEach(event => {
      const dateKey = event.start.toDateString();
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });
    
    return (
      <div className="bg-white rounded-md shadow-sm overflow-auto" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        {Object.keys(eventsByDate).length > 0 ? (
          Object.keys(eventsByDate).map(dateKey => {
            const date = new Date(dateKey);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={dateKey} className="border-b last:border-b-0">
                <div 
                  className={`py-2 px-4 font-medium ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}
                  onClick={() => handleDateClick(date)}
                >
                  {formatDate(date)}
                </div>
                <div className="divide-y">
                  {eventsByDate[dateKey].map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start">
                        <div 
                          className="w-3 h-3 rounded-full mt-1 mr-2 flex-shrink-0"
                          style={{ backgroundColor: event.color || '#3788d8' }}
                        />
                        <div className="flex-grow">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">
                            {formatEventTime(event)}
                          </div>
                          {event.location && (
                            <div className="text-sm text-gray-500 mt-1">
                              📍 {event.location}
                            </div>
                          )}
                          {event.description && (
                            <div className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            No events to display
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`calendar ${className}`}>
      {showToolbar && renderToolbar()}
      
      {currentView === 'month' && renderMonthView()}
      {currentView === 'week' && renderWeekView()}
      {currentView === 'day' && renderDayView()}
      {currentView === 'agenda' && renderAgendaView()}
    </div>
  );
}