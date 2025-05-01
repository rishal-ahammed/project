import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Event, EventContextType, User } from '../types';
import { sampleEvents } from '../data/sampleData';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : sampleEvents;
  });
  
  const [registrations, setRegistrations] = useState<User[]>(() => {
    const storedRegistrations = localStorage.getItem('registrations');
    return storedRegistrations ? JSON.parse(storedRegistrations) : [];
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);
  
  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);
  
  const addEvent = (event: Omit<Event, 'id' | 'registrationCount' | 'createdAt'>) => {
    const newEvent: Event = {
      ...event,
      id: uuidv4(),
      registrationCount: 0,
      createdAt: new Date(),
    };
    setEvents([...events, newEvent]);
  };
  
  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };
  
  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setRegistrations(registrations.filter(reg => reg.eventId !== id));
  };
  
  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };
  
  const registerUser = (userData: Omit<User, 'id' | 'registrationDate'>) => {
    const eventId = userData.eventId;
    const event = getEvent(eventId);
    
    if (!event) return false;
    
    // Check if there are available spots
    const { available } = getAvailableSpots(eventId);
    if (available <= 0) return false;
    
    // Create new user registration
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      registrationDate: new Date(),
    };
    
    // Update registrations
    setRegistrations([...registrations, newUser]);
    
    // Update event registration count
    const updatedEvent = {
      ...event,
      registrationCount: event.registrationCount + 1,
    };
    updateEvent(updatedEvent);
    
    return true;
  };
  
  const getRegistrationsForEvent = (eventId: string) => {
    return registrations.filter(user => user.eventId === eventId);
  };
  
  const setEventCapacity = (eventId: string, capacity: number) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, capacity } : event
    ));
  };
  
  const getAvailableSpots = (eventId: string) => {
    const event = getEvent(eventId);
    if (!event) return { available: 0, total: 0 };
    
    return {
      available: Math.max(0, event.capacity - event.registrationCount),
      total: event.capacity,
    };
  };
  
  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        addEvent,
        updateEvent,
        removeEvent,
        getEvent,
        registerUser,
        getRegistrationsForEvent,
        setEventCapacity,
        getAvailableSpots,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};