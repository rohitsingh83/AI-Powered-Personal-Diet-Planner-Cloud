import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import GeneratePlanPage from './pages/GeneratePlanPage';
import SavedPlansPage from './pages/SavedPlansPage';
import PlanDetailPage from './pages/PlanDetailPage';
import FilesPage from './pages/FilesPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><GeneratePlanPage /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><SavedPlansPage /></ProtectedRoute>} />
          <Route path="/plans/:planId" element={<ProtectedRoute><PlanDetailPage /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
