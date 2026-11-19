import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { 
  UserProfile, MealSlot, FoodItem, DailyMealPlan, 
  WorkoutEntry, FastingState, CustomRecipe 
} from './types';
import { calculateMacroGoals } from './utils/nutritionCalculator';
import { generateDailyMealPlan } from './utils/mealPlanGenerator';
import { INDIAN_FOOD_DATABASE } from './data/indianFoodDatabase';
import { getIndianFoodImage } from './utils/indianFoodImages';
import { initializeAndroidSystem, setupAndroidBackButton } from './utils/androidPlatform';
import { AppClerkProvider, useClerkAuth } from './components/ClerkAuthProvider';
import { SafeSignedIn, SafeUserButton } from './components/SafeClerkComponents';
import { RecipeModal } from './components/RecipeModal';
import { MealSwapperModal } from './components/MealSwapperModal';
import { HandsFreeCookingModal } from './components/HandsFreeCookingModal';
import { GroceryList } from './components/GroceryList';
import { FoodScanner } from './components/FoodScanner';
import { FastingTimer } from './components/FastingTimer';
import { WorkoutTracker } from './components/WorkoutTracker';
import { AICoach } from './components/AICoach';
import { SwiggyGuide } from './components/SwiggyGuide';
import { CustomRecipeBuilder } from './components/CustomRecipeBuilder';
import { haptic } from './utils/haptics';
import { cx } from './utils/cx';
import confetti from 'canvas-confetti';
import { 
  Home, 
  BarChart3, 
  Scan, 
  LayoutGrid, 
  Droplets, 
  Flame, 
  Activity, 
  Scale, 
  ChevronRight, 
  Sparkles, 
  Sun, 
  Moon, 
  Check, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Utensils, 
  ShoppingBag, 
  Bot, 
  Camera, 
  Timer, 
  User, 
  RefreshCw, 
  ChefHat, 
  Play, 
  Smartphone, 
  Monitor
} from 'lucide-react';

/**
 * Sync Clerk user details when authenticated
 */
function ClerkUserSync({ onUserLoaded }: { onUserLoaded: (name: string, avatarUrl?: string) => void }) {
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const name = user.fullName || user.firstName || '';
      onUserLoaded(name, user.imageUrl);
    }
  }, [isLoaded, isSignedIn, user, onUserLoaded]);
  return null;
}

