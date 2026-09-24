import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const GeneratePlanPage = () => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    dietary_preference: 'any',
    goal: 'maintenance',
    activity_level: 'sedentary',
    allergies: '',
    days_count: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/profile');
        if (res.data) {
          setHasProfile(true);
          setFormData(prev => ({
            ...prev,
            dietary_preference: res.data.dietary_preference || 'any',
            goal: res.data.goal || 'maintenance',
            activity_level: res.data.activity_level || 'sedentary',
            allergies: res.data.allergies || ''
          }));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false);
        }
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
    try {
      const res = await client.post('/diet/generate', formData);
      toast.success("Diet plan generated successfully!");
      navigate(`/plans/${res.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (profileLoading) return <LoadingSpinner message="Checking profile..." />;

  if (!hasProfile) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center card bg-orange-50 border-orange-100">
        <h2 className="text-2xl font-bold text-orange-800 mb-4">Profile Required</h2>
        <p className="text-orange-700 mb-6">
          You need to complete your health profile before we can generate a personalized diet plan for you.
        </p>
        <Link to="/profile" className="btn-primary inline-block">Complete Profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Generate AI Diet Plan</h2>
        <p className="text-gray-600 mb-8 text-sm">
          We've pre-filled these options based on your profile, but you can adjust them for this specific plan.
        </p>

        {generating ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <h3 className="text-xl font-semibold text-emerald-800">AI is crafting your plan...</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Calculating macros, finding perfect recipes, and balancing your daily nutrition. This might take up to 30 seconds.
            </p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Duration</label>
                <select name="days_count" className="input-field" value={formData.days_count} onChange={handleChange}>
                  <option value={1}>1 Day (Sample)</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (Full Week)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
                <select name="goal" className="input-field" value={formData.goal} onChange={handleChange}>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="fitness">General Fitness / Health</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
                <select name="dietary_preference" className="input-field" value={formData.dietary_preference} onChange={handleChange}>
                  <option value="any">Any / Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                <select name="activity_level" className="input-field" value={formData.activity_level} onChange={handleChange}>
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (hard exercise daily)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Allergies / Exclusions</label>
              <textarea 
                name="allergies" 
                rows="2" 
                className="input-field" 
                value={formData.allergies} 
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-lg font-bold flex justify-center items-center gap-2">
              <span>✨</span> Generate Magic Plan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GeneratePlanPage;
