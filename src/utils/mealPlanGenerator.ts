import type { UserProfile, DailyMealPlan, FoodItem, MealSlot } from '../types';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoodDatabase';

/**
 * Filter foods compatible with user's diet type, region, and budget
 */
export function filterCompatibleFoods(
  slot: MealSlot,
  profile: UserProfile
): FoodItem[] {
  return INDIAN_FOOD_DATABASE.filter((food) => {
    if (food.slot !== slot) return false;

    // Filter by Diet Type
    if (profile.dietType === 'pure_veg' || profile.dietType === 'jain' || profile.dietType === 'sattvic' || profile.dietType === 'vegan') {
      if (food.dietType.includes('non_veg') && !food.dietType.includes('pure_veg')) return false;
      if (food.dietType.includes('eggetarian') && !food.dietType.includes('pure_veg')) return false;
    }

    if (profile.dietType === 'jain') {
      if (!food.dietType.includes('jain')) return false;
    }

    if (profile.dietType === 'vegan') {
      if (!food.dietType.includes('vegan')) return false;
    }

    if (profile.dietType === 'eggetarian') {
      if (food.dietType.includes('non_veg') && !food.dietType.includes('eggetarian')) return false;
    }

    return true;
  });
}

/**
 * Generate a complete 1-day Meal Plan optimized for target macros
 */
export function generateDailyMealPlan(profile: UserProfile, _targetCalories: number): DailyMealPlan {
  const slots: MealSlot[] = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'];
  const selectedMeals: Partial<Record<MealSlot, FoodItem>> = {};

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;

  for (const slot of slots) {
    const candidates = filterCompatibleFoods(slot, profile);
    
    // Pick the best food item (or first matching)
    let bestMatch = candidates[0];
    
    // If user wants high protein or non-veg, prioritize highest protein food in candidates
    if (profile.goal === 'muscle_gain' || profile.goal === 'fat_loss') {
      const sortedByProtein = [...candidates].sort((a, b) => b.protein - a.protein);
      if (sortedByProtein.length > 0) {
        bestMatch = sortedByProtein[0];
      }
    }

    if (!bestMatch) {
      // Fallback to any food in slot
      bestMatch = INDIAN_FOOD_DATABASE.find((f) => f.slot === slot) || INDIAN_FOOD_DATABASE[0];
    }

    selectedMeals[slot] = bestMatch;
    totalCalories += bestMatch.calories;
    totalProtein += bestMatch.protein;
    totalCarbs += bestMatch.carbs;
    totalFats += bestMatch.fats;
    totalFiber += bestMatch.fiber;
  }

  return {
    dayName: 'Day 1 (Custom Fitness Plan)',
    meals: selectedMeals as Record<MealSlot, FoodItem>,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalCarbs: Math.round(totalCarbs),
    totalFats: Math.round(totalFats),
    totalFiber: Math.round(totalFiber)
  };
}
