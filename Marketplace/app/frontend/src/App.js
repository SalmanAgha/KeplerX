import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index/Index';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import Guest from './pages/Auth/Guest/Guest';
import Preloader from './pages/Preloader/Preloader';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate actual loading: Check auth, load user data, etc.
    const initApp = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('jwt');
      
      // Simulate loading time for actual data fetching
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second for actual loading
      
      setLoading(false);
    };

    initApp();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/index" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/guest" element={<Guest />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<h2 style={{ textAlign: 'center' }}>404 Not Found</h2>} />
    </Routes>
  );
}

export default App;
