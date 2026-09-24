import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const PlanDetailPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await client.get(`/diet/plans/${planId}`);
        setPlan(res.data);
      } catch (error) {
        toast.error("Plan not found");
        navigate('/plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await client.delete(`/diet/plans/${planId}`);
        toast.success("Plan deleted");
        navigate('/plans');
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading your diet plan..." />;
  if (!plan || !plan.plan_json) return <div className="text-center text-red-500">Invalid plan data.</div>;

  const planData = plan.plan_json;
  const days = planData.days || [];
  const currentDay = days[activeDay];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="card bg-emerald-50 border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.title || 'Your Custom Diet Plan'}</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm text-emerald-700 font-medium border border-emerald-200 capitalize">
              Goal: {plan.goal?.replace('_', ' ')}
            </span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm text-emerald-700 font-medium border border-emerald-200 capitalize">
              Diet: {plan.dietary_preference?.replace('_', ' ')}
            </span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm text-gray-600 border border-gray-200">
              📅 {new Date(plan.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 font-medium">Daily Target</div>
          <div className="text-3xl font-black text-emerald-600">{plan.target_calories} <span className="text-base font-normal text-gray-500">kcal</span></div>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm mt-2 underline">Delete Plan</button>
        </div>
      </div>

      {/* Tabs */}
      {days.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          {days.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                activeDay === idx 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      )}

      {/* Daily Content */}
      {currentDay && (
        <div className="space-y-6">
          {/* Daily Macros Summary */}
          {currentDay.daily_summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card py-4 text-center">
                <div className="text-sm text-gray-500">Calories</div>
                <div className="text-xl font-bold text-gray-800">{currentDay.daily_summary.total_calories} kcal</div>
              </div>
              <div className="card py-4 text-center border-b-4 border-b-red-400">
                <div className="text-sm text-gray-500">Protein</div>
                <div className="text-xl font-bold text-gray-800">{currentDay.daily_summary.total_protein_g}g</div>
              </div>
              <div className="card py-4 text-center border-b-4 border-b-blue-400">
                <div className="text-sm text-gray-500">Carbs</div>
                <div className="text-xl font-bold text-gray-800">{currentDay.daily_summary.total_carbs_g}g</div>
              </div>
              <div className="card py-4 text-center border-b-4 border-b-yellow-400">
                <div className="text-sm text-gray-500">Fat</div>
                <div className="text-xl font-bold text-gray-800">{currentDay.daily_summary.total_fat_g}g</div>
              </div>
            </div>
          )}

          {/* Meals */}
          <div className="grid md:grid-cols-2 gap-6">
            {['breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
              const meal = currentDay.meals[mealType];
              if (!meal) return null;
              
              // Emoji mapping
              const emoji = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' }[mealType];
              
              return (
                <div key={mealType} className="card h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-800 capitalize flex items-center gap-2">
                      <span>{emoji}</span> {mealType}
                    </h3>
                    <span className="font-semibold text-emerald-600">{meal.calories} kcal</span>
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-2">{meal.meal_name}</h4>
                    
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ingredients</p>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {meal.ingredients?.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t grid grid-cols-3 text-center text-sm">
                    <div><span className="block text-gray-400 text-xs">Protein</span> <span className="font-medium">{meal.protein_g}g</span></div>
                    <div><span className="block text-gray-400 text-xs">Carbs</span> <span className="font-medium">{meal.carbs_g}g</span></div>
                    <div><span className="block text-gray-400 text-xs">Fat</span> <span className="font-medium">{meal.fat_g}g</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hydration & Tips */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="card bg-blue-50 border-blue-100">
               <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">💧 Hydration Reminder</h3>
               <p className="text-blue-900 text-sm">{currentDay.hydration_reminder || 'Drink at least 8 glasses of water today.'}</p>
             </div>
             
             {planData.general_tips && planData.general_tips.length > 0 && (
               <div className="card bg-yellow-50 border-yellow-100">
                 <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">💡 Pro Tips</h3>
                 <ul className="text-yellow-900 text-sm list-disc pl-5 space-y-1">
                   {planData.general_tips.map((tip, i) => <li key={i}>{tip}</li>)}
                 </ul>
               </div>
             )}
          </div>
        </div>
      )}
      
      <div className="text-center text-xs text-gray-400 mt-8">
        Disclaimer: This AI-generated plan is for educational purposes. Consult a medical professional before starting any new diet.
      </div>
    </div>
  );
};

export default PlanDetailPage;
