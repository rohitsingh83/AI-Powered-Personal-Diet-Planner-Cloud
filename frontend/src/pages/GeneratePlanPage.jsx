import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const GeneratePlanPage = () => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const [formData, setFormData] = useState({
    dietary_preference: 'vegetarian',
    goal: 'weight_loss',
    activity_level: 'moderate',
    allergies: '',
    days_count: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/profile');
        if (res.data && res.data.weight && res.data.height) {
          setHasProfile(true);
          setFormData(prev => ({
            ...prev,
            dietary_preference: res.data.dietary_preference || 'vegetarian',
            goal: res.data.goal || 'weight_loss',
            activity_level: res.data.activity_level || 'moderate',
            allergies: Array.isArray(res.data.allergies) ? res.data.allergies.join(', ') : (res.data.allergies || '')
          }));
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        setHasProfile(false);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await client.post('/diet/generate', formData);
      clearInterval(stepInterval);
      toast.success("Diet plan generated successfully!");
      navigate(`/plans/${res.data.id}`);
    } catch (error) {
      clearInterval(stepInterval);
      toast.error(error.response?.data?.detail || "Failed to generate plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (profileLoading) return <LoadingSpinner message="Validating cloud profile..." />;

  if (!hasProfile) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center card border-amber-200 bg-amber-50/60 p-8 space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xs">
          📋
        </div>
        <h2 className="text-2xl font-black text-slate-800">Biometric Profile Required</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          To calculate your clinical Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), the AI engine requires your age, height, and weight.
        </p>
        <div className="pt-2">
          <Link to="/profile" className="btn-primary text-sm px-6 py-2.5">
            Complete Profile Now →
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    "Computing BMR using Mifflin-St Jeor formula...",
    "Applying activity level multiplier for TDEE...",
    "Querying Cloud AI Engine with allergen filters...",
    "Synthesizing customized macronutrient schedule..."
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <span>🤖</span> Dual-Layer AI Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Generate Your Custom Diet Plan</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Caloric targets are mathematically tailored to your metabolic expenditure and goal.
        </p>
      </div>

      {/* Generation Form */}
      <div className="card shadow-lg border-slate-200/80 p-6 sm:p-10 relative">
        {generating ? (
          <div className="py-12 text-center space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
              <span className="text-3xl absolute">🥗</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Formulating Diet Plan</h3>
              <p className="text-sm font-medium text-emerald-600 animate-pulse">
                {steps[loadingStep] || steps[0]}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Goal Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Primary Fitness Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'weight_loss', label: 'Weight Loss', icon: '🔥', desc: '-500 kcal deficit' },
                  { id: 'maintenance', label: 'Maintenance', icon: '⚖️', desc: 'Balanced TDEE' },
                  { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪', desc: '+500 kcal surplus' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g.id })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.goal === g.id
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xl mb-1">{g.icon}</div>
                    <div className="font-bold text-sm text-slate-900">{g.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'vegetarian', label: 'Vegetarian', icon: '🥦' },
                  { id: 'vegan', label: 'Vegan', icon: '🌱' },
                  { id: 'non_vegetarian', label: 'Non-Veg', icon: '🍗' },
                  { id: 'keto', label: 'Keto / Low-Carb', icon: '🥑' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietary_preference: p.id })}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.dietary_preference === p.id
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 font-bold text-emerald-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-medium'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{p.icon}</span>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Activity Multiplier
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="sedentary">Sedentary (Little or no exercise, Desk job — 1.2x)</option>
                <option value="light">Lightly Active (Light exercise 1-3 days/week — 1.375x)</option>
                <option value="moderate">Moderately Active (Moderate exercise 3-5 days/week — 1.55x)</option>
                <option value="active">Very Active (Hard exercise 6-7 days/week — 1.725x)</option>
                <option value="very_active">Extremely Active (Physical job or athlete — 1.9x)</option>
              </select>
            </div>

            {/* Allergies Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Allergens to Exclude
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. peanuts, dairy, shellfish, gluten (comma separated)"
                className="input-field"
              />
              <p className="text-[11px] text-slate-500">
                The AI inference engine will strictly filter ingredients containing these allergens.
              </p>
            </div>

            {/* Days Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Plan Duration (Days)
              </label>
              <div className="flex gap-3">
                {[1, 3, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, days_count: num })}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      formData.days_count === num
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num} {num === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn-glow w-full py-4 text-base font-black shadow-lg"
              >
                <span>⚡</span> Generate Tailored Meal Plan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GeneratePlanPage;
