import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEvents } from '../../context/EventContext';
import { Event } from '../../types';

const ManageEvents: React.FC = () => {
  const { events, removeEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort events by creation date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const handleDeleteClick = (eventId: string) => {
    setShowDeleteModal(eventId);
  };
  
  const confirmDelete = () => {
    if (showDeleteModal) {
      const eventToDelete = events.find(e => e.id === showDeleteModal);
      removeEvent(showDeleteModal);
      setShowDeleteModal(null);
      toast.success(`"${eventToDelete?.title}" has been deleted`);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Function to generate event status badge
  const EventStatusBadge: React.FC<{ event: Event }> = ({ event }) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > now;
    
    const availableSpots = event.capacity - event.registrationCount;
    const availablePercentage = (availableSpots / event.capacity) * 100;
    
    if (!isUpcoming) {
      return <span className="badge bg-gray-100 text-gray-800">Past</span>;
    }
    
    if (availablePercentage === 0) {
      return <span className="badge badge-error">Full</span>;
    }
    
    if (availablePercentage <= 20) {
      return <span className="badge badge-warning">Almost Full</span>;
    }
    
    return <span className="badge badge-success">Available</span>;
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-600">Create, edit and manage your events</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link to="/admin/events/new" className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-1" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>
      
      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events by title or location"
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Events list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {sortedEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 overflow-hidden">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{formatDate(event.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.registrationCount} / {event.capacity}
                      </div>
                      {/* Small progress bar */}
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            event.registrationCount === event.capacity 
                              ? 'bg-error-500' 
                              : event.registrationCount > event.capacity * 0.8 
                                ? 'bg-warning-500' 
                                : 'bg-success-500'
                          }`}
                          style={{ width: `${(event.registrationCount / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EventStatusBadge event={event} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/events/${event.id}`}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(event.id)}
                          className="text-error-600 hover:text-error-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 px-4 text-center">
            <div className="flex justify-center mb-3">
              <Calendar className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No events match "${searchTerm}". Try a different search term.` 
                : "You haven't created any events yet."}
            </p>
            {!searchTerm && (
              <Link to="/admin/events/new" className="btn-primary">
                Create Your First Event
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-error-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Delete Event</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone, 
              and all registration data for this event will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn-danger"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;