import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BattleArena from './components/BattleArena';
import Leaderboard from './components/Leaderboard';
import HowToPlay from './components/HowToPlay';
import LoadingScreen from './components/LoadingScreen';
import { loadUser } from './store/authSlice';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  return user || token ? children : <Navigate to="/login" />;
};

// Layout Wrapper to handle conditional Nav/Footer
const AppLayout = ({ children }) => {
  return (
    <div className="app-container text-light min-vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        {children}
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(loadUser());

    // Show loading screen for 2.5 seconds on first boot
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isInitialLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <AppLayout key="main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/battle"
                element={
                  <PrivateRoute>
                    <BattleArena />
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
                path="/how-to-play"
                element={
                  <PrivateRoute>
                    <HowToPlay />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AppLayout>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
