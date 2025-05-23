import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import { FinanceProvider } from './context/FinanceContext';
import AuthPages from './components/AuthPages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/auth" element={<AuthPages />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/auth" replace />} />
            </Routes>
          </div>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
