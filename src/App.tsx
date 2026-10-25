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
  const [wellnessGoal, setWellnessGoal] = useState<string>('maintain');
  const [otherGoal, setOtherGoal] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<number>(68.4);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [waterUnit, setWaterUnit] = useState<'ml' | 'oz'>('ml');
  const [stepGoal, setStepGoal] = useState<number>(8000);
  const [waterGoal, setWaterGoal] = useState<number>(2000);
  const [cuisines, setCuisines] = useState<string[]>(['south', 'north']);
  const [allergyNotes, setAllergyNotes] = useState<string>('');

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
            <span className="brandmark" aria-hidden="true">M</span>
            <span>morrow</span>
          </div>

          <div>
            <p className="navlabel">Plan</p>
            <nav className="navlist">
              <button 
                className="navbtn" 
                data-screen="dashboard" 
                aria-current={activeScreen === 'dashboard' ? 'page' : undefined}
                onClick={() => setActiveScreen('dashboard')}
              >
                <span className="navicon">⌂</span>
                <span className="navtext">Overview</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="planner" 
                aria-current={activeScreen === 'planner' ? 'page' : undefined}
                onClick={() => setActiveScreen('planner')}
              >
                <span className="navicon">▦</span>
                <span className="navtext">Meal planner</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="recipes" 
                aria-current={activeScreen === 'recipes' ? 'page' : undefined}
                onClick={() => setActiveScreen('recipes')}
              >
                <span className="navicon">◉</span>
                <span className="navtext">Recipes · 5,284</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="grocery" 
                aria-current={activeScreen === 'grocery' ? 'page' : undefined}
                onClick={() => setActiveScreen('grocery')}
              >
                <span className="navicon">☷</span>
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
                <span className="navicon">◎</span>
                <span className="navtext">Goals & weight</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="steps" 
                aria-current={activeScreen === 'steps' ? 'page' : undefined}
                onClick={() => setActiveScreen('steps')}
              >
                <span className="navicon">⌁</span>
                <span className="navtext">Steps & activity</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="water" 
                aria-current={activeScreen === 'water' ? 'page' : undefined}
                onClick={() => setActiveScreen('water')}
              >
                <span className="navicon">◌</span>
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
                <span className="navicon">🤖</span>
                <span className="navtext">AI Coach</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="scanner" 
                aria-current={activeScreen === 'scanner' ? 'page' : undefined}
                onClick={() => setActiveScreen('scanner')}
              >
                <span className="navicon">📷</span>
                <span className="navtext">Food Scanner</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="fridge" 
                aria-current={activeScreen === 'fridge' ? 'page' : undefined}
                onClick={() => setActiveScreen('fridge')}
              >
                <span className="navicon">❄️</span>
                <span className="navtext">Fridge AI</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="fasting" 
                aria-current={activeScreen === 'fasting' ? 'page' : undefined}
                onClick={() => setActiveScreen('fasting')}
              >
                <span className="navicon">⏱️</span>
                <span className="navtext">Fasting Timer</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="workouts" 
                aria-current={activeScreen === 'workouts' ? 'page' : undefined}
                onClick={() => setActiveScreen('workouts')}
              >
                <span className="navicon">🏋️</span>
                <span className="navtext">Workouts</span>
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
                <span className="navicon">◉</span>
                <span className="navtext">Profile setup</span>
              </button>
              <button 
                className="navbtn" 
                data-screen="settings" 
                aria-current={activeScreen === 'settings' ? 'page' : undefined}
                onClick={() => setActiveScreen('settings')}
              >
                <span className="navicon">⚙</span>
                <span className="navtext">Settings</span>
              </button>
            </nav>
          </div>

          <div className="sidebottom">
            <div className="sidebar-tip">
              <span aria-hidden="true">✳</span>
              <strong>A little goes a long way</strong>
              <p>Plan a few meals now and give your week more breathing room.</p>
            </div>
            <button className="accountmini" onClick={() => setActiveScreen('account')}>
              <span className="avatar">{initials(profile.name)}</span>
              <span className="accountmeta">
                <strong>{profile.name}</strong>
                <span>Personal plan</span>
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--muted)' }}>···</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="main">
          {/* Top Bar */}
          <div className="topbar">
            <span className="brand mobile-wordmark" onClick={() => setActiveScreen('dashboard')}>
              <span className="brandmark" aria-hidden="true">M</span>
              <span>morrow</span>
            </span>
            <span className="crumb" id="crumb">
              Your week &nbsp;/ &nbsp;{breadcrumbs[activeScreen] || 'Overview'}
            </span>
            <div className="topactions">
              <button 
                className="iconbtn" 
                onClick={() => setActiveScreen('settings')} 
                aria-label="Open settings"
              >
                ⚙
              </button>
              <button 
                className="iconbtn" 
                onClick={() => setActiveScreen('account')} 
                aria-label="Open account setup"
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
                    <p className="subline">A little planning makes room for a better week.</p>
                  </div>
                  <button className="primary" onClick={() => setActiveScreen('planner')}>
                    ＋ Plan this week
                  </button>
                </div>

                <div className="grid">
                  <div className="stack">
                    <section className="surface hero">
                      <div className="herocopy">
                        <p className="eyebrow">Your week, made lighter</p>
                        <h2>Good food, less guesswork.</h2>
                        <p>Indian favorites, planned around your goals.</p>
                        <button className="primary" onClick={() => setActiveScreen('planner')}>
                          Open weekly plan →
                        </button>
                      </div>
                      <img 
                        className="hero-photo" 
                        src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80" 
                        alt="Indian Thali" 
                      />
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Today’s table</h2>
                          <p>Your Sunday meal plan</p>
                        </div>
                        <button className="textbtn" onClick={() => setActiveScreen('planner')}>
                          View plan →
                        </button>
                      </div>
                      <div className="meals">
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.breakfast)}
                        >
                          <span className="mealtime">8:30 AM</span>
                          <span className="mealemoji">◉</span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.breakfast.name}</strong>
                            <span>Breakfast · {mealPlan.meals.breakfast.prepTimeMins} min</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.breakfast.calories} kcal</span>
                        </div>
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.lunch)}
                        >
                          <span className="mealtime">1:00 PM</span>
                          <span className="mealemoji">◉</span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.lunch.name}</strong>
                            <span>Lunch · {mealPlan.meals.lunch.prepTimeMins} min</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.lunch.calories} kcal</span>
                        </div>
                        <div 
                          className="mealrow cursor-pointer" 
                          onClick={() => setSelectedRecipe(mealPlan.meals.dinner)}
                        >
                          <span className="mealtime">7:00 PM</span>
                          <span className="mealemoji">◉</span>
                          <span className="mealname">
                            <strong>{mealPlan.meals.dinner.name}</strong>
                            <span>Dinner · {mealPlan.meals.dinner.prepTimeMins} min</span>
                          </span>
                          <span className="mealcal">{mealPlan.meals.dinner.calories} kcal</span>
                        </div>
                      </div>
                    </section>

                    <div className="tipstrip">
                      <span>🌱</span>
                      <div>
                        <strong>Your gentle nudge</strong>
                        <span>Prep grains once today; tomorrow’s lunch is already halfway done.</span>
                      </div>
                    </div>
                  </div>

                  <div className="stack">
                    {/* Steps Widget */}
                    <section className="surface progresscard">
                      <div className="sectionhead">
                        <div>
                          <h2>Daily steps</h2>
                          <p>You’re moving at your own pace</p>
                        </div>
                        <span>👟</span>
                      </div>
                      <div className="stepslayout">
                        <div>
                          <div className="statnum">{steps.toLocaleString()}</div>
                          <div className="unit">of {stepGoal.toLocaleString()} steps</div>
                          <p style={{ margin: '5px 0 12px', color: 'var(--muted)', fontSize: '11px' }}>
                            {stepsLeft > 0 ? `${stepsLeft.toLocaleString()} to your daily goal` : 'Goal reached — great work!'}
                          </p>
                          <button className="textbtn" onClick={() => setActiveScreen('steps')}>
                            See activity →
                          </button>
                        </div>
                        <div className="ring" style={{ ['--angle' as string]: `${stepPct}%` }}>
                          <div className="ringinner">
                            <strong>{stepPct}%</strong>
                            <span>of daily goal</span>
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
                          notify('A little movement added. Nice work!');
                        }}
                      >
                        ＋ Add a walk (+250 steps)
                      </button>
                    </section>

                    {/* Water Widget */}
                    <section className="surface watercard">
                      <div className="sectionhead">
                        <div>
                          <h2>Water today</h2>
                          <p>{shownVolume(waterAmount)} of {shownVolume(waterGoal)} {waterUnit}</p>
                        </div>
                        <span style={{ fontSize: '19px', color: '#55917f' }}>◌</span>
                      </div>
                      <div className="water-glasses">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((g, idx) => {
                          const filled = idx < Math.ceil(waterAmount / 250);
                          return (
                            <i key={g} className={`water-glass ${filled ? 'filled' : ''}`}>
                              {filled ? '✓' : g}
                            </i>
                          );
                        })}
                      </div>
                      <div className="inline-actions">
                        <button 
                          className="secondary" 
                          onClick={() => {
                            haptic.medium();
                            setWaterAmount((w) => w + 250);
                            notify(`＋ ${shownVolume(250)} ${waterUnit} added.`);
                          }}
                        >
                          ＋ 250 ml
                        </button>
                        <button className="textbtn" onClick={() => setActiveScreen('water')}>
                          View water log →
                        </button>
                      </div>
                    </section>

                    {/* Weekly Planned Count */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>This week</h2>
                          <p>Meals planned so far</p>
                        </div>
                        <span>✦</span>
                      </div>
                      <div className="mealprogress">
                        <strong>{4 + plannedMeals.length} <span style={{ fontSize: '16px' }}>/ 7</span></strong>
                        <span>meals ready for the week</span>
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
                        <button className="textbtn" onClick={() => setActiveScreen('planner')}>
                          Keep planning →
                        </button>
                      </div>
                    </section>

                    {/* Your Focus Card */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Your focus</h2>
                          <p>Personalized meal planning</p>
                        </div>
                        <span>◎</span>
                      </div>
                      <div className="goal-summary">
                        <span className="goal-summary-mark">◎</span>
                        <div>
                          <strong>{wellnessGoal === 'maintain' ? 'Maintain weight' : wellnessGoal === 'lose' ? 'Lose weight' : wellnessGoal === 'strength' ? 'Build strength' : 'Eat healthier'}</strong>
                          <span>Flexible Indian meal ideas</span>
                        </div>
                      </div>
                      <button className="textbtn mt-2" onClick={() => setActiveScreen('goals')}>
                        View goals →
                      </button>
                    </section>

                    {/* Grocery Preview */}
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Shopping list</h2>
                          <p>{defaultGroceryItems.length + addedGrocery.length} Indian staples</p>
                        </div>
                        <button className="textbtn" onClick={() => setActiveScreen('grocery')}>
                          Open →
                        </button>
                      </div>
                      <div className="meals">
                        <div className="mini-item">• &nbsp;Toor dal <span style={{ marginLeft: 'auto' }}>500 g</span></div>
                        <div className="mini-item">• &nbsp;Curry leaves <span style={{ marginLeft: 'auto' }}>1 bunch</span></div>
                        <div className="mini-item">• &nbsp;Paneer <span style={{ marginLeft: 'auto' }}>200 g</span></div>
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
                    <p className="eyebrow">Plan ahead, feel good</p>
                    <h1>Your meal plan</h1>
                    <p className="subline">A flexible week of meals that works for you.</p>
                  </div>
                  <button className="primary" onClick={() => setActiveScreen('recipes')}>
                    ＋ Add a meal
                  </button>
                </div>

                <section className="surface">
                  <div className="sectionhead">
                    <div>
                      <h2>October 19 – 25</h2>
                      <p>Week 43 · {4 + plannedMeals.length} meals planned</p>
                    </div>
                    <div>
                      <button className="iconbtn" onClick={() => notify('Previous week viewed.')}>‹</button>
                      <button className="iconbtn ml-1" onClick={() => notify('Next week viewed.')}>›</button>
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

                  <div className="plannerlist">
                    <div className="plannerday">
                      <div className="plannerdate">
                        <strong>Sunday</strong>
                        <span>Today</span>
                      </div>
                      <div className="plannerslots">
                        <div className="slot" onClick={() => setSelectedRecipe(mealPlan.meals.breakfast)}>
                          <small>Breakfast</small>
                          <strong>{mealPlan.meals.breakfast.name}</strong>
                        </div>
                        <div className="slot" onClick={() => setSelectedRecipe(mealPlan.meals.lunch)}>
                          <small>Lunch</small>
                          <strong>{mealPlan.meals.lunch.name}</strong>
                        </div>
                        <div className="slot" onClick={() => setSelectedRecipe(mealPlan.meals.dinner)}>
                          <small>Dinner</small>
                          <strong>{mealPlan.meals.dinner.name}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="plannerday">
                      <div className="plannerdate">
                        <strong>Monday</strong>
                        <span>Oct 26</span>
                      </div>
                      <div className="plannerslots">
                        <div className="slot">
                          <small>Breakfast</small>
                          <strong>Vegetable Poha</strong>
                        </div>
                        <div 
                          className="slot empty" 
                          onClick={() => setSwappingSlot('lunch')}
                        >
                          ＋ Add meal
                        </div>
                        <div className="slot">
                          <small>Dinner</small>
                          <strong>Chana Masala & Roti</strong>
                        </div>
                      </div>
                    </div>

                    <div className="plannerday">
                      <div className="plannerdate">
                        <strong>Tuesday</strong>
                        <span>Oct 27</span>
                      </div>
                      <div className="plannerslots">
                        <div 
                          className="slot empty" 
                          onClick={() => setSwappingSlot('breakfast')}
                        >
                          ＋ Add meal
                        </div>
                        <div className="slot">
                          <small>Lunch</small>
                          <strong>Rajma Chawal</strong>
                        </div>
                        <div 
                          className="slot empty" 
                          onClick={() => setSwappingSlot('dinner')}
                        >
                          ＋ Add meal
                        </div>
                      </div>
                    </div>

                    <div className="plannerday">
                      <div className="plannerdate">
                        <strong>Wednesday</strong>
                        <span>Oct 28</span>
                      </div>
                      <div className="plannerslots">
                        <div className="slot empty" onClick={() => setActiveScreen('recipes')}>＋ Add meal</div>
                        <div className="slot empty" onClick={() => setActiveScreen('recipes')}>＋ Add meal</div>
                        <div className="slot empty" onClick={() => setActiveScreen('recipes')}>＋ Add meal</div>
                      </div>
                    </div>

                    <div className="plannerday">
                      <div className="plannerdate">
                        <strong>Thursday</strong>
                        <span>Oct 29</span>
                      </div>
                      <div className="plannerslots">
                        <div className="slot empty" onClick={() => setActiveScreen('recipes')}>＋ Add meal</div>
                        <div className="slot empty" onClick={() => setActiveScreen('recipes')}>＋ Add meal</div>
                        <div className="slot empty" onClick={() => setActiveScreen('recipes')}>＋ Add meal</div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="tipstrip" style={{ marginTop: '15px' }}>
                  <span>💡</span>
                  <div>
                    <strong>Keep it flexible</strong>
                    <span>Leftovers count as a plan, too. Add only what makes your week easier.</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. RECIPES CATALOG SCREEN */}
            {activeScreen === 'recipes' && (
              <div>
                <div className="pagehead">
                  <div>
                    <p className="eyebrow">A kitchen full of possibility</p>
                    <h1>Indian recipes</h1>
                    <p className="subline">Explore regional favorites and save what you love.</p>
                  </div>
                  <span className="recipe-total">{filteredRecipes.length}+ recipes</span>
                </div>

                <div className="tools">
                  <div className="searchwrap">
                    <input 
                      className="input" 
                      type="search" 
                      placeholder="⌕  Search 5,284+ recipes"
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
                    High protein
                  </button>
                </div>

                <div className="recipes">
                  {filteredRecipes.slice(0, 12).map((food) => (
                    <article key={food.id} className="surface recipecard">
                      <div 
                        className="recipeimage flex items-center justify-center cursor-pointer text-4xl"
                        style={{ background: 'var(--surface2)' }}
                        onClick={() => setSelectedRecipe(food)}
                      >
                        🍱
                      </div>
                      <div className="recipecopy">
                        <h3 
                          className="cursor-pointer font-bold"
                          onClick={() => setSelectedRecipe(food)}
                        >
                          {food.name}
                        </h3>
                        <p>{food.tips || `${food.calories} kcal · ${food.protein}g protein`}</p>
                        <div className="recipemeta">
                          <span>{food.prepTimeMins} min</span>
                          <span>{food.region[0].replace('_', ' ')}</span>
                        </div>
                        <button 
                          className="textbtn" 
                          onClick={() => {
                            haptic.medium();
                            setPlannedMeals((prev) => [...prev, food.name]);
                            notify(`${food.name} added to your plan.`);
                          }}
                        >
                          ＋ Add to plan
                        </button>
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
                    <p className="subline">Everything you need for this week, all in one place.</p>
                  </div>
                  <button 
                    className="secondary" 
                    onClick={() => {
                      haptic.light();
                      navigator.clipboard?.writeText(
                        defaultGroceryItems.map((i) => `• ${i.name} (${i.amount})`).join('\n')
                      );
                      notify('Your shopping list is copied to clipboard.');
                    }}
                  >
                    ↗ Share list
                  </button>
                </div>

                <section className="surface">
                  <div className="groceryhead">
                    <div>
                      <strong>{defaultGroceryItems.length + addedGrocery.length} items</strong>
                      <span className="unit"> · for 4 planned meals</span>
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

                  <p className="grocerygroup">Produce</p>
                  <div id="grocery-list">
                    {defaultGroceryItems.filter((i) => i.group === 'Produce').map((item) => {
                      const isChecked = checkedGrocery.includes(item.id);
                      return (
                        <div 
                          key={item.id} 
                          className={`groceryitem ${isChecked ? 'checked' : ''}`}
                        >
                          <button 
                            className="check" 
                            aria-pressed={isChecked}
                            onClick={() => {
                              haptic.selection();
                              setCheckedGrocery((prev) => 
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                              );
                            }}
                          >
                            ✓
                          </button>
                          <span className="groceryname">{item.name}</span>
                          <span className="amount">{item.amount}</span>
                        </div>
                      );
                    })}

                    <p className="grocerygroup" style={{ marginTop: '18px' }}>Pantry & protein</p>
                    {defaultGroceryItems.filter((i) => i.group === 'Pantry & protein').map((item) => {
                      const isChecked = checkedGrocery.includes(item.id);
                      return (
                        <div 
                          key={item.id} 
                          className={`groceryitem ${isChecked ? 'checked' : ''}`}
                        >
                          <button 
                            className="check" 
                            aria-pressed={isChecked}
                            onClick={() => {
                              haptic.selection();
                              setCheckedGrocery((prev) => 
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                              );
                            }}
                          >
                            ✓
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
                            className="check" 
                            aria-pressed={isChecked}
                            onClick={() => {
                              setCheckedGrocery((prev) => 
                                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                              );
                            }}
                          >
                            ✓
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
                      placeholder="Add an item to your list" 
                    />
                    <button className="primary" type="submit">Add item</button>
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
                    <h1>Your movement</h1>
                    <p className="subline">A friendly look at how you’re feeling and moving.</p>
                  </div>
                  <button 
                    className="secondary" 
                    onClick={() => {
                      haptic.light();
                      setSteps((s) => s + 500);
                      notify('500 steps logged.');
                    }}
                  >
                    ＋ Log a walk
                  </button>
                </div>

                <div className="grid">
                  <div className="stack">
                    <section className="surface">
                      <div className="stepshero">
                        <div className="ring" style={{ ['--angle' as string]: `${stepPct}%` }}>
                          <div className="ringinner">
                            <strong>{stepPct}%</strong>
                            <span>of daily goal</span>
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
                            className="textbtn" 
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
                              notify('＋ 250 steps added.');
                            }}
                          >
                            ＋ Add 250 steps
                          </button>
                        </div>
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Your week in motion</h2>
                          <p>One day at a time</p>
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
                      <span className="goalicon">🎯</span>
                      <div>
                        <strong>Daily step goal</strong>
                        <p className="unit">{stepGoal.toLocaleString()} steps · a steady, kind target</p>
                        <button className="textbtn" onClick={() => setActiveScreen('account')}>
                          Adjust in account setup →
                        </button>
                      </div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Today’s rhythm</h2>
                          <p>Make space to move</p>
                        </div>
                      </div>
                      <div className="meals">
                        {stepsLogs.map((log) => (
                          <div key={log.id} className="mealrow">
                            <span className="mealemoji">☀️</span>
                            <span className="mealname">
                              <strong>{log.title}</strong>
                              <span>{log.durationMins} min · {log.avgPaceMinutesPerKm} pace</span>
                            </span>
                            <span className="mealcal">{log.steps.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="tipstrip">
                      <span>🌤</span>
                      <div>
                        <strong>No perfect number needed</strong>
                        <span>Every little bit of movement counts. Take a pause when you need one.</span>
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
                    <p className="subline">Log drinks as you go. Your target is yours to adjust.</p>
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
                            {filled ? '✓' : g}
                          </span>
                        );
                      })}
                    </div>

                    <div className="sectionhead">
                      <div>
                        <strong>Quick add</strong>
                        <p>Choose the amount you just drank.</p>
                      </div>
                    </div>
                    <div className="inline-actions">
                      <button 
                        className="secondary" 
                        onClick={() => {
                          haptic.medium();
                          setWaterAmount((w) => w + 250);
                          notify(`＋ ${shownVolume(250)} ${waterUnit} added.`);
                        }}
                      >
                        ＋ {shownVolume(250)} {waterUnit}
                      </button>
                      <button 
                        className="secondary" 
                        onClick={() => {
                          haptic.medium();
                          setWaterAmount((w) => w + 500);
                          notify(`＋ ${shownVolume(500)} ${waterUnit} added.`);
                        }}
                      >
                        ＋ {shownVolume(500)} {waterUnit}
                      </button>
                      <button className="textbtn" onClick={() => setActiveScreen('settings')}>
                        Adjust daily target →
                      </button>
                    </div>
                  </section>

                  <div className="grid">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Today’s log</h2>
                          <p>Your recent drinks</p>
                        </div>
                        <span className="unit">Today</span>
                      </div>
                      <div className="history-row"><span>🌤 Morning</span><strong>500 ml</strong></div>
                      <div className="history-row"><span>🥣 With breakfast</span><strong>250 ml</strong></div>
                      <div className="history-row"><span>☀️ Midday</span><strong>500 ml</strong></div>
                      <div className="history-row"><span>＋ Quick add</span><strong>Just now</strong></div>
                    </section>

                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Hydration reminders</h2>
                          <p>Small nudges, on your schedule.</p>
                        </div>
                      </div>
                      <div className="setting">
                        <div className="settingcopy">
                          <strong>Gentle water reminder</strong>
                          <span>Every 2 hours between 9 am and 7 pm.</span>
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
                    <p className="subline">Choose a focus that feels right for you. You can change it anytime.</p>
                  </div>
                  <button className="secondary" onClick={() => setActiveScreen('account')}>
                    Edit goals
                  </button>
                </div>

                <div className="stack">
                  <section className="surface">
                    <div className="goal-summary">
                      <span className="goal-summary-mark">◎</span>
                      <div>
                        <strong>{wellnessGoal === 'maintain' ? 'Maintain weight' : wellnessGoal === 'lose' ? 'Lose weight' : wellnessGoal === 'strength' ? 'Build strength' : 'Eat healthier'}</strong>
                        <span>Your plan is set around a flexible, balanced routine.</span>
                      </div>
                    </div>
                  </section>

                  <div className="grid">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Weight check-in</h2>
                          <p>Log a check-in when it feels useful.</p>
                        </div>
                        <span className="unit">Optional</span>
                      </div>
                      <div className="statline">
                        <div>
                          <div className="statnum">{shownWeight(profile.weightKg)} <span className="unit">{weightUnit}</span></div>
                          <div className="unit">Most recent check-in · target {shownWeight(targetWeight)} {weightUnit}</div>
                        </div>
                        <span className="goal-summary-mark">↗</span>
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
                    <p className="subline">A few details help Morrow fit your life.</p>
                  </div>
                  <span style={{ padding: '7px 10px', borderRadius: '20px', background: 'var(--greenSoft)', color: 'var(--greenDark)', fontSize: '10px' }}>
                    Profile · 85% complete
                  </span>
                </div>

                <div className="grid">
                  <section className="surface">
                    <div className="sectionhead">
                      <div>
                        <h2>Your profile</h2>
                        <p>Update your account details and daily goals.</p>
                      </div>
                      <span>◎</span>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        notify('Your profile and goals have been saved.');
                      }}
                    >
                      <div className="formgrid">
                        <div className="field">
                          <label htmlFor="user-name">Full name</label>
                          <input 
                            id="user-name" 
                            className="input" 
                            value={profile.name} 
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="user-email">Email address</label>
                          <input id="user-email" className="input" defaultValue="maya@example.com" />
                        </div>

                        <div className="field full">
                          <label>What is your main wellbeing goal?</label>
                          <div className="goal-options">
                            {[
                              { id: 'lose', title: 'Lose weight', desc: 'Meals that support your chosen direction' },
                              { id: 'gain', title: 'Gain weight', desc: 'More nourishing meal ideas' },
                              { id: 'maintain', title: 'Maintain weight', desc: 'A steady, flexible routine' },
                              { id: 'strength', title: 'Build strength', desc: 'Food and movement habits' },
                              { id: 'healthy', title: 'Eat healthier', desc: 'More balance in everyday meals' },
                              { id: 'other', title: 'Other', desc: 'Choose a personal focus' },
                            ].map((g) => (
                              <label key={g.id} className="goal-option">
                                <input 
                                  type="radio" 
                                  name="wellnessGoal" 
                                  value={g.id}
                                  checked={wellnessGoal === g.id}
                                  onChange={() => setWellnessGoal(g.id)}
                                />
                                <span>
                                  <strong>{g.title}</strong>
                                  <small>{g.desc}</small>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {wellnessGoal === 'other' && (
                          <div className="field full">
                            <label>Your personal focus</label>
                            <input 
                              className="input" 
                              value={otherGoal} 
                              onChange={(e) => setOtherGoal(e.target.value)} 
                              placeholder="What would you like to focus on?" 
                            />
                          </div>
                        )}

                        <div className="field">
                          <label>Daily step goal</label>
                          <select 
                            className="select" 
                            value={stepGoal} 
                            onChange={(e) => setStepGoal(Number(e.target.value))}
                          >
                            <option value="5000">5,000 steps</option>
                            <option value="8000">8,000 steps</option>
                            <option value="10000">10,000 steps</option>
                            <option value="12000">12,000 steps</option>
                          </select>
                        </div>

                        <div className="field">
                          <label>Daily water goal</label>
                          <select 
                            className="select" 
                            value={waterGoal} 
                            onChange={(e) => setWaterGoal(Number(e.target.value))}
                          >
                            <option value="1500">1,500 ml</option>
                            <option value="2000">2,000 ml</option>
                            <option value="2500">2,500 ml</option>
                            <option value="3000">3,000 ml</option>
                          </select>
                        </div>

                        <div className="field full">
                          <label>Eating style</label>
                          <div className="choices">
                            {[
                              { id: 'vegetarian', label: 'Vegetarian' },
                              { id: 'eggetarian', label: 'Eggetarian' },
                              { id: 'vegan', label: 'Vegan' },
                              { id: 'non_veg', label: 'Includes meat' },
                            ].map((d) => (
                              <label key={d.id} className="choice">
                                <input 
                                  type="radio" 
                                  name="dietType" 
                                  value={d.id}
                                  checked={profile.dietType === d.id}
                                  onChange={() => setProfile({ ...profile, dietType: d.id as any })}
                                />
                                <span>{d.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="field full">
                          <label>Favorite Indian cuisines</label>
                          <div className="choices">
                            {['south', 'north', 'gujarati', 'bengali', 'maharashtrian'].map((c) => (
                              <label key={c} className="choice">
                                <input 
                                  type="checkbox" 
                                  checked={cuisines.includes(c)}
                                  onChange={() => {
                                    setCuisines((prev) => 
                                      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
                                    );
                                  }}
                                />
                                <span className="capitalize">{c} Indian</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="field full">
                          <label>Allergies or ingredients to avoid</label>
                          <input 
                            className="input" 
                            value={allergyNotes} 
                            onChange={(e) => setAllergyNotes(e.target.value)} 
                            placeholder="For example, peanuts or dairy" 
                          />
                        </div>
                      </div>

                      <div className="formfooter">
                        <span className="hint">Your preferences stay in your account.</span>
                        <button className="primary" type="submit">Save profile</button>
                      </div>
                    </form>
                  </section>

                  <div className="stack">
                    <section className="surface progresscard">
                      <div className="sectionhead">
                        <div>
                          <h2>Your plan focus</h2>
                          <p>Used to shape meal suggestions</p>
                        </div>
                        <span>◎</span>
                      </div>
                      <div className="goal-summary">
                        <span className="goal-summary-mark">◎</span>
                        <div>
                          <strong>{wellnessGoal === 'maintain' ? 'Maintain weight' : 'Balanced health'}</strong>
                          <span>A steady, flexible routine</span>
                        </div>
                      </div>
                      <div className="meals" style={{ marginTop: '12px' }}>
                        <div className="mini-item">Eating style <strong style={{ marginLeft: 'auto', color: 'var(--ink)' }} className="capitalize">{profile.dietType.replace('_', ' ')}</strong></div>
                        <div className="mini-item">Daily steps <strong style={{ marginLeft: 'auto', color: 'var(--ink)' }}>{stepGoal.toLocaleString()}</strong></div>
                        <div className="mini-item">Daily water <strong style={{ marginLeft: 'auto', color: 'var(--ink)' }}>{waterGoal.toLocaleString()} ml</strong></div>
                      </div>
                    </section>
                  </div>
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
                    <p className="subline">Tune Morrow to work the way you like.</p>
                  </div>
                </div>

                <div className="grid">
                  <div className="stack">
                    <section className="surface">
                      <div className="sectionhead">
                        <div>
                          <h2>Reminders</h2>
                          <p>Choose what you’d like a nudge about.</p>
                        </div>
                        <span>♧</span>
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
                            <strong>Meal prep reminders</strong>
                            <span>Get a heads-up before a planned meal.</span>
                          </div>
                          <button 
                            className="switch" 
                            role="switch" 
                            aria-pressed={settings.mealPrep}
                            onClick={() => setSettings({ ...settings, mealPrep: !settings.mealPrep })}
                          />
                        </div>
                        <div className="setting">
                          <div className="settingcopy">
                            <strong>Daily movement nudge</strong>
                            <span>A quiet reminder to stretch or take a walk.</span>
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
                            <span>Gentle prompts during your chosen hours.</span>
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
                          <p>Make the app comfortable to look at.</p>
                        </div>
                        <span>◐</span>
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
                          <p>Set the units and goals that feel familiar.</p>
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
                    <p className="eyebrow">Your tools</p>
                    <h1>More</h1>
                    <p className="subline">Everything else for your food and wellbeing routine.</p>
                  </div>
                </div>

                <div className="stack">
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('goals')}>
                    <span className="goalicon">◎</span>
                    <span><strong>Goals & weight</strong><span className="unit">Maintain weight</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('steps')}>
                    <span className="goalicon">⌁</span>
                    <span><strong>Steps & activity</strong><span className="unit">{steps.toLocaleString()} steps today</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('grocery')}>
                    <span className="goalicon">☷</span>
                    <span><strong>Shopping list</strong><span className="unit">Indian staples for your plan</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('coach')}>
                    <span className="goalicon">🤖</span>
                    <span><strong>AI Fitness Coach</strong><span className="unit">Ask questions about Indian diets & workout plans</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('scanner')}>
                    <span className="goalicon">📷</span>
                    <span><strong>Food Scanner</strong><span className="unit">AI Camera food scanner</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('fridge')}>
                    <span className="goalicon">❄️</span>
                    <span><strong>Fridge AI</strong><span className="unit">Cook with what you have</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('fasting')}>
                    <span className="goalicon">⏱️</span>
                    <span><strong>Fasting Timer</strong><span className="unit">Intermittent fasting clock</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('workouts')}>
                    <span className="goalicon">🏋️</span>
                    <span><strong>Workouts & Burn</strong><span className="unit">Track training sessions</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('swiggy')}>
                    <span className="goalicon">🍽️</span>
                    <span><strong>Swiggy Guide</strong><span className="unit">Healthy restaurant eating guide</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('account')}>
                    <span className="goalicon">◉</span>
                    <span><strong>Profile setup</strong><span className="unit">Diet, cuisine, goals and account</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
                  </button>
                  <button className="surface goalcard more-link" onClick={() => setActiveScreen('settings')}>
                    <span className="goalicon">⚙</span>
                    <span><strong>Settings</strong><span className="unit">Reminders, appearance & units</span></span>
                    <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>→</span>
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
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
                    <p className="subline">Track your fasting and eating windows with haptic cues.</p>
                  </div>
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
                  <button className="secondary" onClick={() => setActiveScreen('dashboard')}>← Back</button>
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
              <span aria-hidden="true">⌂</span>
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
              <span aria-hidden="true">▦</span>
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
              <span aria-hidden="true">◉</span>
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
              <span aria-hidden="true">◌</span>
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
              <span aria-hidden="true">···</span>
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
      {selectedRecipe && (
        <RecipeModal 
          food={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToPlan={(food) => {
            setPlannedMeals((prev) => [...prev, food.name]);
            notify(`${food.name} added to your plan.`);
          }}
        />
      )}

      {/* Meal Swapper Modal */}
      {swappingSlot && (
        <MealSwapperModal 
          slot={swappingSlot}
          currentFood={mealPlan.meals[swappingSlot]}
          profile={profile}
          onClose={() => setSwappingSlot(null)}
          onSelectFood={(slot, newFood) => {
            setMealPlan({
              ...mealPlan,
              meals: {
                ...mealPlan.meals,
                [slot]: newFood
              }
            });
            notify(`Swapped ${slot} with ${newFood.name}.`);
          }}
        />
      )}
    </div>
  );
}

export default App;
