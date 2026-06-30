import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CameraUpload from './pages/CameraUpload';
import ScanHistory from './pages/ScanHistory';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Weather from './pages/Weather';
import ChatAssistant from './pages/ChatAssistant';
import FarmMap from './pages/FarmMap';
import LandingPage from './pages/LandingPage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Security from './pages/Security';
import AuthGuard from './components/AuthGuard';

function App() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable common developer tools keyboard shortcuts
    const handleKeyDown = (e) => {
      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/camera" element={<CameraUpload />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/map" element={<FarmMap />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

