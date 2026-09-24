import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleQuickDemo = async () => {
    setDemoLoading(true);
    try {
      await login('demo@example.com', 'Demo@12345');
      toast.success("Logged in with Demo Account!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Demo login error: " + (err.response?.data?.detail || "Please try manual login"));
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-24 py-6 md:py-12">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Multi-Cloud Production Architecture • Live 2026
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
          Intelligent Nutrition Meets{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-transparent">
            Cloud Computing
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A full-stack, industry-grade SaaS platform that computes clinical metabolic formulas (BMR & TDEE), leverages AI engines for meal generation, and provides isolated cloud object storage for health reports.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-glow text-base px-8 py-3.5 rounded-xl w-full sm:w-auto">
              Open My Dashboard 🚀
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-glow text-base px-8 py-3.5 rounded-xl w-full sm:w-auto">
                Create Free Account ✨
              </Link>
              <button
                onClick={handleQuickDemo}
                disabled={demoLoading}
                className="btn-secondary text-base px-6 py-3.5 rounded-xl w-full sm:w-auto border-emerald-200 text-emerald-800 hover:bg-emerald-50/50"
              >
                {demoLoading ? "Connecting..." : "⚡ One-Click Demo Account"}
              </button>
            </>
          )}
          <a
            href="https://ai-powered-personal-diet-planner-backend.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-base px-6 py-3.5 rounded-xl w-full sm:w-auto text-slate-600 hover:text-slate-900"
          >
            Explore Swagger API ↗
          </a>
        </div>

        {/* Live Badges Strip */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-lg shadow-2xs">
            <span className="text-emerald-500">●</span> Vercel Global Edge CDN
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-lg shadow-2xs">
            <span className="text-teal-500">●</span> Render Docker ASGI
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-lg shadow-2xs">
            <span className="text-indigo-500">●</span> Supabase PostgreSQL
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-lg shadow-2xs">
            <span className="text-amber-500">●</span> Multi-Tenant Cloud Vault
          </span>
        </div>
      </section>

      {/* Interactive Cloud Architecture Card */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">Cloud Infrastructure</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Multi-Tier Microservice Topology</h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Cloud Services Operational
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="text-3xl">🌐</div>
              <h3 className="font-bold text-lg text-white">Tier 1: Edge CDN</h3>
              <p className="text-sm text-slate-300">
                Single Page Application built with React 18 & Vite, deployed on Vercel's global edge network for sub-50ms static delivery.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 font-semibold">→ Vercel Edge Cache</div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="text-3xl">⚡</div>
              <h3 className="font-bold text-lg text-white">Tier 2: Compute PaaS</h3>
              <p className="text-sm text-slate-300">
                FastAPI ASGI REST server containerized with Docker on Render. Fully stateless with HMAC-SHA256 JWT tokens for horizontal auto-scaling.
              </p>
              <div className="pt-2 text-xs font-mono text-teal-400 font-semibold">→ Render Docker Engine</div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 space-y-3">
              <div className="text-3xl">🗄️</div>
              <h3 className="font-bold text-lg text-white">Tier 3: Cloud Storage</h3>
              <p className="text-sm text-slate-300">
                Decoupled persistence: relational schema on Supabase PostgreSQL (AWS) combined with isolated UUID-keyed blob storage for health reports.
              </p>
              <div className="pt-2 text-xs font-mono text-indigo-400 font-semibold">→ Supabase DB + Cloud Vault</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Placement & Portfolio Excellence
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Not just another diet app — a complete demonstration of enterprise cloud architectural principles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card card-hover space-y-3 border-emerald-100/60">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-2xl shadow-xs">
              🤖
            </div>
            <h3 className="text-lg font-bold text-slate-900">Dual-Engine AI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Google Gemini LLM inference combined with a Mifflin-St Jeor mathematical fallback engine ensuring 100% availability.
            </p>
          </div>

          <div className="card card-hover space-y-3 border-blue-100/60">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-2xl shadow-xs">
              ☁️
            </div>
            <h3 className="text-lg font-bold text-slate-900">Storage Decoupling</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Decoupled relational data from binary files. Medical lab reports and PDFs are streamed into an isolated cloud object storage vault.
            </p>
          </div>

          <div className="card card-hover space-y-3 border-purple-100/60">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-2xl shadow-xs">
              🔒
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Tenant Isolation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Strict cryptographic JWT claims and row-level ownership validation to guarantee complete data isolation between accounts.
            </p>
          </div>

          <div className="card card-hover space-y-3 border-amber-100/60">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-2xl shadow-xs">
              🧪
            </div>
            <h3 className="text-lg font-bold text-slate-900">Automated Testing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              34 unit and integration tests passing with Pytest, covering token lifecycle, BMR equations, and cross-tenant access barriers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-8 sm:p-12 border border-emerald-200/80 space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900">Ready to Experience the Live Application?</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Test the live cloud application with one-click credentials or create a personal account to track your nutritional plans.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Get Started Now
            </Link>
            <button
              onClick={handleQuickDemo}
              className="btn-secondary text-base px-6 py-3"
            >
              Log in as Demo User
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
