import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

const AdminDashboard: React.FC = () => {
  const { events, registrations } = useEvents();
  
  // Calculate some stats for the dashboard
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const filledCapacity = events.reduce((sum, event) => sum + event.registrationCount, 0);
  const capacityPercentage = totalCapacity > 0 
    ? Math.round((filledCapacity / totalCapacity) * 100) 
    : 0;
  
  // Sort events by date (most recent first)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Recent registrations
  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">View and manage your events and registrations</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <h3 className="text-2xl font-semibold text-gray-900">{totalEvents}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-accent-100 p-3 mr-4">
              <Users className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Registrations</p>
              <h3 className="text-2xl font-semibold text-gray-900">{totalRegistrations}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-success-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Capacity Filled</p>
              <h3 className="text-2xl font-semibold text-gray-900">{capacityPercentage}%</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-warning-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Available Spots</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {totalCapacity - filledCapacity}
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming events */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/admin/events" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const date = new Date(event.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                
                return (
                  <div key={event.id} className="py-4 first:pt-0 last:pb-0">
                    <Link to={`/admin/events/${event.id}`} className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded bg-primary-100 flex items-center justify-center mr-4">
                        <Calendar className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formattedDate} • {event.location}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-gray-900">
                          {event.registrationCount}/{event.capacity}
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-gray-500 text-center">No upcoming events</p>
            )}
          </div>
        </div>
        
        {/* Recent registrations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
            <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentRegistrations.length > 0 ? (
              recentRegistrations.map((registration) => {
                const event = events.find(e => e.id === registration.eventId);
                const date = new Date(registration.registrationDate);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                
                return (
                  <div key={registration.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {registration.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {registration.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {event?.title || 'Unknown event'}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500">
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-gray-500 text-center">No registrations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;