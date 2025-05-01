import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Image as ImageIcon,
  Save, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useEvents } from '../../context/EventContext';
import { Event } from '../../types';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl: string;
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, updateEvent, addEvent, getAvailableSpots } = useEvents();
  
  const isNewEvent = eventId === 'new';
  const existingEvent = !isNewEvent ? getEvent(eventId || '') : null;
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 50,
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  });
  
  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        location: existingEvent.location,
        capacity: existingEvent.capacity,
        imageUrl: existingEvent.imageUrl,
      });
    }
  }, [existingEvent]);
  
  const validateForm = () => {
    const newErrors: Partial<EventFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    if (existingEvent && formData.capacity < existingEvent.registrationCount) {
      newErrors.capacity = `Capacity cannot be less than current registrations (${existingEvent.registrationCount})`;
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof EventFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsSaving(true);
    
    // Short timeout to simulate server processing
    setTimeout(() => {
      try {
        if (isNewEvent) {
          // Create new event
          addEvent({
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location,
            capacity: formData.capacity,
            imageUrl: formData.imageUrl,
          });
          toast.success('Event created successfully!');
          navigate('/admin/events');
        } else if (existingEvent) {
          // Update existing event
          updateEvent({
            ...existingEvent,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location,
            capacity: formData.capacity,
            imageUrl: formData.imageUrl,
          });
          toast.success('Event updated successfully!');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }, 600);
  };
  
  // If trying to edit non-existent event
  if (!isNewEvent && !existingEvent) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-error-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're trying to edit doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/admin/events')}
          className="btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }
  
  // For existing events, show registration stats
  const registrationStats = !isNewEvent && existingEvent ? (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Registration Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Current Registrations</p>
          <p className="text-lg font-semibold">{existingEvent.registrationCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Available Spots</p>
          <p className="text-lg font-semibold">
            {getAvailableSpots(existingEvent.id).available}
          </p>
        </div>
      </div>
    </div>
  ) : null;
  
  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => navigate('/admin/events')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Back to events</span>
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isNewEvent ? 'Create New Event' : 'Edit Event'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label htmlFor="title" className="label">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input ${errors.title ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="e.g. Annual Business Conference"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-error-600">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`input ${errors.description ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="Provide a detailed description of your event"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-error-600">{errors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="label">
                      Event Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`input pl-10 ${errors.date ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-sm text-error-600">{errors.date}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="label">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`input pl-10 ${errors.location ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                        placeholder="e.g. Grand Hotel, New York"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-error-600">{errors.location}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {registrationStats}
                
                <div>
                  <label htmlFor="capacity" className="label">
                    Maximum Capacity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      min={existingEvent ? existingEvent.registrationCount : 1}
                      value={formData.capacity}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.capacity ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    />
                  </div>
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-error-600">{errors.capacity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="label">
                    Event Image URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.imageUrl ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-error-600">{errors.imageUrl}</p>
                  )}
                  
                  {/* Image preview */}
                  {formData.imageUrl && (
                    <div className="mt-2 relative bg-gray-100 rounded-lg overflow-hidden h-40">
                      <img 
                        src={formData.imageUrl}
                        alt="Event preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`btn-primary flex items-center ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <Save className="h-5 w-5 mr-1" />
                {isSaving ? 'Saving...' : isNewEvent ? 'Create Event' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;