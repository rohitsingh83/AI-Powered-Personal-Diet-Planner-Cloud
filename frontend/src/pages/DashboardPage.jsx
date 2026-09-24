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

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600 mt-1">Here is your health and diet overview.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/generate" className="btn-primary">Generate New Plan</Link>
          <Link to="/files" className="btn-secondary">Upload File</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-emerald-50 border-emerald-100 p-5">
          <div className="text-emerald-600 text-sm font-semibold mb-1 uppercase tracking-wide">Total Plans</div>
          <div className="text-3xl font-black text-gray-900">{stats?.total_plans || 0}</div>
        </div>
        <div className="card bg-blue-50 border-blue-100 p-5">
          <div className="text-blue-600 text-sm font-semibold mb-1 uppercase tracking-wide">Files Stored</div>
          <div className="text-3xl font-black text-gray-900">{stats?.total_files || 0}</div>
        </div>
        <div className="card bg-orange-50 border-orange-100 p-5">
          <div className="text-orange-600 text-sm font-semibold mb-1 uppercase tracking-wide">Current Goal</div>
          <div className="text-xl font-bold text-gray-900 capitalize mt-1 truncate">
            {stats?.profile?.goal?.replace('_', ' ') || 'Not Set'}
          </div>
        </div>
        <div className="card bg-purple-50 border-purple-100 p-5">
          <div className="text-purple-600 text-sm font-semibold mb-1 uppercase tracking-wide">Diet Pref</div>
          <div className="text-xl font-bold text-gray-900 capitalize mt-1 truncate">
            {stats?.profile?.dietary_preference?.replace('_', ' ') || 'Not Set'}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8 pt-4">
        
        {/* Recent Plans Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Plans</h2>
            <Link to="/plans" className="text-emerald-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          
          {stats?.recent_plans && stats.recent_plans.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.recent_plans.map(plan => (
                <DietPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12 bg-gray-50 border-dashed">
              <p className="text-gray-500 mb-4">No plans generated yet.</p>
              <Link to="/generate" className="btn-primary inline-block text-sm">Create One Now</Link>
            </div>
          )}
        </div>

        {/* Profile Completion / Quick Info Column */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Profile Status</h3>
            {!stats?.profile ? (
              <div className="text-sm">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <p className="text-red-600 mb-3">Profile incomplete. AI needs your data!</p>
                <Link to="/profile" className="btn-secondary w-full block text-center text-sm">Complete Profile</Link>
              </div>
            ) : (
              <div className="text-sm space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-emerald-700 font-medium">Profile 100% Complete</p>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-medium text-gray-900">{stats.profile.weight} kg</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Height</span>
                    <span className="font-medium text-gray-900">{stats.profile.height} cm</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Activity</span>
                    <span className="font-medium text-gray-900 capitalize">{stats.profile.activity_level?.replace('_', ' ')}</span>
                  </div>
                </div>
                <Link to="/profile" className="text-emerald-600 font-medium text-xs hover:underline block text-center mt-4">Edit Profile</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
