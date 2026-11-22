import React, { useState, useMemo } from 'react';
import type { UserProfile, DailyMealPlan } from '../types';
import { generateDailyMealPlan } from '../utils/mealPlanGenerator';
import { getIndianFoodImage } from '../utils/indianFoodImages';
import { Calendar, Printer, Sparkles } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-6 print:p-0 print:bg-white print:text-black animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-5 sm:p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>7-Day Indian Thali Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Weekly 7-Day Fitness Meal Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Structured thali plan tailored for {profile.dietType.replace('_', ' ').toUpperCase()} • {targetCalories} kcal
          </p>
        </div>

        <button
          onClick={handlePrintPDF}
          className="flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-[#EA580C] to-[#D97706] hover:from-[#C2410C] hover:to-[#B45309] text-white font-bold text-xs rounded-2xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Export 7-Day PDF / Print</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-[#EEDEC1] dark:border-[#3A291E] print:hidden">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition active:scale-95 cursor-pointer shrink-0 ${
              selectedDay === day
                ? 'bg-[#EA580C] text-white shadow-md'
                : 'bg-white dark:bg-[#1C1511] text-slate-700 dark:text-slate-300 border border-[#EEDEC1] dark:border-[#3A291E] hover:border-[#EA580C]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Active Day Thali Card */}
      <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] rounded-3xl p-5 sm:p-7 space-y-6 shadow-xs print:bg-white print:border-black print:text-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EEDEC1] dark:border-[#3A291E] pb-4 gap-2 print:border-black">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#EA580C]" />
              <span>{selectedDay} Thali Plan</span>
            </h2>
            <p className="text-xs text-amber-900 dark:text-amber-400 print:text-gray-700 font-bold mt-0.5">
              {profile.dietType.replace('_', ' ')} • {activePlan.totalCalories} kcal • {activePlan.totalProtein}g Protein
            </p>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 print:hidden font-medium">
            <span>Carbs: <strong className="text-sky-600 dark:text-sky-400 font-bold">{activePlan.totalCarbs}g</strong></span> • 
            <span className="ml-2">Fats: <strong className="text-amber-700 dark:text-amber-400 font-bold">{activePlan.totalFats}g</strong></span>
          </div>
        </div>

        {/* 5 Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {Object.entries(activePlan.meals).map(([slotKey, food]) => (
            <div 
              key={slotKey} 
              className="bg-[#FFFBF5] dark:bg-[#15100E] border border-[#EEDEC1] dark:border-[#2D1F16] p-3.5 rounded-2xl space-y-2.5 print:bg-gray-100 print:border-gray-300 flex flex-col justify-between"
            >
              <div>
                <img 
                  src={getIndianFoodImage(food)} 
                  alt={food.name} 
                  className="w-full h-24 object-cover rounded-xl border border-[#EEDEC1] dark:border-[#3A291E] mb-2" 
                  loading="lazy" 
                />
                <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-400 print:text-black block">
                  {slotKey.replace('_', ' ')}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white print:text-black line-clamp-1 mt-0.5">
                  {food.name}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium print:text-gray-600">
                  {food.servingSize}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EEDEC1] dark:border-[#2D1F16] text-[11px] flex justify-between font-bold print:text-black">
                <span className="text-[#EA580C]">{food.calories} kcal</span>
                <span className="text-amber-700 dark:text-amber-400">{food.protein}g Prot</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
