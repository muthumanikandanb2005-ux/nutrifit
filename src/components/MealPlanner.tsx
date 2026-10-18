import React from 'react';
import type { UserProfile, DailyMealPlan, FoodItem, MealSlot, MacroGoals } from '../types';
import { Utensils, Flame, RefreshCw, ChefHat, Clock } from 'lucide-react';

interface MealPlannerProps {
  profile: UserProfile;
  mealPlan: DailyMealPlan;
  macroGoals: MacroGoals;
  onOpenSwapper: (slot: MealSlot) => void;
  onSelectRecipe: (food: FoodItem) => void;
  onRegeneratePlan: () => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  profile,
  mealPlan,
  macroGoals,
  onOpenSwapper,
  onSelectRecipe,
  onRegeneratePlan
}) => {
  const slotLabels: Record<MealSlot, { title: string; subtitle: string; time: string; icon: string }> = {
    early_morning: { title: 'Early Morning Detox', subtitle: 'Metabolism Kickstart', time: '6:30 AM - 7:00 AM', icon: '🌅' },
    breakfast: { title: 'High-Protein Breakfast', subtitle: 'Fuel for the morning', time: '8:30 AM - 9:00 AM', icon: '🥣' },
    lunch: { title: 'Main Lunch Meal', subtitle: 'Balanced Indian Thali', time: '1:30 PM - 2:00 PM', icon: '🍛' },
    snack: { title: 'Evening Snack', subtitle: 'Pre/Post Workout Boost', time: '5:30 PM - 6:00 PM', icon: '☕' },
    dinner: { title: 'Light High-Protein Dinner', subtitle: 'Overnight recovery', time: '8:30 PM - 9:00 PM', icon: '🌙' },
  };

  const calPercentage = Math.min(100, Math.round((mealPlan.totalCalories / macroGoals.calories) * 100));
  const proteinPercentage = Math.min(100, Math.round((mealPlan.totalProtein / macroGoals.proteinGrams) * 100));
  const carbPercentage = Math.min(100, Math.round((mealPlan.totalCarbs / macroGoals.carbsGrams) * 100));
  const fatPercentage = Math.min(100, Math.round((mealPlan.totalFats / macroGoals.fatsGrams) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Actions */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
            <span className="bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
              {profile.dietType.replace('_', ' ').toUpperCase()} • {profile.goal.replace('_', ' ').toUpperCase()}
            </span>
            <span>•</span>
            <span>{profile.region.replace('_', ' ').toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Your Personal Indian Fitness Meal Plan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Custom calculated for {profile.weightKg}kg • Target: {macroGoals.calories} kcal & {macroGoals.proteinGrams}g Protein
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRegeneratePlan}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Shuffle Plan</span>
          </button>
        </div>
      </div>

      {/* Progress Bars Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Progress */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300 flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Calories</span>
            </span>
            <span className="text-amber-400">{mealPlan.totalCalories} / {macroGoals.calories} kcal</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${calPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 text-right">{calPercentage}% of daily goal</div>
        </div>

        {/* Protein Progress */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300 flex items-center space-x-1">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>Protein</span>
            </span>
            <span className="text-emerald-400">{mealPlan.totalProtein}g / {macroGoals.proteinGrams}g</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${proteinPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 text-right">{proteinPercentage}% achieved</div>
        </div>

        {/* Carbs Progress */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Carbs</span>
            <span className="text-sky-400">{mealPlan.totalCarbs}g / {macroGoals.carbsGrams}g</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${carbPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 text-right">{carbPercentage}% target</div>
        </div>

        {/* Fats Progress */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Healthy Fats</span>
            <span className="text-yellow-400">{mealPlan.totalFats}g / {macroGoals.fatsGrams}g</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${fatPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 text-right">{fatPercentage}% target</div>
        </div>
      </div>

      {/* Meal Cards Timeline */}
      <div className="space-y-4">
        {(Object.keys(mealPlan.meals) as MealSlot[]).map((slotKey) => {
          const food = mealPlan.meals[slotKey];
          const slotInfo = slotLabels[slotKey];

          return (
            <div
              key={slotKey}
              className="bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-md hover:shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl bg-slate-900 p-2.5 rounded-2xl border border-slate-700">{slotInfo.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg text-white">{slotInfo.title}</h3>
                      <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 font-medium">
                        {slotInfo.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{slotInfo.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenSwapper(slotKey)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Swap Meal</span>
                  </button>

                  <button
                    onClick={() => onSelectRecipe(food)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Recipe</span>
                  </button>
                </div>
              </div>

              {/* Food Details Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="text-lg font-extrabold text-white">{food.name}</h4>
                    {food.hindiName && (
                      <span className="text-xs text-amber-300/80 font-medium font-serif">
                        ({food.hindiName})
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex items-center space-x-2">
                    <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-amber-200">
                      Portion: {food.servingSize}
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{food.prepTimeMins} mins prep</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {food.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Macro Pills Grid */}
                <div className="lg:col-span-5 grid grid-cols-4 gap-2 text-center bg-slate-900/80 p-3 rounded-2xl border border-slate-700/50">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Calories</span>
                    <div className="text-sm font-bold text-amber-400">{food.calories}</div>
                  </div>

                  <div className="space-y-0.5 border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Protein</span>
                    <div className="text-sm font-bold text-emerald-400">{food.protein}g</div>
                  </div>

                  <div className="space-y-0.5 border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Carbs</span>
                    <div className="text-sm font-bold text-sky-400">{food.carbs}g</div>
                  </div>

                  <div className="space-y-0.5 border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Fats</span>
                    <div className="text-sm font-bold text-yellow-400">{food.fats}g</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
