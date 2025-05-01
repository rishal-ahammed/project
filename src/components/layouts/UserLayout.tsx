import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CalendarCheck, Menu, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show the header on the admin login page
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <CalendarCheck className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-heading font-bold text-gray-900">EventFlow</span>
            </Link>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition font-medium">
                Events
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/admin" 
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/admin/login" 
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Admin Login
                </Link>
              )}
            </nav>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white px-4 pt-2 pb-4 border-t animate-fade-in">
            <Link 
              to="/" 
              className="block py-2 text-gray-600 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            {isAuthenticated ? (
              <Link 
                to="/admin" 
                className="flex items-center py-2 text-primary-600 hover:text-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="flex items-center py-2 text-primary-600 hover:text-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock className="h-4 w-4 mr-1" />
                Admin Login
              </Link>
            )}
          </nav>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CalendarCheck className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-heading font-bold">EventFlow</span>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} EventFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;