import React, { useState, useMemo } from 'react';
import type { UserProfile, DailyMealPlan } from '../types';
import { generateDailyMealPlan } from '../utils/mealPlanGenerator';
import { Calendar, Printer } from 'lucide-react';

interface WeeklyPlannerProps {
  profile: UserProfile;
  targetCalories: number;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ profile, targetCalories }) => {
  const weeklyPlans = useMemo<Record<string, DailyMealPlan>>(() => {
    const plans: Record<string, DailyMealPlan> = {};
    DAYS_OF_WEEK.forEach((day, index) => {
      const plan = generateDailyMealPlan(profile, targetCalories, index);
      plan.dayName = `${day} Thali`;
      plans[day] = plan;
    });
    return plans;
  }, [profile, targetCalories]);

  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const handlePrintPDF = () => {
    window.print();
  };

  const activePlan = weeklyPlans[selectedDay] || weeklyPlans['Monday'];
  if (!activePlan) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 print:p-0 print:bg-white print:text-black">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Indian Thali Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Weekly 7-Day Fitness Meal Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Structured thali plan tailored for {profile.dietType.replace('_', ' ').toUpperCase()} • {targetCalories} kcal
          </p>
        </div>

        <button
          onClick={handlePrintPDF}
          className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition cursor-pointer transform hover:scale-[1.02]"
        >
          <Printer className="w-4 h-4" />
          <span>Export 7-Day PDF / Print</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-slate-700/60 print:hidden">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 ${
              selectedDay === day
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Active Day Thali Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl print:bg-white print:border-black print:text-black">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4 print:border-black">
          <div>
            <h2 className="text-2xl font-extrabold text-white print:text-black">{selectedDay} Thali Plan</h2>
            <p className="text-xs text-amber-400 print:text-gray-700 font-medium">{profile.dietType.replace('_', ' ')} • {activePlan.totalCalories} kcal • {activePlan.totalProtein}g Protein</p>
          </div>

          <div className="text-right text-xs print:hidden">
            <span className="text-slate-400">Carbs: <strong className="text-sky-400">{activePlan.totalCarbs}g</strong></span> • <span className="text-slate-400">Fats: <strong className="text-yellow-400">{activePlan.totalFats}g</strong></span>
          </div>
        </div>

        {/* 5 Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(activePlan.meals).map(([slotKey, food]) => (
            <div key={slotKey} className="bg-slate-900/90 border border-slate-700/60 p-4 rounded-2xl space-y-2 print:bg-gray-100 print:border-gray-300">
              <span className="text-[10px] uppercase font-bold text-amber-400 print:text-black">{slotKey.replace('_', ' ')}</span>
              <h3 className="font-bold text-sm text-white print:text-black">{food.name}</h3>
              <p className="text-[10px] text-slate-400 print:text-gray-600">{food.servingSize}</p>
              <div className="pt-2 border-t border-slate-800 text-[10px] flex justify-between text-slate-300 print:text-black">
                <span className="font-bold text-amber-400">{food.calories} kcal</span>
                <span className="font-bold text-emerald-400">{food.protein}g Prot</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
