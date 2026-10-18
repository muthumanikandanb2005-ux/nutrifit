export type FitnessGoal = 'fat_loss' | 'maintenance' | 'muscle_gain' | 'recomp';

export type DietType = 
  | 'pure_veg' 
  | 'eggetarian' 
  | 'non_veg' 
  | 'high_protein_veg' 
  | 'jain' 
  | 'sattvic' 
  | 'vegan';

export type RegionPreference = 
  | 'all' 
  | 'north_indian' 
  | 'south_indian' 
  | 'west_indian' 
  | 'east_indian';

export type BudgetLevel = 'budget' | 'moderate' | 'premium';

export type MealSlot = 'early_morning' | 'breakfast' | 'lunch' | 'snack' | 'dinner';

export type FoodState = 'cooked' | 'raw';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: FitnessGoal;
  dietType: DietType;
  region: RegionPreference;
  budget: BudgetLevel;
  medicalConditions: string[];
}

export interface MacroGoals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  slot: MealSlot;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  fiber: number;   // in grams
  servingSize: string; // e.g. "2 Rotis + 1 Katori Dal"
  servingSizeGrams?: number;
  dietType: DietType[];
  region: RegionPreference[];
  budget: BudgetLevel;
  prepTimeMins: number;
  tags: string[];
  ingredients: { item: string; amount: string; category: 'grains' | 'dairy_poultry' | 'vegetables' | 'spices_pantry' | 'legumes' }[];
  recipeInstructions?: string[];
  tips?: string;
}

export interface ScannedFoodResult {
  id: string;
  foodName: string;
  hindiName?: string;
  foodState: FoodState;
  estimatedServing: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  confidence: number; // 0 to 100
  recommendedSlot: MealSlot;
  healthRating: 'Excellent' | 'Good' | 'Moderate' | 'High Calorie';
  benefits: string[];
  cookingImpactNote?: string;
}

export interface DailyMealPlan {
  dayName: string;
  meals: Record<MealSlot, FoodItem>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
}

export interface GroceryItem {
  name: string;
  amount: string;
  category: 'grains' | 'dairy_poultry' | 'vegetables' | 'spices_pantry' | 'legumes';
  checked: boolean;
}

export interface WorkoutEntry {
  id: string;
  name: string;
  category: 'weightlifting' | 'hiit' | 'yoga' | 'running' | 'sports';
  durationMins: number;
  caloriesBurned: number;
  intensity: 'low' | 'moderate' | 'high';
  timestamp: string;
}

export interface WeightEntry {
  date: string;
  weightKg: number;
  bmi: number;
}

export interface SupplementInfo {
  id: string;
  name: string;
  hindiName?: string;
  category: 'protein' | 'performance' | 'vitamins' | 'herbal';
  dosage: string;
  bestTime: string;
  benefits: string[];
  isVegetarian: boolean;
  scientificRating: 'A+' | 'A' | 'B+';
  description: string;
}

export type FastingProtocol = '16_8' | '14_10' | '18_6' | '20_4' | 'vrat';

export interface FastingState {
  isFasting: boolean;
  startTime: number | null; // epoch ms
  targetDurationHours: number;
  protocol: FastingProtocol;
}

export interface CustomRecipe {
  id: string;
  name: string;
  servingCount: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatsPerServing: number;
  ingredients: { name: string; grams: number }[];
}

export interface StepsLogEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  steps: number;
  distanceKm: number;
  caloriesBurned: number;
  durationMins: number;
  avgPaceMinutesPerKm: number;
  activityType: 'walk' | 'run' | 'hike' | 'treadmill';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface RestaurantSwapItem {
  id: string;
  cuisine: 'north_indian' | 'south_indian' | 'chinese' | 'mughlai' | 'dhaba';
  unhealthyChoice: string;
  unhealthyCalories: number;
  healthySwap: string;
  healthyCalories: number;
  proteinSavedGrams: number;
  reason: string;
}
