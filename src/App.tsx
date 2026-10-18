import { useState, useEffect } from 'react';
import type { UserProfile, MealSlot, FoodItem, DailyMealPlan, ScannedFoodResult, WorkoutEntry, WeightEntry, FastingState, CustomRecipe, StepsLogEntry } from './types';
import { calculateMacroGoals } from './utils/nutritionCalculator';
import { generateDailyMealPlan } from './utils/mealPlanGenerator';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';
import { MealPlanner } from './components/MealPlanner';
import { MealSwapperModal } from './components/MealSwapperModal';
import { GroceryList } from './components/GroceryList';
import { RecipeModal } from './components/RecipeModal';
import { FridgeAI } from './components/FridgeAI';
import { FoodScanner } from './components/FoodScanner';
import { WaterTracker } from './components/WaterTracker';
import { WorkoutTracker } from './components/WorkoutTracker';
import { StepsTracker } from './components/StepsTracker';
import { AICoach } from './components/AICoach';
import { Analytics } from './components/Analytics';
import { SupplementGuide } from './components/SupplementGuide';
import { FastingTimer } from './components/FastingTimer';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { SwiggyGuide } from './components/SwiggyGuide';
import { CustomRecipeBuilder } from './components/CustomRecipeBuilder';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { initializeAndroidSystem, setupAndroidBackButton } from './utils/androidPlatform';

