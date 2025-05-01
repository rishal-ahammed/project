import React from 'react';
import { CalendarCheck } from 'lucide-react';
import EventCard from '../../components/EventCard';
import { useEvents } from '../../context/EventContext';

const Home: React.FC = () => {
  const { events } = useEvents();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex justify-center mb-4">
            <CalendarCheck className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Our Events
          </h1>
          <p className="text-lg text-gray-600">
            Browse our upcoming events and secure your spot today. Limited capacity available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;