export function AppContent() {
  const { isClerkConfigured } = useClerkAuth();

  // Active Screen / Tab
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');

  // Desktop Layout Mode: 'responsive' (full modern dashboard) vs 'mobile_preview' (phone simulator)
  const [desktopMode, setDesktopMode] = useState<'responsive' | 'mobile_preview'>(() => {
    const saved = localStorage.getItem('nutrifit_desktop_mode');
    return (saved === 'mobile_preview' || saved === 'responsive') ? saved : 'responsive';
  });

  useEffect(() => {
    localStorage.setItem('nutrifit_desktop_mode', desktopMode);
  }, [desktopMode]);

  // Toast Notification State
  const [notification, setNotification] = useState<string | null>(null);
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Theme state: defaults to 'light' (Stitch Botanical Culinary)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nutrifit_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('nutrifit_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark-mode', theme === 'dark');
    initializeAndroidSystem(theme);
  }, [theme]);

  // Setup Android hardware back button handler
  useEffect(() => {
    const removeListener = setupAndroidBackButton(() => {
      if (activeScreen !== 'dashboard') {
        setActiveScreen('dashboard');
        return true;
      }
      return false;
    });
    return () => {
      if (removeListener) removeListener();
    };
  }, [activeScreen]);

  // User Profile Avatar
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem('nutrifit_avatar') || '/user-avatar.png';
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUserAvatar(base64);
        localStorage.setItem('nutrifit_avatar', base64);
        notify('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToProvidedAvatar = () => {
    setUserAvatar('/user-avatar.png');
    localStorage.removeItem('nutrifit_avatar');
    notify('Reset to user provided profile image.');
  };

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('morrow_profile');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          bodyType: parsed.bodyType || 'mesomorph',
        };
      } catch { /* fallback */ }
    }
    return {
      name: 'Sajibur Rahman',
      age: 26,
      gender: 'male',
      weightKg: 68.4,
      heightCm: 174,
      activityLevel: 'moderately_active',
      goal: 'fat_loss',
      bodyType: 'mesomorph',
      dietType: 'pure_veg',
      region: 'all',
      budget: 'moderate',
      medicalConditions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('morrow_profile', JSON.stringify(profile));
  }, [profile]);

  // Dynamic Mifflin-St Jeor Macro Target
  const macroGoals = useMemo(() => {
    return calculateMacroGoals(profile);
  }, [profile]);

  // Extended Goals & Metrics
  const targetWeight = 65.0;
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [waterAmount, setWaterAmount] = useState<number>(2400); // 12 glasses (200ml each)

  // Calendar Week Strip State
  const [activeDateIndex, setActiveDateIndex] = useState<number>(3); // 3 = Wednesday 10th
  const weekDays = [
    { day: 'Mon', date: '08' },
    { day: 'Tue', date: '09' },
    { day: 'Wed', date: '10' },
    { day: 'Thu', date: '11' },
    { day: 'Fri', date: '12' },
    { day: 'Sat', date: '13' },
    { day: 'Sun', date: '14' },
  ];

  // Dynamic Indian Meal Plan
  const [mealPlan, setMealPlan] = useState<DailyMealPlan>(() => {
    return generateDailyMealPlan(profile, macroGoals.calories, activeDateIndex);
  });

  // Regenerate plan when profile, goal, bodyType or active day changes
  useEffect(() => {
    setMealPlan(generateDailyMealPlan(profile, macroGoals.calories, activeDateIndex));
  }, [profile.dietType, profile.goal, profile.bodyType, macroGoals.calories, activeDateIndex]);

  // Track eaten meals for today: { early_morning: false, breakfast: true, ... }
  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`nutrifit_eaten_${activeDateIndex}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { breakfast: true }; // Default breakfast logged
  });

  useEffect(() => {
    localStorage.setItem(`nutrifit_eaten_${activeDateIndex}`, JSON.stringify(eatenMeals));
  }, [eatenMeals, activeDateIndex]);

  const toggleMealEaten = (slot: MealSlot) => {
    haptic.success();
    setEatenMeals(prev => {
      const isEaten = !prev[slot];
      if (isEaten) {
        notify(`Logged ${slot.replace('_', ' ')} as eaten!`);
        try {
          confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
        } catch { /* ignore */ }
      } else {
        notify(`Unmarked ${slot.replace('_', ' ')}.`);
      }
      return { ...prev, [slot]: isEaten };
    });
  };

  // Dynamically calculate calories and protein logged based on eaten meals
  const caloriesLogged = useMemo(() => {
    let total = 0;
    if (eatenMeals.early_morning && mealPlan.meals.early_morning) total += mealPlan.meals.early_morning.calories;
    if (eatenMeals.breakfast && mealPlan.meals.breakfast) total += mealPlan.meals.breakfast.calories;
    if (eatenMeals.lunch && mealPlan.meals.lunch) total += mealPlan.meals.lunch.calories;
    if (eatenMeals.snack && mealPlan.meals.snack) total += mealPlan.meals.snack.calories;
    if (eatenMeals.dinner && mealPlan.meals.dinner) total += mealPlan.meals.dinner.calories;
    return total || 420;
  }, [eatenMeals, mealPlan]);

  const proteinLogged = useMemo(() => {
    let total = 0;
    if (eatenMeals.early_morning && mealPlan.meals.early_morning) total += mealPlan.meals.early_morning.protein;
    if (eatenMeals.breakfast && mealPlan.meals.breakfast) total += mealPlan.meals.breakfast.protein;
    if (eatenMeals.lunch && mealPlan.meals.lunch) total += mealPlan.meals.lunch.protein;
    if (eatenMeals.snack && mealPlan.meals.snack) total += mealPlan.meals.snack.protein;
    if (eatenMeals.dinner && mealPlan.meals.dinner) total += mealPlan.meals.dinner.protein;
    return total || 22;
  }, [eatenMeals, mealPlan]);

  // Modal States
  const [selectedRecipe, setSelectedRecipe] = useState<FoodItem | null>(null);
  const [swappingSlot, setSwappingSlot] = useState<MealSlot | null>(null);
  const [cookingFood, setCookingFood] = useState<FoodItem | null>(null);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);

  // Sub-feature states
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([
    {
      id: 'w1',
      name: 'Surya Namaskar & Core Yoga',
      category: 'yoga',
      durationMins: 30,
      caloriesBurned: 160,
      intensity: 'moderate',
      timestamp: '07:00 AM'
    },
    {
      id: 'w2',
      name: 'Functional Dumbbell Circuit',
      category: 'weightlifting',
      durationMins: 45,
      caloriesBurned: 290,
      intensity: 'high',
      timestamp: '05:45 PM'
    }
  ]);

  const [fastingState, setFastingState] = useState<FastingState>({
    isFasting: true,
    startTime: Date.now() - 14 * 3600 * 1000, // 14 hours into fast
    targetDurationHours: 16,
    protocol: '16_8'
  });

  const [savedCustomRecipes, setSavedCustomRecipes] = useState<CustomRecipe[]>([
    {
      id: 'cr1',
      name: 'High-Protein Paneer Besan Chilla',
      servingCount: 1,
      caloriesPerServing: 380,
      proteinPerServing: 24,
      carbsPerServing: 32,
      fatsPerServing: 14,
      ingredients: [
        { name: 'Besan (Gram Flour)', grams: 50 },
        { name: 'Low-Fat Paneer (Grated)', grams: 60 },
        { name: 'Spinach & Coriander', grams: 30 }
      ]
    }
  ]);

  // Recipe catalog search & filter
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeFilter, setRecipeFilter] = useState('all');

  const filteredRecipes = useMemo(() => {
    return INDIAN_FOOD_DATABASE.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
        (f.hindiName && f.hindiName.toLowerCase().includes(recipeSearch.toLowerCase()));
      if (!matchSearch) return false;
      if (recipeFilter === 'all') return true;
      if (recipeFilter === 'high-protein') return f.protein >= 15;
      if (recipeFilter === 'quick') return f.prepTimeMins <= 10;
      if (recipeFilter === 'north') return f.region.includes('north_indian');
      if (recipeFilter === 'south') return f.region.includes('south_indian');
      return true;
    });
  }, [recipeSearch, recipeFilter]);

  // Weight converter helper
  const shownWeight = (kg: number) => {
    return weightUnit === 'lb' ? Math.round(kg * 2.20462) : kg;
  };

  // ========================================================
  // RENDER: Daily Indian Meal Cards
  // ========================================================
  const renderIndianMealCards = () => {
    const mealSlots: { slot: MealSlot; label: string; time: string; item: FoodItem }[] = [
      { slot: 'early_morning', label: 'Early Morning Detox', time: '06:30 AM', item: mealPlan.meals.early_morning },
      { slot: 'breakfast', label: 'High-Protein Breakfast', time: '08:30 AM', item: mealPlan.meals.breakfast },
      { slot: 'lunch', label: 'Lunch Thali', time: '01:30 PM', item: mealPlan.meals.lunch },
      { slot: 'snack', label: 'Evening Fuel / Snack', time: '05:30 PM', item: mealPlan.meals.snack },
      { slot: 'dinner', label: 'Recovery Dinner Thali', time: '08:30 PM', item: mealPlan.meals.dinner },
    ];

    return (
      <div className="space-y-3.5">
        {mealSlots.map((slotData) => {
          const dish = slotData.item;
          if (!dish) return null;
          const dishImg = getIndianFoodImage(dish);
          const isEaten = Boolean(eatenMeals[slotData.slot]);

          return (
            <div 
              key={slotData.slot}
              className={cx(
                "p-4 rounded-3xl border transition-all shadow-xs group",
                isEaten 
                  ? "bg-[#f8faf8] dark:bg-[#131d16] border-[#EEDEC1] dark:border-[#312219] opacity-90"
                  : "bg-white dark:bg-[#1C1511] border-[#EEDEC1] dark:border-[#3A291E] hover:border-[#EA580C] dark:hover:border-[#FB923C]"
              )}
            >
              <div className="flex items-start sm:items-center justify-between gap-3">
                {/* Image Thumbnail with Clickable Recipe Modal */}
                <div 
                  onClick={() => setSelectedRecipe(dish)}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-xs"
                >
                  <img 
                    src={dishImg} 
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  {isEaten && (
                    <div className="absolute inset-0 bg-[#EA580C]/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white text-[#EA580C] flex items-center justify-center shadow">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    ⏱ {dish.prepTimeMins}m
                  </span>
                </div>

                {/* Dish Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA]">
                      {slotData.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {slotData.time}</span>
                  </div>

                  <h4 
                    onClick={() => setSelectedRecipe(dish)}
                    className={cx(
                      "text-sm sm:text-base font-bold truncate cursor-pointer hover:text-[#EA580C] dark:hover:text-[#FB923C] transition",
                      isEaten ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-white"
                    )}
                    title={dish.name}
                  >
                    {dish.name}
                  </h4>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Portion: {dish.servingSize}
                  </div>

                  {/* Nutrition Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#fef6e7] dark:bg-[#2b2214] text-amber-700 dark:text-amber-300 text-[10px] font-bold flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                      <span>{dish.calories} kcal</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#251912] text-amber-800 dark:text-amber-400 text-[10px] font-bold">
                      {dish.protein}g Protein
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#2D2018] text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                      {dish.carbs}g Carbs
                    </span>
                  </div>
                </div>

                {/* Mark Eaten Checkbox & Dropdown */}
                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <button
                    onClick={() => toggleMealEaten(slotData.slot)}
                    className={cx(
                      "flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs",
                      isEaten 
                        ? "bg-[#EA580C] text-white" 
                        : "bg-white dark:bg-[#251C17] border border-[#EEDEC1] dark:border-[#3A2A1F] text-slate-700 dark:text-slate-200 hover:border-[#EA580C]"
                    )}
                    title={isEaten ? "Mark as not eaten" : "Mark as eaten"}
                  >
                    <Check className={cx("w-3.5 h-3.5 stroke-[2.5]", isEaten ? "text-white" : "text-slate-400")} />
                    <span className="hidden sm:inline">{isEaten ? 'Eaten' : 'Mark Eaten'}</span>
                  </button>
                </div>
              </div>

              {/* Action Toolbar on Card */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#2D2018] flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      haptic.medium();
                      setCookingFood(dish);
                      setIsCookModeOpen(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Cook Mode</span>
                  </button>

                  <button
                    onClick={() => {
                      haptic.selection();
                      setSwappingSlot(slotData.slot);
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#f8faf8] dark:bg-[#251C17] border border-[#EEDEC1] dark:border-[#3A2A1F] text-slate-700 dark:text-slate-200 font-bold text-xs hover:border-[#EA580C] active:scale-95 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-[#9A3412] dark:text-[#FED7AA]" />
                    <span>Swap</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedRecipe(dish)}
                  className="text-xs font-bold text-[#9A3412] dark:text-[#FED7AA] hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>Recipe Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    );
  };

  // ========================================================
  // RENDER: Home Screen / Daily Dashboard
  // ========================================================
  const renderHomeScreen = (_isDual = false) => (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* 1. Daily Fuel & Macro Bento Card (Stitch Design) */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Daily Energy Fuel
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <h2 className="text-2xl sm:text-3xl font-black text-[#7C2D12] dark:text-white tracking-tight">
                {caloriesLogged.toLocaleString()}
              </h2>
              <span className="text-sm font-semibold text-slate-400">
                / {macroGoals.calories.toLocaleString()} kcal target
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] font-bold text-xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] dark:bg-[#FB923C] animate-pulse" />
              <span>{Math.max(0, macroGoals.calories - caloriesLogged)} kcal remaining</span>
            </span>
          </div>
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Protein */}
          <div className="p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#34251B]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 font-bold">Protein</span>
              <span className="font-black text-[#9A3412] dark:text-[#FED7AA]">
                {Math.min(100, Math.round((proteinLogged / (macroGoals.proteinGrams || 1)) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FAF0DC] dark:bg-[#202d23] overflow-hidden">
              <div 
                className="h-full bg-[#EA580C] dark:bg-[#FB923C] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((proteinLogged / (macroGoals.proteinGrams || 1)) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
              {proteinLogged}g <span className="opacity-60">/ {macroGoals.proteinGrams}g</span>
            </div>
          </div>

          {/* Carbs */}
          <div className="p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#34251B]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 font-bold">Carbs</span>
              <span className="font-black text-[#2ba5f7]">
                {Math.min(100, Math.round((Math.round(caloriesLogged * 0.12) / (macroGoals.carbsGrams || 1)) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e8f6fd] dark:bg-[#1a2d39] overflow-hidden">
              <div 
                className="h-full bg-[#2ba5f7] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((Math.round(caloriesLogged * 0.12) / (macroGoals.carbsGrams || 1)) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
              {Math.round(caloriesLogged * 0.12)}g <span className="opacity-60">/ {macroGoals.carbsGrams}g</span>
            </div>
          </div>

          {/* Fats */}
          <div className="p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#34251B]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 font-bold">Fats</span>
              <span className="font-black text-[#e07a5f]">
                {Math.min(100, Math.round((Math.round(caloriesLogged * 0.035) / (macroGoals.fatsGrams || 1)) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#ffdbd2] dark:bg-[#3c0800] overflow-hidden">
              <div 
                className="h-full bg-[#e07a5f] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((Math.round(caloriesLogged * 0.035) / (macroGoals.fatsGrams || 1)) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
              {Math.round(caloriesLogged * 0.035)}g <span className="opacity-60">/ {macroGoals.fatsGrams}g</span>
            </div>
          </div>
        </div>

        {/* Interactive Hydration Counter Bar */}
        <div className="p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#34251B] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e8f6fd] text-[#2ba5f7] flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Hydration</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-[#2ba5f7] font-bold">{Math.round(waterAmount / 200)}</strong> of 12 glasses ({waterAmount}ml)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                setWaterAmount(prev => Math.max(0, prev - 200));
                haptic.light();
              }}
              className="w-8 h-8 rounded-full bg-white dark:bg-[#2D2018] border border-[#EEDEC1] dark:border-[#3A2A1F] text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm active:scale-95 transition cursor-pointer"
              title="Minus 1 glass"
            >
              -
            </button>
            <button
              onClick={() => {
                setWaterAmount(prev => prev + 200);
                haptic.medium();
                notify("Logged 1 glass of water (+200ml)!");
              }}
              className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm active:scale-95 transition cursor-pointer shadow-xs"
              title="Add 1 glass"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI Smart Sous-Chef Coach Tip Banner */}
      <div className="p-4 rounded-3xl bg-[#9A3412] text-white shadow-sm flex items-center space-x-3.5 relative overflow-hidden">
        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#FDBA74]" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDBA74] block">
            AI Nutrition Cue • {profile.bodyType ? profile.bodyType.toUpperCase() : 'FITNESS'}
          </span>
          <p className="text-xs sm:text-sm font-medium leading-snug text-white/95">
            {profile.goal === 'fat_loss' 
              ? "High-protein recovery dinner recommended to preserve lean muscle during today's calorie deficit."
              : profile.goal === 'muscle_gain'
              ? "Hit surplus fuel tonight! Add sattu or paneer bhurji to maximize overnight muscle synthesis."
              : "Steady energy day! Keep hydration active and maintain balanced thali portions."}
          </p>
        </div>
      </div>

      {/* 3. Goal & Somatotype Controller */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-4 sm:p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Diet Goal & Body Type (Somatotype)
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA]">
            100% Indian Diet
          </span>
        </div>

        {/* 3 Goal Selection Buttons */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#FEF3C7] dark:bg-[#141d16] rounded-2xl">
          {[
            { id: 'fat_loss' as const, label: 'Weight Loss', desc: '-20% Deficit' },
            { id: 'maintenance' as const, label: 'Maintain', desc: 'TDEE Balance' },
            { id: 'muscle_gain' as const, label: 'Weight Gain', desc: '+15% Surplus' }
          ].map(g => {
            const isSelected = profile.goal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setProfile(prev => ({ ...prev, goal: g.id }));
                  haptic.selection();
                  notify(`Switched to ${g.label} mode!`);
                }}
                className={cx(
                  "py-2 px-1 rounded-xl text-center transition cursor-pointer active:scale-95 flex flex-col items-center justify-center",
                  isSelected
                    ? "bg-[#EA580C] text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-xs"
                )}
              >
                <span className="text-xs">{g.label}</span>
                <span className={cx("text-[9px] mt-0.5", isSelected ? "text-[#FED7AA]" : "opacity-60")}>
                  {g.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3 Somatotype Buttons */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Body Type (Metabolic Calibration):</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
              {profile.bodyType || 'mesomorph'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ectomorph' as const, label: 'Ectomorph', desc: 'Lean / Fast Burn' },
              { id: 'mesomorph' as const, label: 'Mesomorph', desc: 'Athletic / Balanced' },
              { id: 'endomorph' as const, label: 'Endomorph', desc: 'Broad / Carb-Sens' }
            ].map(bt => {
              const isSelected = (profile.bodyType || 'mesomorph') === bt.id;
              return (
                <button
                  key={bt.id}
                  onClick={() => {
                    setProfile(prev => ({ ...prev, bodyType: bt.id }));
                    haptic.selection();
                    notify(`Updated to ${bt.label} metabolism`);
                  }}
                  className={cx(
                    "p-2 rounded-xl text-left border transition cursor-pointer active:scale-95",
                    isSelected
                      ? "border-[#EA580C] bg-[#FFFBF5] dark:bg-[#231811] text-[#9A3412] dark:text-[#FED7AA] font-bold"
                      : "border-[#EEDEC1] dark:border-[#3A291E] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#231811]"
                  )}
                >
                  <div className="text-[11px] font-bold leading-tight">{bt.label}</div>
                  <div className="text-[9px] opacity-75">{bt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Horizontal 7-Day Date Selector Strip */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-3 sm:p-4 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            August 2025 • Daily Kitchen Schedule
          </span>
          <button
            onClick={() => {
              haptic.light();
              setMealPlan(generateDailyMealPlan(profile, macroGoals.calories, activeDateIndex + Math.floor(Math.random() * 5 + 1)));
              notify("Shuffled with fresh regional recipes!");
            }}
            className="flex items-center space-x-1 text-xs font-bold text-[#9A3412] dark:text-[#FED7AA] hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Shuffle Dishes</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((item, idx) => {
            const isSelected = idx === activeDateIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveDateIndex(idx);
                  haptic.selection();
                }}
                className={cx(
                  "py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer active:scale-95",
                  isSelected 
                    ? "bg-[#EA580C] text-white font-bold shadow-xs" 
                    : "bg-[#f8faf8] dark:bg-[#19120E] text-slate-700 dark:text-slate-300 hover:bg-[#FEF3C7] dark:hover:bg-[#261B14]"
                )}
              >
                <span className={cx("text-[10px] font-medium", isSelected ? "text-[#FED7AA]" : "text-slate-400")}>
                  {item.day}
                </span>
                <span className={cx("text-sm font-bold mt-0.5", isSelected ? "text-white" : "text-slate-800 dark:text-slate-200")}>
                  {item.date}
                </span>
                <span className={cx("w-1.5 h-1.5 rounded-full mt-1", isSelected ? "bg-[#FED7AA]" : "bg-transparent")} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. The 5 Indian Meal Deck */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA]" />
              <span>Today's Indian Fitness Meal Plan</span>
            </h3>
            <p className="text-xs text-slate-400">
              5 authentic Indian nutrition slots • {mealPlan.totalCalories} kcal planned
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {Object.values(eatenMeals).filter(Boolean).length} of 5 completed
          </span>
        </div>

        {renderIndianMealCards()}
      </div>

    </div>
  );

  // ========================================================
  // RENDER: Desktop Companion Sidebar
  // ========================================================
  const renderDesktopCompanionSidebar = () => (
    <div className="space-y-5">
      
      {/* 1. Fasting Tracker Live Ring Widget */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Intermittent Fasting
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA]">
            16:8 Protocol
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#34251B]">
          <div>
            <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Status</div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              14h 22m fasted
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-500 font-semibold mt-0.5">
              🔥 Ketosis & Autophagy Zone
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('fasting')}
            className="px-3 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
          >
            Fasting Hub
          </button>
        </div>
      </div>

      {/* 2. Weight & Somatotype Telemetry */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Body Telemetry
            </h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">
              Target: {shownWeight(targetWeight)} {weightUnit}
            </span>
            <button 
              onClick={() => {
                setWeightUnit(prev => prev === 'kg' ? 'lb' : 'kg');
                haptic.selection();
              }}
              className="px-1.5 py-0.5 rounded-md bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] text-[10px] font-bold cursor-pointer"
              title="Toggle kg/lb unit"
            >
              {weightUnit.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {shownWeight(profile.weightKg)}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1.5">{weightUnit}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-500">
              -3.4 kg past 30 days
            </span>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">BMI: 22.6 (Healthy)</div>
          </div>
        </div>

        {/* Quick Weight Slider */}
        <div className="space-y-1 pt-1">
          <input 
            type="range"
            min={50}
            max={100}
            step={0.1}
            value={profile.weightKg}
            onChange={(e) => setProfile(prev => ({ ...prev, weightKg: parseFloat(e.target.value) }))}
            className="w-full accent-[#EA580C] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>50 kg</span>
            <span>Current: {profile.weightKg} kg</span>
            <span>100 kg</span>
          </div>
        </div>
      </div>

      {/* 3. Quick AI Personal Nutritionist Assistant Widget */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              AI Desi Nutritionist
            </h3>
          </div>
          <button 
            onClick={() => setActiveScreen('coach')}
            className="text-xs font-bold text-[#9A3412] dark:text-[#FED7AA] hover:underline"
          >
            Open Full Chat
          </button>
        </div>

        <div className="space-y-2">
          {[
            'How to hit 120g protein on pure veg diet?',
            'Roti vs Rice for weight loss?',
            'Is Sattu better than Whey protein?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => setActiveScreen('coach')}
              className="w-full text-left p-2.5 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#34251B] hover:border-[#EA580C] text-xs font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center justify-between group"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#EA580C]" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Quick Smart Grocery Hub Trigger */}
      <div className="p-4 rounded-3xl bg-[#FEF3C7] dark:bg-[#241811] border border-[#FED7AA] dark:border-[#3A281E] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Smart Grocery List</div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">1-Click WhatsApp & Blinkit Export</div>
          </div>
        </div>
        <button
          onClick={() => setActiveScreen('grocery')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#2D2018] border border-[#EEDEC1] dark:border-[#3A2A1F] text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs hover:border-[#EA580C] transition cursor-pointer"
        >
          View List
        </button>
      </div>

    </div>
  );

  // ========================================================
  // RENDER: Statistics / Analytics Screen
  // ========================================================
  const renderStatisticScreen = (_isDual = false) => (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Macro & Energy Telemetry
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">7-Day Calorie Balance & Body Transformation</p>
        </div>
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Back to Plan
        </button>
      </div>

      {/* Calorie Balance Summary */}
      <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Daily Intake</span>
            <div className="text-3xl font-black text-[#7C2D12] dark:text-white mt-0.5">
              1,840 <span className="text-sm font-normal text-slate-600 dark:text-slate-300 font-bold">kcal/day</span>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA]">
            -420 kcal Deficit (On Track)
          </span>
        </div>

        {/* 7-Day Chart Bars */}
        <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 border-b border-slate-100 dark:border-[#2D2018] pb-2">
          {[
            { day: 'Mon', pct: 85, kcal: 1780 },
            { day: 'Tue', pct: 90, kcal: 1890 },
            { day: 'Wed', pct: 98, kcal: 2050, peak: true },
            { day: 'Thu', pct: 88, kcal: 1840 },
            { day: 'Fri', pct: 82, kcal: 1720 },
            { day: 'Sat', pct: 95, kcal: 1980 },
            { day: 'Sun', pct: 78, kcal: 1640 },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-end h-full space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400">{item.kcal}</span>
              <div 
                className={cx(
                  "w-full rounded-t-xl transition-all duration-500",
                  item.peak ? "bg-[#EA580C] shadow-xs" : "bg-[#EEDEC1] dark:bg-[#3A291E]"
                )}
                style={{ height: `${item.pct}%` }}
              />
              <span className={cx("text-xs font-semibold", item.peak ? "text-[#9A3412] dark:text-[#FED7AA] font-bold" : "text-slate-400")}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div 
          onClick={() => setActiveScreen('workouts')}
          className="p-4 rounded-3xl bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs flex items-center justify-between cursor-pointer hover:border-[#EA580C] transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] dark:bg-[#251912] text-amber-700 dark:text-amber-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Workouts</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">450 kcal burned</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div 
          onClick={() => setActiveScreen('account')}
          className="p-4 rounded-3xl bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs flex items-center justify-between cursor-pointer hover:border-[#EA580C] transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fef6e7] dark:bg-[#2b2214] text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Body Weight</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{profile.weightKg} kg (68.4 kg)</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

    </div>
  );

  // ========================================================
  // RENDER: Desktop Top Navigation Bar
  // ========================================================
  const renderDesktopTopNav = () => (
    <header className="bg-white/90 dark:bg-[#1C1511]/90 backdrop-blur-xl border border-[#EEDEC1] dark:border-[#3A291E] rounded-3xl px-6 py-3 flex items-center justify-between shadow-xs select-none">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <img 
          src="/app-icon.png" 
          alt="NutriFit Logo" 
          className="w-9 h-9 rounded-2xl object-cover border border-[#EEDEC1] dark:border-[#2f4034] shadow-xs" 
        />
        <div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">NutriFit</span>
          <span className="text-slate-600 dark:text-slate-300 font-semibold text-xs ml-2 hidden sm:inline">
            Botanical Culinary • AI Indian Meal Planner
          </span>
        </div>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden md:flex items-center space-x-1 bg-[#f8faf8] dark:bg-[#19120E] p-1 rounded-2xl border border-[#EEDEC1] dark:border-[#34251B]">
        {[
          { id: 'dashboard', label: 'Today Plan' },
          { id: 'statistic', label: 'Analytics' },
          { id: 'grocery', label: 'Smart Pantry' },
          { id: 'coach', label: 'AI Coach' },
          { id: 'fasting', label: 'Fasting' },
          { id: 'recipes', label: 'Recipes' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveScreen(item.id);
              haptic.selection();
            }}
            className={cx(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
              activeScreen === item.id 
                ? "bg-[#EA580C] text-white shadow-xs" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Controls: Streak, Simulator Toggle, Theme, Clerk Auth */}
      <div className="flex items-center space-x-2.5">
        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] text-xs font-bold">
          <Flame className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
          <span>5d Streak</span>
        </div>

        {/* View Mode Toggle: Responsive Dashboard vs Phone Simulator */}
        <button
          onClick={() => {
            const next = desktopMode === 'responsive' ? 'mobile_preview' : 'responsive';
            setDesktopMode(next);
            notify(`Switched to ${next === 'responsive' ? 'Responsive Web' : 'Phone Simulator'} mode`);
          }}
          className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#EEDEC1] dark:border-[#3A2A1F] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#251C17] transition cursor-pointer"
          title="Toggle view mode"
        >
          {desktopMode === 'responsive' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          <span>{desktopMode === 'responsive' ? 'Phone Preview' : 'Full Web'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => {
            const next = theme === 'dark' ? 'light' : 'dark';
            setTheme(next);
            haptic.selection();
            notify(`Switched to ${next} theme.`);
          }}
          className="w-9 h-9 rounded-xl bg-white dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        <SafeUserButton userAvatar={userAvatar} userName={profile.name} />
      </div>
    </header>
  );

  // ========================================================
  // RENDER: Mobile Floating Navigation Bar
  // ========================================================
  const renderMobileBottomNav = () => (
    <nav 
      className="floating-nav flex items-center justify-around fixed bottom-3 inset-x-3 max-w-[420px] mx-auto z-40 bg-white/95 dark:bg-[#1C1511]/95 backdrop-blur-xl border border-[#EEDEC1] dark:border-[#3A291E] rounded-3xl py-2 px-3 shadow-xl"
      aria-label="Bottom Navigation"
    >
      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('dashboard');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
          activeScreen === 'dashboard' ? 'text-[#9A3412] dark:text-[#FED7AA] font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
        )}
      >
        <Home className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px]">Today</span>
      </button>

      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('statistic');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
          activeScreen === 'statistic' ? 'text-[#9A3412] dark:text-[#FED7AA] font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
        )}
      >
        <BarChart3 className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px]">Analytics</span>
      </button>

      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('scanner');
        }}
        className="w-11 h-11 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-md active:scale-95 transition -mt-5 cursor-pointer"
        aria-label="Scan food"
      >
        <Scan className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('coach');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
          activeScreen === 'coach' ? 'text-[#9A3412] dark:text-[#FED7AA] font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
        )}
      >
        <Bot className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px]">AI Coach</span>
      </button>

      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('menu');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
          activeScreen === 'menu' ? 'text-[#9A3412] dark:text-[#FED7AA] font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
        )}
      >
        <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[10px]">Tools</span>
      </button>
    </nav>
  );

  return (
    <div id="morrow-app" data-theme={theme} className="min-h-screen bg-[#FFFBF5] dark:bg-[#130E0C] text-slate-900 dark:text-white pb-20">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#EA580C] text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#FED7AA]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Clerk User Synchronization */}
      {isClerkConfigured && (
        <SafeSignedIn>
          <ClerkUserSync 
            onUserLoaded={(name, avatar) => {
              if (name && name !== profile.name) {
                setProfile(prev => ({ ...prev, name }));
              }
              if (avatar) {
                setUserAvatar(avatar);
              }
            }} 
          />
        </SafeSignedIn>
      )}

      {/* ========================================================
          DESKTOP RESPONSIVE LAYOUT (Default on Large Screens)
          ======================================================== */}
      {desktopMode === 'responsive' && (
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-6 space-y-6">
          {renderDesktopTopNav()}

          {activeScreen === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 space-y-6">
                {renderHomeScreen(false)}
              </div>
              <div className="col-span-4 space-y-6">
                {renderDesktopCompanionSidebar()}
              </div>
            </div>
          )}

          {activeScreen === 'statistic' && (
            <div className="max-w-4xl mx-auto">
              {renderStatisticScreen(false)}
            </div>
          )}

          {activeScreen === 'grocery' && (
            <div className="max-w-4xl mx-auto">
              <GroceryList mealPlan={mealPlan} onNotify={notify} />
            </div>
          )}

          {activeScreen === 'coach' && (
            <div className="max-w-3xl mx-auto">
              <AICoach profile={profile} macroGoals={macroGoals} />
            </div>
          )}

          {activeScreen === 'fasting' && (
            <div className="max-w-3xl mx-auto">
              <FastingTimer fastingState={fastingState} setFastingState={setFastingState} />
            </div>
          )}

          {activeScreen === 'recipes' && (
            <div className="max-w-4xl mx-auto">
              {/* Recipe browser */}
              <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-6 border border-[#EEDEC1] dark:border-[#3A291E] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">50+ Authentic Indian Fitness Recipes</h3>
                  <span className="text-xs text-slate-400">Curated with macros</span>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    placeholder="Search dal, paneer, oats, chilla, khichdi, sattu..."
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
                {/* Category Filter Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'All Recipes' },
                    { id: 'high-protein', label: 'High Protein (15g+)' },
                    { id: 'quick', label: 'Under 10 mins' },
                    { id: 'north', label: 'North Indian' },
                    { id: 'south', label: 'South Indian' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setRecipeFilter(cat.id)}
                      className={cx(
                        "px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shrink-0",
                        recipeFilter === cat.id
                          ? "bg-[#EA580C] text-white shadow-xs"
                          : "bg-[#f8faf8] dark:bg-[#19120E] text-slate-600 dark:text-slate-400 border border-[#EEDEC1] dark:border-[#34251B] hover:border-[#EA580C]"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredRecipes.map((food) => (
                    <div 
                      key={food.id}
                      onClick={() => setSelectedRecipe(food)}
                      className="p-3 bg-[#f8faf8] dark:bg-[#19120E] rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E] hover:border-[#EA580C] transition cursor-pointer flex items-center space-x-3"
                    >
                      <img src={getIndianFoodImage(food)} alt={food.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{food.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{food.calories} kcal • {food.protein}g Protein</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeScreen === 'menu' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">All Indian Health Tools & AI Companions</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'scanner', title: 'Food Scanner', icon: Camera, desc: 'AI nutrition recognition' },
                  { id: 'grocery', title: 'Smart Grocery', icon: ShoppingBag, desc: '1-click WhatsApp list' },
                  { id: 'coach', title: 'AI Coach', icon: Bot, desc: 'Personal nutritionist' },
                  { id: 'fasting', title: 'Fasting Timer', icon: Timer, desc: '16:8 countdown ring' },
                  { id: 'workouts', title: 'Workouts', icon: Activity, desc: 'Track exercise burn' },
                  { id: 'custom_recipes', title: 'Recipe Builder', icon: SlidersHorizontal, desc: 'Custom dish calculator' },
                  { id: 'swiggy', title: 'Delivery Swaps', icon: Utensils, desc: 'Healthy Swiggy choices' },
                  { id: 'account', title: 'Profile & Settings', icon: User, desc: 'Calibrate your plan' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveScreen(tool.id)}
                    className="p-4 bg-white dark:bg-[#1C1511] rounded-3xl border border-[#EEDEC1] dark:border-[#3A291E] hover:border-[#EA580C] transition text-left cursor-pointer space-y-2 group shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] flex items-center justify-center">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">{tool.title}</div>
                      <div className="text-xs text-slate-400">{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub screens on desktop */}
          {activeScreen === 'scanner' && (
            <div className="max-w-3xl mx-auto">
              <FoodScanner onAddScannedFoodToPlan={(scanned, slot) => {
                notify(`Added ${scanned.foodName} to ${slot}!`);
                setActiveScreen('dashboard');
              }} />
            </div>
          )}

          {activeScreen === 'workouts' && (
            <div className="max-w-3xl mx-auto">
              <WorkoutTracker 
                profile={profile}
                workouts={workouts} 
                onAddWorkout={(w) => setWorkouts([...workouts, w])} 
                onRemoveWorkout={(id: string) => setWorkouts(workouts.filter(w => w.id !== id))} 
              />
            </div>
          )}

          {activeScreen === 'custom_recipes' && (
            <div className="max-w-3xl mx-auto">
              <CustomRecipeBuilder 
                savedRecipes={savedCustomRecipes} 
                onSaveCustomRecipe={(r) => {
                  setSavedCustomRecipes([...savedCustomRecipes, r]);
                  notify(`Saved custom dish ${r.name}!`);
                }} 
              />
            </div>
          )}

          {activeScreen === 'swiggy' && (
            <div className="max-w-3xl mx-auto">
              <SwiggyGuide />
            </div>
          )}

          {activeScreen === 'account' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-6 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={userAvatar} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-[#EA580C]" />
                    <div>
                      <h3 className="font-black text-lg text-slate-900 dark:text-white">{profile.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{profile.age} yrs • {profile.weightKg} kg • {profile.heightCm} cm</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="px-3 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold cursor-pointer hover:bg-[#C2410C] transition shadow-xs">
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                    <button 
                      onClick={resetToProvidedAvatar}
                      className="px-2.5 py-1.5 rounded-xl border border-[#EEDEC1] dark:border-[#3A291E] text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
                      title="Reset Avatar"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-[#2D2018] space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Diet Type</label>
                    <select
                      value={profile.dietType}
                      onChange={(e) => setProfile(prev => ({ ...prev, dietType: e.target.value as any }))}
                      className="w-full p-2.5 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] text-xs font-bold text-slate-800 dark:text-white"
                    >
                      <option value="pure_veg">Pure Vegetarian (Indian Lacto-Veg)</option>
                      <option value="eggetarian">Eggetarian (Veg + Eggs)</option>
                      <option value="non_veg">Non-Vegetarian (Chicken & Fish)</option>
                      <option value="high_protein_veg">High-Protein Veg (Paneer, Tofu, Sattu)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Daily Target</label>
                    <div className="text-xs text-slate-500">
                      Mifflin-St Jeor TDEE: <strong>{macroGoals.calories} kcal</strong> ({macroGoals.proteinGrams}g Protein)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MOBILE VIEW / PHONE SIMULATOR MODE
          ======================================================== */}
      {(desktopMode === 'mobile_preview' || true) && (
        <div className={`phone-shell ${desktopMode === 'mobile_preview' ? 'hidden lg:block phone-simulator-frame mx-auto' : 'lg:hidden'}`}>
          
          {/* Mobile Top App Header */}
          <header className="sticky top-0 z-40 bg-[#FFFBF5]/90 dark:bg-[#130E0C]/90 backdrop-blur-xl border-b border-[#EEDEC1] dark:border-[#2D2018] px-4 py-2.5 flex items-center justify-between safe-top">
            <div className="flex items-center space-x-2.5">
              <img 
                src="/app-icon.png" 
                alt="NutriFit" 
                className="w-8 h-8 rounded-xl object-cover border border-[#EEDEC1] dark:border-[#3A291E]" 
              />
              <div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">NutriFit</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold block leading-none">Indian AI Planner</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] text-[11px] font-bold">
                <Flame className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                <span>5d</span>
              </div>

              <button 
                onClick={() => {
                  const next = theme === 'dark' ? 'light' : 'dark';
                  setTheme(next);
                  haptic.selection();
                  notify(`Switched to ${next} theme.`);
                }}
                className="w-8 h-8 rounded-full bg-white dark:bg-[#231811] border border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-center text-slate-700 dark:text-slate-200 transition"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              </button>

              <button 
                onClick={() => setActiveScreen('account')}
                className="w-8 h-8 rounded-full overflow-hidden border border-[#EA580C]"
              >
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              </button>
            </div>
          </header>

          {/* Mobile Main Body */}
          <main className="px-4 pt-3 pb-28 space-y-4">
            {activeScreen === 'dashboard' && renderHomeScreen(false)}
            {activeScreen === 'statistic' && renderStatisticScreen(false)}
            
            {activeScreen === 'scanner' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <FoodScanner onAddScannedFoodToPlan={(scanned, slot) => {
                  notify(`Added ${scanned.foodName} to ${slot}!`);
                  setActiveScreen('dashboard');
                }} />
              </div>
            )}

            {activeScreen === 'coach' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <AICoach profile={profile} macroGoals={macroGoals} />
              </div>
            )}

            {activeScreen === 'grocery' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <GroceryList mealPlan={mealPlan} onNotify={notify} />
              </div>
            )}

            {activeScreen === 'fasting' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <FastingTimer fastingState={fastingState} setFastingState={setFastingState} />
              </div>
            )}

            {activeScreen === 'workouts' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <WorkoutTracker 
                  profile={profile}
                  workouts={workouts} 
                  onAddWorkout={(w) => setWorkouts([...workouts, w])} 
                  onRemoveWorkout={(id: string) => setWorkouts(workouts.filter(w => w.id !== id))} 
                />
              </div>
            )}

            {activeScreen === 'custom_recipes' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('menu')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Menu</span>
                </button>
                <CustomRecipeBuilder 
                  savedRecipes={savedCustomRecipes} 
                  onSaveCustomRecipe={(r) => {
                    setSavedCustomRecipes([...savedCustomRecipes, r]);
                    notify(`Saved custom dish ${r.name}!`);
                  }} 
                />
              </div>
            )}

            {activeScreen === 'swiggy' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('menu')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Menu</span>
                </button>
                <SwiggyGuide />
              </div>
            )}

            {activeScreen === 'recipes' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-4 border border-[#EEDEC1] dark:border-[#3A291E] space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Indian Recipe Library</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text"
                      placeholder="Search paneer, dal, oats, chilla..."
                      value={recipeSearch}
                      onChange={(e) => setRecipeSearch(e.target.value)}
                      className="w-full bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 max-h-[460px] overflow-y-auto">
                    {filteredRecipes.map((food) => (
                      <div 
                        key={food.id}
                        onClick={() => setSelectedRecipe(food)}
                        className="p-2.5 bg-[#f8faf8] dark:bg-[#19120E] rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img src={getIndianFoodImage(food)} alt={food.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">{food.name}</div>
                            <div className="text-[10px] text-slate-400">{food.calories} kcal • {food.protein}g Protein</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeScreen === 'menu' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
                  AI Indian Tools & Companions
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'scanner', title: 'Food Scanner', icon: Camera, desc: 'Camera AI log' },
                    { id: 'grocery', title: 'Smart Pantry', icon: ShoppingBag, desc: '1-click WhatsApp' },
                    { id: 'coach', title: 'AI Coach', icon: Bot, desc: 'Desi nutritionist' },
                    { id: 'fasting', title: 'Fasting Timer', icon: Timer, desc: '16:8 countdown' },
                    { id: 'workouts', title: 'Workouts', icon: Activity, desc: 'Exercise burn' },
                    { id: 'recipes', title: 'Recipes', icon: ChefHat, desc: '50+ Indian meals' },
                    { id: 'custom_recipes', title: 'Recipe Builder', icon: SlidersHorizontal, desc: 'Custom macros' },
                    { id: 'swiggy', title: 'Delivery Swaps', icon: Utensils, desc: 'Healthy orders' },
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveScreen(tool.id);
                        haptic.selection();
                      }}
                      className="p-3.5 bg-white dark:bg-[#1C1511] rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E] text-left cursor-pointer space-y-1.5 shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] flex items-center justify-center">
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{tool.title}</div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">{tool.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveScreen('account')}
                  className="w-full p-3.5 bg-white dark:bg-[#1C1511] rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between text-left cursor-pointer mt-2"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">Profile & Target Calibration</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}

            {activeScreen === 'account' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('menu')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Menu</span>
                </button>

                <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-5 border border-[#EEDEC1] dark:border-[#3A291E] shadow-xs space-y-4">
                  <div className="flex items-center space-x-3">
                    <img src={userAvatar} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-[#EA580C]" />
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">{profile.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{profile.age} yrs • {profile.weightKg} kg • {profile.heightCm} cm</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#2D2018]">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">Diet Preference</label>
                      <select
                        value={profile.dietType}
                        onChange={(e) => setProfile(prev => ({ ...prev, dietType: e.target.value as any }))}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] text-xs font-bold text-slate-800 dark:text-white"
                      >
                        <option value="pure_veg">Pure Vegetarian (Lacto-Veg)</option>
                        <option value="eggetarian">Eggetarian</option>
                        <option value="non_veg">Non-Vegetarian</option>
                        <option value="high_protein_veg">High-Protein Vegetarian</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Mifflin-St Jeor Target</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{macroGoals.calories} kcal ({macroGoals.proteinGrams}g Protein)</div>
                      </div>
                      <span className="text-xs font-bold text-[#9A3412] dark:text-[#FED7AA]">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Floating Mobile Bottom Nav */}
          {renderMobileBottomNav()}
        </div>
      )}

      {/* ========================================================
          GLOBAL MODALS
          ======================================================== */}
      {/* 1. Recipe Detail Modal */}
      <RecipeModal 
        food={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onStartCookMode={(food) => {
          setSelectedRecipe(null);
          setCookingFood(food);
          setIsCookModeOpen(true);
        }}
      />

      {/* 2. Indian Alternative Meal Swapper Modal */}
      <MealSwapperModal 
        slot={swappingSlot}
        currentFood={swappingSlot ? mealPlan.meals[swappingSlot] : null}
        profile={profile}
        onClose={() => setSwappingSlot(null)}
        onSelectFood={(slot, item) => {
          setMealPlan(prev => ({
            ...prev,
            meals: {
              ...prev.meals,
              [slot]: item
            }
          }));
          notify(`Swapped with ${item.name}!`);
        }}
      />

      {/* 3. Hands-Free Kitchen Cooking Mode Modal */}
      <HandsFreeCookingModal 
        food={cookingFood}
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        onCompleted={() => {
          if (cookingFood) {
            setEatenMeals(prev => ({ ...prev, [cookingFood.slot]: true }));
            notify(`Celebration! You finished cooking & logged ${cookingFood.name}!`);
          }
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppClerkProvider>
      <AppContent />
    </AppClerkProvider>
  );
}
