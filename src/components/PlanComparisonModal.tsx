import React from 'react';
import { X, Check, Flame, Scale, Dumbbell, Sparkles, ArrowRight } from 'lucide-react';
import type { UserProfile } from '../types';
import { calculateMacroGoals } from '../utils/nutritionCalculator';
import { generateDailyMealPlan } from '../utils/mealPlanGenerator';
import { haptic } from '../utils/haptics';

interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSelectGoal: (goal: 'fat_loss' | 'maintenance' | 'muscle_gain') => void;
}

export const PlanComparisonModal: React.FC<PlanComparisonModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectGoal
}) => {
  if (!isOpen) return null;

  // Calculate telemetry for each plan
  const weightLossMacros = calculateMacroGoals({ ...profile, goal: 'fat_loss' });
  const maintainMacros = calculateMacroGoals({ ...profile, goal: 'maintenance' });
  const weightGainMacros = calculateMacroGoals({ ...profile, goal: 'muscle_gain' });

  // Generate representative sample meal plans
  const weightLossPlan = generateDailyMealPlan({ ...profile, goal: 'fat_loss' }, weightLossMacros.calories, 0);
  const maintainPlan = generateDailyMealPlan({ ...profile, goal: 'maintenance' }, maintainMacros.calories, 0);
  const weightGainPlan = generateDailyMealPlan({ ...profile, goal: 'muscle_gain' }, weightGainMacros.calories, 0);

  const plans = [
    {
      id: 'fat_loss' as const,
      name: 'Weight Loss Plan',
      subtitle: 'Calorie Deficit & Fat Burn',
      icon: Flame,
      badge: '-20% Calorie Deficit',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950/70 dark:text-orange-200',
      macros: weightLossMacros,
      plan: weightLossPlan,
      desc: 'Formulated to burn stubborn body fat while preserving lean muscle with high-satiety Indian meals.',
      bestFor: 'Cutting body fat, reducing waist circumference & boosting metabolic rate.',
      keyStrategy: 'Fiber-first meals (salads before rotis), zero-sugar beverages, and low-glycemic millets.'
    },
    {
      id: 'maintenance' as const,
      name: 'Maintain Plan',
      subtitle: 'Energy Balance & Weight Stability',
      icon: Scale,
      badge: 'TDEE Equilibrium',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/70 dark:text-amber-200',
      macros: maintainMacros,
      plan: maintainPlan,
      desc: 'Balanced traditional Indian thali proportions for all-day energy, digestive health, and athletic stamina.',
      bestFor: 'Maintaining current weight, improving workout endurance and long-term metabolic health.',
      keyStrategy: 'Equal macro distribution, post-meal probiotic chaas, and consistent 4-hour meal timing.'
    },
    {
      id: 'muscle_gain' as const,
      name: 'Weight Gain Plan',
      subtitle: 'Clean Calorie Surplus & Hypertrophy',
      icon: Dumbbell,
      badge: '+15% Caloric Surplus',
      badgeColor: 'bg-amber-200 text-amber-950 border-amber-300 dark:bg-amber-900/60 dark:text-amber-100',
      macros: weightGainMacros,
      plan: weightGainPlan,
      desc: 'Calorie-dense clean bulking strategy powered by desi superfoods like sattu, nuts, paneer, and ghee.',
      bestFor: 'Building lean muscle mass, healthy weight gain, and progressive gym strength.',
      keyStrategy: 'Sattu-banana mass gainer smoothies, extra desi ghee on rotis, and dense protein snacks.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1511] w-full max-w-5xl max-h-[92vh] rounded-3xl border border-[#EEDEC1] dark:border-[#3A291E] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between shrink-0 bg-stone-50/80 dark:bg-[#251C17]/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] font-extrabold text-[10px] uppercase tracking-wider">
                3 Dedicated Indian Nutrition Paths
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Compare Weight Loss, Maintain & Weight Gain Plans
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Calculated specifically for {profile.name} ({profile.weightKg} kg • {profile.heightCm} cm • {profile.dietType.replace('_', ' ')})
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#2D2018] border border-[#EEDEC1] dark:border-[#3A291E] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close Comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Column Plan Grid Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {plans.map((p) => {
              const isCurrent = profile.goal === p.id;

              return (
                <div
                  key={p.id}
                  className={`rounded-3xl p-5 border flex flex-col justify-between transition-all shadow-xs ${
                    isCurrent
                      ? 'border-[#EA580C] bg-amber-50/40 dark:bg-amber-950/20 ring-2 ring-[#EA580C]/40'
                      : 'border-[#EEDEC1] dark:border-[#3A291E] bg-white dark:bg-[#231811] hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Goal Badge & Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EA580C] text-white shadow-2xs">
                          Active Goal
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0">
                          <p.icon className="w-4 h-4 text-[#EA580C]" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                            {p.name}
                          </h3>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold block">
                            {p.subtitle}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    {/* Macro Target Bento */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">Daily Fuel</span>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                          {p.macros.calories.toLocaleString()} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">kcal</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-center border-t border-[#EEDEC1] dark:border-[#3A291E]">
                        <div className="p-1.5 rounded-xl bg-white dark:bg-[#251C17]">
                          <div className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Protein</div>
                          <div className="text-xs font-black text-[#EA580C] dark:text-[#FB923C]">{p.macros.proteinGrams}g</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-white dark:bg-[#251C17]">
                          <div className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Carbs</div>
                          <div className="text-xs font-black text-[#0284C7] dark:text-[#38BDF8]">{p.macros.carbsGrams}g</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-white dark:bg-[#251C17]">
                          <div className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Fats</div>
                          <div className="text-xs font-black text-amber-800 dark:text-amber-400">{p.macros.fatsGrams}g</div>
                        </div>
                      </div>
                    </div>

                    {/* Sample 5-Meal Roster */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        Sample Daily Thali Roster
                      </span>
                      <div className="space-y-1 text-xs">
                        <div className="p-2 rounded-xl bg-stone-50/70 dark:bg-[#19120E] border border-stone-200 dark:border-[#2D2018] flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            🌅 {p.plan.meals.breakfast?.name || 'Breakfast'}
                          </span>
                          <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-200 ml-2 shrink-0">
                            {p.plan.meals.breakfast?.calories} kcal
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-50/70 dark:bg-[#19120E] border border-stone-200 dark:border-[#2D2018] flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            🍛 {p.plan.meals.lunch?.name || 'Lunch'}
                          </span>
                          <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-200 ml-2 shrink-0">
                            {p.plan.meals.lunch?.calories} kcal
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-50/70 dark:bg-[#19120E] border border-stone-200 dark:border-[#2D2018] flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            🌙 {p.plan.meals.dinner?.name || 'Dinner'}
                          </span>
                          <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-200 ml-2 shrink-0">
                            {p.plan.meals.dinner?.calories} kcal
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Strategic Advice */}
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-[#1f1610] border border-amber-200/80 dark:border-amber-900/50">
                      <div className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase text-[#9A3412] dark:text-[#FED7AA]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Core Strategy</span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1 leading-snug">
                        {p.keyStrategy}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-2 border-t border-[#EEDEC1] dark:border-[#3A291E]">
                    {isCurrent ? (
                      <div className="w-full py-2.5 px-3 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-extrabold text-xs flex items-center justify-center space-x-1.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Currently Active Plan</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          haptic.success();
                          onSelectGoal(p.id);
                          onClose();
                        }}
                        className="w-full py-2.5 px-3 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <span>Switch to {p.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
