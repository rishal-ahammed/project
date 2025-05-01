import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-primary-800 text-white transform transition-transform duration-200 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-700">
          <Link to="/admin" className="flex items-center space-x-2">
            <CalendarCheck className="h-7 w-7 text-white" />
            <span className="text-xl font-heading font-bold">EventFlow Admin</span>
          </Link>
          <button 
            className="md:hidden text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center space-x-2 py-2 px-4 rounded transition-colors ${
                isActive ? 'bg-primary-700 text-white' : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/events" 
            className={({ isActive }) => 
              `flex items-center space-x-2 py-2 px-4 rounded transition-colors mt-2 ${
                isActive ? 'bg-primary-700 text-white' : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <Calendar className="h-5 w-5" />
            <span>Manage Events</span>
          </NavLink>
          
          <NavLink 
            to="/admin/capacity" 
            className={({ isActive }) => 
              `flex items-center space-x-2 py-2 px-4 rounded transition-colors mt-2 ${
                isActive ? 'bg-primary-700 text-white' : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span>Capacity Settings</span>
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center space-x-2 py-2 px-4 rounded transition-colors mt-2 ${
                isActive ? 'bg-primary-700 text-white' : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users className="h-5 w-5" />
            <span>User Registrations</span>
          </NavLink>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center space-x-2 mb-4 text-primary-200 px-4">
              <div className="bg-primary-700 h-8 w-8 flex items-center justify-center rounded-full">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{username}</div>
                <div className="text-xs">Administrator</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full py-2 px-4 text-primary-200 hover:bg-primary-700 hover:text-white rounded transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Welcome back, {username}</span>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 focus:outline-none hidden md:block"
              >
                <div className="flex items-center space-x-1">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;