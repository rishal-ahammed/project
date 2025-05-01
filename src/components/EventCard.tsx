import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../types';
import { useEvents } from '../context/EventContext';

interface EventCardProps {
  event: Event;
  showRegisterButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, showRegisterButton = true }) => {
  const { getAvailableSpots } = useEvents();
  const { available, total } = getAvailableSpots(event.id);
  
  // Determine capacity status
  const getCapacityStatus = () => {
    const ratio = available / total;
    if (ratio === 0) return { color: 'error', text: 'Full' };
    if (ratio <= 0.2) return { color: 'warning', text: 'Almost Full' };
    return { color: 'success', text: 'Available' };
  };
  
  const status = getCapacityStatus();
  const progressWidth = ((total - available) / total) * 100;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="card animate-fade-in">
      <div className="relative h-48 bg-gray-200">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`badge badge-${status.color}`}>
            {status.text}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{available} of {total} spots available</span>
          </div>
        </div>
        
        {/* Capacity progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full ${
              progressWidth === 100 
                ? 'bg-error-500' 
                : progressWidth > 80 
                  ? 'bg-warning-500' 
                  : 'bg-success-500'
            }`}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/events/${event.id}`} className="btn-secondary flex-1">
            View Details
          </Link>
          
          {showRegisterButton && (
            <Link 
              to={available > 0 ? `/register/${event.id}` : '#'} 
              className={`btn flex-1 ${
                available > 0 
                  ? 'btn-primary' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => available === 0 && e.preventDefault()}
            >
              {available > 0 ? 'Register' : 'Full'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;