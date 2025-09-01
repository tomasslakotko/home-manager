import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Meters from './components/meters/Meters';
import Bills from './components/bills/Bills';
import News from './components/news/News';
import Calendar from './components/calendar/Calendar';
import Feedback from './components/feedback/Feedback';
import Parking from './components/parking/Parking';
import AdminPanel from './components/admin/AdminPanel';
import Profile from './components/profile/Profile';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
                
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="meters" element={<Meters />} />
                    <Route path="bills" element={<Bills />} />
                    <Route path="news" element={<News />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="parking" element={<Parking />} />
                    <Route path="profile" element={<Profile />} />
                    
                    {/* Admin Routes */}
                    <Route path="admin" element={
                      <ProtectedRoute requiredRole={['admin', 'superadmin']}>
                        <AdminPanel />
                      </ProtectedRoute>
                    } />
                  </Route>
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
