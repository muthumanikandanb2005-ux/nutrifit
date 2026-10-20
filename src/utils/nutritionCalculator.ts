import type { UserProfile, MacroGoals } from '../types';

/**
 * Calculates BMR using Mifflin-St Jeor Equation:
 * For Men: BMR = 10W + 6.25H - 5A + 5
 * For Women: BMR = 10W + 6.25H - 5A - 161
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
  const safeWeight = Math.max(1, weightKg || 0);
  const safeHeight = Math.max(1, heightCm || 0);
  const safeAge = Math.max(1, age || 0);
  if (gender === 'male') {
    return Math.round(10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5);
  } else {
    return Math.round(10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161);
  }
}

/**
 * Gets TDEE Multiplier based on Activity Level
 */
export function getActivityMultiplier(activity: UserProfile['activityLevel']): number {
  switch (activity) {
    case 'sedentary':
      return 1.2; // Desk job, little/no exercise
    case 'lightly_active':
      return 1.375; // Light exercise 1-3 days/week
    case 'moderately_active':
      return 1.55; // Moderate exercise 3-5 days/week
    case 'very_active':
      return 1.725; // Heavy exercise 6-7 days/week
    case 'extra_active':
      return 1.9; // Physical work + intense workouts
    default:
      return 1.375;
  }
}

/**
 * Calculates Target Calories and Macros based on user profile and goals
 */
export function calculateMacroGoals(profile: UserProfile): MacroGoals {
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender);
  const tdee = Math.round(bmr * getActivityMultiplier(profile.activityLevel));

  let targetCalories = tdee;

  switch (profile.goal) {
    case 'fat_loss':
      targetCalories = Math.round(tdee * 0.80); // 20% deficit
      break;
    case 'recomp':
      targetCalories = Math.round(tdee * 0.95); // 5% slight deficit
      break;
    case 'muscle_gain':
      targetCalories = Math.round(tdee * 1.12); // 12% surplus
      break;
    case 'maintenance':
    default:
      targetCalories = tdee;
      break;
  }

  // Safe metabolic floor recommended by ICMR and WHO to prevent severe metabolic crashes
  const minSafeFloor = profile.gender === 'male' ? 1400 : 1200;
  targetCalories = Math.max(minSafeFloor, targetCalories);

  // 1. Protein Target (grams per kg bodyweight based on diet & goal)
  let proteinMultiplier = 1.8;
  if (profile.goal === 'muscle_gain' || profile.goal === 'fat_loss') {
    proteinMultiplier = 2.0;
  }
  if (profile.dietType === 'non_veg' || profile.dietType === 'eggetarian') {
    proteinMultiplier += 0.1;
  }

  let proteinGrams = Math.round(profile.weightKg * proteinMultiplier);
  const minProtein = Math.round(profile.weightKg * 1.4);
  const maxProtein = Math.round(profile.weightKg * 2.4);
  proteinGrams = Math.min(Math.max(proteinGrams, minProtein), maxProtein);

  // 2. Fat Target (25% of total calories; 9 kcal/g)
  const fatsGrams = Math.max(25, Math.round((targetCalories * 0.25) / 9));

  // 3. Exact Remaining Calories Allocated to Carbs (4 kcal/g)
  const proteinCalories = proteinGrams * 4;
  const fatsCalories = fatsGrams * 9;
  const remainingCarbCalories = Math.max(0, targetCalories - (proteinCalories + fatsCalories));
  let carbsGrams = Math.round(remainingCarbCalories / 4);

  // Re-verify exact target calorie summation: (P * 4) + (F * 9) + (C * 4)
  let exactCalculatedCalories = (proteinGrams * 4) + (fatsGrams * 9) + (carbsGrams * 4);
  if (exactCalculatedCalories < minSafeFloor) {
    carbsGrams += Math.ceil((minSafeFloor - exactCalculatedCalories) / 4);
    exactCalculatedCalories = (proteinGrams * 4) + (fatsGrams * 9) + (carbsGrams * 4);
  }

  // Recommended daily fiber (in grams) based on ICMR guidelines
  const fiberGrams = profile.gender === 'male' ? 35 : 28;

  return {
    calories: exactCalculatedCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    fiberGrams
  };
}
