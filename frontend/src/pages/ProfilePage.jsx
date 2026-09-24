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
    gender: 'male',
    activity_level: 'moderate',
    dietary_preference: 'vegetarian',
    goal: 'maintenance',
    allergies: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/profile');
        if (res.data) {
          const { id, user_id, created_at, updated_at, ...profileData } = res.data;
          setProfile(prev => ({
            ...prev,
            ...profileData,
            gender: profileData.gender || profileData.sex || 'male',
            allergies: Array.isArray(profileData.allergies) 
              ? profileData.allergies.join(', ') 
              : (profileData.allergies || '')
          }));
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
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        gender: profile.gender,
        sex: profile.gender,
      };
      await client.put('/profile', payload);
      toast.success("Biometric profile synchronized with Cloud Database!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Live BMI calculation
  const calcBmi = () => {
    if (profile.weight && profile.height) {
      const hM = Number(profile.height) / 100;
      if (hM > 0) {
        return (Number(profile.weight) / (hM * hM)).toFixed(1);
      }
    }
    return null;
  };

  const bmiVal = calcBmi();

  if (loading) return <LoadingSpinner message="Fetching biometric records..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1">
          <span>🧬</span> Metabolic Biometrics
        </div>
        <h1 className="text-3xl font-black text-slate-900">Your Health Profile</h1>
        <p className="text-sm text-slate-500">
          Used by the AI engine to calculate clinical BMR and TDEE caloric targets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Biometrics Card */}
        <div className="card space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800">Physical Metrics</h2>
            {bmiVal && (
              <span className="pill-badge bg-emerald-50 text-emerald-800 border border-emerald-200">
                Live BMI: {bmiVal}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Age (Years)
              </label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                min="10"
                max="120"
                required
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['male', 'female'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: s })}
                    className={`py-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                      profile.gender === s
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {s === 'male' ? '👨 Male' : '👩 Female'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleChange}
                placeholder="e.g. 175"
                min="50"
                max="260"
                required
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                placeholder="e.g. 70.0"
                min="20"
                max="300"
                required
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Nutritional Goals & Habits Card */}
        <div className="card space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800">Dietary Preferences & Activity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Activity Level
              </label>
              <select
                name="activity_level"
                value={profile.activity_level}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="sedentary">Sedentary (Desk Job)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
                <option value="very_active">Extremely Active (Athletic)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dietary Habit
              </label>
              <select
                name="dietary_preference"
                value={profile.dietary_preference}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="keto">Keto / Low-Carb</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Objective
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'weight_loss', label: 'Weight Loss' },
                  { id: 'maintenance', label: 'Maintenance' },
                  { id: 'muscle_gain', label: 'Muscle Gain' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, goal: g.id })}
                    className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                      profile.goal === g.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Permanent Allergies / Restrictions
              </label>
              <input
                type="text"
                name="allergies"
                value={profile.allergies}
                onChange={handleChange}
                placeholder="e.g. peanuts, dairy, soy, gluten (comma separated)"
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-glow px-8 py-3 text-sm font-black shadow-md cursor-pointer"
          >
            {saving ? "Saving to Cloud..." : "Save Profile & Update Macros"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
