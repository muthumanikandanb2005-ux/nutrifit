import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { 
  UserProfile, MealSlot, FoodItem, DailyMealPlan, 
  WorkoutEntry, FastingState, CustomRecipe,
  WeightEntry, StepsLogEntry
} from './types';
import { calculateMacroGoals } from './utils/nutritionCalculator';
import { generateDailyMealPlan } from './utils/mealPlanGenerator';
import { INDIAN_FOOD_DATABASE } from './data/indianFoodDatabase';
import { getIndianFoodImage } from './utils/indianFoodImages';
import { initializeAndroidSystem, setupAndroidBackButton } from './utils/androidPlatform';
import { AppClerkProvider, useClerkAuth } from './components/ClerkAuthProvider';
import { SafeSignedIn } from './components/SafeClerkComponents';
import { RecipeModal } from './components/RecipeModal';
import { PlanComparisonModal } from './components/PlanComparisonModal';
import { ProfileModal } from './components/ProfileModal';
import { MealSwapperModal } from './components/MealSwapperModal';
import { HandsFreeCookingModal } from './components/HandsFreeCookingModal';
import { GroceryList } from './components/GroceryList';
import { FoodScanner } from './components/FoodScanner';
import { FastingTimer } from './components/FastingTimer';
import { WorkoutTracker } from './components/WorkoutTracker';
import { AICoach } from './components/AICoach';
import { SwiggyGuide } from './components/SwiggyGuide';
import { CustomRecipeBuilder } from './components/CustomRecipeBuilder';
import { WaterTracker } from './components/WaterTracker';
import { StepsTracker } from './components/StepsTracker';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { FridgeAI } from './components/FridgeAI';
import { SupplementGuide } from './components/SupplementGuide';
import { Analytics } from './components/Analytics';
import { OTAUpdateModal } from './components/OTAUpdateModal';
import { CURRENT_COMMIT, CURRENT_APP_VERSION } from './utils/otaUpdate';
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
  ChevronRight, 
  ChevronLeft,
  MoreHorizontal,
  Plus,
  Heart,
  Award,
  Star,
  FileText,
  Bell,
  Wifi,
  Sparkles, 
  Sun, 
  Moon, 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Bot, 
  Timer, 
  User, 
  ChefHat, 
  Smartphone, 
  Monitor,
  Dumbbell,
  Upload,
  Footprints,
  Calendar,
  Refrigerator,
  Pill,
  CloudDownload,
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

  // Desktop Layout Mode: 'dual_mockup' (side-by-side matching screenshot) | 'single_phone' | 'responsive'
  const [desktopMode, setDesktopMode] = useState<'dual_mockup' | 'single_phone' | 'responsive'>(() => {
    const saved = localStorage.getItem('nutrifit_desktop_mode');
    return (saved === 'dual_mockup' || saved === 'single_phone' || saved === 'responsive') ? saved : 'dual_mockup';
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

  const weightLossMacros = useMemo(() => {
    return calculateMacroGoals({ ...profile, goal: 'fat_loss' });
  }, [profile]);

  const maintainMacros = useMemo(() => {
    return calculateMacroGoals({ ...profile, goal: 'maintenance' });
  }, [profile]);

  const weightGainMacros = useMemo(() => {
    return calculateMacroGoals({ ...profile, goal: 'muscle_gain' });
  }, [profile]);

  // Extended Goals & Metrics
  const targetWeight = profile.targetWeightKg || 65.0;
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [waterAmount, setWaterAmount] = useState<number>(2400); // 12 glasses (200ml each)

  // Weight Tracker telemetry state with localStorage persistence
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('nutrifit_weight_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { date: '15 Aug', weightKg: 71.5, bmi: 23.9 },
      { date: '18 Aug', weightKg: 70.8, bmi: 23.6 },
      { date: '21 Aug', weightKg: 70.2, bmi: 23.4 },
      { date: '24 Aug', weightKg: 69.8, bmi: 23.3 },
      { date: '27 Aug', weightKg: 69.1, bmi: 23.1 },
      { date: '30 Aug', weightKg: 68.4, bmi: 22.8 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('nutrifit_weight_logs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  const handleAddWeightLog = (entry: WeightEntry) => {
    setWeightLogs(prev => [...prev, entry]);
    setProfile(prev => ({ ...prev, weightKg: entry.weightKg }));
    notify(`Logged weight check-in: ${entry.weightKg} kg!`);
  };

  // Steps / Pedometer Tracker state with localStorage persistence
  const [stepsLogs, setStepsLogs] = useState<StepsLogEntry[]>(() => {
    const saved = localStorage.getItem('nutrifit_steps_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'step_demo_1',
        date: 'Today',
        time: '07:15 AM',
        title: 'Morning Strava Walk & Jog',
        steps: 4250,
        distanceKm: 3.1,
        caloriesBurned: 185,
        durationMins: 35,
        avgPaceMinutesPerKm: 6.2,
        activityType: 'walk',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nutrifit_steps_logs', JSON.stringify(stepsLogs));
  }, [stepsLogs]);

  const handleAddStepsLog = (entry: StepsLogEntry) => {
    setStepsLogs(prev => [entry, ...prev]);
    notify(`Saved activity: ${entry.title} (${entry.steps} steps)!`);
  };

  // Calendar Week Strip State (matches screenshot: S 07, M 08, T 09, W 10 [selected], T 11, F 12, S 13)
  const [activeDateIndex, setActiveDateIndex] = useState<number>(3); // 3 = Wednesday 10th
  const weekDays = [
    { day: 'S', date: '07' },
    { day: 'M', date: '08' },
    { day: 'T', date: '09' },
    { day: 'W', date: '10' },
    { day: 'T', date: '11' },
    { day: 'F', date: '12' },
    { day: 'S', date: '13' },
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
  const [isPlanCompareModalOpen, setIsPlanCompareModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOTAModalOpen, setIsOTAModalOpen] = useState(false);

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
  // RENDER: Phone Status Bar with Dynamic Island
  // ========================================================
  const renderPhoneStatusBar = () => (
    <div className="pt-3 px-6 pb-2 flex items-center justify-between text-slate-900 dark:text-white select-none shrink-0 z-20">
      <span className="text-xs font-bold tracking-tight">9:41</span>
      <div className="w-24 h-5 bg-black rounded-full mx-auto" />
      <div className="flex items-center space-x-1.5 text-xs">
        <span className="text-[10px] font-bold">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
          <div className="w-full h-full bg-current rounded-2xs" />
        </div>
      </div>
    </div>
  );

  // ========================================================
  // RENDER: Home Screen / Daily Dashboard (Exact Mockup Match)
  // ========================================================
  const renderHomeScreen = (_isDual = false) => {
    return (
      <main className="px-5 py-2 space-y-4 flex-1 animate-in fade-in duration-200">
        {/* 1. Top User Header Bar */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <div 
            onClick={() => {
              setIsProfileModalOpen(true);
              haptic.selection();
            }}
            className="flex items-center space-x-3 cursor-pointer group"
            title="Edit Profile & Body Metrics"
          >
            <img 
              src={userAvatar} 
              alt={profile.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-[#1C1511] shadow-xs group-hover:scale-105 transition"
            />
            <div>
              <div className="text-xs text-slate-400 font-medium">Good morning!</div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {profile.name || 'Sajibur Rahman'}
              </h1>
            </div>
          </div>

          {/* Right Action Icons: Recipe Library & Bell Notification */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                setActiveScreen('recipes');
                haptic.selection();
              }}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-[#28201b] transition active:scale-95 cursor-pointer"
              title="Indian Recipe Library"
            >
              <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
            <button 
              onClick={() => {
                notify("You are on track with today's calorie budget!");
                haptic.light();
              }}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-[#28201b] transition active:scale-95 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="w-2 h-2 rounded-full bg-[#ff723b] absolute top-2.5 right-2.5 ring-2 ring-white dark:ring-[#1C1511]" />
            </button>
          </div>
        </div>

        {/* 2. Hero Card: "Your Weekly Progress" (Exact Lime Style) */}
        <section className="hero-lime rounded-[28px] p-5 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="space-y-2.5 z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-black/30 text-[#1b2b0a] dark:text-[#d8f58c] text-[11px] font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1b2b0a] dark:text-[#d8f58c]" />
              <span>Daily intake</span>
            </div>
            <h2 className="text-[22px] font-black text-[#1b2b0a] dark:text-white leading-tight max-w-[150px]">
              Your Weekly<br />Progress
            </h2>
          </div>

          {/* Circular Progress Ring: 6 days */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0 z-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              {/* Inner white circle disk */}
              <circle cx="38" cy="38" r="30" fill="#ffffff" />
              {/* Background Track */}
              <circle
                cx="38"
                cy="38"
                r="26"
                fill="transparent"
                stroke="#e2f79f"
                strokeWidth="6"
              />
              {/* Active Lime Progress Arc */}
              <circle
                cx="38"
                cy="38"
                r="26"
                fill="transparent"
                stroke="#8fd12a"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - 6/7)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1b2b0a] pointer-events-none">
              <span className="text-2xl font-black leading-none">6</span>
              <span className="text-[10px] font-bold text-[#1b2b0a]/75 mt-0.5">days</span>
            </div>
          </div>
        </section>

        {/* 3. 2-Column Quick Metric Cards: Steps & Water */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Step to walk Card */}
          <div 
            onClick={() => {
              setActiveScreen('steps');
              haptic.selection();
            }}
            className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug">
                Step to<br />walk
              </span>
              <div className="w-8 h-8 rounded-full bg-[#fff0eb] text-[#ff6838] flex items-center justify-center shrink-0">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                5,500
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">steps</span>
            </div>
          </div>

          {/* Drink Water Card */}
          <div 
            onClick={() => {
              setWaterAmount(prev => prev + 200);
              haptic.medium();
              notify("Logged 1 glass of water (+200ml)!");
            }}
            className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug">
                Drink<br />Water
              </span>
              <div className="w-8 h-8 rounded-full bg-[#e8f6fd] text-[#0ea5e9] flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                12
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">glass</span>
            </div>
          </div>
        </div>

        {/* 4. Horizontal 7-Day Date Selector Strip */}
        <section className="bg-white dark:bg-[#1C1511] rounded-[26px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              August 2025
            </span>
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => {
                  setActiveDateIndex(prev => (prev > 0 ? prev - 1 : 6));
                  haptic.selection();
                }}
                className="w-7 h-7 rounded-full bg-[#f1f3ec] dark:bg-[#28201b] hover:bg-[#e4e7dd] text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setActiveDateIndex(prev => (prev < 6 ? prev + 1 : 0));
                  haptic.selection();
                }}
                className="w-7 h-7 rounded-full bg-[#f1f3ec] dark:bg-[#28201b] hover:bg-[#e4e7dd] text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                aria-label="Next day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
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
                    "py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95",
                    isSelected 
                      ? "bg-[#d8f572] text-[#1b2b0a] font-bold shadow-xs" 
                      : "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#28201b]"
                  )}
                >
                  <span className={cx("text-xs font-semibold", isSelected ? "text-[#1b2b0a]" : "text-slate-400")}>
                    {item.day}
                  </span>
                  <span className={cx("text-sm font-bold mt-1", isSelected ? "text-[#1b2b0a]" : "text-slate-900 dark:text-white")}>
                    {item.date}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Meal Cards List (Breakfast, Lunch time, Snacks, Dinner) */}
        <section className="space-y-3 pt-1">
          {[
            { slot: 'breakfast' as const, label: 'Breakfast', calRange: '456 - 512 kcal', item: mealPlan.meals.breakfast },
            { slot: 'lunch' as const, label: 'Lunch time', calRange: '456 - 512 kcal', item: mealPlan.meals.lunch },
            { slot: 'snack' as const, label: 'Snack time', calRange: '210 - 280 kcal', item: mealPlan.meals.snack },
            { slot: 'dinner' as const, label: 'Dinner', calRange: '420 - 480 kcal', item: mealPlan.meals.dinner }
          ].map((mealRow) => {
            const dish = mealRow.item;
            const secondaryDish = INDIAN_FOOD_DATABASE.find(f => f.slot === mealRow.slot && f.id !== dish?.id) || dish;
            const isEaten = eatenMeals[mealRow.slot];

            return (
              <div 
                key={mealRow.slot}
                className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex items-center justify-between"
              >
                <div 
                  onClick={() => {
                    if (dish) {
                      setSelectedRecipe(dish);
                      haptic.selection();
                    }
                  }}
                  className="cursor-pointer group flex-1 pr-2"
                >
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                      {mealRow.label}
                    </h4>
                    {isEaten && (
                      <span className="w-2 h-2 rounded-full bg-[#8fd12a]" title="Logged as eaten" />
                    )}
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#fef6e7] dark:bg-[#2b2214] text-slate-600 dark:text-slate-300 text-[11px] font-semibold mt-1">
                    <Flame className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                    <span>{mealRow.calRange}</span>
                  </div>
                  {dish && (
                    <div className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                      {dish.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {dish && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMealEaten(mealRow.slot);
                      }}
                      className="flex items-center -space-x-3 cursor-pointer"
                      title={isEaten ? `${dish.name} (Eaten - click to unmark)` : `${dish.name} (Click to mark eaten)`}
                    >
                      <img 
                        src={getIndianFoodImage(dish)} 
                        alt={dish.name} 
                        className={cx(
                          "w-10 h-10 rounded-full object-cover border-2 shadow-xs transition",
                          isEaten ? "border-[#8fd12a] ring-2 ring-[#8fd12a]/40" : "border-white dark:border-[#1C1511]"
                        )}
                      />
                      {secondaryDish && (
                        <img 
                          src={getIndianFoodImage(secondaryDish)} 
                          alt={secondaryDish.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#1C1511] shadow-xs" 
                        />
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      haptic.selection();
                      setSwappingSlot(mealRow.slot);
                    }}
                    className="w-8 h-8 rounded-full bg-[#f1f3ec] dark:bg-[#28201b] hover:bg-[#e4e7dd] dark:hover:bg-[#342a24] text-slate-700 dark:text-slate-200 flex items-center justify-center transition active:scale-95 cursor-pointer"
                    title={`Swap or customize ${mealRow.label}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* 6. Dedicated 3-Diet Protocols (Weight Loss, Maintain, Weight Gain) */}
        <section className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Diet Protocol
            </span>
            <button
              onClick={() => setIsPlanCompareModalOpen(true)}
              className="text-[11px] font-bold text-[#EA580C] hover:underline cursor-pointer"
            >
              Compare All 3 →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'fat_loss' as const, label: 'Weight Loss', desc: `${weightLossMacros.calories} kcal (-20%)` },
              { id: 'maintenance' as const, label: 'Maintain', desc: `${maintainMacros.calories} kcal (TDEE)` },
              { id: 'muscle_gain' as const, label: 'Weight Gain', desc: `${weightGainMacros.calories} kcal (+15%)` }
            ].map((p) => {
              const isSelected = profile.goal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setProfile(prev => ({ ...prev, goal: p.id }));
                    haptic.selection();
                    notify(`Switched to ${p.label}!`);
                  }}
                  className={cx(
                    "p-2 rounded-xl text-center transition cursor-pointer active:scale-95 border",
                    isSelected
                      ? "bg-[#EA580C] border-[#EA580C] text-white font-bold shadow-xs"
                      : "bg-[#f8faf8] dark:bg-[#19120E] border-[#edf0e8] dark:border-[#33251c] text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  )}
                >
                  <div className="text-xs">{p.label}</div>
                  <div className={cx("text-[9px]", isSelected ? "text-[#FED7AA]" : "opacity-60")}>{p.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 7. Quick Tool Launchpad */}
        <section className="bg-white dark:bg-[#1C1511] rounded-[24px] p-3.5 border border-[#edf0e8] dark:border-[#33251c] shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { id: 'fridge', label: 'Fridge AI', icon: Refrigerator },
              { id: 'weekly', label: '7-Day Plan', icon: Calendar },
              { id: 'fasting', label: 'Fasting', icon: Timer },
              { id: 'supplements', label: 'Supplements', icon: Pill },
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveScreen(tool.id);
                  haptic.selection();
                }}
                className="p-2 rounded-xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#edf0e8] dark:border-[#33251c] hover:border-slate-300 flex flex-col items-center justify-center transition active:scale-95 cursor-pointer"
              >
                <tool.icon className="w-4 h-4 text-[#EA580C] mb-1" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">{tool.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  };

  // ========================================================
  // RENDER: Statistics Screen (Exact Mockup Match)
  // ========================================================
  const renderStatisticScreen = (_isDual = false) => (
    <main className="px-5 py-2 space-y-4 flex-1 animate-in fade-in duration-200">
      {/* Top Bar with Back and Options */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button 
          onClick={() => {
            setActiveScreen('dashboard');
            haptic.selection();
          }}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Statistic</h2>
        <button 
          onClick={() => {
            haptic.light();
            notify("Telemetry calibrated via Mifflin-St Jeor equation.");
          }}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          aria-label="Options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Calories Summary Metric */}
      <div className="space-y-1 pt-1">
        <span className="text-xs font-semibold text-slate-400">Calories</span>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {caloriesLogged || 1250}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1.5">Kcal</span>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Target: <span className="text-slate-800 dark:text-white font-bold">{macroGoals.calories || 1920} Kcal</span>
          </div>
        </div>
      </div>

      {/* 7-Day Calorie Bar Chart */}
      <div className="bg-white dark:bg-[#1C1511] rounded-[26px] p-5 border border-[#edf0e8] dark:border-[#33251c] shadow-xs">
        <div className="grid grid-cols-7 gap-2.5 items-end h-44 pb-2 border-b border-slate-100 dark:border-slate-800">
          {/* Mon: 44% */}
          <div className="flex flex-col items-center justify-end h-full space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400">44%</span>
            <div className="w-5 sm:w-6 chart-striped-bar" style={{ height: '44%' }} />
          </div>

          {/* Tue: 34% */}
          <div className="flex flex-col items-center justify-end h-full space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400">34%</span>
            <div className="w-5 sm:w-6 chart-striped-bar" style={{ height: '34%' }} />
          </div>

          {/* Wed: 110% (Peak active day highlighted in solid lime) */}
          <div className="flex flex-col items-center justify-end h-full space-y-1">
            <span className="text-[10px] font-bold text-[#1b2b0a] bg-[#d8f572] px-2 py-0.5 rounded-full shadow-xs">
              110%
            </span>
            <div className="w-5 sm:w-6 chart-peak-bar" style={{ height: '90%' }} />
          </div>

          {/* Thu: 47% */}
          <div className="flex flex-col items-center justify-end h-full space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400">47%</span>
            <div className="w-5 sm:w-6 chart-striped-bar" style={{ height: '47%' }} />
          </div>

          {/* Fri: 32% */}
          <div className="flex flex-col items-center justify-end h-full space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400">32%</span>
            <div className="w-5 sm:w-6 chart-striped-bar" style={{ height: '32%' }} />
          </div>

          {/* Sat: 79% */}
          <div className="flex flex-col items-center justify-end h-full space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400">79%</span>
            <div className="w-5 sm:w-6 chart-striped-bar" style={{ height: '79%' }} />
          </div>

          {/* Sun: 24% */}
          <div className="flex flex-col items-center justify-end h-full space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400">24%</span>
            <div className="w-5 sm:w-6 chart-striped-bar" style={{ height: '24%' }} />
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2.5 pt-2 text-center text-xs text-slate-400 font-medium">
          <span>Mon</span>
          <span>Tue</span>
          <span className="text-slate-900 dark:text-white font-bold">Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* 2x2 Activity & Health Metric Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Exercise Card */}
        <div 
          onClick={() => {
            setActiveScreen('workouts');
            haptic.selection();
          }}
          className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#eef9ee] text-[#22c55e] flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Exercise</span>
          </div>

          {/* Mini Wave Bar Visual */}
          <div className="flex items-end space-x-1.5 h-6 my-2">
            <div className="w-1.5 bg-[#22c55e]/50 rounded-full h-2.5" />
            <div className="w-1.5 bg-[#22c55e]/70 rounded-full h-4" />
            <div className="w-1.5 bg-[#22c55e] rounded-full h-5.5" />
            <div className="w-1.5 bg-[#22c55e]/80 rounded-full h-3.5" />
            <div className="w-1.5 bg-[#22c55e] rounded-full h-6" />
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">2.0</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">hours</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
              {proteinLogged}g protein
            </span>
          </div>
        </div>

        {/* BPM Card */}
        <div className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#feecee] text-[#f43f5e] flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 fill-[#f43f5e]" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">BPM</span>
          </div>

          {/* Heartbeat ECG Line Visual */}
          <div className="my-2 h-6 flex items-center">
            <svg viewBox="0 0 100 24" className="w-full h-5 stroke-[#f43f5e] fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
              <path d="M0 12 H22 L26 5 L32 20 L37 8 L42 15 L45 12 H62 L66 6 L71 18 L75 12 H100" />
            </svg>
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">86</span>
            <span className="text-xs text-slate-400 ml-1 font-medium">bpm</span>
          </div>
        </div>

        {/* Weight Card */}
        <div 
          onClick={() => {
            setIsProfileModalOpen(true);
            haptic.selection();
          }}
          className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#fff0eb] text-[#ff6838] flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-[#ff6838]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.69 2 6 4.69 6 8v1H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v1H8V8c0-2.21 1.79-4 4-4z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Weight</span>
          </div>

          <div className="my-2 h-6 flex items-center">
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#EA580C] rounded-full w-3/4" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {shownWeight(profile.weightKg)}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-slate-400 font-medium">{weightUnit}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWeightUnit(prev => prev === 'kg' ? 'lb' : 'kg');
                    haptic.selection();
                  }}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {weightUnit.toUpperCase()}
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Target: {shownWeight(targetWeight)} {weightUnit}</div>
          </div>
        </div>

        {/* Water Card */}
        <div 
          onClick={() => {
            setActiveScreen('water');
            haptic.selection();
          }}
          className="bg-white dark:bg-[#1C1511] rounded-[24px] p-4 border border-[#edf0e8] dark:border-[#33251c] shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#e8f6fd] text-[#0ea5e9] flex items-center justify-center shrink-0">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Water</span>
          </div>

          {/* Water Droplets Row */}
          <div className="my-2 h-6 flex items-center space-x-1.5 text-[#0ea5e9]">
            {[1,2,3,4,5,6].map(i => (
              <Droplets key={i} className="w-3.5 h-3.5 fill-[#0ea5e9]" />
            ))}
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">12</span>
            <span className="text-xs text-slate-400 ml-1 font-medium">glasses</span>
          </div>
        </div>
      </div>

      {/* Telemetry & Weight check-in section */}
      <div className="pt-2">
        <Analytics
          profile={profile}
          weightLogs={weightLogs}
          onAddWeightLog={handleAddWeightLog}
        />
      </div>
    </main>
  );

  // ========================================================
  // RENDER: Rewards & Streaks Screen
  // ========================================================
  const renderRewardsScreen = () => (
    <main className="px-5 py-2 space-y-4 flex-1 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-1 pb-1">
        <button 
          onClick={() => {
            setActiveScreen('dashboard');
            haptic.selection();
          }}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Rewards & Streaks</h2>
        <div className="w-10" />
      </div>

      <div className="hero-lime rounded-3xl p-6 text-center space-y-2">
        <Award className="w-12 h-12 text-[#1b2b0a] mx-auto" />
        <h3 className="text-2xl font-black text-[#1b2b0a]">6-Day Fitness Streak!</h3>
        <p className="text-xs text-[#1b2b0a]/80 max-w-xs mx-auto">
          You have logged meals consistently for 6 days this week. 1 more day to unlock the Golden Thali badge!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-white dark:bg-[#1C1511] p-4 rounded-2xl border border-[#edf0e8] dark:border-[#33251c] space-y-1 text-center">
          <div className="w-10 h-10 rounded-full bg-[#fff0eb] text-[#ff6838] flex items-center justify-center mx-auto mb-2">
            <Footprints className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">Pedometer Pro</div>
          <div className="text-[10px] text-slate-400">5,500 / 10,000 steps</div>
        </div>

        <div className="bg-white dark:bg-[#1C1511] p-4 rounded-2xl border border-[#edf0e8] dark:border-[#33251c] space-y-1 text-center">
          <div className="w-10 h-10 rounded-full bg-[#e8f6fd] text-[#0ea5e9] flex items-center justify-center mx-auto mb-2">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">Hydration Master</div>
          <div className="text-[10px] text-slate-400">12 / 12 glasses reached</div>
        </div>
      </div>
    </main>
  );

  // ========================================================
  // RENDER: Menu / All Tools Screen
  // ========================================================
  const renderMenuScreen = () => (
    <main className="px-5 py-2 space-y-4 flex-1 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-1 pb-1">
        <button 
          onClick={() => {
            setActiveScreen('dashboard');
            haptic.selection();
          }}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">All Fitness Tools</h2>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'weekly', title: '7-Day Thali', icon: Calendar, desc: 'Weekly meal schedule' },
          { id: 'water', title: 'Hydration', icon: Droplets, desc: 'Water & buttermilk' },
          { id: 'steps', title: 'Strava Steps', icon: Footprints, desc: 'Distance & burn' },
          { id: 'fridge', title: 'Fridge AI', icon: Refrigerator, desc: 'Pantry dish finder' },
          { id: 'supplements', title: 'Supplements', icon: Pill, desc: 'Evidence guide' },
          { id: 'coach', title: 'AI Coach', icon: Bot, desc: 'Desi nutritionist' },
          { id: 'grocery', title: 'Grocery List', icon: ShoppingBag, desc: 'WhatsApp export' },
          { id: 'fasting', title: 'Fasting Timer', icon: Timer, desc: 'Intermittent clock' },
          { id: 'workouts', title: 'Workouts', icon: Dumbbell, desc: 'Desi cardio & gym' },
          { id: 'recipes', title: 'Recipes', icon: ChefHat, desc: '50+ Indian meals' },
          { id: 'account', title: 'Profile Settings', icon: User, desc: 'Height, weight, age' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveScreen(t.id);
              haptic.selection();
            }}
            className="p-3.5 bg-white dark:bg-[#1C1511] rounded-2xl border border-[#edf0e8] dark:border-[#33251c] text-left hover:border-slate-300 transition cursor-pointer active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-2">
              <t.icon className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>
    </main>
  );

  // ========================================================
  // RENDER: Sub-Screen Content Handler
  // ========================================================
  const renderSubScreenContent = (screen: string) => {
    switch (screen) {
      case 'scanner':
        return (
          <FoodScanner onAddScannedFoodToPlan={(scanned, slot) => {
            notify(`Added ${scanned.foodName} to ${slot}!`);
            setActiveScreen('dashboard');
          }} />
        );
      case 'weekly':
        return (
          <WeeklyPlanner profile={profile} targetCalories={macroGoals.calories} />
        );
      case 'water':
        return (
          <WaterTracker 
            waterLoggedMl={waterAmount}
            setWaterLoggedMl={setWaterAmount}
            targetMl={Math.max(2500, Math.round(profile.weightKg * 35))}
          />
        );
      case 'steps':
        return (
          <StepsTracker
            profile={profile}
            stepsLogs={stepsLogs}
            onAddStepsLog={handleAddStepsLog}
          />
        );
      case 'fridge':
        return (
          <FridgeAI onSelectRecipe={(food) => setSelectedRecipe(food)} />
        );
      case 'supplements':
        return (
          <SupplementGuide />
        );
      case 'coach':
        return (
          <AICoach profile={profile} macroGoals={macroGoals} />
        );
      case 'grocery':
        return (
          <GroceryList mealPlan={mealPlan} onNotify={notify} />
        );
      case 'fasting':
        return (
          <FastingTimer fastingState={fastingState} setFastingState={setFastingState} />
        );
      case 'workouts':
        return (
          <WorkoutTracker 
            profile={profile}
            workouts={workouts} 
            onAddWorkout={(w) => setWorkouts([...workouts, w])} 
            onRemoveWorkout={(id: string) => setWorkouts(workouts.filter(w => w.id !== id))} 
          />
        );
      case 'custom_recipes':
        return (
          <CustomRecipeBuilder 
            savedRecipes={savedCustomRecipes} 
            onSaveCustomRecipe={(r) => {
              setSavedCustomRecipes([...savedCustomRecipes, r]);
              notify(`Saved custom dish ${r.name}!`);
            }} 
          />
        );
      case 'swiggy':
        return (
          <SwiggyGuide />
        );
      case 'recipes':
        return (
          <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-4 border border-[#edf0e8] dark:border-[#33251c] space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Indian Recipe Library</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search paneer, dal, oats, chilla..."
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                className="w-full bg-[#f8faf8] dark:bg-[#19120E] border border-[#edf0e8] dark:border-[#33251c] rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Recipes' },
                { id: 'high-protein', label: 'High Protein' },
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
                      ? "bg-[#8fd12a] text-[#1b2b0a] shadow-xs"
                      : "bg-[#f8faf8] dark:bg-[#19120E] text-slate-600 dark:text-slate-400 border border-[#edf0e8] dark:border-[#33251c]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-[460px] overflow-y-auto">
              {filteredRecipes.map((food) => (
                <div 
                  key={food.id}
                  onClick={() => setSelectedRecipe(food)}
                  className="p-2.5 bg-[#f8faf8] dark:bg-[#19120E] rounded-2xl border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-between cursor-pointer hover:border-slate-300 transition"
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
        );
      case 'account':
        return (
          <div className="bg-white dark:bg-[#1C1511] rounded-3xl p-6 border border-[#edf0e8] dark:border-[#33251c] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img src={userAvatar} alt="Profile" className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8fd12a] shadow-md" />
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">{profile.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {profile.gender === 'female' ? 'Female' : 'Male'} • {profile.age} yrs • {profile.heightCm} cm • {profile.weightKg} kg
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="px-3 py-1.5 rounded-xl bg-[#8fd12a] text-[#1b2b0a] text-xs font-bold cursor-pointer hover:bg-[#7bc01d] transition shadow-xs flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-[#8fd12a] text-slate-800 dark:text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Full Editor</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#edf0e8] dark:border-[#33251c] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Over-The-Air (OTA) Updates</div>
                <div className="text-[10px] text-slate-400">NutriFit v{CURRENT_APP_VERSION} ({CURRENT_COMMIT})</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOTAModalOpen(true);
                  haptic.selection();
                }}
                className="px-3 py-1.5 rounded-xl bg-lime-100 dark:bg-lime-950/80 text-[#1b2b0a] dark:text-[#d8f58c] border border-lime-300 dark:border-lime-700 text-xs font-bold cursor-pointer"
              >
                Check OTA
              </button>
            </div>
          </div>
        );
      default:
        return renderHomeScreen(false);
    }
  };

  // ========================================================
  // RENDER: Desktop Top Navigation Bar
  // ========================================================
  const renderDesktopTopNav = () => (
    <header className="bg-white/95 dark:bg-[#1C1511]/95 backdrop-blur-xl border border-[#edf0e8] dark:border-[#33251c] rounded-3xl px-6 py-3 flex items-center justify-between shadow-xs select-none">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <img 
          src="/app-icon.png" 
          alt="NutriFit Logo" 
          className="w-9 h-9 rounded-2xl object-cover border border-[#edf0e8] dark:border-[#33251c] shadow-xs" 
        />
        <div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">NutriFit</span>
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs ml-2 hidden sm:inline">
            Smart Indian Fitness & Meal Planner
          </span>
        </div>
      </div>

      {/* Center Layout Mode Switcher */}
      <div className="hidden lg:flex items-center space-x-1 bg-[#f1f3ec] dark:bg-[#19120E] p-1 rounded-2xl border border-[#edf0e8] dark:border-[#33251c]">
        {[
          { id: 'dual_mockup' as const, label: 'Dual Mockup (Screenshot)', icon: Smartphone },
          { id: 'single_phone' as const, label: 'Single Phone', icon: Smartphone },
          { id: 'responsive' as const, label: 'Full Web Dashboard', icon: Monitor },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setDesktopMode(item.id);
              haptic.selection();
              notify(`Switched to ${item.label}`);
            }}
            className={cx(
              "flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
              desktopMode === item.id 
                ? "bg-[#8fd12a] text-[#1b2b0a] shadow-xs" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Right Controls: OTA, Theme, Profile */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => {
            setIsOTAModalOpen(true);
            haptic.selection();
          }}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-lime-100 dark:bg-lime-950/80 border border-lime-300 dark:border-lime-800 text-[#1b2b0a] dark:text-[#d8f58c] text-xs font-bold hover:scale-105 transition cursor-pointer"
          title="Check Over-The-Air (OTA) Updates"
        >
          <CloudDownload className="w-3.5 h-3.5 text-[#8fd12a]" />
          <span>OTA v2.2</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => {
            const next = theme === 'dark' ? 'light' : 'dark';
            setTheme(next);
            haptic.selection();
            notify(`Switched to ${next} theme.`);
          }}
          className="w-9 h-9 rounded-xl bg-white dark:bg-[#231811] border border-[#edf0e8] dark:border-[#33251c] flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Profile Details Quick Edit */}
        <button
          onClick={() => {
            setIsProfileModalOpen(true);
            haptic.selection();
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[#edf0e8] dark:border-[#33251c] bg-white dark:bg-[#231811] text-xs font-bold text-slate-800 dark:text-white hover:border-[#8fd12a] transition cursor-pointer shadow-2xs"
          title="Edit Profile & Body Metrics"
        >
          <img 
            src={userAvatar} 
            alt="User Profile" 
            className="w-5 h-5 rounded-full object-cover border border-[#8fd12a]" 
          />
          <span className="hidden sm:inline">{profile.name.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  );

  // ========================================================
  // RENDER: Floating Bottom Navigation Bar (Matches Screenshot 1:1)
  // ========================================================
  const renderFloatingNav = (isEmbedded = false) => {
    return (
      <nav 
        className={cx(
          isEmbedded ? "floating-nav-embedded" : "floating-nav",
          "select-none"
        )} 
        aria-label="Bottom Navigation"
      >
        <button 
          onClick={() => {
            haptic.selection();
            setActiveScreen('dashboard');
          }}
          className={cx(
            "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
            activeScreen === 'dashboard' ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
          )}
        >
          <Home className={cx("w-5 h-5", activeScreen === 'dashboard' ? "stroke-[2.5]" : "stroke-[2]")} />
          <span className="text-[10px]">Home</span>
        </button>

        <button 
          onClick={() => {
            haptic.selection();
            setActiveScreen('statistic');
          }}
          className={cx(
            "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
            activeScreen === 'statistic' ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
          )}
        >
          <BarChart3 className={cx("w-5 h-5", activeScreen === 'statistic' ? "stroke-[2.5]" : "stroke-[2]")} />
          <span className="text-[10px]">Progress</span>
        </button>

        <button 
          onClick={() => {
            haptic.selection();
            setActiveScreen('scanner');
          }}
          className="fab-raised"
          aria-label="Scan food with camera"
        >
          <Scan className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button 
          onClick={() => {
            haptic.selection();
            setActiveScreen('rewards');
          }}
          className={cx(
            "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
            activeScreen === 'rewards' ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
          )}
        >
          <Star className={cx("w-5 h-5", activeScreen === 'rewards' ? "stroke-[2.5]" : "stroke-[2]")} />
          <span className="text-[10px]">Rewards</span>
        </button>

        <button 
          onClick={() => {
            haptic.selection();
            setActiveScreen('menu');
          }}
          className={cx(
            "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer rounded-xl",
            activeScreen === 'menu' ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
          )}
        >
          <LayoutGrid className={cx("w-5 h-5", activeScreen === 'menu' ? "stroke-[2.5]" : "stroke-[2]")} />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>
    );
  };

  return (
    <div id="morrow-app" data-theme={theme} className="min-h-screen bg-[#edf0f2] dark:bg-[#12161a] text-slate-900 dark:text-white pb-16">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#8fd12a] text-[#1b2b0a] px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#1b2b0a]" />
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
          DESKTOP DUAL MOCKUP VIEW (Exact Match to Screenshot)
          ======================================================== */}
      {desktopMode === 'dual_mockup' && (
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-6 space-y-6">
          {renderDesktopTopNav()}

          <div className="flex items-start justify-center gap-10 py-6">
            {/* Phone 1 (Left): Home Screen UI */}
            <div className="w-[390px] h-[820px] rounded-[48px] border-[9px] border-[#15100e] relative flex flex-col bg-[#f6f8f4] dark:bg-[#15100E] overflow-hidden shrink-0 shadow-2xl">
              {renderPhoneStatusBar()}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
                {renderHomeScreen(true)}
              </div>
              <div className="px-4 pb-2">
                {renderFloatingNav(true)}
              </div>
              <div className="w-32 h-1 bg-slate-900/80 dark:bg-white/80 rounded-full mx-auto mb-2 shrink-0 select-none" />
            </div>

            {/* Phone 2 (Right): Statistic Screen UI or Active Tab */}
            <div className="w-[390px] h-[820px] rounded-[48px] border-[9px] border-[#15100e] relative flex flex-col bg-[#f6f8f4] dark:bg-[#15100E] overflow-hidden shrink-0 shadow-2xl">
              {renderPhoneStatusBar()}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-3">
                {activeScreen === 'statistic' || activeScreen === 'dashboard' ? (
                  renderStatisticScreen(true)
                ) : activeScreen === 'rewards' ? (
                  renderRewardsScreen()
                ) : activeScreen === 'menu' ? (
                  renderMenuScreen()
                ) : (
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    <button 
                      onClick={() => setActiveScreen('statistic')}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Statistic</span>
                    </button>
                    {renderSubScreenContent(activeScreen)}
                  </div>
                )}
              </div>
              <div className="w-32 h-1 bg-slate-900/80 dark:bg-white/80 rounded-full mx-auto my-3 shrink-0 select-none" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DESKTOP RESPONSIVE LAYOUT
          ======================================================== */}
      {desktopMode === 'responsive' && (
        <div className="hidden lg:block max-w-7xl mx-auto px-6 py-6 space-y-6">
          {renderDesktopTopNav()}

          {activeScreen === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-7 space-y-6">
                {renderHomeScreen(false)}
              </div>
              <div className="col-span-5 space-y-6">
                {renderStatisticScreen(false)}
              </div>
            </div>
          )}

          {activeScreen === 'statistic' && (
            <div className="max-w-4xl mx-auto">
              {renderStatisticScreen(false)}
            </div>
          )}

          {activeScreen === 'rewards' && (
            <div className="max-w-2xl mx-auto">
              {renderRewardsScreen()}
            </div>
          )}

          {activeScreen === 'menu' && (
            <div className="max-w-3xl mx-auto">
              {renderMenuScreen()}
            </div>
          )}

          {activeScreen !== 'dashboard' && activeScreen !== 'statistic' && activeScreen !== 'rewards' && activeScreen !== 'menu' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <button 
                onClick={() => setActiveScreen('dashboard')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] px-3.5 py-1.5 rounded-xl shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              {renderSubScreenContent(activeScreen)}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SINGLE PHONE VIEW (Mobile or Phone Simulator Mode)
          ======================================================== */}
      {(desktopMode === 'single_phone' || desktopMode === 'dual_mockup') && (
        <div className={`phone-shell bg-[#f6f8f4] dark:bg-[#15100E] ${desktopMode === 'single_phone' ? 'hidden lg:block phone-simulator-frame mx-auto my-6' : 'lg:hidden'}`}>
          {desktopMode === 'single_phone' && (
            <div className="p-4 bg-white/95 dark:bg-[#1C1511]/95 border-b border-[#edf0e8] dark:border-[#33251c]">
              {renderDesktopTopNav()}
            </div>
          )}

          {renderPhoneStatusBar()}

          <main className="px-4 pt-2 pb-24 space-y-4">
            {activeScreen === 'dashboard' && renderHomeScreen(false)}
            {activeScreen === 'statistic' && renderStatisticScreen(false)}
            {activeScreen === 'rewards' && renderRewardsScreen()}
            {activeScreen === 'menu' && renderMenuScreen()}
            {activeScreen !== 'dashboard' && activeScreen !== 'statistic' && activeScreen !== 'rewards' && activeScreen !== 'menu' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                {renderSubScreenContent(activeScreen)}
              </div>
            )}
          </main>

          {renderFloatingNav(false)}
        </div>
      )}

      {/* If desktopMode is responsive, mobile still needs to render on small screens */}
      {desktopMode === 'responsive' && (
        <div className="lg:hidden phone-shell bg-[#f6f8f4] dark:bg-[#15100E]">
          {renderPhoneStatusBar()}
          <main className="px-4 pt-2 pb-24 space-y-4">
            {activeScreen === 'dashboard' && renderHomeScreen(false)}
            {activeScreen === 'statistic' && renderStatisticScreen(false)}
            {activeScreen === 'rewards' && renderRewardsScreen()}
            {activeScreen === 'menu' && renderMenuScreen()}
            {activeScreen !== 'dashboard' && activeScreen !== 'statistic' && activeScreen !== 'rewards' && activeScreen !== 'menu' && (
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1C1511] border border-[#edf0e8] dark:border-[#33251c] px-3 py-1.5 rounded-xl shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                {renderSubScreenContent(activeScreen)}
              </div>
            )}
          </main>
          {renderFloatingNav(false)}
        </div>
      )}


      {/* ========================================================
          GLOBAL MODALS
          ======================================================== */}
      {/* 4. Weight Loss / Maintain / Weight Gain Comparison Modal */}
      <PlanComparisonModal
        isOpen={isPlanCompareModalOpen}
        onClose={() => setIsPlanCompareModalOpen(false)}
        profile={profile}
        onSelectGoal={(g) => {
          setProfile(prev => ({ ...prev, goal: g }));
          notify(`Activated ${g === 'fat_loss' ? 'Weight Loss' : g === 'muscle_gain' ? 'Weight Gain' : 'Maintain'} Plan!`);
        }}
      />

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

      {/* 5. User Profile & Body Metrics Editor Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          setProfile(updated);
          notify(`Profile saved! Goals updated for ${updated.name}.`);
        }}
        userAvatar={userAvatar}
        onAvatarUpload={handleAvatarUpload}
        onResetAvatar={resetToProvidedAvatar}
      />

      {/* 6. Over-The-Air (OTA) Updates & Cloud Sync Modal */}
      <OTAUpdateModal
        isOpen={isOTAModalOpen}
        onClose={() => setIsOTAModalOpen(false)}
        onNotify={notify}
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
