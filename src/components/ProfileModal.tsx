import React, { useState, useMemo } from 'react';
import type { UserProfile, DietType, RegionPreference } from '../types';
import { calculateBMR, calculateMacroGoals, getActivityMultiplier } from '../utils/nutritionCalculator';
import { 
  X, 
  User, 
  Scale, 
  Activity, 
  Target, 
  Flame, 
  Sparkles, 
  Check, 
  Upload, 
  RotateCcw,
  Utensils,
  MapPin
} from 'lucide-react';
import { haptic } from '../utils/haptics';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  userAvatar: string;
  onAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetAvatar?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  userAvatar,
  onAvatarUpload,
  onResetAvatar
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    targetWeightKg: profile.targetWeightKg || (profile.goal === 'fat_loss' ? Math.round(profile.weightKg * 0.92) : profile.goal === 'muscle_gain' ? Math.round(profile.weightKg * 1.08) : profile.weightKg)
  });

  // Real-time Mifflin-St Jeor calculations
  const bmr = useMemo(() => {
    return calculateBMR(formData.weightKg, formData.heightCm, formData.age, formData.gender);
  }, [formData.weightKg, formData.heightCm, formData.age, formData.gender]);

  const tdee = useMemo(() => {
    return Math.round(bmr * getActivityMultiplier(formData.activityLevel));
  }, [bmr, formData.activityLevel]);

  const macroGoals = useMemo(() => {
    return calculateMacroGoals(formData);
  }, [formData]);

  // BMI calculation
  const heightM = formData.heightCm / 100;
  const bmi = heightM > 0 ? (formData.weightKg / (heightM * heightM)).toFixed(1) : '22.0';
  const bmiNumber = parseFloat(bmi);

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700' };
    if (val < 25) return { label: 'Normal / Healthy', color: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-800 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-950/80 border-orange-300 dark:border-orange-700' };
    return { label: 'Obese', color: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-950/80 border-red-300 dark:border-red-700' };
  };

  const bmiStatus = getBmiStatus(bmiNumber);

  // Height helper in feet & inches
  const heightTotalInches = formData.heightCm / 2.54;
  const heightFeet = Math.floor(heightTotalInches / 12);
  const heightInches = Math.round(heightTotalInches % 12);

  // Weight in lbs
  const weightLbs = Math.round(formData.weightKg * 2.20462);

  // Difference to target
  const targetDiff = formData.targetWeightKg ? (formData.weightKg - formData.targetWeightKg).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptic.selection();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between shrink-0 bg-stone-50/90 dark:bg-[#251C17]/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-[#EA580C] flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Your Fitness Profile & Body Details
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Calibrate your personalized Indian diet and Mifflin-St Jeor macros
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#2D2018] border border-[#EEDEC1] dark:border-[#3A291E] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close Profile Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* 1. Avatar & Personal Identity */}
          <div className="bg-stone-50 dark:bg-[#231811] rounded-2xl p-4 border border-[#EEDEC1] dark:border-[#3A291E] space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative group shrink-0">
                <img 
                  src={userAvatar} 
                  alt={formData.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#EA580C] shadow-md"
                />
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {onAvatarUpload && (
                    <label className="px-3 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold cursor-pointer hover:bg-[#C2410C] transition shadow-2xs flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" />
                    </label>
                  )}
                  {onResetAvatar && (
                    <button 
                      type="button"
                      onClick={onResetAvatar}
                      className="px-3 py-1.5 rounded-xl border border-[#EEDEC1] dark:border-[#3A291E] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#2A1E17] transition flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Custom profile photo or athlete avatar helps personalize your daily experience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EEDEC1]/60 dark:border-[#3A291E]">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-white dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Biological Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                      formData.gender === 'male'
                        ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-2xs'
                        : 'bg-white dark:bg-[#19120E] text-slate-700 dark:text-slate-300 border-[#EEDEC1] dark:border-[#3A291E] hover:bg-amber-50/50'
                    }`}
                  >
                    <span>👨 Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer border ${
                      formData.gender === 'female'
                        ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-2xs'
                        : 'bg-white dark:bg-[#19120E] text-slate-700 dark:text-slate-300 border-[#EEDEC1] dark:border-[#3A291E] hover:bg-amber-50/50'
                    }`}
                  >
                    <span>👩 Female</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Body Metrics: Age, Height, Weight, Target Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Body Measurements & Targets</span>
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${bmiStatus.bg} ${bmiStatus.color}`}>
                BMI {bmi} • {bmiStatus.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Age */}
              <div className="bg-stone-50 dark:bg-[#231811] p-3 rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E]">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Age
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="12"
                    max="100"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
                  />
                  <span className="text-[11px] font-semibold text-slate-500">yrs</span>
                </div>
              </div>

              {/* Height */}
              <div className="bg-stone-50 dark:bg-[#231811] p-3 rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Height
                  </label>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                    {heightFeet}'{heightInches}"
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="100"
                    max="240"
                    required
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
                  />
                  <span className="text-[11px] font-semibold text-slate-500">cm</span>
                </div>
              </div>

              {/* Current Weight */}
              <div className="bg-stone-50 dark:bg-[#231811] p-3 rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Weight
                  </label>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                    {weightLbs} lbs
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="220"
                    required
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
                  />
                  <span className="text-[11px] font-semibold text-slate-500">kg</span>
                </div>
              </div>

              {/* Target Weight */}
              <div className="bg-stone-50 dark:bg-[#231811] p-3 rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Target
                  </label>
                  <span className="text-[10px] text-[#EA580C] font-black">
                    {parseFloat(targetDiff) > 0 ? `-${targetDiff}kg` : parseFloat(targetDiff) < 0 ? `+${Math.abs(parseFloat(targetDiff))}kg` : 'Goal'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="220"
                    value={formData.targetWeightKg || ''}
                    onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                    placeholder="e.g. 65"
                    className="w-full bg-white dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
                  />
                  <span className="text-[11px] font-semibold text-slate-500">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Fitness Goal & Body Frame (Somatotype) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Target Fitness Goal</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fat_loss' as const, label: 'Weight Loss', desc: '-20% Calorie Deficit', icon: Flame },
                { id: 'maintenance' as const, label: 'Maintain', desc: 'TDEE Equilibrium', icon: Scale },
                { id: 'muscle_gain' as const, label: 'Weight Gain', desc: '+15% Clean Surplus', icon: Activity },
              ].map((g) => {
                const isSelected = formData.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g.id })}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#EA580C] bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-[#EA580C]'
                        : 'border-[#EEDEC1] dark:border-[#3A291E] bg-stone-50 dark:bg-[#231811] hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <g.icon className={`w-4 h-4 ${isSelected ? 'text-[#EA580C]' : 'text-slate-400'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-black text-slate-900 dark:text-white">{g.label}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{g.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Somatotype / Body Frame */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Body Type / Somatotype
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ectomorph' as const, label: 'Ectomorph', desc: 'Slim Frame / Fast Metabolism' },
                  { id: 'mesomorph' as const, label: 'Mesomorph', desc: 'Athletic / Responsive' },
                  { id: 'endomorph' as const, label: 'Endomorph', desc: 'Stockier / Stores Fat Easily' },
                ].map((bt) => {
                  const isSelected = formData.bodyType === bt.id;
                  return (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, bodyType: bt.id })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-[#EA580C] bg-[#EA580C]/10 text-[#9A3412] dark:text-[#FED7AA] font-bold'
                          : 'border-[#EEDEC1] dark:border-[#3A291E] bg-stone-50 dark:bg-[#231811] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{bt.label}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{bt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Activity Level */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Daily Physical Activity Level</span>
            </h3>

            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
              className="w-full bg-stone-50 dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
            >
              <option value="sedentary">Sedentary (Desk Job, minimal walking — 1.2x)</option>
              <option value="lightly_active">Lightly Active (Light exercise / brisk walk 1-3 days/wk — 1.375x)</option>
              <option value="moderately_active">Moderately Active (Gym workout 3-5 days/wk — 1.55x)</option>
              <option value="very_active">Very Active (Heavy training / sports 6-7 days/wk — 1.725x)</option>
              <option value="extra_active">Extra Active (Athlete / double sessions daily — 1.9x)</option>
            </select>
          </div>

          {/* 5. Indian Dietary & Regional Taste */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center space-x-1">
                <Utensils className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Dietary Preference</span>
              </label>
              <select
                value={formData.dietType}
                onChange={(e) => setFormData({ ...formData, dietType: e.target.value as DietType })}
                className="w-full bg-stone-50 dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
              >
                <option value="pure_veg">Pure Vegetarian (Lacto-Veg, Paneer, Dals)</option>
                <option value="eggetarian">Eggetarian (Veg + Eggs & Omelettes)</option>
                <option value="non_veg">Non-Vegetarian (Chicken, Fish, Eggs)</option>
                <option value="high_protein_veg">High-Protein Veg (Soya, Sattu, Paneer, Whey)</option>
                <option value="jain">Jain Food (No root veggies, onion or garlic)</option>
                <option value="sattvic">Sattvic Ayurvedic (Fresh, pure, no onion/garlic)</option>
                <option value="vegan">Vegan (100% Plant-Based, Tofu, Sattu, Nuts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Regional Taste</span>
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionPreference })}
                className="w-full bg-stone-50 dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#EA580C]"
              >
                <option value="all">All India Pan-Regional</option>
                <option value="north_indian">North Indian (Rotis, Rajma, Paneer, Chole)</option>
                <option value="south_indian">South Indian (Idli, Dosa, Sambar, Matta Rice)</option>
                <option value="west_indian">West Indian (Poha, Jowar Bhakri, Thepla)</option>
                <option value="east_indian">East Indian (Sattu, Fish Curry, Rice, Dals)</option>
              </select>
            </div>
          </div>

          {/* 6. Live Calculated Calorie & Macro Target Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#251C17] dark:to-[#1F1611] rounded-2xl p-4 border border-[#EEDEC1] dark:border-[#3A291E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#9A3412] dark:text-[#FED7AA] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Calculated Nutrition Targets (Mifflin-St Jeor)</span>
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                BMR: {bmr} • TDEE: {tdee}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/80 dark:bg-[#2A1E17] p-2 rounded-xl border border-amber-200/60 dark:border-[#3A291E]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Calories</div>
                <div className="text-sm font-black text-[#EA580C] mt-0.5">{macroGoals.calories}</div>
                <div className="text-[9px] text-slate-500 font-semibold">kcal/day</div>
              </div>

              <div className="bg-white/80 dark:bg-[#2A1E17] p-2 rounded-xl border border-amber-200/60 dark:border-[#3A291E]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Protein</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{macroGoals.proteinGrams}g</div>
                <div className="text-[9px] text-slate-500 font-semibold">{(macroGoals.proteinGrams / formData.weightKg).toFixed(1)}g/kg</div>
              </div>

              <div className="bg-white/80 dark:bg-[#2A1E17] p-2 rounded-xl border border-amber-200/60 dark:border-[#3A291E]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Carbs</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{macroGoals.carbsGrams}g</div>
                <div className="text-[9px] text-slate-500 font-semibold">Clean Energy</div>
              </div>

              <div className="bg-white/80 dark:bg-[#2A1E17] p-2 rounded-xl border border-amber-200/60 dark:border-[#3A291E]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Healthy Fats</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{macroGoals.fatsGrams}g</div>
                <div className="text-[9px] text-slate-500 font-semibold">Hormone Health</div>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EEDEC1] dark:border-[#3A291E] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-[#251C17] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-black shadow-md transition cursor-pointer active:scale-95 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Profile Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
