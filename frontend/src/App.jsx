import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuestion from './pages/CreateQuestion';
import TakeTest from './pages/TakeTest';
import TestHistory from './pages/TestHistory';
import TestResults from './pages/TestResults';
import Leaderboard from './pages/Leaderboard';
import Statistics from './pages/Statistics';
import Moderation from './pages/Moderation';
import Payments from './pages/Payments';
import PrivateRoute from './components/PrivateRoute';

/**
 * Main App komponenti
 * Barcha providerlar va routelar shu yerda
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-[var(--bg-primary)] transition-colors">
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-question"
                  element={
                    <PrivateRoute>
                      <CreateQuestion />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/take-test"
                  element={
                    <PrivateRoute>
                      <TakeTest />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/test-history"
                  element={
                    <PrivateRoute>
                      <TestHistory />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/test-results/:id"
                  element={
                    <PrivateRoute>
                      <TestResults />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <PrivateRoute>
                      <Leaderboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <PrivateRoute>
                      <Statistics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/moderation"
                  element={
                    <PrivateRoute requireModerator>
                      <Moderation />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <PrivateRoute>
                      <Payments />
                    </PrivateRoute>
                  }
                />

                {/* 404 - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
