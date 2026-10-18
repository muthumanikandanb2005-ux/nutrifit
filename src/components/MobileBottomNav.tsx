import React, { useState } from 'react';
import { Utensils, Camera, Droplet, MoreHorizontal, Dumbbell, TrendingUp, ShoppingBag, Sparkles, Pill, ChefHat, Flame, X, Footprints, Bot } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface MobileBottomNavProps {
  activeTab: 'calculator' | 'planner' | 'grocery' | 'fridge' | 'scanner' | 'water' | 'workouts' | 'steps' | 'coach' | 'analytics' | 'supplements' | 'fasting' | 'weekly' | 'swiggy' | 'custom_recipes';
  setActiveTab: (tab: 'calculator' | 'planner' | 'grocery' | 'fridge' | 'scanner' | 'water' | 'workouts' | 'steps' | 'coach' | 'analytics' | 'supplements' | 'fasting' | 'weekly' | 'swiggy' | 'custom_recipes') => void;
  isMoreOpen?: boolean;
  setIsMoreOpen?: (open: boolean) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab, 
  setActiveTab,
  isMoreOpen: externalIsMoreOpen,
  setIsMoreOpen: externalSetIsMoreOpen
}) => {
  const [internalIsMoreOpen, setInternalIsMoreOpen] = useState(false);
  
  const isMoreOpen = externalIsMoreOpen !== undefined ? externalIsMoreOpen : internalIsMoreOpen;
  const setIsMoreOpen = externalSetIsMoreOpen !== undefined ? externalSetIsMoreOpen : setInternalIsMoreOpen;

  const primaryTabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'planner', label: 'Thali', icon: <Utensils className="w-5 h-5" /> },
    { id: 'coach', label: 'AI Coach', icon: <Bot className="w-5 h-5 text-emerald-400" /> },
    { id: 'steps', label: 'Steps', icon: <Footprints className="w-5 h-5 text-orange-400" /> },
    { id: 'scanner', label: 'Scanner', icon: <Camera className="w-5 h-5" /> },
  ];

  const featureCategories = [
    {
      title: 'Fitness & Progress',
      items: [
        { id: 'workouts' as const, label: 'Workouts & Burn', icon: <Dumbbell className="w-5 h-5 text-amber-400" />, desc: 'Desi gym & cardio' },
        { id: 'water' as const, label: 'Water Tracker', icon: <Droplet className="w-5 h-5 text-sky-400" />, desc: 'Hydration logging' },
        { id: 'analytics' as const, label: 'Weight & BMI Chart', icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, desc: 'Visual progress' },
      ]
    },
    {
      title: 'Diet & Meal Planning',
      items: [
        { id: 'weekly' as const, label: '7-Day Thali Plan', icon: <Utensils className="w-5 h-5 text-amber-300" />, desc: 'Full weekly grid' },
        { id: 'swiggy' as const, label: 'Swiggy/Zomato Guide', icon: <ShoppingBag className="w-5 h-5 text-orange-400" />, desc: 'Dining out healthy' },
        { id: 'custom_recipes' as const, label: 'Custom Recipes', icon: <ChefHat className="w-5 h-5 text-amber-300" />, desc: 'Home recipe builder' },
        { id: 'grocery' as const, label: 'Kirana Checklist', icon: <ShoppingBag className="w-5 h-5 text-amber-400" />, desc: 'Shopping list' },
        { id: 'fridge' as const, label: 'Fridge AI Finder', icon: <Sparkles className="w-5 h-5 text-amber-300" />, desc: 'Cook with what you have' },
      ]
    },
    {
      title: 'Health & Science',
      items: [
        { id: 'calculator' as const, label: 'Macro Calculator', icon: <Flame className="w-5 h-5 text-orange-400" />, desc: 'BMR & TDEE goals' },
        { id: 'supplements' as const, label: 'Supplement Guide', icon: <Pill className="w-5 h-5 text-purple-400" />, desc: 'Whey & creatine science' },
      ]
    }
  ];

  const handleSelectTab = (tab: typeof activeTab) => {
    haptic.light();
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  const handleToggleMore = () => {
    haptic.medium();
    setIsMoreOpen(!isMoreOpen);
  };

  return (
    <>
      {/* Fixed Android Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 py-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="grid grid-cols-5 gap-1 text-center">
          {primaryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
                  isActive ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-transform ${
                  isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm scale-110' : 'text-slate-400'
                }`}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-amber-300' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            onClick={handleToggleMore}
            className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
              isMoreOpen || !primaryTabs.some((t) => t.id === activeTab)
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-transform ${
              isMoreOpen || !primaryTabs.some((t) => t.id === activeTab)
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm scale-110'
                : 'text-slate-400'
            }`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${
              isMoreOpen || !primaryTabs.some((t) => t.id === activeTab) ? 'font-extrabold text-amber-300' : 'font-medium'
            }`}>
              More
            </span>
          </button>
        </div>
      </div>

      {/* Android Native Modal Bottom Sheet */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop Tap to Close */}
          <div className="flex-1" onClick={() => setIsMoreOpen(false)} />

          <div className="bg-slate-900 border-t border-slate-700/80 rounded-t-[32px] p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300">
            {/* Native Android Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />

            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">All NutriFit Features</h3>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 bg-slate-800 text-slate-400 rounded-xl border border-slate-700 cursor-pointer active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorized Menu Groups */}
            <div className="space-y-4">
              {featureCategories.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    {cat.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.items.map((item) => {
                      const isSelected = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`flex items-center space-x-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500 shadow-md'
                              : 'bg-slate-800/80 border-slate-700/70 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="p-2 bg-slate-900 rounded-xl shrink-0 border border-slate-800">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">{item.label}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

