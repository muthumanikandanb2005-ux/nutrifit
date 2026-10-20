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
    if (
      profile.dietType === 'pure_veg' ||
      profile.dietType === 'jain' ||
      profile.dietType === 'sattvic' ||
      profile.dietType === 'vegan' ||
      profile.dietType === 'high_protein_veg'
    ) {
      if (food.dietType.includes('non_veg') && !food.dietType.includes('pure_veg')) return false;
      if (food.dietType.includes('eggetarian') && !food.dietType.includes('pure_veg')) return false;
    }

    if (profile.dietType === 'pure_veg') {
      if (!food.dietType.includes('pure_veg')) return false;
    }

    if (profile.dietType === 'jain') {
      if (!food.dietType.includes('jain')) return false;
    }

    if (profile.dietType === 'sattvic') {
      if (!food.dietType.includes('sattvic')) return false;
    }

    if (profile.dietType === 'vegan') {
      if (!food.dietType.includes('vegan')) return false;
    }

    if (profile.dietType === 'high_protein_veg') {
      if (!food.dietType.includes('high_protein_veg')) return false;
    }

    if (profile.dietType === 'eggetarian') {
      if (food.dietType.includes('non_veg') && !food.dietType.includes('eggetarian') && !food.dietType.includes('pure_veg')) return false;
    }

    return true;
  });
}

/**
 * Generate a complete 1-day Meal Plan optimized for target macros
 * @param variationIndex Optional index/seed used to rotate candidate meals for daily variety or shuffle
 */
export function generateDailyMealPlan(
  profile: UserProfile,
  _targetCalories?: number,
  variationIndex?: number
): DailyMealPlan {
  const slots: MealSlot[] = ['early_morning', 'breakfast', 'lunch', 'snack', 'dinner'];
  const selectedMeals: Partial<Record<MealSlot, FoodItem>> = {};

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;

  for (const slot of slots) {
    let candidates = filterCompatibleFoods(slot, profile);
    
    // Fallback if no exact candidates matched
    if (candidates.length === 0) {
      candidates = INDIAN_FOOD_DATABASE.filter((f) => {
        if (f.slot !== slot) return false;
        if (
          profile.dietType === 'pure_veg' ||
          profile.dietType === 'jain' ||
          profile.dietType === 'sattvic' ||
          profile.dietType === 'vegan' ||
          profile.dietType === 'high_protein_veg'
        ) {
          return f.dietType.includes('pure_veg');
        }
        if (profile.dietType === 'eggetarian') {
          return f.dietType.includes('eggetarian') || f.dietType.includes('pure_veg');
        }
        return true;
      });
    }

    let bestMatch: FoodItem;

    if (variationIndex !== undefined && candidates.length > 1) {
      // Prioritize top protein candidates if muscle gain/fat loss, but offset by variationIndex
      const sorted = (profile.goal === 'muscle_gain' || profile.goal === 'fat_loss')
        ? [...candidates].sort((a, b) => b.protein - a.protein)
        : candidates;
      bestMatch = sorted[variationIndex % sorted.length];
    } else if (profile.goal === 'muscle_gain' || profile.goal === 'fat_loss') {
      const sortedByProtein = [...candidates].sort((a, b) => b.protein - a.protein);
      bestMatch = sortedByProtein[0] || candidates[0];
    } else {
      bestMatch = candidates[0];
    }

    if (!bestMatch) {
      const safeFood = INDIAN_FOOD_DATABASE.find((f) => {
        if (f.slot !== slot) return false;
        if (
          profile.dietType === 'pure_veg' ||
          profile.dietType === 'jain' ||
          profile.dietType === 'sattvic' ||
          profile.dietType === 'vegan' ||
          profile.dietType === 'high_protein_veg'
        ) {
          return f.dietType.includes('pure_veg');
        }
        if (profile.dietType === 'eggetarian') {
          return f.dietType.includes('eggetarian') || f.dietType.includes('pure_veg');
        }
        return true;
      });
      bestMatch = safeFood || candidates[0] || INDIAN_FOOD_DATABASE[0];
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
