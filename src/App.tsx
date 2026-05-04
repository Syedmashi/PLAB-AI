import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Profile from './pages/Profile';
import CaseSelection from './pages/CaseSelection';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cases" element={<CaseSelection />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
