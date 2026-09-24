import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import DietPlanCard from '../components/DietPlanCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Connecting to cloud dashboard..." />;

  const profile = stats?.profile;
  const bmi = profile?.bmi ? Number(profile.bmi).toFixed(1) : null;

  const getBmiCategory = (val) => {
    if (!val) return { label: 'Not Calculated', color: 'bg-slate-100 text-slate-700' };
    const num = Number(val);
    if (num < 18.5) return { label: 'Underweight', color: 'bg-amber-100 text-amber-800' };
    if (num <= 24.9) return { label: 'Optimal / Normal', color: 'bg-emerald-100 text-emerald-800' };
    if (num <= 29.9) return { label: 'Overweight', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Obese', color: 'bg-rose-100 text-rose-800' };
  };

  const bmiStatus = getBmiCategory(bmi);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            <span>✨</span> Active Cloud Session
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}! 👋
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
            Your personalized nutritional parameters and cloud medical vault are synchronized with the database.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10 w-full md:w-auto">
          <Link to="/generate" className="btn-secondary bg-white text-emerald-800 hover:bg-emerald-50 border-0 shadow-md">
            <span>⚡</span> Generate Plan
          </Link>
          <Link to="/files" className="btn-secondary bg-emerald-800/40 text-white hover:bg-emerald-800/60 border-emerald-500/50 backdrop-blur-md">
            <span>☁️</span> Cloud Vault
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="card card-hover border-emerald-100/60 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Plans</span>
            <span className="text-xl">🥗</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">{stats?.total_plans || 0}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-2">Saved in PostgreSQL</div>
        </div>

        <div className="card card-hover border-blue-100/60 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Files Stored</span>
            <span className="text-xl">📁</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">{stats?.total_files || 0}</div>
          <div className="text-xs text-blue-600 font-semibold mt-2">Object Storage Vault</div>
        </div>

        <div className="card card-hover border-amber-100/60 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Target Goal</span>
            <span className="text-xl">🎯</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 capitalize truncate">
            {profile?.goal ? profile.goal.replace('_', ' ') : 'Not Set'}
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-2">Active Target</div>
        </div>

        <div className="card card-hover border-purple-100/60 bg-gradient-to-br from-white to-purple-50/40">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Diet Preference</span>
            <span className="text-xl">🥦</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 capitalize truncate">
            {profile?.dietary_preference ? profile.dietary_preference.replace('_', ' ') : 'Balanced'}
          </div>
          <div className="text-xs text-purple-600 font-semibold mt-2">Allergy Filter Active</div>
        </div>
      </div>

      {/* Main Grid: Biometric Overview + Cloud Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biometrics Card */}
        <div className="lg:col-span-2 card space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Biometric Health Indicators</h2>
              <p className="text-xs text-slate-500 mt-0.5">Calculated using the clinical Mifflin-St Jeor formula</p>
            </div>
            <Link to="/profile" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
              Edit Metrics →
            </Link>
          </div>

          {profile ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Body Mass Index</span>
                <span className="text-2xl font-black text-slate-900">{bmi || '—'}</span>
                <span className={`pill-badge text-[10px] mt-2 block w-fit ${bmiStatus.color}`}>
                  {bmiStatus.label}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Est. BMR</span>
                <span className="text-2xl font-black text-slate-900">{profile.bmr ? `${Math.round(profile.bmr)}` : '—'}</span>
                <span className="text-[10px] text-slate-400 block mt-2 font-medium">kcal/day basal</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Daily TDEE</span>
                <span className="text-2xl font-black text-emerald-600">{profile.tdee ? `${Math.round(profile.tdee)}` : '—'}</span>
                <span className="text-[10px] text-slate-400 block mt-2 font-medium">kcal maintenance</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Weight / Height</span>
                <span className="text-lg font-black text-slate-900 block truncate">
                  {profile.weight ? `${profile.weight} kg` : '—'}
                </span>
                <span className="text-xs text-slate-500 block font-medium">
                  {profile.height ? `${profile.height} cm` : '—'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-600 mb-3">No biometrics configured yet.</p>
              <Link to="/profile" className="btn-primary text-xs">Set Up Profile</Link>
            </div>
          )}
        </div>

        {/* Live Cloud Services Telemetry */}
        <div className="card space-y-4 bg-slate-900 text-white border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm tracking-wide text-white uppercase flex items-center gap-2">
              <span>☁️</span> Cloud Telemetry
            </h3>
            <span className="pill-badge bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800/80">
              Healthy
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-slate-200">Compute PaaS</span>
              </div>
              <span className="font-mono text-emerald-400">Render Docker</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-slate-200">Cloud Database</span>
              </div>
              <span className="font-mono text-indigo-400">Supabase PG15</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-slate-200">Frontend CDN</span>
              </div>
              <span className="font-mono text-teal-400">Vercel Edge</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-medium text-slate-200">Object Storage</span>
              </div>
              <span className="font-mono text-amber-400">Vault Multi-Tenant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Diet Plans Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Diet Plans</h2>
            <p className="text-xs text-slate-500">Your tailored meal schedules and macro targets</p>
          </div>
          <Link to="/plans" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
            View All ({stats?.recent_plans?.length || 0}) →
          </Link>
        </div>

        {stats?.recent_plans && stats.recent_plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recent_plans.slice(0, 3).map((plan) => (
              <DietPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 border-dashed border-slate-200 bg-slate-50/50">
            <span className="text-4xl block mb-2">🥗</span>
            <h3 className="font-bold text-slate-700 mb-1">No plans generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Generate your first AI-tailored meal schedule based on your profile biometrics.
            </p>
            <Link to="/generate" className="btn-primary text-xs">Generate Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
