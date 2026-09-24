import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          AI-Powered <span className="text-emerald-600">Diet Planning</span>
        </h1>
        <p className="text-xl text-gray-600">
          Leverage the power of cloud computing and AI to generate personalized diet plans, track your progress, and manage your health files securely in one place.
        </p>
        <div className="pt-6">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 rounded-full inline-block">
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3 rounded-full inline-block shadow-lg shadow-emerald-200">
                Start for Free
              </Link>
              <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI Plans</h3>
          <p className="text-gray-600 text-sm">Smartly generated diet plans based on your specific body metrics, goals, and allergies.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4">☁️</div>
          <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
          <p className="text-gray-600 text-sm">Securely upload and manage your medical reports and fitness files in the cloud.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4">🔒</div>
          <h3 className="text-xl font-bold mb-2">Secure Auth</h3>
          <p className="text-gray-600 text-sm">Your data is protected with industry-standard JWT authentication and encryption.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Dashboard</h3>
          <p className="text-gray-600 text-sm">Track all your plans, view stats, and access quick actions from a unified dashboard.</p>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-emerald-50 rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">1</div>
            <h4 className="text-lg font-semibold">Create Profile</h4>
            <p className="text-gray-600 text-sm">Input your age, weight, height, and goals to help our AI understand your needs.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">2</div>
            <h4 className="text-lg font-semibold">Generate Plan</h4>
            <p className="text-gray-600 text-sm">Get a detailed daily meal plan tailored exactly to your preferences and allergies.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">3</div>
            <h4 className="text-lg font-semibold">Track Progress</h4>
            <p className="text-gray-600 text-sm">Save multiple plans, upload your health records, and achieve your fitness goals.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
        <p>NutriPlan AI is an educational project demonstrating Cloud Computing and AI integration.</p>
        <p className="mt-2">© {new Date().getFullYear()} NutriPlan AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
