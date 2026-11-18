import { useState, useEffect } from 'react';
import type { 
  UserProfile, MealSlot, FoodItem, DailyMealPlan, 
  WorkoutEntry, FastingState, CustomRecipe 
} from './types';
import { calculateMacroGoals } from './utils/nutritionCalculator';
import { generateDailyMealPlan } from './utils/mealPlanGenerator';
import { INDIAN_FOOD_DATABASE } from './data/indianFoodDatabase';
import { RecipeModal } from './components/RecipeModal';
import { MealSwapperModal } from './components/MealSwapperModal';
import { FoodScanner } from './components/FoodScanner';
import { FastingTimer } from './components/FastingTimer';
import { WorkoutTracker } from './components/WorkoutTracker';
import { AICoach } from './components/AICoach';
import { FridgeAI } from './components/FridgeAI';
import { SwiggyGuide } from './components/SwiggyGuide';
import { CustomRecipeBuilder } from './components/CustomRecipeBuilder';
import { haptic } from './utils/haptics';
import { cx } from './utils/cx';
import { 
  Home, 
  BarChart3, 
  Scan, 
  Star, 
  LayoutGrid, 
  Footprints, 
  Droplets, 
  Flame, 
  Heart, 
  Activity, 
  Scale, 
  Bell, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  Sparkles, 
  Sun, 
  Moon, 
  Check, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Utensils, 
  CalendarDays, 
  ShoppingBag, 
  Bot, 
  Camera, 
  Refrigerator, 
  Timer, 
  User, 
  RefreshCw, 
  ChefHat, 
  Award 
} from 'lucide-react';

