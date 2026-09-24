import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResourceViewer from './pages/ResourceViewer';
import SecurityMonitor from './pages/SecurityMonitor';
import Walkthrough from './pages/Walkthrough';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="cyber-grid"></div>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/resource/:service" element={
          <ProtectedRoute>
            <ResourceViewer />
          </ProtectedRoute>
        } />
        
        <Route path="/security" element={
          <ProtectedRoute>
            <SecurityMonitor />
          </ProtectedRoute>
        } />
        
        <Route path="/walkthrough" element={
          <ProtectedRoute>
            <Walkthrough />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