export function App() {
  // 1. Profile State with LocalStorage Persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ahaarfit_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      name: 'Indian Fitness Enthusiast',
      age: 26,
      gender: 'male',
      weightKg: 70,
      heightCm: 175,
      activityLevel: 'moderately_active',
      goal: 'muscle_gain',
      dietType: 'eggetarian',
      region: 'all',
      budget: 'moderate',
      medicalConditions: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_profile', JSON.stringify(profile));
  }, [profile]);

  // 2. Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'calculator' | 'planner' | 'grocery' | 'fridge' | 'scanner' | 'water' | 'workouts' | 'steps' | 'coach' | 'analytics' | 'supplements' | 'fasting' | 'weekly' | 'swiggy' | 'custom_recipes'>('planner');

  // 3. Fasting State Persistence
  const [fastingState, setFastingState] = useState<FastingState>(() => {
    const saved = localStorage.getItem('ahaarfit_fasting');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      isFasting: false,
      startTime: null,
      targetDurationHours: 16,
      protocol: '16_8'
    };
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_fasting', JSON.stringify(fastingState));
  }, [fastingState]);

  // 4. Custom Recipes State
  const [savedCustomRecipes, setSavedCustomRecipes] = useState<CustomRecipe[]>(() => {
    const saved = localStorage.getItem('ahaarfit_custom_recipes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_custom_recipes', JSON.stringify(savedCustomRecipes));
  }, [savedCustomRecipes]);

  // 5. Hydration State
  const [waterLoggedMl, setWaterLoggedMl] = useState<number>(() => {
    const saved = localStorage.getItem('ahaarfit_water');
    return saved ? Number(saved) : 1250;
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_water', waterLoggedMl.toString());
  }, [waterLoggedMl]);

  // 6. Workouts Log State
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => {
    const saved = localStorage.getItem('ahaarfit_workouts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'w1',
        name: 'Heavy Desi Gym Workout (Push/Pull)',
        category: 'weightlifting',
        durationMins: 50,
        caloriesBurned: 320,
        intensity: 'high',
        timestamp: '07:30 AM'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  // 7. Steps & Cardio Logs State
  const [stepsLogs, setStepsLogs] = useState<StepsLogEntry[]>(() => {
    const saved = localStorage.getItem('ahaarfit_steps_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'step_initial',
        date: 'Today',
        time: '06:45 AM',
        title: 'Morning Strava Power Walk',
        steps: 6420,
        distanceKm: 4.8,
        caloriesBurned: 245,
        durationMins: 45,
        avgPaceMinutesPerKm: 9.3,
        activityType: 'walk',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_steps_logs', JSON.stringify(stepsLogs));
  }, [stepsLogs]);

  const handleAddStepsLog = (entry: StepsLogEntry) => {
    setStepsLogs([entry, ...stepsLogs]);
  };

  // 8. Weight Logs State
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('ahaarfit_weight_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { date: 'Aug 15', weightKg: 73.5, bmi: 24.0 },
      { date: 'Aug 22', weightKg: 72.8, bmi: 23.8 },
      { date: 'Aug 29', weightKg: 72.0, bmi: 23.5 },
      { date: 'Sep 05', weightKg: 71.2, bmi: 23.2 },
      { date: 'Sep 13', weightKg: 70.0, bmi: 22.8 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_weight_logs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  // Calculate Macro Goals
  const macroGoals = calculateMacroGoals(profile);

  // Daily Meal Plan State
  const [mealPlan, setMealPlan] = useState<DailyMealPlan>(() => {
    const saved = localStorage.getItem('ahaarfit_mealplan');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return generateDailyMealPlan(profile, macroGoals.calories);
  });

  useEffect(() => {
    localStorage.setItem('ahaarfit_mealplan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const [swappingSlot, setSwappingSlot] = useState<MealSlot | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<FoodItem | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Initialize Native Android Status Bar & Nav
  useEffect(() => {
    initializeAndroidSystem();
  }, []);

  // Native Android Hardware / Gesture Back Button Handling
  useEffect(() => {
    const unregister = setupAndroidBackButton(() => {
      // 1. Close Recipe Modal if active
      if (selectedRecipe) {
        setSelectedRecipe(null);
        return true;
      }
      // 2. Close Meal Swapper Modal if active
      if (swappingSlot) {
        setSwappingSlot(null);
        return true;
      }
      // 3. Close "More" drawer bottom sheet if open
      if (isMoreOpen) {
        setIsMoreOpen(false);
        return true;
      }
      // 4. If viewing any sub-screen, navigate back to the primary Planner/Thali screen
      if (activeTab !== 'planner') {
        setActiveTab('planner');
        return true;
      }
      // 5. If already on Planner, permit OS to exit/minimize app
      return false;
    });

    return () => {
      unregister();
    };
  }, [selectedRecipe, swappingSlot, isMoreOpen, activeTab]);

  // Handle regenerating meal plan
  const handleRegeneratePlan = () => {
    setMealPlan(generateDailyMealPlan(profile, macroGoals.calories));
  };

  // Handle saving new profile from calculator
  const handleProfileUpdated = () => {
    const newGoals = calculateMacroGoals(profile);
    setMealPlan(generateDailyMealPlan(profile, newGoals.calories));
    setActiveTab('planner');
  };

  // Workout Handlers
  const handleAddWorkout = (entry: WorkoutEntry) => {
    setWorkouts([...workouts, entry]);
  };

  const handleRemoveWorkout = (id: string) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  // Weight Log Handler
  const handleAddWeightLog = (entry: WeightEntry) => {
    setWeightLogs([...weightLogs, entry]);
    setProfile({ ...profile, weightKg: entry.weightKg });
  };

  // Custom Recipe Handler
  const handleSaveCustomRecipe = (recipe: CustomRecipe) => {
    setSavedCustomRecipes([...savedCustomRecipes, recipe]);
  };

  // Handle logging scanned food item to meal plan
  const handleAddScannedFoodToPlan = (scanned: ScannedFoodResult, targetSlot: MealSlot) => {
    const convertedFood: FoodItem = {
      id: `scanned_${Date.now()}`,
      name: scanned.foodName,
      hindiName: scanned.hindiName,
      slot: targetSlot,
      calories: scanned.calories,
      protein: scanned.protein,
      carbs: scanned.carbs,
      fats: scanned.fats,
      fiber: scanned.fiber,
      servingSize: scanned.estimatedServing,
      dietType: [profile.dietType],
      region: ['all'],
      budget: 'moderate',
      prepTimeMins: scanned.foodState === 'raw' ? 5 : 15,
      tags: ['AI Scanned', scanned.foodState.toUpperCase()],
      ingredients: [
        { item: scanned.foodName, amount: scanned.estimatedServing, category: 'grains' }
      ],
      recipeInstructions: [
        `Scanned via NutriBharat AI Scanner (${scanned.foodState.toUpperCase()} Item).`,
        `Health Rating: ${scanned.healthRating}.`
      ],
      tips: scanned.cookingImpactNote || 'Scanned item added to daily thali.'
    };

    const updatedMeals = { ...mealPlan.meals, [targetSlot]: convertedFood };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;

    Object.values(updatedMeals).forEach((f) => {
      totalCalories += f.calories;
      totalProtein += f.protein;
      totalCarbs += f.carbs;
      totalFats += f.fats;
      totalFiber += f.fiber;
    });

    setMealPlan({
      ...mealPlan,
      meals: updatedMeals,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFats: Math.round(totalFats),
      totalFiber: Math.round(totalFiber),
    });
  };

  // Handle meal swap
  const handleSelectSwappedFood = (slot: MealSlot, newFood: FoodItem) => {
    const updatedMeals = { ...mealPlan.meals, [slot]: newFood };
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;

    Object.values(updatedMeals).forEach((f) => {
      totalCalories += f.calories;
      totalProtein += f.protein;
      totalCarbs += f.carbs;
      totalFats += f.fats;
      totalFiber += f.fiber;
    });

    setMealPlan({
      ...mealPlan,
      meals: updatedMeals,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFats: Math.round(totalFats),
      totalFiber: Math.round(totalFiber),
    });
  };

  const targetWaterMl = Math.round(profile.weightKg * 45);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetCalories={macroGoals.calories}
        targetProtein={macroGoals.proteinGrams}
      />

      <main className="flex-1 pb-24 sm:pb-8">
        {activeTab === 'planner' && (
          <MealPlanner
            profile={profile}
            mealPlan={mealPlan}
            macroGoals={macroGoals}
            onOpenSwapper={(slot) => setSwappingSlot(slot)}
            onSelectRecipe={(food) => setSelectedRecipe(food)}
            onRegeneratePlan={handleRegeneratePlan}
          />
        )}

        {activeTab === 'scanner' && (
          <FoodScanner onAddScannedFoodToPlan={handleAddScannedFoodToPlan} />
        )}

        {activeTab === 'fasting' && (
          <FastingTimer
            fastingState={fastingState}
            setFastingState={setFastingState}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyPlanner
            profile={profile}
            targetCalories={macroGoals.calories}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutTracker
            profile={profile}
            workouts={workouts}
            onAddWorkout={handleAddWorkout}
            onRemoveWorkout={handleRemoveWorkout}
          />
        )}

        {activeTab === 'steps' && (
          <StepsTracker
            profile={profile}
            stepsLogs={stepsLogs}
            onAddStepsLog={handleAddStepsLog}
          />
        )}

        {activeTab === 'coach' && (
          <AICoach
            profile={profile}
            macroGoals={macroGoals}
          />
        )}

        {activeTab === 'water' && (
          <WaterTracker
            waterLoggedMl={waterLoggedMl}
            setWaterLoggedMl={setWaterLoggedMl}
            targetMl={targetWaterMl}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            profile={profile}
            weightLogs={weightLogs}
            onAddWeightLog={handleAddWeightLog}
          />
        )}

        {activeTab === 'swiggy' && (
          <SwiggyGuide />
        )}

        {activeTab === 'custom_recipes' && (
          <CustomRecipeBuilder
            onSaveCustomRecipe={handleSaveCustomRecipe}
            savedRecipes={savedCustomRecipes}
          />
        )}

        {activeTab === 'calculator' && (
          <Calculator
            profile={profile}
            setProfile={setProfile}
            onCalculateComplete={handleProfileUpdated}
          />
        )}

        {activeTab === 'grocery' && (
          <GroceryList mealPlan={mealPlan} />
        )}

        {activeTab === 'fridge' && (
          <FridgeAI onSelectRecipe={(food) => setSelectedRecipe(food)} />
        )}

        {activeTab === 'supplements' && (
          <SupplementGuide />
        )}
      </main>

      {/* Mobile Native Bottom Navigation */}
      <MobileBottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMoreOpen={isMoreOpen}
        setIsMoreOpen={setIsMoreOpen}
      />

      {/* Swapper Modal */}
      {swappingSlot && (
        <MealSwapperModal
          slot={swappingSlot}
          currentFood={mealPlan.meals[swappingSlot]}
          profile={profile}
          onClose={() => setSwappingSlot(null)}
          onSelectFood={handleSelectSwappedFood}
        />
      )}

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <RecipeModal
          food={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Desktop Only Footer: Hidden on mobile so app looks and feels 100% native */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

export default App;
