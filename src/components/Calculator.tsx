import React, { useState } from 'react';
import type { UserProfile, DietType, RegionPreference, FitnessGoal } from '../types';
import { calculateBMR, calculateMacroGoals, getActivityMultiplier } from '../utils/nutritionCalculator';
import { Calculator as CalcIcon, Dumbbell, Flame, Sparkles, ChevronRight, Info } from 'lucide-react';

interface CalculatorProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onCalculateComplete: (updatedProfile?: UserProfile) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ profile, setProfile, onCalculateComplete }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const bmr = calculateBMR(formData.weightKg, formData.heightCm, formData.age, formData.gender);
  const tdee = Math.round(bmr * getActivityMultiplier(formData.activityLevel));
  const macroGoals = calculateMacroGoals(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    onCalculateComplete(formData);
  };

  const dietOptions: { id: DietType; label: string; desc: string; badge: string }[] = [
    { id: 'pure_veg', label: 'Pure Veg', desc: 'No eggs, meat, fish. Dals, Paneer, Curd, Sprouts', badge: '🥦 Veg' },
    { id: 'eggetarian', label: 'Eggetarian', desc: 'Vegetarian + Whole Eggs & Egg Whites', badge: '🥚 Eggs' },
    { id: 'non_veg', label: 'Non-Vegetarian', desc: 'Chicken, Fish, Eggs, Mutton + Dairy', badge: '🍗 Non-Veg' },
    { id: 'high_protein_veg', label: 'High Protein Veg', desc: 'Focus on Soya, Paneer, Tofu, Whey & Chana', badge: '⚡ High Protein' },
    { id: 'jain', label: 'Jain Food', desc: 'Strict Vegetarian without onion, garlic or root veggies', badge: '🙏 Jain' },
    { id: 'sattvic', label: 'Sattvic Diet', desc: 'Fresh, organic, light ayurvedic cooking without onion/garlic', badge: '🍃 Sattvic' },
    { id: 'vegan', label: 'Vegan', desc: '100% Plant-Based. Tofu, Sattu, Soy, Nuts, Seeds', badge: '🌱 Vegan' },
  ];

  const regionOptions: { id: RegionPreference; label: string }[] = [
    { id: 'all', label: 'All India Pan-Regional' },
    { id: 'north_indian', label: 'North Indian (Roti, Rajma, Paneer)' },
    { id: 'south_indian', label: 'South Indian (Idli, Dosa, Sambar, Matta Rice)' },
    { id: 'west_indian', label: 'West Indian (Poha, Jowar, Dhokla, Thepla)' },
    { id: 'east_indian', label: 'East Indian (Sattu, Fish Curry, Rice)' },
  ];

  const goalOptions: { id: FitnessGoal; label: string; desc: string; tag: string }[] = [
    { id: 'fat_loss', label: 'Fat Loss & Cutting', desc: 'Burn body fat while retaining lean muscle (-20% Deficit)', tag: '🔥 Fat Loss' },
    { id: 'recomp', label: 'Body Recomposition', desc: 'Build muscle & lose fat simultaneously (-5% Calorie Deficit)', tag: '⚖️ Recomp' },
    { id: 'maintenance', label: 'Weight Maintenance', desc: 'Maintain current bodyweight & sustain energy (TDEE Calories)', tag: '🎯 Maintain' },
    { id: 'muscle_gain', label: 'Lean Muscle Gain', desc: 'Build lean muscle mass with minimal fat (+12% Surplus)', tag: '💪 Muscle Gain' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Scientific BMR & Macro Engine for Indian Diets</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Calculate Your Calorie & Protein Targets
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Tailored specifically for Indian food portions (rotis, katori dal, paneer, sattu, eggs) and local metabolic factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl">
          
          {/* Personal Metrics Grid */}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <CalcIcon className="w-5 h-5 text-amber-400" />
              <span>1. Body Metrics</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="12"
                  max="90"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="male">Male 👨</option>
                  <option value="female">Female 👩</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="200"
                  required
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as UserProfile['activityLevel'] })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="sedentary">Sedentary (Desk Job, little or no exercise)</option>
              <option value="lightly_active">Lightly Active (Workout 1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (Workout 3-5 days/week)</option>
              <option value="very_active">Very Active (Heavy Workout 6-7 days/week)</option>
              <option value="extra_active">Extra Active (Intense Daily Workout + Physical Job)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-3">
              <Dumbbell className="w-5 h-5 text-amber-400" />
              <span>2. Your Primary Fitness Goal</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  type="button"
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, goal: goal.id })}
                  className={`p-3.5 rounded-2xl border cursor-pointer text-left transition-all ${
                    formData.goal === goal.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{goal.label}</span>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 text-amber-300">
                      {goal.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{goal.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Type Selection */}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-3">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>3. Dietary Preference</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {dietOptions.map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietType: diet.id })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.dietType === diet.id
                      ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{diet.label}</span>
                    <span className="text-[10px]">{diet.badge}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{diet.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Regional Cuisine */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Regional Food Style</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionPreference })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              {regionOptions.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-base rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer transform hover:scale-[1.01]"
          >
            <span>Save Profile & Generate Custom Indian Meal Plan</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        {/* Results Sidebar Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-6 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-700/60 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Calculated Nutrition Breakdown</span>
            </h2>

            {/* Calories Summary Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 rounded-2xl p-5 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Target Daily Intake</span>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                {macroGoals.calories} <span className="text-base text-amber-300/80 font-normal">kcal/day</span>
              </div>
              <div className="flex justify-center space-x-4 text-xs text-slate-400 pt-1">
                <span>BMR: <strong>{bmr} kcal</strong></span>
                <span>•</span>
                <span>TDEE: <strong>{tdee} kcal</strong></span>
              </div>
            </div>

            {/* Macro Targets Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Protein</span>
                  <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">High</span>
                </div>
                <div className="text-2xl font-bold text-white">{macroGoals.proteinGrams}g</div>
                <div className="text-[10px] text-slate-400">{Math.round((macroGoals.proteinGrams * 4 * 100) / macroGoals.calories)}% of calories</div>
              </div>

              <div className="bg-slate-900/80 border border-sky-500/30 p-4 rounded-2xl space-y-1">
                <div className="text-xs font-semibold text-sky-400">Carbohydrates</div>
                <div className="text-2xl font-bold text-white">{macroGoals.carbsGrams}g</div>
                <div className="text-[10px] text-slate-400">{Math.round((macroGoals.carbsGrams * 4 * 100) / macroGoals.calories)}% of calories</div>
              </div>

              <div className="bg-slate-900/80 border border-yellow-500/30 p-4 rounded-2xl space-y-1">
                <div className="text-xs font-semibold text-yellow-400">Healthy Fats</div>
                <div className="text-2xl font-bold text-white">{macroGoals.fatsGrams}g</div>
                <div className="text-[10px] text-slate-400">{Math.round((macroGoals.fatsGrams * 9 * 100) / macroGoals.calories)}% of calories</div>
              </div>

              <div className="bg-slate-900/80 border border-purple-500/30 p-4 rounded-2xl space-y-1">
                <div className="text-xs font-semibold text-purple-400">Dietary Fiber</div>
                <div className="text-2xl font-bold text-white">{macroGoals.fiberGrams}g</div>
                <div className="text-[10px] text-slate-400">Gut health & satiety</div>
              </div>
            </div>

            {/* Indian Diet Tips Box */}
            <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-2xl text-xs space-y-2 text-slate-300">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                <Info className="w-4 h-4" />
                <span>Indian Fitness Nutrition Tip</span>
              </div>
              <p className="leading-relaxed">
                Hitting <strong>{macroGoals.proteinGrams}g protein</strong> on an Indian diet is easy when combining 
                legumes with cereals (Rajma + Rice), low-fat Paneer, Sattu, Sprouts, and optional Egg Whites or Whey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
