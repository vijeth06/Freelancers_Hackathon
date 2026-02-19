import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MeetingCreate from './pages/MeetingCreate';
import MeetingDetail from './pages/MeetingDetail';
import ActionItems from './pages/ActionItems';
import SharedView from './pages/SharedView';

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
            duration: 5000,
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route path="/shared/:shareToken" element={<SharedView />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/new"
          element={
            <ProtectedRoute>
              <MeetingCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <MeetingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/action-items"
          element={
            <ProtectedRoute>
              <ActionItems />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-200">404</h1>
                <p className="mt-4 text-lg text-gray-600">Page not found</p>
                <a href="/dashboard" className="mt-6 inline-block text-primary-600 hover:text-primary-700 font-medium">
                  Go to Dashboard &rarr;
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}
