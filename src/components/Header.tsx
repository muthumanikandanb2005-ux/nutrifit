import React from 'react';
import { Dumbbell, Utensils, ShoppingBag, Flame, Sparkles, Camera, Droplet, TrendingUp, Pill, Timer, Calendar, ChefHat, Footprints, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'planner' | 'grocery' | 'fridge' | 'scanner' | 'water' | 'workouts' | 'steps' | 'coach' | 'analytics' | 'supplements' | 'fasting' | 'weekly' | 'swiggy' | 'custom_recipes';
  setActiveTab: (tab: 'calculator' | 'planner' | 'grocery' | 'fridge' | 'scanner' | 'water' | 'workouts' | 'steps' | 'coach' | 'analytics' | 'supplements' | 'fasting' | 'weekly' | 'swiggy' | 'custom_recipes') => void;
  targetCalories?: number;
  targetProtein?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, targetCalories, targetProtein }) => {
  return (
    <header className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white shadow-md sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-2.5 cursor-pointer active:scale-95 transition-transform" onClick={() => setActiveTab('planner')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl overflow-hidden border border-white/40 shadow shrink-0 bg-emerald-800">
              <img src="/logo.png" alt="NutriFit Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-100">
                  NutriFit
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500 text-white rounded-full shadow-sm border border-emerald-400">
                  🇮🇳
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-amber-100/90 font-medium">Smart Indian Fitness & Macro Meal Planner</p>
            </div>
          </div>

          {/* Quick Target Pill for Mobile & Desktop */}
          {targetCalories && targetProtein ? (
            <div className="flex items-center space-x-2 bg-black/25 backdrop-blur-md px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl border border-white/15 text-[11px] sm:text-xs">
              <div className="flex items-center space-x-1 text-amber-200">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span><strong>{targetCalories}</strong> <span className="hidden xs:inline">kcal</span></span>
              </div>
              <div className="h-2.5 w-px bg-white/20" />
              <div className="flex items-center space-x-1 text-emerald-200">
                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>{targetProtein}g</strong> <span className="hidden xs:inline">P</span></span>
              </div>
            </div>
          ) : null}

          {/* Desktop Navigation Tabs (Hidden on Mobile) */}
          <nav className="hidden md:flex space-x-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'planner'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Thali Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'scanner'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('fasting')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'fasting'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-purple-300" />
              <span>Fasting</span>
            </button>

            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'weekly'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>7-Day Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('coach')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'coach'
                  ? 'bg-white text-emerald-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI Coach</span>
            </button>

            <button
              onClick={() => setActiveTab('steps')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'steps'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-orange-300" />
              <span>Steps & Strava</span>
            </button>

            <button
              onClick={() => setActiveTab('workouts')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'workouts'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-amber-300" />
              <span>Workouts</span>
            </button>

            <button
              onClick={() => setActiveTab('water')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'water'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-sky-300" />
              <span>Water</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('swiggy')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'swiggy'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Swiggy Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_recipes')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'custom_recipes'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-300" />
              <span>Custom Recipe</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('grocery')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'grocery'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirana</span>
            </button>

            <button
              onClick={() => setActiveTab('fridge')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'fridge'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Fridge AI</span>
            </button>

            <button
              onClick={() => setActiveTab('supplements')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'supplements'
                  ? 'bg-white text-orange-900 shadow-md scale-105 font-bold'
                  : 'text-amber-100 hover:bg-white/15'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden lg:inline">Supplements</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
