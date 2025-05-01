import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar } from 'lucide-react';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect if user directly accesses this page
  useEffect(() => {
    const hasRegistered = localStorage.getItem('registrations') !== null;
    
    if (!hasRegistered) {
      navigate('/');
    }
  }, [navigate]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-primary-50 flex items-center justify-center">
          <CheckCircle className="h-20 w-20 text-success-500" />
        </div>
        
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for registering for our event. We've reserved your spot and look forward to seeing you there.
          </p>
          
          <div className="space-y-2 max-w-xs mx-auto mb-8">
            <div className="flex items-center justify-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              <span>Check your email for event details</span>
            </div>
          </div>
          
          <Link to="/" className="btn-primary inline-block py-3 px-8">
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;