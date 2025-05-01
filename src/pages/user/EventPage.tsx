import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, getAvailableSpots } = useEvents();
  
  const event = getEvent(eventId || '');
  
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }
  
  const { available, total } = getAvailableSpots(event.id);
  const progressWidth = ((total - available) / total) * 100;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Back to events</span>
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 md:h-80 bg-gray-200 relative">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              <span>
                {available} of {total} spots available
              </span>
            </div>
          </div>
          
          {/* Capacity progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                progressWidth === 100 
                  ? 'bg-error-500' 
                  : progressWidth > 80 
                    ? 'bg-warning-500' 
                    : 'bg-success-500'
              }`}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link 
              to={available > 0 ? `/register/${event.id}` : '#'} 
              className={`btn px-8 py-3 text-lg ${
                available > 0 
                  ? 'btn-primary' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => available === 0 && e.preventDefault()}
            >
              {available > 0 ? 'Register Now' : 'Event Full'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;