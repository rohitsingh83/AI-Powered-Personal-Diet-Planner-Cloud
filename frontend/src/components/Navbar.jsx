import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold tracking-wider flex items-center gap-2">
            🥗 NutriPlan AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-emerald-200 transition-colors">Dashboard</Link>
                <Link to="/generate" className="hover:text-emerald-200 transition-colors">Generate Plan</Link>
                <Link to="/plans" className="hover:text-emerald-200 transition-colors">My Plans</Link>
                <Link to="/files" className="hover:text-emerald-200 transition-colors">My Files</Link>
                <Link to="/profile" className="hover:text-emerald-200 transition-colors">Profile</Link>
                <div className="flex items-center gap-4 border-l border-emerald-500 pl-6 ml-2">
                  <span className="text-sm bg-emerald-700 px-3 py-1 rounded-full">{user?.name}</span>
                  <button onClick={handleLogout} className="text-sm hover:text-red-200 transition-colors">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-emerald-200 transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-700 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-emerald-600 mb-2">
                <span className="text-sm font-medium">Logged in as {user?.name}</span>
              </div>
              <Link to="/dashboard" className="block py-2 hover:bg-emerald-600 rounded px-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/generate" className="block py-2 hover:bg-emerald-600 rounded px-2" onClick={() => setMobileMenuOpen(false)}>Generate Plan</Link>
              <Link to="/plans" className="block py-2 hover:bg-emerald-600 rounded px-2" onClick={() => setMobileMenuOpen(false)}>My Plans</Link>
              <Link to="/files" className="block py-2 hover:bg-emerald-600 rounded px-2" onClick={() => setMobileMenuOpen(false)}>My Files</Link>
              <Link to="/profile" className="block py-2 hover:bg-emerald-600 rounded px-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 mt-2 text-red-200 hover:bg-emerald-600 rounded px-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:bg-emerald-600 rounded px-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 hover:bg-emerald-600 rounded px-2 text-emerald-100" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
