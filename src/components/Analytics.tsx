import React, { useState } from 'react';
import type { UserProfile, WeightEntry } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Plus, Activity, Award, Scale, CheckCircle2 } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface AnalyticsProps {
  profile: UserProfile;
  weightLogs: WeightEntry[];
  onAddWeightLog: (entry: WeightEntry) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  profile,
  weightLogs,
  onAddWeightLog
}) => {
  const [newWeight, setNewWeight] = useState<number>(profile.weightKg);

  const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  };

  const currentBMI = calculateBMI(profile.weightKg, profile.heightCm);

  let bmiCategory = 'Normal';
  let bmiColor = 'text-amber-600 dark:text-amber-400';
  let bmiBadgeBg = 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700';

  if (currentBMI < 18.5) { 
    bmiCategory = 'Underweight'; 
    bmiColor = 'text-sky-600 dark:text-sky-400'; 
    bmiBadgeBg = 'bg-sky-100 dark:bg-sky-950/80 border-sky-300 dark:border-sky-700';
  } else if (currentBMI >= 25 && currentBMI < 29.9) { 
    bmiCategory = 'Overweight'; 
    bmiColor = 'text-orange-600 dark:text-orange-400'; 
    bmiBadgeBg = 'bg-orange-100 dark:bg-orange-950/80 border-orange-300 dark:border-orange-700';
  } else if (currentBMI >= 30) { 
    bmiCategory = 'Obese'; 
    bmiColor = 'text-red-600 dark:text-red-400'; 
    bmiBadgeBg = 'bg-red-100 dark:bg-red-950/80 border-red-300 dark:border-red-700';
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    haptic.success();
    const bmi = calculateBMI(newWeight, profile.heightCm);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    onAddWeightLog({ date: dateStr, weightKg: newWeight, bmi });
  };

  const targetWeight = profile.targetWeightKg || profile.weightKg;
  const weightDiff = Number((profile.weightKg - targetWeight).toFixed(1));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 sm:p-8 rounded-3xl shadow-xs space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-[#EA580C]" />
          <span>Weight & BMI Progress Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Your Transformation Journey
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium max-w-xl mx-auto">
          Log your weekly weigh-ins to observe your body composition, BMI status, and progress toward your target weight.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Weight Card */}
        <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-5 rounded-3xl shadow-xs space-y-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-bold flex items-center justify-between">
            <span>Current Weight</span>
            <Scale className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {profile.weightKg} <span className="text-sm text-slate-400 font-bold">kg</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500">Target: <strong className="text-slate-900 dark:text-white">{targetWeight} kg</strong></span>
            <span className="font-bold text-[#EA580C]">
              {weightDiff > 0 ? `${weightDiff} kg to lose` : weightDiff < 0 ? `${Math.abs(weightDiff)} kg to gain` : 'Goal achieved!'}
            </span>
          </div>
        </div>

        {/* BMI Card */}
        <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-5 rounded-3xl shadow-xs space-y-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-bold flex items-center justify-between">
            <span>Body Mass Index (BMI)</span>
            <Activity className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{currentBMI}</div>
          <div className="pt-1">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${bmiBadgeBg} ${bmiColor}`}>
              {bmiCategory}
            </span>
          </div>
        </div>

        {/* Body Fat Estimate Card */}
        <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-5 rounded-3xl shadow-xs space-y-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-bold flex items-center justify-between">
            <span>Estimated Body Fat</span>
            <Award className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {profile.gender === 'male' 
              ? Math.max(8, Math.round(currentBMI * 1.2 + 0.23 * profile.age - 16.2)) 
              : Math.max(12, Math.round(currentBMI * 1.2 + 0.23 * profile.age - 5.4))}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Deurenberg scientific estimate</p>
        </div>
      </div>

      {/* Progress Chart & Log Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#EA580C]" />
              <span>Weight Progress Trend (kg)</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">{weightLogs.length} Check-ins</span>
          </div>

          {weightLogs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              <span>No weight check-ins recorded yet.</span>
              <span className="text-[11px] text-slate-400 mt-1">Log your first scale weight on the right to start tracking.</span>
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={weightLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEDEC1" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1C1511', 
                      borderColor: '#3A291E', 
                      borderRadius: '16px', 
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  />
                  <Area type="monotone" dataKey="weightKg" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Log Entry Form */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center space-x-2 border-b border-[#EEDEC1] dark:border-[#3A291E] pb-3">
            <Plus className="w-4 h-4 text-[#EA580C]" />
            <span>Record Today's Weight</span>
          </h2>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Scale Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="220"
                required
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Weight Entry</span>
            </button>
          </form>

          {/* History */}
          <div className="space-y-2 pt-2 border-t border-[#EEDEC1] dark:border-[#3A291E]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Recent Weigh-ins</span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {weightLogs.slice().reverse().map((entry, i) => (
                <div key={i} className="flex justify-between items-center bg-[#f8faf8] dark:bg-[#19120E] p-2.5 rounded-xl text-xs border border-[#EEDEC1] dark:border-[#3A291E]">
                  <span className="text-slate-500 font-medium">{entry.date}</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{entry.weightKg} kg</span>
                  <span className="text-[#D97706] font-bold text-[10px]">BMI {entry.bmi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
