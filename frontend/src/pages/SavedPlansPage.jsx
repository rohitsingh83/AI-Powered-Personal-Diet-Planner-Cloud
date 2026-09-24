import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import DietPlanCard from '../components/DietPlanCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SavedPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await client.get('/diet/plans');
        setPlans(res.data);
      } catch (error) {
        console.error("Error fetching plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your plans..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Diet Plans</h1>
          <p className="text-gray-500 text-sm">View and manage all your generated plans</p>
        </div>
        <Link to="/generate" className="btn-primary">
          + New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="text-4xl mb-4">🥗</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No plans yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't generated any diet plans yet. Head over to the generator to create your first personalized AI plan!
          </p>
          <Link to="/generate" className="btn-primary inline-block">Generate Your First Plan</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <DietPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPlansPage;
