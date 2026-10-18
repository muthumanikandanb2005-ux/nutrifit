import React, { useState } from 'react';
import type { UserProfile, WeightEntry } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Plus, Activity, Award, Scale } from 'lucide-react';

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
  let bmiColor = 'text-emerald-400';
  if (currentBMI < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-sky-400'; }
  else if (currentBMI >= 25 && currentBMI < 29.9) { bmiCategory = 'Overweight'; bmiColor = 'text-yellow-400'; }
  else if (currentBMI >= 30) { bmiCategory = 'Obese'; bmiColor = 'text-red-400'; }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const bmi = calculateBMI(newWeight, profile.heightCm);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    onAddWeightLog({ date: dateStr, weightKg: newWeight, bmi });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Weight & BMI Progress Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Track Your Transformation Journey
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Log your weekly weight check-ins to visualize body composition trends over time.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-1">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Current Weight</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{profile.weightKg} <span className="text-sm text-slate-400 font-normal">kg</span></div>
          <p className="text-[10px] text-slate-400">Target Goal: {profile.goal.replace('_', ' ').toUpperCase()}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-1">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Body Mass Index (BMI)</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{currentBMI}</div>
          <div className={`text-xs font-bold ${bmiColor}`}>Category: {bmiCategory}</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-1">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Estimated Body Fat %</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {profile.gender === 'male' ? Math.round(currentBMI * 1.2 + 0.23 * profile.age - 16.2) : Math.round(currentBMI * 1.2 + 0.23 * profile.age - 5.4)}%
          </div>
          <p className="text-[10px] text-slate-400">Estimated based on age & BMI</p>
        </div>
      </div>

      {/* Progress Chart & Log Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recharts Area Chart */}
        <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Weight Progress Trend (kg)</span>
          </h2>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightLogs}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="weightKg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Log Entry Form */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-700 pb-3">
            <Plus className="w-5 h-5 text-amber-400" />
            <span>Add Weight Log</span>
          </h2>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Scale Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                required
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Log Weight Entry
            </button>
          </form>

          {/* History */}
          <div className="space-y-2 pt-2 border-t border-slate-700/60">
            <span className="text-xs font-bold text-slate-400">Log History</span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {weightLogs.slice().reverse().map((entry, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl text-xs">
                  <span className="text-slate-400 font-medium">{entry.date}</span>
                  <span className="font-bold text-white">{entry.weightKg} kg</span>
                  <span className="text-slate-500 text-[10px]">BMI {entry.bmi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