export function App() {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('morrow_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('morrow_theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  // Active Screen
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('morrow_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return {
      name: 'Sajibur Rahman',
      age: 26,
      gender: 'male',
      weightKg: 68.4,
      heightCm: 174,
      activityLevel: 'moderately_active',
      goal: 'fat_loss',
      dietType: 'pure_veg',
      region: 'all',
      budget: 'moderate',
      medicalConditions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('morrow_profile', JSON.stringify(profile));
  }, [profile]);

  // Extended Goals & Metrics
  const [targetWeight, setTargetWeight] = useState<number>(65.0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const steps = 5500;
  const [waterAmount, setWaterAmount] = useState<number>(2400); // 12 glasses (200ml each)

  // Calendar Week Strip State
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

  // Grocery List State
  const [checkedGrocery, setCheckedGrocery] = useState<string[]>([]);
  const [recipeFilter, setRecipeFilter] = useState<string>('all');
  const [recipeSearch, setRecipeSearch] = useState<string>('');

  // Modals & Toast State
  const [toast, setToast] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<FoodItem | null>(null);
  const [swappingSlot, setSwappingSlot] = useState<MealSlot | null>(null);

  // Macro Goals & Generated Daily Plan
  const macroGoals = calculateMacroGoals(profile);
  const [mealPlan, setMealPlan] = useState<DailyMealPlan>(() => {
    return generateDailyMealPlan(profile, macroGoals.calories);
  });

  // Dual Mockup vs Single View mode for desktop
  const [desktopView, setDesktopView] = useState<'dual' | 'single'>('dual');

  // Sub-feature states
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([
    {
      id: 'w1',
      name: 'Functional Strength & Core',
      category: 'weightlifting',
      durationMins: 45,
      caloriesBurned: 280,
      intensity: 'moderate',
      timestamp: '07:30 AM'
    }
  ]);
  const [fastingState, setFastingState] = useState<FastingState>({
    isFasting: false,
    startTime: null,
    targetDurationHours: 16,
    protocol: '16_8'
  });
  const [savedCustomRecipes, setSavedCustomRecipes] = useState<CustomRecipe[]>([]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  const shownWeight = (kg: number) => {
    return weightUnit === 'lb' ? (kg * 2.20462).toFixed(1) : kg.toFixed(1);
  };

  // Grocery staples
  const defaultGroceryItems = [
    { id: 'paneer', name: 'Low-fat paneer', amount: '400 g', group: 'Protein' },
    { id: 'sattu', name: 'Roasted chana sattu', amount: '500 g', group: 'Protein' },
    { id: 'oats', name: 'Rolled oats', amount: '1 kg', group: 'Carbs & Fiber' },
    { id: 'moong', name: 'Sprouted green moong', amount: '500 g', group: 'Pantry' },
    { id: 'curd', name: 'Greek yogurt / dahi', amount: '400 g', group: 'Dairy' },
    { id: 'almonds', name: 'California almonds', amount: '250 g', group: 'Healthy Fats' },
  ];

  // Recipe catalog filtering
  const filteredRecipes = INDIAN_FOOD_DATABASE.filter((dish) => {
    const matchesSearch = !recipeSearch || 
      dish.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      (dish.hindiName && dish.hindiName.toLowerCase().includes(recipeSearch.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (recipeFilter === 'all') return true;
    if (recipeFilter === 'south') return dish.region.includes('south_indian');
    if (recipeFilter === 'north') return dish.region.includes('north_indian');
    if (recipeFilter === 'high-protein') return dish.protein >= 15;
    if (recipeFilter === 'quick') return dish.prepTimeMins <= 25;
    return true;
  });

  // Calculate calories logged today
  const caloriesLogged = 1250; // exact match to mock-up statistic screen

  // Render status bar with notch / Dynamic Island
  const renderPhoneStatusBar = () => (
    <header className="px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 shrink-0 select-none">
      <span className="font-bold text-[13px] tracking-tight">9:41</span>
      <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2 space-x-1 shadow-inner">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
      </div>
      <div className="flex items-center space-x-1.5 opacity-90">
        <span className="text-[10px] font-bold">5G</span>
        <div className="w-4 h-2 border border-slate-700 rounded-xs p-0.5 flex items-center">
          <div className="w-full h-full bg-slate-800 rounded-2xs" />
        </div>
      </div>
    </header>
  );

  // Render Screen 1: Dashboard / Home Screen (Exact Mockup)
  const renderHomeScreen = (isDual = false) => (
    <main className="px-5 py-2 space-y-4 flex-1 animate-in fade-in duration-200">
      {/* Top User Header Bar */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
            alt="User Avatar"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
          />
          <div>
            <div className="text-xs text-slate-400 font-medium">Good morning!</div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
              {profile.name || 'Sajibur Rahman'}
            </h1>
          </div>
        </div>

        {/* Right Action Icons: Notes/Journal & Bell Notification */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveScreen('recipes')}
            className="w-10 h-10 rounded-2xl card-surface card-border flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 interactive-btn cursor-pointer"
            title="Recipe Journal"
            aria-label="View Recipe Journal"
          >
            <FileText className="w-4 h-4 text-slate-700" />
          </button>
          <button 
            onClick={() => notify("You are on track with today's calorie budget!")}
            className="w-10 h-10 rounded-2xl card-surface card-border flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 interactive-btn relative cursor-pointer"
            title="Notifications"
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="w-2 h-2 rounded-full bg-[#ff723b] absolute top-2.5 right-2.5 ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Hero Card: "Your Weekly Progress" (Exact Lime Style) */}
      <section className="hero-lime rounded-[28px] p-5 shadow-xs relative overflow-hidden flex items-center justify-between">
        <div className="space-y-2.5 z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/50 text-[#1b2b0a] text-[11px] font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1b2b0a]" />
            <span>Daily intake</span>
          </div>
          <h2 className="text-[22px] font-black text-[#1b2b0a] leading-tight max-w-[150px]">
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
              stroke="#8acb20"
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

      {/* 2-Column Quick Metric Cards: Steps & Water */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Step to walk Card */}
        <div 
          onClick={() => setActiveScreen('steps')}
          className="card-surface card-border rounded-[24px] p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600 leading-snug">
              Step to<br />walk
            </span>
            <div className="w-8 h-8 rounded-full bg-[#fff0eb] text-[#ff6838] flex items-center justify-center shrink-0">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {steps.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-normal ml-1.5">steps</span>
          </div>
        </div>

        {/* Drink Water Card */}
        <div 
          onClick={() => {
            setWaterAmount((prev) => prev + 200);
            haptic.medium();
            notify("Logged 1 glass of water (+200ml)!");
          }}
          className="card-surface card-border rounded-[24px] p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition cursor-pointer active:scale-98"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600 leading-snug">
              Drink<br />Water
            </span>
            <div className="w-8 h-8 rounded-full bg-[#e8f6fd] text-[#2ba5f7] flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {Math.round(waterAmount / 200)}
            </span>
            <span className="text-xs text-slate-400 font-normal ml-1.5">glass</span>
          </div>
        </div>
      </div>

      {/* Calendar Week Strip ("August 2025" / Selected Day Pill) */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">August 2025</h3>
          <div className="flex items-center space-x-1.5">
            <button 
              onClick={() => setActiveDateIndex((prev) => Math.max(0, prev - 1))}
              className="w-8 h-8 rounded-full card-surface card-border text-slate-600 flex items-center justify-center hover:bg-[#e4e7dd] transition interactive-btn cursor-pointer"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveDateIndex((prev) => Math.min(6, prev + 1))}
              className="w-8 h-8 rounded-full card-surface card-border text-slate-600 flex items-center justify-center hover:bg-[#e4e7dd] transition interactive-btn cursor-pointer"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Day Selector Strip */}
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
                  "py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer interactive-btn",
                  isSelected 
                    ? "bg-[#d8f572] text-[#1b2b0a] font-bold shadow-xs" 
                    : "bg-transparent text-slate-700 hover:bg-slate-100"
                )}
                aria-label={`Select date ${item.day} ${item.date}`}
              >
                <span className={cx("text-[11px] font-medium", isSelected ? "text-[#1b2b0a]" : "text-slate-400")}>
                  {item.day}
                </span>
                <span className={cx("text-sm font-bold mt-1", isSelected ? "text-[#1b2b0a]" : "text-slate-800")}>
                  {item.date}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Meal Cards List (Breakfast, Lunch time) */}
      <section className="space-y-3 pt-1">
        {/* Breakfast Card */}
        <div className="card-surface card-border rounded-[24px] p-4 shadow-xs flex items-center justify-between">
          <div>
            <h4 
              onClick={() => setSelectedRecipe(mealPlan.meals.breakfast)}
              className="text-sm font-bold text-slate-900 cursor-pointer hover:text-emerald-700"
            >
              Breakfast
            </h4>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#fef6e7] text-slate-600 text-[11px] font-semibold mt-1">
              <Flame className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
              <span>456 - 512 kcal</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=120&auto=format&fit=crop&q=80" 
                alt="Poha dish" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80" 
                alt="Fruit bowl" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              />
            </div>

            <button 
              onClick={() => setSwappingSlot('breakfast')}
              className="w-9 h-9 rounded-full bg-[#f1f3ec] hover:bg-[#e4e7dd] text-slate-700 flex items-center justify-center transition active:scale-95 interactive-btn cursor-pointer ml-1"
              title="Swap or log Breakfast"
              aria-label="Swap or log Breakfast"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lunch time Card */}
        <div className="card-surface card-border rounded-[24px] p-4 shadow-xs flex items-center justify-between">
          <div>
            <h4 
              onClick={() => setSelectedRecipe(mealPlan.meals.lunch)}
              className="text-sm font-bold text-slate-900 cursor-pointer hover:text-emerald-700"
            >
              Lunch time
            </h4>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#fef6e7] text-slate-600 text-[11px] font-semibold mt-1">
              <Flame className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
              <span>456 - 512 kcal</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=120&auto=format&fit=crop&q=80" 
                alt="Thali bowl" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <img 
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&auto=format&fit=crop&q=80" 
                alt="Paneer tikka" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              />
            </div>

            <button 
              onClick={() => setSwappingSlot('lunch')}
              className="w-9 h-9 rounded-full bg-[#f1f3ec] hover:bg-[#e4e7dd] text-slate-700 flex items-center justify-center transition active:scale-95 interactive-btn cursor-pointer ml-1"
              title="Swap or log Lunch"
              aria-label="Swap or log Lunch"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Evening Fuel (available on scroll) */}
        {!isDual && (
          <div className="bg-white rounded-[24px] p-4 border border-[#edf0e8] shadow-xs flex items-center justify-between">
            <div>
              <h4 
                onClick={() => setSelectedRecipe(mealPlan.meals.snack)}
                className="text-sm font-bold text-slate-900 cursor-pointer hover:text-emerald-700"
              >
                Evening Fuel
              </h4>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#fef6e7] text-slate-600 text-[11px] font-semibold mt-1">
                <Flame className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                <span>220 - 280 kcal</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=120&auto=format&fit=crop&q=80" 
                alt="Roasted chana" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <button 
                onClick={() => setSwappingSlot('snack')}
                className="w-8 h-8 rounded-full bg-[#f1f3ec] hover:bg-[#e4e7dd] text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer ml-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );

  // Render Screen 2: Statistic / Progress Screen (Exact Mockup)
  const renderStatisticScreen = (_isDual = false) => (
    <main className="px-5 py-2 space-y-4 flex-1 animate-in fade-in duration-200">
      {/* Top Bar with Back and Options */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button 
          onClick={() => setActiveScreen('dashboard')}
          className="w-10 h-10 rounded-2xl card-surface card-border flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 interactive-btn cursor-pointer"
          aria-label="Back to Home"
          title="Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Statistic</h2>
        <button 
          onClick={() => notify("Target calibrated with Mifflin-St Jeor equation.")}
          className="w-10 h-10 rounded-2xl card-surface card-border flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 interactive-btn cursor-pointer"
          aria-label="Statistic Options"
          title="Options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Calories Summary Metric */}
      <div className="space-y-1 pt-1">
        <span className="text-xs font-semibold text-slate-400">Calories</span>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {caloriesLogged}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1.5">Kcal</span>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Target: <span className="text-slate-800">{macroGoals.calories || 1920} Kcal</span>
          </div>
        </div>
      </div>

      {/* 7-Day Calorie Bar Chart */}
      <div className="card-surface card-border rounded-[26px] p-5 shadow-xs">
        <div className="grid grid-cols-7 gap-2.5 items-end h-44 pb-2 border-b border-slate-100">
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
          <span className="text-slate-900 font-bold">Wed</span>
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
          onClick={() => setActiveScreen('workouts')}
          className="card-surface card-border rounded-[24px] p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition interactive-btn cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#eef9ee] text-[#22c55e] flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700">Exercise</span>
          </div>

          {/* Mini Wave Bar Visual */}
          <div className="flex items-end space-x-1.5 h-6 my-2">
            <div className="w-1.5 bg-[#22c55e]/50 rounded-full h-2.5" />
            <div className="w-1.5 bg-[#22c55e]/70 rounded-full h-4" />
            <div className="w-1.5 bg-[#22c55e] rounded-full h-5.5" />
            <div className="w-1.5 bg-[#22c55e]/80 rounded-full h-3.5" />
            <div className="w-1.5 bg-[#22c55e] rounded-full h-6" />
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">2.0</span>
            <span className="text-xs text-slate-400 ml-1">hours</span>
          </div>
        </div>

        {/* BPM Card */}
        <div className="card-surface card-border rounded-[24px] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#feecee] text-[#f43f5e] flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 fill-[#f43f5e]" />
            </div>
            <span className="text-xs font-bold text-slate-700">BPM</span>
          </div>

          {/* Heartbeat ECG Line Visual */}
          <div className="my-2 h-6 flex items-center">
            <svg viewBox="0 0 100 24" className="w-full h-5 stroke-[#f43f5e] fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
              <path d="M0 12 H22 L26 5 L32 20 L37 8 L42 15 L45 12 H62 L66 6 L71 18 L75 12 H100" />
            </svg>
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">86</span>
            <span className="text-xs text-slate-400 ml-1">bpm</span>
          </div>
        </div>

        {/* Weight Card */}
        <div 
          onClick={() => setActiveScreen('goals')}
          className="card-surface card-border rounded-[24px] p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition interactive-btn cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#fff0eb] text-[#f97316] flex items-center justify-center shrink-0">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700">Weight</span>
          </div>

          <div className="my-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#f97316] h-full rounded-full" style={{ width: '74%' }} />
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {shownWeight(profile.weightKg)}
            </span>
            <span className="text-xs text-slate-400 ml-1">{weightUnit}</span>
          </div>
        </div>

        {/* Water Card */}
        <div 
          onClick={() => setActiveScreen('water')}
          className="card-surface card-border rounded-[24px] p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition interactive-btn cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#e8f6fd] text-[#2ba5f7] flex items-center justify-center shrink-0">
              <Droplets className="w-3.5 h-3.5 fill-[#2ba5f7]" />
            </div>
            <span className="text-xs font-bold text-slate-700">Water</span>
          </div>

          {/* Droplets row visual */}
          <div className="flex items-center space-x-1.5 my-2">
            {[...Array(6)].map((_, i) => (
              <svg key={i} viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-[#2ba5f7] text-[#2ba5f7]">
                <path d="M8 1.5C8 1.5 3 7.5 3 11a5 5 0 0 0 10 0c0-3.5-5-9.5-5-9.5z" />
              </svg>
            ))}
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {Math.round(waterAmount / 200)}
            </span>
            <span className="text-xs text-slate-400 ml-1">glass</span>
          </div>
        </div>
      </div>
    </main>
  );

  // Render Floating Navigation Bar
  const renderFloatingNav = (isEmbedded = false) => (
    <nav className={isEmbedded ? "floating-nav-embedded" : "floating-nav"} aria-label="Main Navigation">
      {/* 1. Home */}
      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('dashboard');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer interactive-btn rounded-xl",
          activeScreen === 'dashboard' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
        )}
        aria-label="Navigate to Home"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* 2. Progress / Statistic */}
      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('statistic');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer interactive-btn rounded-xl",
          activeScreen === 'statistic' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
        )}
        aria-label="View Statistics and Progress"
      >
        <BarChart3 className="w-5 h-5" />
        <span className="text-[10px]">Progress</span>
      </button>

      {/* 3. Center Raised Lime FAB (Scanner / Quick Log) */}
      <button 
        onClick={() => {
          haptic.medium();
          setActiveScreen('scanner');
        }}
        className="fab-raised"
        title="Scan Food Macros"
        aria-label="Scan food macros"
      >
        <Scan className="w-5 h-5 stroke-[2.4]" />
      </button>

      {/* 4. Rewards */}
      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('rewards');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer interactive-btn rounded-xl",
          activeScreen === 'rewards' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
        )}
        aria-label="View Rewards and Streaks"
      >
        <Star className="w-5 h-5" />
        <span className="text-[10px]">Rewards</span>
      </button>

      {/* 5. Menu */}
      <button 
        onClick={() => {
          haptic.selection();
          setActiveScreen('menu');
        }}
        className={cx(
          "flex flex-col items-center justify-center space-y-0.5 px-3 py-1 transition cursor-pointer interactive-btn rounded-xl",
          activeScreen === 'menu' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
        )}
        aria-label="Open Menu and AI Tools"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px]">Menu</span>
      </button>
    </nav>
  );

  return (
    <div id="morrow-app" data-theme={theme} className="min-h-screen bg-[#f6f8f4] text-slate-900 pb-20">
      {/* Top Header / Viewport Controller for Desktop */}
      <header className="max-w-5xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#d8f572] flex items-center justify-center text-[#1b2b0a] font-black text-xs shadow-xs">
            NF
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-800 tracking-tight">NutriFit</span>
            <span className="text-slate-400 font-normal text-xs ml-1.5 hidden sm:inline">Daily Meal Planner & Fitness</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dual Mockup vs Single View Toggle (desktop) */}
          <div className="hidden lg:flex bg-white/90 backdrop-blur border border-[#edf0e8] rounded-full p-1 items-center shadow-xs">
            <button 
              onClick={() => setDesktopView('dual')}
              className={cx(
                "px-3 py-1 text-xs font-bold rounded-full transition cursor-pointer interactive-btn",
                desktopView === 'dual' ? 'bg-[#d8f572] text-[#1b2b0a] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              )}
              aria-label="Side-by-side Dual Phone View"
            >
              Side-by-Side Dual View
            </button>
            <button 
              onClick={() => setDesktopView('single')}
              className={cx(
                "px-3 py-1 text-xs font-bold rounded-full transition cursor-pointer interactive-btn",
                desktopView === 'single' ? 'bg-[#d8f572] text-[#1b2b0a] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              )}
              aria-label="Single Phone View"
            >
              Single Phone
            </button>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => {
              const next = theme === 'dark' ? 'light' : 'dark';
              setTheme(next);
            }}
            className="w-8 h-8 rounded-full bg-white border border-[#edf0e8] flex items-center justify-center text-slate-600 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ========================================================
          DESKTOP DUAL VIEW: Side-by-side Phones (Exact Reference Match)
          ======================================================== */}
      {desktopView === 'dual' && (
        <div className="hidden lg:flex items-start justify-center gap-8 max-w-6xl mx-auto px-4 py-4">
          {/* Left Phone: Screen 1 (Home Screen) */}
          <div className="w-[390px] phone-shell relative flex flex-col bg-[#f6f8f4] overflow-hidden shrink-0 shadow-2xl">
            {renderPhoneStatusBar()}
            {renderHomeScreen(true)}
            <div className="px-4 pb-2">
              {renderFloatingNav(true)}
            </div>
            <div className="w-32 h-1 bg-slate-900/80 rounded-full mx-auto mb-2 shrink-0 select-none" />
          </div>

          {/* Right Phone: Screen 2 (Statistic Screen or Active Sub-screen) */}
          <div className="w-[390px] phone-shell relative flex flex-col bg-[#f6f8f4] overflow-hidden shrink-0 shadow-2xl">
            {renderPhoneStatusBar()}
            {renderStatisticScreen(true)}
            <div className="w-32 h-1 bg-slate-900/80 rounded-full mx-auto my-3 shrink-0 select-none" />
          </div>
        </div>
      )}

      {/* ========================================================
          SINGLE PHONE CANVAS: For Mobile or Single View Mode
          ======================================================== */}
      <div className={`phone-shell bg-[#f6f8f4] min-h-screen relative flex flex-col ${desktopView === 'dual' ? 'lg:hidden' : ''}`}>
        {renderPhoneStatusBar()}
        {activeScreen === 'dashboard' && renderHomeScreen(false)}
        {activeScreen === 'statistic' && renderStatisticScreen(false)}

        {/* ========================================================
            SCREEN 3: REWARDS & ACHIEVEMENTS
            ======================================================== */}
        {activeScreen === 'rewards' && (
          <main className="px-5 py-4 space-y-4 flex-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2">
              <button 
                onClick={() => setActiveScreen('dashboard')}
                className="w-10 h-10 rounded-2xl bg-white border border-[#edf0e8] flex items-center justify-center text-slate-700 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-slate-900">Rewards & Streaks</h2>
              <div className="w-10" />
            </div>

            <div className="hero-lime rounded-3xl p-5 text-center space-y-2">
              <Award className="w-10 h-10 text-[#1b2b0a] mx-auto" />
              <h3 className="text-2xl font-black text-[#1b2b0a]">6-Day Fitness Streak!</h3>
              <p className="text-xs text-[#1b2b0a]/80 max-w-xs mx-auto">
                You’ve logged meals consistently for 6 days this week. 1 more day to unlock the Golden Thali badge!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-[#edf0e8] space-y-1 text-center">
                <div className="w-10 h-10 rounded-full bg-[#fff0eb] text-[#ff6838] flex items-center justify-center mx-auto mb-2">
                  <Footprints className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm">10k Steps Club</div>
                <div className="text-[11px] text-slate-400">Completed 4 times</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#edf0e8] space-y-1 text-center">
                <div className="w-10 h-10 rounded-full bg-[#e8f6fd] text-[#2ba5f7] flex items-center justify-center mx-auto mb-2">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm">Hydration Master</div>
                <div className="text-[11px] text-slate-400">12 glasses/day</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#edf0e8] space-y-1 text-center">
                <div className="w-10 h-10 rounded-full bg-[#eef9ee] text-[#22c55e] flex items-center justify-center mx-auto mb-2">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm">Clean Macros</div>
                <div className="text-[11px] text-slate-400">92% Calorie Accuracy</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#edf0e8] space-y-1 text-center">
                <div className="w-10 h-10 rounded-full bg-[#fef6e7] text-[#f59e0b] flex items-center justify-center mx-auto mb-2">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm">Fasting Champion</div>
                <div className="text-[11px] text-slate-400">16:8 Protocol Kept</div>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            SCREEN 4: MENU & COMPANION APPS DRAWER
            ======================================================== */}
        {activeScreen === 'menu' && (
          <main className="px-5 py-4 space-y-4 flex-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2">
              <button 
                onClick={() => setActiveScreen('dashboard')}
                className="w-10 h-10 rounded-2xl bg-white border border-[#edf0e8] flex items-center justify-center text-slate-700 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-slate-900">Menu & Tools</h2>
              <button 
                onClick={() => {
                  const next = theme === 'dark' ? 'light' : 'dark';
                  setTheme(next);
                  notify(`Switched to ${next} theme.`);
                }}
                className="w-10 h-10 rounded-2xl bg-white border border-[#edf0e8] flex items-center justify-center text-slate-700 shadow-sm cursor-pointer"
                title="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">AI Companions</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => setActiveScreen('coach')}
                  className="bg-white p-3.5 rounded-2xl border border-[#edf0e8] text-left hover:border-slate-300 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#eef9ee] text-[#22c55e] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">AI Coach</div>
                    <div className="text-[10px] text-slate-400">Nutrition chat</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveScreen('fridge')}
                  className="bg-white p-3.5 rounded-2xl border border-[#edf0e8] text-left hover:border-slate-300 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#e8f6fd] text-[#2ba5f7] flex items-center justify-center shrink-0">
                    <Refrigerator className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Fridge AI</div>
                    <div className="text-[10px] text-slate-400">Cook with pantry</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveScreen('scanner')}
                  className="bg-white p-3.5 rounded-2xl border border-[#edf0e8] text-left hover:border-slate-300 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#d8f572] text-[#1b2b0a] flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Food Scanner</div>
                    <div className="text-[10px] text-slate-400">Snap thali macros</div>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveScreen('fasting')}
                  className="bg-white p-3.5 rounded-2xl border border-[#edf0e8] text-left hover:border-slate-300 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#fef6e7] text-[#f59e0b] flex items-center justify-center shrink-0">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Fasting Clock</div>
                    <div className="text-[10px] text-slate-400">16:8 Timer</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Plans & Nutrition</h3>
              <div className="space-y-1.5">
                <button 
                  onClick={() => setActiveScreen('planner')}
                  className="w-full bg-white p-3.5 rounded-2xl border border-[#edf0e8] flex items-center justify-between text-left hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Weekly Meal Planner</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button 
                  onClick={() => setActiveScreen('recipes')}
                  className="w-full bg-white p-3.5 rounded-2xl border border-[#edf0e8] flex items-center justify-between text-left hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Recipe Catalog (50,000+ Dishes)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button 
                  onClick={() => setActiveScreen('grocery')}
                  className="w-full bg-white p-3.5 rounded-2xl border border-[#edf0e8] flex items-center justify-between text-left hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Smart Grocery List</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button 
                  onClick={() => setActiveScreen('swiggy')}
                  className="w-full bg-white p-3.5 rounded-2xl border border-[#edf0e8] flex items-center justify-between text-left hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <ChefHat className="w-4 h-4 text-[#f59e0b]" />
                    <span className="text-xs font-bold text-slate-800">Swiggy & Zomato Ordering Guide</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button 
                  onClick={() => setActiveScreen('custom_recipes')}
                  className="w-full bg-white p-3.5 rounded-2xl border border-[#edf0e8] flex items-center justify-between text-left hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <SlidersHorizontal className="w-4 h-4 text-[#2ba5f7]" />
                    <span className="text-xs font-bold text-slate-800">Custom Recipe Builder</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button 
                  onClick={() => setActiveScreen('account')}
                  className="w-full bg-white p-3.5 rounded-2xl border border-[#edf0e8] flex items-center justify-between text-left hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-800">Profile & Target Calibration</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            SUB-SCREENS: SCANNER, PLANNER, RECIPES, COACH, ETC.
            ======================================================== */}
        {activeScreen === 'scanner' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
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
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>
            <AICoach profile={profile} macroGoals={macroGoals} />
          </div>
        )}

        {activeScreen === 'fridge' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>
            <FridgeAI onSelectRecipe={(recipe) => setSelectedRecipe(recipe)} />
          </div>
        )}

        {activeScreen === 'fasting' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>
            <FastingTimer fastingState={fastingState} setFastingState={setFastingState} />
          </div>
        )}

        {activeScreen === 'workouts' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('statistic')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Statistic</span>
            </button>
            <WorkoutTracker 
              profile={profile}
              workouts={workouts} 
              onAddWorkout={(w) => setWorkouts([...workouts, w])} 
              onRemoveWorkout={(id: string) => setWorkouts(workouts.filter(w => w.id !== id))} 
            />
          </div>
        )}

        {activeScreen === 'swiggy' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>
            <SwiggyGuide />
          </div>
        )}

        {activeScreen === 'custom_recipes' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
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

        {activeScreen === 'planner' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            
            <div className="bg-white rounded-3xl p-5 border border-[#edf0e8] space-y-3">
              <h3 className="font-bold text-base text-slate-900">Your Weekly Thali Plan</h3>
              <p className="text-xs text-slate-500">
                Calibrated to {macroGoals.calories} kcal ({macroGoals.proteinGrams}g Protein, {macroGoals.carbsGrams}g Carbs, {macroGoals.fatsGrams}g Fats)
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { slot: 'early_morning' as MealSlot, title: 'Early Morning (07:00 AM)', item: mealPlan.meals.early_morning },
                  { slot: 'breakfast' as MealSlot, title: 'Breakfast (08:30 AM)', item: mealPlan.meals.breakfast },
                  { slot: 'lunch' as MealSlot, title: 'Lunch Thali (01:30 PM)', item: mealPlan.meals.lunch },
                  { slot: 'snack' as MealSlot, title: 'Evening Fuel (05:00 PM)', item: mealPlan.meals.snack },
                  { slot: 'dinner' as MealSlot, title: 'Dinner Thali (08:00 PM)', item: mealPlan.meals.dinner }
                ].map((row) => (
                  <div key={row.slot} className="p-3.5 bg-[#f6f8f4] rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{row.title}</div>
                      <div className="font-bold text-sm text-slate-900 mt-0.5">{row.item.name}</div>
                      <div className="text-[11px] text-slate-500">{row.item.calories} kcal · {row.item.protein}g P · {row.item.servingSize}</div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button 
                        onClick={() => setSwappingSlot(row.slot)}
                        className="px-2.5 py-1.5 bg-white border border-[#edf0e8] rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Swap</span>
                      </button>
                      <button 
                        onClick={() => setSelectedRecipe(row.item)}
                        className="px-2.5 py-1.5 bg-white border border-[#edf0e8] rounded-xl text-xs font-bold text-slate-700"
                      >
                        Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'recipes' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('dashboard')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="bg-white rounded-3xl p-5 border border-[#edf0e8] space-y-3">
              <h3 className="font-bold text-base text-slate-900">50,000+ Indian Fitness Recipes</h3>
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  placeholder="Search dal, paneer, oats, chilla, khichdi..."
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  className="w-full bg-[#f6f8f4] border border-[#edf0e8] rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {['all', 'high-protein', 'quick', 'north', 'south'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRecipeFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer ${
                      recipeFilter === cat ? 'bg-[#d8f572] text-[#1b2b0a]' : 'bg-[#f1f3ec] text-slate-600'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredRecipes.slice(0, 30).map((food) => (
                  <div 
                    key={food.id}
                    onClick={() => setSelectedRecipe(food)}
                    className="p-3 bg-[#f6f8f4] rounded-2xl flex items-center justify-between hover:bg-slate-100 transition cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{food.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {food.calories} kcal · {food.protein}g Protein · {food.carbs}g Carbs
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'grocery' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>

            <div className="bg-white rounded-3xl p-5 border border-[#edf0e8] space-y-3">
              <h3 className="font-bold text-base text-slate-900">Smart Grocery List</h3>
              <p className="text-xs text-slate-500">Auto-generated ingredients for this week's plan.</p>

              <div className="space-y-2 pt-1">
                {defaultGroceryItems.map((item) => {
                  const isChecked = checkedGrocery.includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setCheckedGrocery(prev => 
                          prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]
                        );
                        haptic.selection();
                      }}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isChecked ? 'bg-slate-50 border-slate-200 opacity-60 line-through' : 'bg-[#f6f8f4] border-[#edf0e8]'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{item.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'account' && (
          <div className="p-4 space-y-3">
            <button 
              onClick={() => setActiveScreen('menu')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-[#edf0e8] px-3 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>

            <div className="bg-white rounded-3xl p-5 border border-[#edf0e8] space-y-4">
              <h3 className="font-bold text-base text-slate-900">Profile & Metabolic Calculator</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#f6f8f4] border border-[#edf0e8] rounded-xl px-3 py-2 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Target Weight ({weightUnit})</label>
                    <input 
                      type="number" 
                      value={targetWeight} 
                      onChange={(e) => setTargetWeight(Number(e.target.value) || 65)}
                      className="w-full bg-[#f6f8f4] border border-[#edf0e8] rounded-xl px-3 py-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Weight Unit</label>
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
                      className="w-full bg-[#f6f8f4] border border-[#edf0e8] rounded-xl px-3 py-2 font-medium"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lb">Pounds (lb)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Fitness Goal</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value as any })}
                    className="w-full bg-[#f6f8f4] border border-[#edf0e8] rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="fat_loss">Fat Loss (-20% Calorie Deficit)</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Building (+15% Calorie Surplus)</option>
                    <option value="recomp">Body Recomposition</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Mifflin-St Jeor Energy Target</div>
                    <div className="text-[11px] text-slate-500">{macroGoals.calories} kcal ({macroGoals.proteinGrams}g Protein)</div>
                  </div>
                  <button 
                    onClick={() => notify("Profile settings saved successfully!")}
                    className="px-4 py-2 bg-[#d8f572] text-[#1b2b0a] font-bold text-xs rounded-xl shadow-xs interactive-btn cursor-pointer"
                    aria-label="Save Energy Target & Profile"
                  >
                    Save Profile & Target
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Mobile Bottom Navigation */}
        {renderFloatingNav(false)}
        <div className="w-32 h-1 bg-slate-900/80 rounded-full mx-auto my-2 shrink-0 select-none" />

        {/* Global Toast Alert */}
        {toast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 animate-in fade-in duration-200">
            <Check className="w-3.5 h-3.5 text-[#d8f572]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Recipe Detail Modal */}
        <RecipeModal 
          food={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onAddToPlan={(food) => {
            notify(`${food.name} added to your weekly plan.`);
          }}
        />

        {/* Meal Swapper Modal */}
        <MealSwapperModal 
          slot={swappingSlot}
          profile={profile}
          currentFood={swappingSlot ? mealPlan.meals[swappingSlot] : null}
          onClose={() => setSwappingSlot(null)}
          onSelectFood={(slot, newFood) => {
            setMealPlan((prev) => ({
              ...prev,
              meals: {
                ...prev.meals,
                [slot]: newFood
              }
            }));
            notify(`Swapped with ${newFood.name}.`);
          }}
        />
      </div>
    </div>
  );
}

export default App;
