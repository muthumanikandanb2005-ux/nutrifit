import { useState, useEffect } from 'react';
import type { 
  UserProfile, MealSlot, FoodItem, DailyMealPlan, 
  WorkoutEntry, FastingState, CustomRecipe, StepsLogEntry 
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
import { 
  Home, 
  CalendarDays, 
  Utensils, 
  ShoppingBag, 
  Target, 
  Footprints, 
  Droplets, 
  Bot, 
  Camera, 
  Refrigerator, 
  Timer, 
  Dumbbell, 
  User, 
  Settings, 
  Sparkles, 
  Sun, 
  Moon, 
  Plus, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpRight, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  Clock, 
  Share2, 
  RefreshCw, 
  Leaf, 
  Coffee, 
  SunMedium, 
  Apple, 
  MoonStar, 
  Store, 
  ChefHat,
  TrendingUp,
  Award,
  BookOpen
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

  // Active Tab / Screen
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('morrow_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      name: 'Maya Chen',
      age: 26,
      gender: 'female',
      weightKg: 68.4,
      heightCm: 168,
      activityLevel: 'moderately_active',
      goal: 'maintenance',
      dietType: 'vegetarian',
      region: 'all',
      budget: 'moderate',
      medicalConditions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('morrow_profile', JSON.stringify(profile));
  }, [profile]);

  // Extended Goals & Wellbeing state
  const [wellnessGoal] = useState<string>('maintain');
  const [targetWeight, setTargetWeight] = useState<number>(68.4);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [waterUnit, setWaterUnit] = useState<'ml' | 'oz'>('ml');
  const [stepGoal] = useState<number>(8000);
  const [waterGoal] = useState<number>(2000);

  // Daily Metrics
  const [steps, setSteps] = useState<number>(5842);
  const [waterAmount, setWaterAmount] = useState<number>(1250);

  // Settings Toggles
  const [settings, setSettings] = useState({
    mealReminder: true,
    mealPrep: false,
    movement: true,
    waterReminder: true,
    weighInReminder: false,
    nutrition: true,
  });

  // Grocery List State
  const [checkedGrocery, setCheckedGrocery] = useState<string[]>([]);
  const [addedGrocery, setAddedGrocery] = useState<Array<{ id: string; name: string; amount: string }>>([]);

  // Meal Planner & Recipes State
  const [plannedMeals, setPlannedMeals] = useState<string[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(6); // Sunday by default
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

  // Sub-feature states (Workouts, Fasting, Custom Recipes, Steps logs)
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([
    {
      id: 'w1',
      name: 'Morning Stroll & Core Stretches',
      category: 'running',
      durationMins: 30,
      caloriesBurned: 140,
      intensity: 'low',
      timestamp: '07:00 AM'
    }
  ]);
  const [fastingState, setFastingState] = useState<FastingState>({
    isFasting: false,
    startTime: null,
    targetDurationHours: 16,
    protocol: '16_8'
  });
  const [savedCustomRecipes, setSavedCustomRecipes] = useState<CustomRecipe[]>([]);
  const [stepsLogs, setStepsLogs] = useState<StepsLogEntry[]>([
    {
      id: 's1',
      date: 'Today',
      time: '08:00 AM',
      title: 'Morning stroll',
      steps: 2140,
      distanceKm: 1.6,
      caloriesBurned: 95,
      durationMins: 18,
      avgPaceMinutesPerKm: 11.2,
      activityType: 'walk',
    },
    {
      id: 's2',
      date: 'Today',
      time: '02:30 PM',
      title: 'Afternoon errands',
      steps: 3702,
      distanceKm: 2.7,
      caloriesBurned: 160,
      durationMins: 24,
      avgPaceMinutesPerKm: 8.9,
      activityType: 'walk',
    }
  ]);

  // Toast Notification helper
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2300);
  };

  const initials = (n: string) => {
    return (n || 'Maya Chen')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  };

  const firstName = (n: string) => (n || 'Maya').trim().split(/\s+/)[0];

  const shownVolume = (ml: number) => {
    return waterUnit === 'oz' ? Math.round(ml * 0.033814).toLocaleString() : Math.round(ml).toLocaleString();
  };

  const shownWeight = (kg: number) => {
    return weightUnit === 'lb' ? (kg * 2.20462).toFixed(1) : kg.toFixed(1);
  };

  const stepPct = Math.min(100, Math.round((steps / Math.max(stepGoal, 1)) * 100));
  const stepsLeft = Math.max(0, stepGoal - steps);
  const waterPct = Math.min(100, Math.round((waterAmount / Math.max(waterGoal, 1)) * 100));
  const waterRemaining = Math.max(0, waterGoal - waterAmount);

  // Default grocery staples
  const defaultGroceryItems = [
    { id: 'tomatoes', name: 'Ripe tomatoes', amount: '6', group: 'Produce' },
    { id: 'coriander', name: 'Fresh coriander', amount: '1 bunch', group: 'Produce' },
    { id: 'curry-leaves', name: 'Curry leaves', amount: '1 bunch', group: 'Produce' },
    { id: 'ginger', name: 'Fresh ginger', amount: '1 piece', group: 'Produce' },
    { id: 'basmati', name: 'Basmati rice', amount: '1 kg', group: 'Pantry & protein' },
    { id: 'toor-dal', name: 'Toor dal', amount: '500 g', group: 'Pantry & protein' },
    { id: 'paneer', name: 'Paneer', amount: '200 g', group: 'Pantry & protein' },
    { id: 'atta', name: 'Whole wheat atta', amount: '1 kg', group: 'Pantry & protein' },
  ];

  const breadcrumbs: Record<string, string> = {
    dashboard: 'Overview',
    planner: 'Meal planner',
    recipes: 'Recipes',
    grocery: 'Shopping list',
    goals: 'Goals & weight',
    steps: 'Steps & activity',
    water: 'Water tracking',
    account: 'Profile setup',
    settings: 'Settings',
    more: 'More',
    coach: 'AI Coach',
    scanner: 'Food Scanner',
    fridge: 'Fridge AI',
    fasting: 'Fasting Timer',
    workouts: 'Workouts',
    swiggy: 'Dining Guide',
    custom_recipes: 'Recipe Builder'
  };

  // Recipe catalog filtering
  const filteredRecipes = INDIAN_FOOD_DATABASE.filter((dish) => {
    const matchesSearch = !recipeSearch || 
      dish.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      (dish.hindiName && dish.hindiName.toLowerCase().includes(recipeSearch.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (recipeFilter === 'all') return true;
    if (recipeFilter === 'south') return dish.region.includes('south_indian');
    if (recipeFilter === 'north') return dish.region.includes('north_indian');
    if (recipeFilter === 'gujarati') return dish.region.includes('west_indian') || dish.name.toLowerCase().includes('dhokla');
    if (recipeFilter === 'quick') return dish.prepTimeMins <= 30;
    if (recipeFilter === 'high-protein') return dish.protein >= 15;
    return true;
  });

  return (
    <div id="morrow-app" data-theme={theme}>
      <div className="window">
        {/* Desktop Sidebar Navigation */}
        <aside className="side" aria-label="Main navigation">
          <div className="brand" onClick={() => setActiveScreen('dashboard')}>
            <span className="brandmark" aria-hidden="true">
              <Leaf className="w-4 h-4" />
            </span>
            <span>morrow</span>
          </div>

          <div>
            <p className="navlabel">Routine</p>
            <nav className="navlist">
              <button 
                className="navbtn" 
                data-screen="dashboard" 
                aria-current={activeScreen === 'dashboard' ? 'page' : undefined}
                onClick={() => setActiveScreen('dashboard')}
              >
                <span className="navicon"><Home /></span>
                <span className="navtext">Overview</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="planner" 
                aria-current={activeScreen === 'planner' ? 'page' : undefined}
                onClick={() => setActiveScreen('planner')}
              >
                <span className="navicon"><CalendarDays /></span>
                <span className="navtext">Meal planner</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="recipes" 
                aria-current={activeScreen === 'recipes' ? 'page' : undefined}
                onClick={() => setActiveScreen('recipes')}
              >
                <span className="navicon"><Utensils /></span>
                <span className="navtext">Recipes</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="grocery" 
                aria-current={activeScreen === 'grocery' ? 'page' : undefined}
                onClick={() => setActiveScreen('grocery')}
              >
                <span className="navicon"><ShoppingBag /></span>
                <span className="navtext">Shopping list</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="navlabel">Wellbeing</p>
            <nav className="navlist">
              <button 
                className="navbtn" 
                data-screen="goals" 
                aria-current={activeScreen === 'goals' ? 'page' : undefined}
                onClick={() => setActiveScreen('goals')}
              >
                <span className="navicon"><Target /></span>
                <span className="navtext">Goals & weight</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="steps" 
                aria-current={activeScreen === 'steps' ? 'page' : undefined}
                onClick={() => setActiveScreen('steps')}
              >
                <span className="navicon"><Footprints /></span>
                <span className="navtext">Steps & activity</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="water" 
                aria-current={activeScreen === 'water' ? 'page' : undefined}
                onClick={() => setActiveScreen('water')}
              >
                <span className="navicon"><Droplets /></span>
                <span className="navtext">Water tracking</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="navlabel">Smart Tools</p>
            <nav className="navlist">
              <button 
                className="navbtn" 
                data-screen="coach" 
                aria-current={activeScreen === 'coach' ? 'page' : undefined}
                onClick={() => setActiveScreen('coach')}
              >
                <span className="navicon"><Bot /></span>
                <span className="navtext">AI Coach</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="scanner" 
                aria-current={activeScreen === 'scanner' ? 'page' : undefined}
                onClick={() => setActiveScreen('scanner')}
              >
                <span className="navicon"><Camera /></span>
                <span className="navtext">Food Scanner</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="fridge" 
                aria-current={activeScreen === 'fridge' ? 'page' : undefined}
                onClick={() => setActiveScreen('fridge')}
              >
                <span className="navicon"><Refrigerator /></span>
                <span className="navtext">Fridge AI</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="fasting" 
                aria-current={activeScreen === 'fasting' ? 'page' : undefined}
                onClick={() => setActiveScreen('fasting')}
              >
                <span className="navicon"><Timer /></span>
                <span className="navtext">Fasting Timer</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="workouts" 
                aria-current={activeScreen === 'workouts' ? 'page' : undefined}
                onClick={() => setActiveScreen('workouts')}
              >
                <span className="navicon"><Dumbbell /></span>
                <span className="navtext">Workouts</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="swiggy" 
                aria-current={activeScreen === 'swiggy' ? 'page' : undefined}
                onClick={() => setActiveScreen('swiggy')}
              >
                <span className="navicon"><Store /></span>
                <span className="navtext">Dining Guide</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="custom_recipes" 
                aria-current={activeScreen === 'custom_recipes' ? 'page' : undefined}
                onClick={() => setActiveScreen('custom_recipes')}
              >
                <span className="navicon"><ChefHat /></span>
                <span className="navtext">Recipe Builder</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="navlabel">Account</p>
            <nav className="navlist">
              <button 
                className="navbtn" 
                data-screen="account" 
                aria-current={activeScreen === 'account' ? 'page' : undefined}
                onClick={() => setActiveScreen('account')}
              >
                <span className="navicon"><User /></span>
                <span className="navtext">Profile setup</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="settings" 
                aria-current={activeScreen === 'settings' ? 'page' : undefined}
                onClick={() => setActiveScreen('settings')}
              >
                <span className="navicon"><Settings /></span>
                <span className="navtext">Settings</span>
              </button>
            </nav>
          </div>

          <div className="sidebottom">
            <div className="sidebar-tip">
              <div className="flex items-center gap-1.5 text-[var(--green)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Daily Inspiration</span>
              </div>
              <strong>A little goes a long way</strong>
              <p>Plan a few wholesome Indian meals now and give your week more breathing room.</p>
            </div>
            <button className="accountmini" onClick={() => setActiveScreen('account')}>
              <span className="avatar">{initials(profile.name)}</span>
              <span className="accountmeta">
                <strong>{profile.name}</strong>
                <span>Personal thali plan</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[var(--muted)] ml-auto" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="main">
          {/* Top Bar */}
          <div className="topbar">
            <span className="brand mobile-wordmark" onClick={() => setActiveScreen('dashboard')}>
              <span className="brandmark" aria-hidden="true">
                <Leaf className="w-4 h-4" />
              </span>
              <span>morrow</span>
            </span>
            <span className="crumb" id="crumb">
              Your week &nbsp;/ &nbsp;{breadcrumbs[activeScreen] || 'Overview'}
            </span>
            <div className="topactions">
              <button 
                className="iconbtn" 
                onClick={() => {
                  const next = theme === 'dark' ? 'light' : 'dark';
                  setTheme(next);
                  notify(`Switched to ${next} theme.`);
                }} 
                aria-label="Toggle theme appearance"
                title="Toggle appearance"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button 
                className="iconbtn" 
                onClick={() => setActiveScreen('settings')} 
                aria-label="Open settings"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                className="iconbtn" 
                onClick={() => setActiveScreen('account')} 
                aria-label="Open account setup"
                title="Profile"
              >
                <span className="avatar" style={{ width: '27px', height: '27px', fontSize: '10px' }}>
                  {initials(profile.name)}
                </span>
              </button>
            </div>
          </div>

          {/* Active Screen View */}
          <main id="screen-panel" aria-live="polite">
            {/* 1. DASHBOARD / OVERVIEW */}
            {activeScreen === 'dashboard' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Sunday, October 25, 2026</p>
                    <h1>Good morning, <span className="account-name">{firstName(profile.name)}</span></h1>
                    <p className="subline">A mindful meal plan makes room for a balanced, energized week.</p>
                  </div>
                  <button className="primary" onClick={() => setActiveScreen('planner')}>
                    <CalendarDays className="w-4 h-4" />
                    <span>Plan this week</span>
                  </button>
                </div>

                <div className="grid">
                  <div className="stack">
                    <section className="surface hero">
                      <div className="herocopy">
                        <p className="eyebrow">Mindful Indian Nutrition</p>
                        <h2>Wholesome food, zero guesswork.</h2>
                        <p>Authentic regional dishes calibrated to your personal calorie and macro targets.</p>
                        <button className="primary" onClick={() => setActiveScreen('planner')}>
                          <span>View weekly schedule</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <img 
                        className="hero-photo" 
                        src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80" 
                        alt="Balanced Indian Thali" 
                      />
                    </section>

                    {/* Today's Meals Schedule */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Today’s table</h2>
                          <p>5 balanced Indian meal slots calibrated to {macroGoals.calories} kcal</p>
                        </div>
                        <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('planner')}>
                          <span>Full plan</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="meals">
                        {/* Early Morning */}
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.early_morning)}
                        >
                          <span className="mealtime">07:00 AM</span>
                          <span className="mealemoji bg-[#e6f0e6] text-[#365c44]">
                            <Apple className="w-4 h-4" />
                          </span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.early_morning.name}</strong>
                            <span>Early Morning · {mealPlan.meals.early_morning.servingSize}</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.early_morning.calories} kcal</span>
                        </div>

                        {/* Breakfast */}
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.breakfast)}
                        >
                          <span className="mealtime">08:30 AM</span>
                          <span className="mealemoji bg-[#f9eedc] text-[#8c6b2d]">
                            <SunMedium className="w-4 h-4" />
                          </span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.breakfast.name}</strong>
                            <span>Breakfast · {mealPlan.meals.breakfast.servingSize}</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.breakfast.calories} kcal</span>
                        </div>

                        {/* Lunch */}
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.lunch)}
                        >
                          <span className="mealtime">01:30 PM</span>
                          <span className="mealemoji bg-[#e6f0e6] text-[#2c4d38]">
                            <Utensils className="w-4 h-4" />
                          </span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.lunch.name}</strong>
                            <span>Lunch · {mealPlan.meals.lunch.servingSize}</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.lunch.calories} kcal</span>
                        </div>

                        {/* Evening Snack */}
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.snack)}
                        >
                          <span className="mealtime">05:00 PM</span>
                          <span className="mealemoji bg-[#f6e6e1] text-[#9b4e3f]">
                            <Coffee className="w-4 h-4" />
                          </span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.snack.name}</strong>
                            <span>Evening Snack · {mealPlan.meals.snack.servingSize}</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.snack.calories} kcal</span>
                        </div>

                        {/* Dinner */}
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.dinner)}
                        >
                          <span className="mealtime">08:00 PM</span>
                          <span className="mealemoji bg-[#e5eef2] text-[#477280]">
                            <MoonStar className="w-4 h-4" />
                          </span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.dinner.name}</strong>
                            <span>Dinner · {mealPlan.meals.dinner.servingSize}</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.dinner.calories} kcal</span>
                        </div>
                      </div>
                    </section>

                    {/* Quick Wellness Tools */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Smart fitness companions</h2>
                          <p>Interactive tools designed for Indian health goals</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        <button 
                          className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--greenSoft)] text-left transition-colors cursor-pointer"
                          onClick={() => setActiveScreen('coach')}
                        >
                          <Bot className="w-5 h-5 text-[var(--green)] mb-1.5" />
                          <strong className="block text-xs text-[var(--ink)]">AI Coach</strong>
                          <span className="text-[10px] text-[var(--muted)]">Ask nutrition queries</span>
                        </button>
                        <button 
                          className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--greenSoft)] text-left transition-colors cursor-pointer"
                          onClick={() => setActiveScreen('scanner')}
                        >
                          <Camera className="w-5 h-5 text-[var(--green)] mb-1.5" />
                          <strong className="block text-xs text-[var(--ink)]">Food Scanner</strong>
                          <span className="text-[10px] text-[var(--muted)]">Live camera analysis</span>
                        </button>
                        <button 
                          className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--greenSoft)] text-left transition-colors cursor-pointer"
                          onClick={() => setActiveScreen('fridge')}
                        >
                          <Refrigerator className="w-5 h-5 text-[var(--green)] mb-1.5" />
                          <strong className="block text-xs text-[var(--ink)]">Fridge AI</strong>
                          <span className="text-[10px] text-[var(--muted)]">Cook from pantry</span>
                        </button>
                        <button 
                          className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--greenSoft)] text-left transition-colors cursor-pointer"
                          onClick={() => setActiveScreen('fasting')}
                        >
                          <Timer className="w-5 h-5 text-[var(--green)] mb-1.5" />
                          <strong className="block text-xs text-[var(--ink)]">Fasting Timer</strong>
                          <span className="text-[10px] text-[var(--muted)]">Intermittent protocol</span>
                        </button>
                      </div>
                    </section>

                    <div className="tipstrip">
                      <Sparkles className="w-4 h-4 text-[#8e682e] shrink-0 mt-0.5" />
                      <div>
                        <strong>Your gentle nudge</strong>
                        <span>Prep protein grains and lentils once today; tomorrow’s lunch is already halfway done.</span>
                      </div>
                    </div>
                  </div>

                  <div className="stack">
                    {/* Energy & Macros Widget */}
                    <section className="surface progresscard">
                      <div className="sectionhead">
                        <div>
                          <h2>Daily macro budget</h2>
                          <p>{macroGoals.calories} kcal calibrated target</p>
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--greenSoft)] text-[var(--greenDark)] font-semibold">
                          Target active
                        </span>
                      </div>
                      <div className="stepslayout">
                        <div>
                          <div className="statnum">{macroGoals.calories}</div>
                          <div className="unit">recommended daily energy</div>
                          <p style={{ margin: '5px 0 12px', color: 'var(--muted)', fontSize: '11px' }}>
                            {macroGoals.proteinGrams}g Protein · {macroGoals.carbsGrams}g Carbs · {macroGoals.fatsGrams}g Fats
                          </p>
                          <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('account')}>
                            <span>Adjust profile</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="ring" style={{ ['--angle' as string]: '78%' }}>
                          <div className="ringinner">
                            <strong>{macroGoals.proteinGrams}g</strong>
                            <span>protein</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-3 pt-3 border-t border-[var(--line)]">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-[var(--ink)]">Protein</span>
                            <span className="text-[var(--muted)]">{macroGoals.proteinGrams}g goal</span>
                          </div>
                          <div className="track h-1.5 m-0">
                            <div className="fill bg-[var(--green)]" style={{ width: '85%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-[var(--ink)]">Complex Carbs</span>
                            <span className="text-[var(--muted)]">{macroGoals.carbsGrams}g goal</span>
                          </div>
                          <div className="track h-1.5 m-0">
                            <div className="fill bg-[#c29758]" style={{ width: '70%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-[var(--ink)]">Healthy Fats</span>
                            <span className="text-[var(--muted)]">{macroGoals.fatsGrams}g goal</span>
                          </div>
                          <div className="track h-1.5 m-0">
                            <div className="fill bg-[#d9826c]" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Steps Widget */}
                    <section className="surface progresscard">
                      <div className="sectionhead">
                        <div>
                          <h2>Daily steps</h2>
                          <p>Moving at your natural pace</p>
                        </div>
                        <Footprints className="w-4 h-4 text-[var(--green)]" />
                      </div>
                      <div className="stepslayout">
                        <div>
                          <div className="statnum">{steps.toLocaleString()}</div>
                          <div className="unit">of {stepGoal.toLocaleString()} steps</div>
                          <p style={{ margin: '5px 0 12px', color: 'var(--muted)', fontSize: '11px' }}>
                            {stepsLeft > 0 ? `${stepsLeft.toLocaleString()} steps to your daily goal` : 'Goal reached — wonderful effort!'}
                          </p>
                          <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('steps')}>
                            <span>Activity breakdown</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="ring" style={{ ['--angle' as string]: `${stepPct}%` }}>
                          <div className="ringinner">
                            <strong>{stepPct}%</strong>
                            <span>completed</span>
                          </div>
                        </div>
                      </div>
                      <div className="track">
                        <div className="fill" style={{ width: `${stepPct}%` }} />
                      </div>
                      <button 
                        className="secondary w-full mt-2" 
                        onClick={() => {
                          haptic.light();
                          setSteps((s) => s + 250);
                          notify('250 steps added to today.');
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        <span>Add 250 steps</span>
                      </button>
                    </section>

                    {/* Water Widget */}
                    <section className="surface watercard">
                      <div className="sectionhead">
                        <div>
                          <h2>Water intake</h2>
                          <p>{shownVolume(waterAmount)} of {shownVolume(waterGoal)} {waterUnit}</p>
                        </div>
                        <Droplets className="w-4 h-4 text-[#477280]" />
                      </div>
                      <div className="hydration-glasses">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((g, idx) => {
                          const filled = idx < Math.ceil(waterAmount / 250);
                          return (
                            <span key={g} className={`hydration-glass ${filled ? 'filled' : ''}`}>
                              {filled ? <Check className="w-3 h-3 text-[#2c4d38]" /> : <Droplets className="w-2.5 h-2.5 opacity-30" />}
                            </span>
                          );
                        })}
                      </div>
                      <div className="inline-actions">
                        <button 
                          className="secondary" 
                          onClick={() => {
                            haptic.medium();
                            setWaterAmount((w) => w + 250);
                            notify(`${shownVolume(250)} ${waterUnit} added.`);
                          }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>250 ml</span>
                        </button>
                        <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('water')}>
                          <span>Hydration log</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </section>

                    {/* Weekly Planned Count */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>This week</h2>
                          <p>Meals arranged so far</p>
                        </div>
                        <Award className="w-4 h-4 text-[var(--green)]" />
                      </div>
                      <div className="mealprogress">
                        <strong>{4 + plannedMeals.length} <span style={{ fontSize: '16px' }}>/ 7</span></strong>
                        <span>days organized</span>
                      </div>
                      <div className="weekdots">
                        <i className="done" />
                        <i className="done" />
                        <i className="done" />
                        <i className="done" />
                        <i className={plannedMeals.length >= 1 ? 'done' : ''} />
                        <i className={plannedMeals.length >= 2 ? 'done' : ''} />
                        <i className={plannedMeals.length >= 3 ? 'done' : ''} />
                      </div>
                      <div style={{ marginTop: '14px' }}>
                        <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('planner')}>
                          <span>Open full planner</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </section>

                    {/* Shopping List Preview */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Shopping list</h2>
                          <p>{defaultGroceryItems.length + addedGrocery.length} Indian ingredients</p>
                        </div>
                        <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('grocery')}>
                          <span>View list</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="meals">
                        <div className="mini-item flex items-center justify-between text-xs py-1">
                          <span>Toor dal (yellow pigeon peas)</span>
                          <span className="text-[var(--muted)]">500 g</span>
                        </div>
                        <div className="mini-item flex items-center justify-between text-xs py-1">
                          <span>Fresh curry leaves & coriander</span>
                          <span className="text-[var(--muted)]">1 bunch</span>
                        </div>
                        <div className="mini-item flex items-center justify-between text-xs py-1">
                          <span>Low-fat paneer</span>
                          <span className="text-[var(--muted)]">200 g</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MEAL PLANNER SCREEN */}
            {activeScreen === 'planner' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Plan ahead, feel calm</p>
                    <h1>Weekly Thali Planner</h1>
                    <p className="subline">A nourishing 5-slot daily schedule tailored to your lifestyle.</p>
                  </div>
                  <button className="primary" onClick={() => setActiveScreen('recipes')}>
                    <Plus className="w-4 h-4" />
                    <span>Browse recipes</span>
                  </button>
                </div>

                <section className="surface">
                  <div className="sectionhead">
                    <div>
                      <h2>October 19 – 25</h2>
                      <p>Week 43 · {4 + plannedMeals.length} days active</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="iconbtn" onClick={() => notify('Previous week shown.')}>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="iconbtn" onClick={() => notify('Next week shown.')}>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="weekselect" aria-label="Choose a day">
                    {['MON 19', 'TUE 20', 'WED 21', 'THU 22', 'FRI 23', 'SAT 24', 'SUN 25'].map((d, idx) => {
                      const [day, date] = d.split(' ');
                      const isActive = activeDayIndex === idx;
                      return (
                        <button 
                          key={d} 
                          type="button"
                          className={`daychip ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            haptic.selection();
                            setActiveDayIndex(idx);
                          }}
                        >
                          <span>{day}</span>
                          <strong>{date}</strong>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Early Morning Slot */}
                    <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f0e6] text-[#365c44] flex items-center justify-center shrink-0">
                          <Apple className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase text-[var(--muted)]">Early Morning · 07:00 AM</span>
                          <h3 className="text-sm font-bold text-[var(--ink)]">{mealPlan.meals.early_morning.name}</h3>
                          <span className="text-xs text-[var(--muted)]">
                            {mealPlan.meals.early_morning.calories} kcal · {mealPlan.meals.early_morning.protein}g protein · {mealPlan.meals.early_morning.servingSize}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSwappingSlot('early_morning')}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </button>
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSelectedRecipe(mealPlan.meals.early_morning)}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Recipe</span>
                        </button>
                      </div>
                    </div>

                    {/* Breakfast Slot */}
                    <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f9eedc] text-[#8e682e] flex items-center justify-center shrink-0">
                          <SunMedium className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase text-[var(--muted)]">Breakfast · 08:30 AM</span>
                          <h3 className="text-sm font-bold text-[var(--ink)]">{mealPlan.meals.breakfast.name}</h3>
                          <span className="text-xs text-[var(--muted)]">
                            {mealPlan.meals.breakfast.calories} kcal · {mealPlan.meals.breakfast.protein}g protein · {mealPlan.meals.breakfast.servingSize}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSwappingSlot('breakfast')}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </button>
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSelectedRecipe(mealPlan.meals.breakfast)}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Recipe</span>
                        </button>
                      </div>
                    </div>

                    {/* Lunch Slot */}
                    <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f0e6] text-[#2c4d38] flex items-center justify-center shrink-0">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase text-[var(--muted)]">Lunch Thali · 01:30 PM</span>
                          <h3 className="text-sm font-bold text-[var(--ink)]">{mealPlan.meals.lunch.name}</h3>
                          <span className="text-xs text-[var(--muted)]">
                            {mealPlan.meals.lunch.calories} kcal · {mealPlan.meals.lunch.protein}g protein · {mealPlan.meals.lunch.servingSize}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSwappingSlot('lunch')}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </button>
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSelectedRecipe(mealPlan.meals.lunch)}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Recipe</span>
                        </button>
                      </div>
                    </div>

                    {/* Evening Snack Slot */}
                    <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f6e6e1] text-[#9b4e3f] flex items-center justify-center shrink-0">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase text-[var(--muted)]">Evening Fuel · 05:00 PM</span>
                          <h3 className="text-sm font-bold text-[var(--ink)]">{mealPlan.meals.snack.name}</h3>
                          <span className="text-xs text-[var(--muted)]">
                            {mealPlan.meals.snack.calories} kcal · {mealPlan.meals.snack.protein}g protein · {mealPlan.meals.snack.servingSize}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSwappingSlot('snack')}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </button>
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSelectedRecipe(mealPlan.meals.snack)}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Recipe</span>
                        </button>
                      </div>
                    </div>

                    {/* Dinner Slot */}
                    <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e5eef2] text-[#477280] flex items-center justify-center shrink-0">
                          <MoonStar className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase text-[var(--muted)]">Dinner Thali · 08:00 PM</span>
                          <h3 className="text-sm font-bold text-[var(--ink)]">{mealPlan.meals.dinner.name}</h3>
                          <span className="text-xs text-[var(--muted)]">
                            {mealPlan.meals.dinner.calories} kcal · {mealPlan.meals.dinner.protein}g protein · {mealPlan.meals.dinner.servingSize}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSwappingSlot('dinner')}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </button>
                        <button 
                          className="secondary text-xs px-3 py-1.5"
                          onClick={() => setSelectedRecipe(mealPlan.meals.dinner)}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Recipe</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="tipstrip" style={{ marginTop: '15px' }}>
                  <Sparkles className="w-4 h-4 text-[#8e682e] shrink-0 mt-0.5" />
                  <div>
                    <strong>Keep it kind and flexible</strong>
                    <span>Leftovers and simple dals count as a plan, too. Add only what brings ease to your routine.</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. RECIPES CATALOG SCREEN */}
            {activeScreen === 'recipes' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">A kitchen full of heritage</p>
                    <h1>Indian Recipes</h1>
                    <p className="subline">Explore regional delicacies calibrated with exact calories and protein.</p>
                  </div>
                  <span className="recipe-total">{filteredRecipes.length}+ recipes</span>
                </div>

                <div className="tools">
                  <div className="searchwrap relative">
                    <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-3" />
                    <input 
                      className="input pl-9" 
                      type="search" 
                      placeholder="Search recipes (e.g. Paneer, Moong, Sattu, Dal)..."
                      value={recipeSearch}
                      onChange={(e) => setRecipeSearch(e.target.value)}
                    />
                  </div>
                  <button 
                    className="filter" 
                    aria-pressed={recipeFilter === 'all'}
                    onClick={() => setRecipeFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className="filter" 
                    aria-pressed={recipeFilter === 'south'}
                    onClick={() => setRecipeFilter('south')}
                  >
                    South Indian
                  </button>
                  <button 
                    className="filter" 
                    aria-pressed={recipeFilter === 'north'}
                    onClick={() => setRecipeFilter('north')}
                  >
                    North Indian
                  </button>
                  <button 
                    className="filter" 
                    aria-pressed={recipeFilter === 'gujarati'}
                    onClick={() => setRecipeFilter('gujarati')}
                  >
                    Gujarati
                  </button>
                  <button 
                    className="filter" 
                    aria-pressed={recipeFilter === 'quick'}
                    onClick={() => setRecipeFilter('quick')}
                  >
                    Under 30 min
                  </button>
                  <button 
                    className="filter" 
                    aria-pressed={recipeFilter === 'high-protein'}
                    onClick={() => setRecipeFilter('high-protein')}
                  >
                    High Protein
                  </button>
                </div>

                <div className="recipes">
                  {filteredRecipes.slice(0, 16).map((food) => (
                    <article key={food.id} className="surface recipecard">
                      <div 
                        className="recipeimage flex flex-col items-center justify-center cursor-pointer p-4 relative overflow-hidden"
                        style={{ background: 'var(--surface2)' }}
                        onClick={() => setSelectedRecipe(food)}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] text-[var(--green)] flex items-center justify-center shadow-sm mb-2">
                          <Utensils className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--greenDark)]">
                          {Array.isArray(food.dietType) ? food.dietType.map((d: string) => d.replace(/_/g, ' ')).join(', ') : String(food.dietType).replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="recipecopy">
                        <h3 
                          className="cursor-pointer font-bold text-sm text-[var(--ink)]"
                          onClick={() => setSelectedRecipe(food)}
                        >
                          {food.name}
                        </h3>
                        <p className="text-xs text-[var(--muted)] line-clamp-2">
                          {food.tips || `${food.calories} kcal · ${food.protein}g protein · ${food.servingSize}`}
                        </p>
                        <div className="recipemeta flex items-center justify-between text-xs text-[var(--muted)] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {food.prepTimeMins} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#c29758]" />
                            {food.calories} kcal
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-[var(--line)]">
                          <span className="text-xs font-semibold text-[var(--green)]">
                            {food.protein}g protein
                          </span>
                          <button 
                            className="secondary text-xs px-2.5 py-1" 
                            onClick={() => {
                              haptic.medium();
                              setPlannedMeals((prev) => [...prev, food.name]);
                              notify(`${food.name} added to your plan.`);
                            }}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SHOPPING LIST SCREEN */}
            {activeScreen === 'grocery' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">From plan to pantry</p>
                    <h1>Shopping list</h1>
                    <p className="subline">All ingredients organized by group for your planned meals.</p>
                  </div>
                  <button 
                    className="secondary flex items-center gap-1.5" 
                    onClick={() => {
                      haptic.light();
                      navigator.clipboard?.writeText(
                        defaultGroceryItems.map((i) => `• ${i.name} (${i.amount})`).join('\n')
                      );
                      notify('Your shopping list is copied to clipboard.');
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share list</span>
                  </button>
                </div>

                <section className="surface">
                  <div className="groceryhead">
                    <div>
                      <strong>{defaultGroceryItems.length + addedGrocery.length} items</strong>
                      <span className="unit"> · for your active routine</span>
                    </div>
                    <button 
                      className="textbtn" 
                      onClick={() => {
                        setCheckedGrocery([]);
                        notify('All items unchecked.');
                      }}
                    >
                      Uncheck all
                    </button>
                  </div>

                  <p className="grocerygroup">Fresh Produce</p>
                  <div id="grocery-list">
                    {defaultGroceryItems.filter((i) => i.group === 'Produce').map((item) => {
                      const isChecked = checkedGrocery.includes(item.id);
                      return (
                        <div 
                          key={item.id} 
                          className={`groceryitem ${isChecked ? 'checked' : ''}`}
                        >
                          <button 
                            className="check flex items-center justify-center" 
                            aria-pressed={isChecked}
                            onClick={() => {
                              haptic.selection();
                              setCheckedGrocery((prev) => 
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                              );
                            }}
                          >
                            {isChecked && <Check className="w-3 h-3 text-[var(--surface)]" />}
                          </button>
                          <span className="groceryname">{item.name}</span>
                          <span className="amount">{item.amount}</span>
                        </div>
                      );
                    })}

                    <p className="grocerygroup" style={{ marginTop: '18px' }}>Pantry, Grains & Protein</p>
                    {defaultGroceryItems.filter((i) => i.group === 'Pantry & protein').map((item) => {
                      const isChecked = checkedGrocery.includes(item.id);
                      return (
                        <div 
                          key={item.id} 
                          className={`groceryitem ${isChecked ? 'checked' : ''}`}
                        >
                          <button 
                            className="check flex items-center justify-center" 
                            aria-pressed={isChecked}
                            onClick={() => {
                              haptic.selection();
                              setCheckedGrocery((prev) => 
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                              );
                            }}
                          >
                            {isChecked && <Check className="w-3 h-3 text-[var(--surface)]" />}
                          </button>
                          <span className="groceryname">{item.name}</span>
                          <span className="amount">{item.amount}</span>
                        </div>
                      );
                    })}

                    {addedGrocery.map((item) => {
                      const isChecked = checkedGrocery.includes(item.id);
                      return (
                        <div 
                          key={item.id} 
                          className={`groceryitem ${isChecked ? 'checked' : ''}`}
                        >
                          <button 
                            className="check flex items-center justify-center" 
                            aria-pressed={isChecked}
                            onClick={() => {
                              setCheckedGrocery((prev) => 
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                              );
                            }}
                          >
                            {isChecked && <Check className="w-3 h-3 text-[var(--surface)]" />}
                          </button>
                          <span className="groceryname">{item.name}</span>
                          <span className="amount">{item.amount}</span>
                        </div>
                      );
                    })}
                  </div>

                  <form 
                    className="additem" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem('itemInput') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setAddedGrocery((prev) => [
                          ...prev,
                          { id: `custom_${Date.now()}`, name: input.value.trim(), amount: '1' }
                        ]);
                        notify(`${input.value.trim()} added to your list.`);
                        input.value = '';
                      }
                    }}
                  >
                    <input 
                      name="itemInput" 
                      className="input" 
                      type="text" 
                      placeholder="Add an item (e.g. Sprouted Moong, Sattu)" 
                    />
                    <button className="primary flex items-center gap-1" type="submit">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </form>
                </section>
              </div>
            )}

            {/* 5. STEPS & ACTIVITY SCREEN */}
            {activeScreen === 'steps' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Small steps add up</p>
                    <h1>Movement & Steps</h1>
                    <p className="subline">Gentle physical activity tuned for cardiovascular and metabolic balance.</p>
                  </div>
                  <button 
                    className="secondary flex items-center gap-1.5" 
                    onClick={() => {
                      haptic.light();
                      setSteps((s) => s + 500);
                      notify('500 steps logged.');
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log a walk</span>
                  </button>
                </div>

                <div className="grid">
                  <div className="stack">
                    <section className="surface">
                      <div className="stepshero">
                        <div className="ring" style={{ ['--angle' as string]: `${stepPct}%` }}>
                          <div className="ringinner">
                            <strong>{stepPct}%</strong>
                            <span>completed</span>
                          </div>
                        </div>
                        <div className="stepscopy">
                          <p className="eyebrow">Today’s steps</p>
                          <div className="statnum">{steps.toLocaleString()}</div>
                          <p className="subline">
                            of {stepGoal.toLocaleString()} steps · {stepsLeft > 0 ? `${stepsLeft.toLocaleString()} to your daily goal` : 'Goal reached!'}
                          </p>
                          <div className="track">
                            <div className="fill" style={{ width: `${stepPct}%` }} />
                          </div>
                          <button 
                            className="textbtn flex items-center gap-1" 
                            onClick={() => {
                              haptic.light();
                              setSteps((s) => s + 250);
                              setStepsLogs((prev) => [
                                ...prev,
                                {
                                  id: `s-${Date.now()}`,
                                  date: 'Today',
                                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  title: 'Quick stroll',
                                  steps: 250,
                                  distanceKm: 0.2,
                                  caloriesBurned: 12,
                                  durationMins: 4,
                                  avgPaceMinutesPerKm: 12,
                                  activityType: 'walk',
                                }
                              ]);
                              notify('250 steps added.');
                            }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add 250 steps</span>
                          </button>
                        </div>
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Your week in motion</h2>
                          <p>Steady daily rhythm</p>
                        </div>
                        <span className="unit">Daily steps</span>
                      </div>
                      <div className="history" role="img" aria-label="Weekly step history">
                        <div className="stepday"><div className="barwrap"><div className="bar" style={{ height: '72%' }} /></div><span>Mon</span></div>
                        <div className="stepday"><div className="barwrap"><div className="bar" style={{ height: '61%' }} /></div><span>Tue</span></div>
                        <div className="stepday"><div className="barwrap"><div className="bar" style={{ height: '84%' }} /></div><span>Wed</span></div>
                        <div className="stepday"><div className="barwrap"><div className="bar" style={{ height: '53%' }} /></div><span>Thu</span></div>
                        <div className="stepday"><div className="barwrap"><div className="bar" style={{ height: '76%' }} /></div><span>Fri</span></div>
                        <div className="stepday"><div className="barwrap"><div className="bar" style={{ height: '91%' }} /></div><span>Sat</span></div>
                        <div className="stepday today"><div className="barwrap"><div className="bar" style={{ height: `${stepPct}%` }} /></div><span>Today</span></div>
                      </div>
                    </section>
                  </div>

                  <div className="stack">
                    <section className="surface goalcard">
                      <span className="goalicon">
                        <Target className="w-5 h-5" />
                      </span>
                      <div>
                        <strong>Daily step goal</strong>
                        <p className="unit">{stepGoal.toLocaleString()} steps · steady, kind target</p>
                        <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('account')}>
                          <span>Adjust in account</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Today’s rhythm</h2>
                          <p>Logged activity entries</p>
                        </div>
                      </div>
                      <div className="meals">
                        {stepsLogs.map((log) => (
                          <div key={log.id} className="mealrow">
                            <span className="mealemoji bg-[#e6f0e6] text-[#2c4d38]">
                              <Footprints className="w-4 h-4" />
                            </span>
                            <span className="mealname">
                              <strong>{log.title}</strong>
                              <span>{log.durationMins} min · {log.avgPaceMinutesPerKm} pace · {log.caloriesBurned} kcal</span>
                            </span>
                            <span className="mealcal">{log.steps.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="tipstrip">
                      <Sparkles className="w-4 h-4 text-[#8e682e] shrink-0 mt-0.5" />
                      <div>
                        <strong>No perfection required</strong>
                        <span>Every little bit of movement counts. Take pauses whenever your body asks for them.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. WATER TRACKING SCREEN */}
            {activeScreen === 'water' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">A gentle daily rhythm</p>
                    <h1>Water tracking</h1>
                    <p className="subline">Log drinks as you go. Hydration helps nutrient transport and mental clarity.</p>
                  </div>
                </div>

                <div className="stack">
                  <section className="surface watercard">
                    <div className="water-top">
                      <div>
                        <p className="eyebrow">Today’s hydration</p>
                        <div className="water-value">{shownVolume(waterAmount)} <span className="unit">{waterUnit}</span></div>
                        <p className="subline">{shownVolume(waterRemaining)} {waterUnit} to your personal target</p>
                      </div>
                      <div className="ring" style={{ width: '88px', height: '88px', ['--angle' as string]: `${waterPct}%` }}>
                        <div className="ringinner" style={{ width: '70px', height: '70px' }}>
                          <strong style={{ fontSize: '17px' }}>{waterPct}%</strong>
                          <span>target</span>
                        </div>
                      </div>
                    </div>

                    <div className="track">
                      <div className="fill" style={{ width: `${waterPct}%` }} />
                    </div>

                    <div className="hydration-glasses">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((g, idx) => {
                        const filled = idx < Math.ceil(waterAmount / 250);
                        return (
                          <span key={g} className={`hydration-glass ${filled ? 'filled' : ''}`}>
                            {filled ? <Check className="w-3.5 h-3.5 text-[#2c4d38]" /> : <Droplets className="w-3 h-3 opacity-30" />}
                          </span>
                        );
                      })}
                    </div>

                    <div className="sectionhead">
                      <div>
                        <strong>Quick add</strong>
                        <p>Record a drink with one tap.</p>
                      </div>
                    </div>
                    <div className="inline-actions">
                      <button 
                        className="secondary flex items-center gap-1.5" 
                        onClick={() => {
                          haptic.medium();
                          setWaterAmount((w) => w + 250);
                          notify(`${shownVolume(250)} ${waterUnit} added.`);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{shownVolume(250)} {waterUnit}</span>
                      </button>
                      <button 
                        className="secondary flex items-center gap-1.5" 
                        onClick={() => {
                          haptic.medium();
                          setWaterAmount((w) => w + 500);
                          notify(`${shownVolume(500)} ${waterUnit} added.`);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{shownVolume(500)} {waterUnit}</span>
                      </button>
                      <button className="textbtn flex items-center gap-1" onClick={() => setActiveScreen('settings')}>
                        <span>Adjust target</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </section>

                  <div className="grid">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Today’s rhythm</h2>
                          <p>Your logged hydration checkpoints</p>
                        </div>
                        <span className="unit">Today</span>
                      </div>
                      <div className="history-row">
                        <span className="flex items-center gap-1.5"><SunMedium className="w-3.5 h-3.5 text-[#8e682e]" /> Morning glass</span>
                        <strong>500 ml</strong>
                      </div>
                      <div className="history-row">
                        <span className="flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5 text-[#365c44]" /> With breakfast</span>
                        <strong>250 ml</strong>
                      </div>
                      <div className="history-row">
                        <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-[#8e682e]" /> Midday</span>
                        <strong>500 ml</strong>
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Hydration reminders</h2>
                          <p>Quiet nudges on your schedule</p>
                        </div>
                      </div>
                      <div className="setting">
                        <div className="settingcopy">
                          <strong>Gentle water reminder</strong>
                          <span>Every 2 hours between 9:00 AM and 7:00 PM.</span>
                        </div>
                        <button 
                          className="switch" 
                          role="switch" 
                          aria-pressed={settings.waterReminder}
                          onClick={() => {
                            setSettings((prev) => ({ ...prev, waterReminder: !prev.waterReminder }));
                            notify(`Water reminder turned ${!settings.waterReminder ? 'on' : 'off'}.`);
                          }}
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {/* 7. GOALS & WEIGHT SCREEN */}
            {activeScreen === 'goals' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Your wellbeing, your pace</p>
                    <h1>Goals & weight</h1>
                    <p className="subline">Choose an intention that feels natural. You can adjust anytime.</p>
                  </div>
                  <button className="secondary" onClick={() => setActiveScreen('account')}>
                    Edit profile
                  </button>
                </div>

                <div className="stack">
                  <section className="surface">
                    <div className="goal-summary">
                      <span className="goal-summary-mark">
                        <Target className="w-4 h-4" />
                      </span>
                      <div>
                        <strong>{wellnessGoal === 'maintain' ? 'Maintain weight' : wellnessGoal === 'lose' ? 'Lose weight' : wellnessGoal === 'strength' ? 'Build strength' : 'Eat healthier'}</strong>
                        <span>Your plan is set around a flexible, balanced Indian routine.</span>
                      </div>
                    </div>
                  </section>

                  <div className="grid">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Weight check-in</h2>
                          <p>Log a check-in when it feels helpful.</p>
                        </div>
                        <span className="unit">Optional</span>
                      </div>
                      <div className="statline">
                        <div>
                          <div className="statnum">{shownWeight(profile.weightKg)} <span className="unit">{weightUnit}</span></div>
                          <div className="unit">Most recent · target {shownWeight(targetWeight)} {weightUnit}</div>
                        </div>
                        <span className="goal-summary-mark">
                          <TrendingUp className="w-4 h-4" />
                        </span>
                      </div>
                      <form 
                        className="additem" 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = (e.currentTarget.elements.namedItem('weightVal') as HTMLInputElement).value;
                          if (val && Number(val) > 0) {
                            setProfile((prev) => ({ ...prev, weightKg: Number(val) }));
                            notify('Weight check-in saved.');
                          }
                        }}
                      >
                        <input 
                          name="weightVal" 
                          className="input" 
                          type="number" 
                          step="0.1" 
                          defaultValue={profile.weightKg} 
                          placeholder={`Weight in ${weightUnit}`} 
                        />
                        <button className="primary" type="submit">Log weight</button>
                      </form>
                      <p className="hint" style={{ margin: '8px 0 0' }}>Weight tracking is optional. Your goal is chosen by you.</p>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Recent check-ins</h2>
                          <p>Your private log</p>
                        </div>
                        <button className="textbtn" onClick={() => setActiveScreen('settings')}>Units</button>
                      </div>
                      <div className="history-row"><span>Today</span><strong>{shownWeight(profile.weightKg)} {weightUnit}</strong></div>
                      <div className="history-row"><span>Last week</span><strong>{shownWeight(68.6)} {weightUnit}</strong></div>
                      <div className="history-row"><span>2 weeks ago</span><strong>{shownWeight(68.5)} {weightUnit}</strong></div>
                      <div className="history-row"><span>3 weeks ago</span><strong>{shownWeight(68.7)} {weightUnit}</strong></div>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {/* 8. ACCOUNT SETUP SCREEN */}
            {activeScreen === 'account' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Make it yours</p>
                    <h1>Account setup</h1>
                    <p className="subline">Calibrate Morrow to your body metrics, dietary style, and cuisine.</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--greenSoft)] text-[var(--greenDark)] font-semibold">
                    Profile active
                  </span>
                </div>

                <div className="grid">
                  <section className="surface">
                    <div className="sectionhead">
                      <div>
                        <h2>Personal metrics</h2>
                        <p>Used to calculate Mifflin-St Jeor metabolic goals</p>
                      </div>
                    </div>
                    <form 
                      className="formgrid"
                      onSubmit={(e) => {
                        e.preventDefault();
                        notify('Profile changes saved.');
                      }}
                    >
                      <div className="field">
                        <label>Name</label>
                        <input 
                          className="input" 
                          value={profile.name} 
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="field">
                        <label>Age</label>
                        <input 
                          className="input" 
                          type="number" 
                          value={profile.age} 
                          onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) || 25 })}
                        />
                      </div>
                      <div className="field">
                        <label>Gender</label>
                        <select 
                          className="select" 
                          value={profile.gender}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Weight (kg)</label>
                        <input 
                          className="input" 
                          type="number" 
                          step="0.1" 
                          value={profile.weightKg} 
                          onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) || 60 })}
                        />
                      </div>
                      <div className="field">
                        <label>Height (cm)</label>
                        <input 
                          className="input" 
                          type="number" 
                          value={profile.heightCm} 
                          onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) || 165 })}
                        />
                      </div>
                      <div className="field">
                        <label>Activity level</label>
                        <select 
                          className="select" 
                          value={profile.activityLevel}
                          onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as any })}
                        >
                          <option value="sedentary">Sedentary (desk work)</option>
                          <option value="lightly_active">Lightly active (1-3 days/week)</option>
                          <option value="moderately_active">Moderately active (3-5 days/week)</option>
                          <option value="very_active">Very active (6-7 days/week)</option>
                        </select>
                      </div>
                      <div className="field full">
                        <label>Dietary preference</label>
                        <select 
                          className="select" 
                          value={profile.dietType}
                          onChange={(e) => {
                            const newDiet = e.target.value as any;
                            const newProf = { ...profile, dietType: newDiet };
                            setProfile(newProf);
                            setMealPlan(generateDailyMealPlan(newProf, macroGoals.calories));
                            notify(`Diet updated to ${newDiet.replace('_', ' ')}.`);
                          }}
                        >
                          <option value="vegetarian">Indian Vegetarian</option>
                          <option value="pure_veg">Pure Vegetarian (No Onion/Garlic option)</option>
                          <option value="sattvic">Sattvic Ayurvedic</option>
                          <option value="jain">Jain Compliant</option>
                          <option value="high_protein_veg">High Protein Veg (Sattu, Paneer, Moong)</option>
                          <option value="eggetarian">Eggetarian</option>
                          <option value="non_vegetarian">Non-Vegetarian</option>
                        </select>
                      </div>
                      <div className="field full pt-2">
                        <button className="primary w-full" type="submit">
                          Save profile metrics
                        </button>
                      </div>
                    </form>
                  </section>

                  <section className="surface">
                    <div className="sectionhead">
                      <div>
                        <h2>Calculated daily targets</h2>
                        <p>Scientific metabolic output</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Basal Metabolic Rate (BMR)</span>
                        <strong className="text-sm text-[var(--ink)]">{Math.round(macroGoals.calories * 0.7)} kcal</strong>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Target Daily Energy</span>
                        <strong className="text-sm text-[var(--green)]">{macroGoals.calories} kcal</strong>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Daily Protein Minimum</span>
                        <strong className="text-sm text-[var(--ink)]">{macroGoals.proteinGrams} g</strong>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[var(--surface2)] flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Hydration Minimum</span>
                        <strong className="text-sm text-[var(--ink)]">{shownVolume(waterGoal)} {waterUnit}</strong>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* 9. SETTINGS SCREEN */}
            {activeScreen === 'settings' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Your space, your pace</p>
                    <h1>Settings</h1>
                    <p className="subline">Tune Morrow to work seamlessly with your lifestyle.</p>
                  </div>
                </div>

                <div className="grid">
                  <div className="stack">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Reminders</h2>
                          <p>Choose what you’d like gentle notifications about.</p>
                        </div>
                      </div>
                      <div className="settingslist">
                        <div className="setting">
                          <div className="settingcopy">
                            <strong>Meal planning reminder</strong>
                            <span>A gentle Sunday prompt to plan your week.</span>
                          </div>
                          <button 
                            className="switch" 
                            role="switch" 
                            aria-pressed={settings.mealReminder}
                            onClick={() => setSettings({ ...settings, mealReminder: !settings.mealReminder })}
                          />
                        </div>
                        <div className="setting">
                          <div className="settingcopy">
                            <strong>Daily movement nudge</strong>
                            <span>A quiet reminder to stretch or take a stroll.</span>
                          </div>
                          <button 
                            className="switch" 
                            role="switch" 
                            aria-pressed={settings.movement}
                            onClick={() => setSettings({ ...settings, movement: !settings.movement })}
                          />
                        </div>
                        <div className="setting">
                          <div className="settingcopy">
                            <strong>Water reminder</strong>
                            <span>Gentle prompts during your active daytime hours.</span>
                          </div>
                          <button 
                            className="switch" 
                            role="switch" 
                            aria-pressed={settings.waterReminder}
                            onClick={() => setSettings({ ...settings, waterReminder: !settings.waterReminder })}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Appearance</h2>
                          <p>Soft on the eyes in every environment</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                        </div>
                      </div>
                      <div className="setting">
                        <div className="settingcopy">
                          <strong>Dark appearance</strong>
                          <span>Use a softer, low-light color palette.</span>
                        </div>
                        <button 
                          className="switch" 
                          role="switch" 
                          aria-pressed={theme === 'dark'}
                          onClick={() => {
                            const next = theme === 'dark' ? 'light' : 'dark';
                            setTheme(next);
                            notify(`Switched to ${next} mode.`);
                          }}
                        />
                      </div>
                    </section>
                  </div>

                  <div className="stack">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Tracking preferences</h2>
                          <p>Units and goals configured to your habits</p>
                        </div>
                      </div>
                      <div className="field mb-3">
                        <label>Water units</label>
                        <select 
                          className="select" 
                          value={waterUnit} 
                          onChange={(e) => setWaterUnit(e.target.value as any)}
                        >
                          <option value="ml">Milliliters (ml)</option>
                          <option value="oz">Fluid ounces (oz)</option>
                        </select>
                      </div>
                      <div className="field mb-3">
                        <label>Weight units</label>
                        <select 
                          className="select" 
                          value={weightUnit} 
                          onChange={(e) => setWeightUnit(e.target.value as any)}
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lb">Pounds (lb)</option>
                        </select>
                      </div>
                      <div className="field mb-3">
                        <label>Target weight ({weightUnit})</label>
                        <input 
                          type="number"
                          step="0.1"
                          className="input"
                          value={targetWeight}
                          onChange={(e) => setTargetWeight(Number(e.target.value) || 0)}
                        />
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Account</h2>
                          <p>Signed in as {profile.name}</p>
                        </div>
                      </div>
                      <button className="secondary" onClick={() => setActiveScreen('account')}>
                        Manage account
                      </button>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {/* 10. MORE TOOLS DRAWER (Mobile) */}
            {activeScreen === 'more' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Your wellbeing toolkit</p>
                    <h1>More</h1>
                    <p className="subline">Comprehensive tools for your food, activity, and health routine.</p>
                  </div>
                </div>

                <div className="stack">
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('goals')}>
                    <span className="goalicon">
                      <Target className="w-5 h-5" />
                    </span>
                    <span><strong>Goals & weight</strong><span className="unit">Maintain weight & track body check-ins</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('steps')}>
                    <span className="goalicon">
                      <Footprints className="w-5 h-5" />
                    </span>
                    <span><strong>Steps & activity</strong><span className="unit">{steps.toLocaleString()} steps today</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('grocery')}>
                    <span className="goalicon">
                      <ShoppingBag className="w-5 h-5" />
                    </span>
                    <span><strong>Shopping list</strong><span className="unit">Indian pantry & fresh produce items</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('coach')}>
                    <span className="goalicon">
                      <Bot className="w-5 h-5" />
                    </span>
                    <span><strong>AI Fitness Coach</strong><span className="unit">Ask questions about Indian diets & workout plans</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('scanner')}>
                    <span className="goalicon">
                      <Camera className="w-5 h-5" />
                    </span>
                    <span><strong>Food Scanner</strong><span className="unit">Live camera food & nutrition recognition</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('fridge')}>
                    <span className="goalicon">
                      <Refrigerator className="w-5 h-5" />
                    </span>
                    <span><strong>Fridge AI</strong><span className="unit">Discover dishes from available ingredients</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('fasting')}>
                    <span className="goalicon">
                      <Timer className="w-5 h-5" />
                    </span>
                    <span><strong>Fasting Timer</strong><span className="unit">Intermittent fasting clock & stage tracking</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('workouts')}>
                    <span className="goalicon">
                      <Dumbbell className="w-5 h-5" />
                    </span>
                    <span><strong>Workouts & Burn</strong><span className="unit">Track training sessions, yoga & cardio</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('swiggy')}>
                    <span className="goalicon">
                      <Store className="w-5 h-5" />
                    </span>
                    <span><strong>Swiggy & Dining Guide</strong><span className="unit">Healthiest Indian restaurant order recommendations</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('custom_recipes')}>
                    <span className="goalicon">
                      <ChefHat className="w-5 h-5" />
                    </span>
                    <span><strong>Recipe Builder</strong><span className="unit">Calculate exact macros for home dishes</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('account')}>
                    <span className="goalicon">
                      <User className="w-5 h-5" />
                    </span>
                    <span><strong>Profile setup</strong><span className="unit">Diet, cuisine, body metrics and targets</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('settings')}>
                    <span className="goalicon">
                      <Settings className="w-5 h-5" />
                    </span>
                    <span><strong>Settings</strong><span className="unit">Reminders, appearance & units</span></span>
                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--muted)]" />
                  </button>
                </div>
              </div>
            )}

            {/* INTEGRATED SPECIALIZED TOOLS */}
            {activeScreen === 'coach' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Smart Nutrition Assistance</p>
                    <h1>AI Fitness Coach</h1>
                    <p className="subline">Ask anything about Indian thalis, macros, regional foods, and training.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <AICoach profile={profile} macroGoals={macroGoals} />
                </section>
              </div>
            )}

            {activeScreen === 'scanner' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Instant AI Nutrition Analysis</p>
                    <h1>Live Food Scanner</h1>
                    <p className="subline">Snap a photo of your food or meal to get calories, protein, and health score.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <FoodScanner onAddScannedFoodToPlan={() => notify('Item added to meal plan.')} />
                </section>
              </div>
            )}

            {activeScreen === 'fridge' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Cook With What You Have</p>
                    <h1>Fridge AI Finder</h1>
                    <p className="subline">Select your available ingredients to find matching Indian recipes.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <FridgeAI onSelectRecipe={(food) => setSelectedRecipe(food)} />
                </section>
              </div>
            )}

            {activeScreen === 'fasting' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Circadian Health</p>
                    <h1>Intermittent Fasting</h1>
                    <p className="subline">Track your fasting and eating windows with gentle cues.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <FastingTimer fastingState={fastingState} setFastingState={setFastingState} />
                </section>
              </div>
            )}

            {activeScreen === 'workouts' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Desi Training & Activity</p>
                    <h1>Workout Tracker</h1>
                    <p className="subline">Log your gym workouts, yoga, cardio, and calorie burns.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <WorkoutTracker 
                    profile={profile} 
                    workouts={workouts} 
                    onAddWorkout={(w) => setWorkouts([...workouts, w])}
                    onRemoveWorkout={(id) => setWorkouts(workouts.filter((w) => w.id !== id))}
                  />
                </section>
              </div>
            )}

            {activeScreen === 'swiggy' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Dining Out Mindfully</p>
                    <h1>Swiggy & Zomato Guide</h1>
                    <p className="subline">Healthiest Indian restaurant picks, macro hacks, and what to order.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <SwiggyGuide />
                </section>
              </div>
            )}

            {activeScreen === 'custom_recipes' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">Custom Creation</p>
                    <h1>Recipe Builder</h1>
                    <p className="subline">Calculate exact macros for your home-cooked dishes.</p>
                  </div>
                  <button className="secondary flex items-center gap-1.5" onClick={() => setActiveScreen('dashboard')}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>
                <section className="surface">
                  <CustomRecipeBuilder 
                    savedRecipes={savedCustomRecipes}
                    onSaveCustomRecipe={(r) => setSavedCustomRecipes([...savedCustomRecipes, r])}
                  />
                </section>
              </div>
            )}
          </main>

          {/* Sticky Mobile Bottom Navigation */}
          <nav className="mobile-nav" aria-label="Main mobile navigation">
            <button 
              className="mobilebtn" 
              aria-current={activeScreen === 'dashboard' ? 'page' : undefined}
              onClick={() => {
                haptic.selection();
                setActiveScreen('dashboard');
              }}
            >
              <Home />
              <span>Home</span>
            </button>
            <button 
              className="mobilebtn" 
              aria-current={activeScreen === 'planner' ? 'page' : undefined}
              onClick={() => {
                haptic.selection();
                setActiveScreen('planner');
              }}
            >
              <CalendarDays />
              <span>Plan</span>
            </button>
            <button 
              className="mobilebtn" 
              aria-current={activeScreen === 'recipes' ? 'page' : undefined}
              onClick={() => {
                haptic.selection();
                setActiveScreen('recipes');
              }}
            >
              <Utensils />
              <span>Recipes</span>
            </button>
            <button 
              className="mobilebtn" 
              aria-current={activeScreen === 'water' ? 'page' : undefined}
              onClick={() => {
                haptic.selection();
                setActiveScreen('water');
              }}
            >
              <Droplets />
              <span>Water</span>
            </button>
            <button 
              className="mobilebtn" 
              aria-current={activeScreen === 'more' ? 'page' : undefined}
              onClick={() => {
                haptic.selection();
                setActiveScreen('more');
              }}
            >
              <SlidersHorizontal />
              <span>More</span>
            </button>
          </nav>

          {/* Toast Alert */}
          <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
            {toast}
          </div>
        </section>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeModal 
        food={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)}
        onAddToPlan={(food) => {
          setPlannedMeals((prev) => [...prev, food.name]);
          notify(`${food.name} added to your weekly plan.`);
        }}
      />

      {/* Meal Swapper Modal */}
      <MealSwapperModal 
        slot={swappingSlot} 
        currentFood={swappingSlot ? mealPlan.meals[swappingSlot] : null}
        profile={profile}
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
  );
}

export default App;
