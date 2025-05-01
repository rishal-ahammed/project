import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEvents } from '../../context/EventContext';

interface FormData {
  name: string;
  phone: string;
  location: string;
}

const RegisterForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, registerUser, getAvailableSpots } = useEvents();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    location: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const event = getEvent(eventId || '');
  const { available } = getAvailableSpots(eventId || '');
  
  // If event doesn't exist or is full, redirect to home
  React.useEffect(() => {
    if (!event) {
      toast.error('Event not found');
      navigate('/');
      return;
    }
    
    if (available <= 0) {
      toast.error('This event is full');
      navigate(`/events/${eventId}`);
    }
  }, [event, available, eventId, navigate]);
  
  if (!event) {
    return null;
  }
  
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate async operation
    setTimeout(() => {
      const success = registerUser({
        ...formData,
        eventId: eventId || '',
      });
      
      if (success) {
        toast.success('Registration successful!');
        navigate('/thank-you');
      } else {
        toast.error('Registration failed. The event might be full.');
        setIsSubmitting(false);
      }
    }, 800);
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button 
        onClick={() => navigate(`/events/${eventId}`)}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Back to event</span>
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Register for Event</h1>
        <h2 className="text-lg text-gray-600 mb-6">{event.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input ${errors.phone ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="label">
              Your Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`input ${errors.location ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
              placeholder="Enter your city/location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-error-600">{errors.location}</p>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className={`btn-primary w-full py-3 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Registration'}
            </button>
            
            <p className="mt-4 text-sm text-gray-600 text-center">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;