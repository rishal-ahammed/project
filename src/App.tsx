import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventCapacity from './pages/admin/EventCapacity';
import EventDetails from './pages/admin/EventDetails';
import Login from './pages/admin/Login';
import ManageEvents from './pages/admin/ManageEvents';
import UserList from './pages/admin/UserList';
import EventPage from './pages/user/EventPage';
import Home from './pages/user/Home';
import RegisterForm from './pages/user/RegisterForm';
import ThankYou from './pages/user/ThankYou';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="events/:eventId" element={<EventPage />} />
        <Route path="register/:eventId" element={<RegisterForm />} />
        <Route path="thank-you" element={<ThankYou />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="events/:eventId" element={<EventDetails />} />
        <Route path="capacity" element={<EventCapacity />} />
        <Route path="users" element={<UserList />} />
      </Route>
    </Routes>
  );
}

export default App;