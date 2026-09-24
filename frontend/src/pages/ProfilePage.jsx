import { useState, useEffect } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    height: '',
    weight: '',
    sex: 'male',
    activity_level: 'sedentary',
    dietary_preference: 'any',
    goal: 'maintenance',
    allergies: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/profile');
        if (res.data) {
          // Exclude id and user_id for form
          const { id, user_id, created_at, updated_at, ...profileData } = res.data;
          setProfile(prev => ({ ...prev, ...profileData }));
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.put('/profile', profile);
      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Health Profile</h2>
        <p className="text-gray-600 mb-8 text-sm">
          This information helps our AI generate accurate and safe diet plans tailored just for you.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
              <input type="number" name="age" required min="1" max="120" className="input-field" value={profile.age} onChange={handleChange} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biological Sex</label>
              <select name="sex" className="input-field" value={profile.sex} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input type="number" name="height" required min="50" max="300" className="input-field" value={profile.height} onChange={handleChange} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" name="weight" required min="20" max="300" step="0.1" className="input-field" value={profile.weight} onChange={handleChange} />
            </div>

            {/* Lifestyle & Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
              <select name="activity_level" className="input-field" value={profile.activity_level} onChange={handleChange}>
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise daily)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
              <select name="goal" className="input-field" value={profile.goal} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="maintenance">Maintenance</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fitness">General Fitness / Health</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
              <select name="dietary_preference" className="input-field" value={profile.dietary_preference} onChange={handleChange}>
                <option value="any">Any / Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Allergies / Dislikes</label>
            <textarea 
              name="allergies" 
              rows="3" 
              className="input-field" 
              value={profile.allergies || ''} 
              onChange={handleChange}
              placeholder="e.g., Peanuts, shellfish, lactose intolerance, no mushrooms..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Leave blank if none.</p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="btn-primary px-8" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
