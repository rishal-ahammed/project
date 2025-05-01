import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEvents } from '../../context/EventContext';

const EventCapacity: React.FC = () => {
  const { events, setEventCapacity, getAvailableSpots } = useEvents();
  const [capacities, setCapacities] = useState<{ [key: string]: number }>(() => {
    const initialCapacities: { [key: string]: number } = {};
    events.forEach(event => {
      initialCapacities[event.id] = event.capacity;
    });
    return initialCapacities;
  });
  
  const handleCapacityChange = (eventId: string, capacity: string) => {
    const newCapacity = parseInt(capacity, 10);
    if (!isNaN(newCapacity) && newCapacity >= 0) {
      setCapacities({ ...capacities, [eventId]: newCapacity });
    }
  };
  
  const handleSave = (eventId: string) => {
    const currentEvent = events.find(e => e.id === eventId);
    const newCapacity = capacities[eventId];
    
    if (currentEvent && newCapacity !== undefined) {
      // Check if new capacity is less than current registrations
      if (newCapacity < currentEvent.registrationCount) {
        toast.error(`Cannot set capacity below the current registration count (${currentEvent.registrationCount})`);
        return;
      }
      
      setEventCapacity(eventId, newCapacity);
      toast.success(`Capacity updated for "${currentEvent.title}"`);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Event Capacity Settings</h1>
        <p className="text-gray-600">Manage the maximum number of participants for each event</p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {events.map(event => {
            const { available, total } = getAvailableSpots(event.id);
            const progressWidth = ((total - available) / total) * 100;
            
            return (
              <div key={event.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                  </div>
                  <div className="flex items-center">
                    <Link 
                      to={`/admin/events/${event.id}`}
                      className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">Current Registrations</span>
                      </div>
                      <span className="text-sm font-medium">
                        {event.registrationCount} of {event.capacity}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          progressWidth === 100 
                            ? 'bg-error-500' 
                            : progressWidth > 80 
                              ? 'bg-warning-500' 
                              : 'bg-success-500'
                        }`}
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                      <label className="w-full sm:w-auto text-sm font-medium text-gray-700 mr-4">
                        Maximum Capacity:
                      </label>
                      <div className="w-full sm:w-auto flex">
                        <input
                          type="number"
                          min={event.registrationCount}
                          value={capacities[event.id] || ''}
                          onChange={(e) => handleCapacityChange(event.id, e.target.value)}
                          className="input w-28 mr-2"
                        />
                        <button
                          onClick={() => handleSave(event.id)}
                          className="btn-primary"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventCapacity;