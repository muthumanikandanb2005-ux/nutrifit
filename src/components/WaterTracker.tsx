import React from 'react';
import { Droplet, Plus, RotateCcw, Sparkles, Check } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface WaterTrackerProps {
  waterLoggedMl: number;
  setWaterLoggedMl: React.Dispatch<React.SetStateAction<number>>;
  targetMl: number;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterLoggedMl,
  setWaterLoggedMl,
  targetMl
}) => {
  const addWater = (amount: number, _label?: string) => {
    haptic.medium();
    setWaterLoggedMl((prev) => Math.min(prev + amount, 8000));
  };

  const resetWater = () => {
    haptic.warning();
    if (window.confirm("Reset today's water tracking back to 0 ml?")) {
      setWaterLoggedMl(0);
    }
  };

  const percentage = Math.min(100, Math.round((waterLoggedMl / targetMl) * 100));
  const glassCount = Math.round(waterLoggedMl / 250);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 sm:p-8 rounded-3xl shadow-xs space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Droplet className="w-4 h-4 text-sky-500 animate-bounce" />
          <span>Hydration & Fluid Intake Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Track Daily Water & Desi Hydration
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium max-w-xl mx-auto">
          Optimal hydration accelerates nutrient absorption, prevents cramping during heavy lifts, and supports fat oxidation on high-protein Indian diets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Animated Water Circle & Progress */}
        <div className="md:col-span-5 bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 sm:p-8 rounded-3xl text-center space-y-5 shadow-xs flex flex-col items-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-100 dark:text-[#2A1D16] stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-sky-500 stroke-current transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - percentage / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Droplet className="w-7 h-7 text-sky-500 animate-pulse mb-1" />
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {(waterLoggedMl / 1000).toFixed(1)} <span className="text-sm font-bold text-sky-500">L</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                Target: {(targetMl / 1000).toFixed(1)} L
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-black text-sky-600 dark:text-sky-400 flex items-center justify-center space-x-1.5">
              {percentage >= 100 && <Check className="w-4 h-4 text-[#EA580C]" />}
              <span>{percentage}% Achieved</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ~{glassCount} glasses consumed today
            </p>
          </div>
        </div>

        {/* Quick Log Buttons & Controls */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-sky-500" />
                <span>One-Tap Quick Logging</span>
              </h2>

              <button
                onClick={resetWater}
                className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-500 transition cursor-pointer font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addWater(250, '1 Glass')}
                className="p-3.5 bg-[#f8faf8] dark:bg-[#19120E] hover:border-sky-400 border border-[#EEDEC1] dark:border-[#3A291E] rounded-2xl text-left transition-all active:scale-95 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">🥛</span>
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-black group-hover:scale-105 transition">+250 ml</span>
                </div>
                <div className="font-black text-xs text-slate-900 dark:text-white mt-2">1 Glass Water</div>
                <p className="text-[10px] text-slate-500 font-medium">Standard Kitchen Tumbler</p>
              </button>

              <button
                onClick={() => addWater(500, 'Bottle')}
                className="p-3.5 bg-[#f8faf8] dark:bg-[#19120E] hover:border-sky-400 border border-[#EEDEC1] dark:border-[#3A291E] rounded-2xl text-left transition-all active:scale-95 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">🍼</span>
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-black group-hover:scale-105 transition">+500 ml</span>
                </div>
                <div className="font-black text-xs text-slate-900 dark:text-white mt-2">Fitness Bottle</div>
                <p className="text-[10px] text-slate-500 font-medium">Gym Shaker / Sipper</p>
              </button>

              <button
                onClick={() => addWater(300, 'Chaas')}
                className="p-3.5 bg-[#f8faf8] dark:bg-[#19120E] hover:border-sky-400 border border-[#EEDEC1] dark:border-[#3A291E] rounded-2xl text-left transition-all active:scale-95 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">🥤</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-black group-hover:scale-105 transition">+300 ml</span>
                </div>
                <div className="font-black text-xs text-slate-900 dark:text-white mt-2">Masala Chaas</div>
                <p className="text-[10px] text-slate-500 font-medium">Jeera Buttermilk & Probiotics</p>
              </button>

              <button
                onClick={() => addWater(300, 'Nariyal Pani')}
                className="p-3.5 bg-[#f8faf8] dark:bg-[#19120E] hover:border-sky-400 border border-[#EEDEC1] dark:border-[#3A291E] rounded-2xl text-left transition-all active:scale-95 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">🥥</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-black group-hover:scale-105 transition">+300 ml</span>
                </div>
                <div className="font-black text-xs text-slate-900 dark:text-white mt-2">Nariyal Pani</div>
                <p className="text-[10px] text-slate-500 font-medium">Natural Fresh Coconut Water</p>
              </button>
            </div>
          </div>

          {/* Desi Hydration Tip */}
          <div className="bg-amber-50 dark:bg-[#201610] border border-amber-200 dark:border-[#38261A] p-4 rounded-2xl flex items-start space-x-3 text-xs">
            <Sparkles className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#9A3412] dark:text-[#FED7AA]">Indian Kitchen Hydration Tip:</span>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                Drink earthen matka water or add roasted cumin (jeera) and rock salt to cold Chaas. This cools metabolic heat, balances electrolytes, and prevents dehydration headaches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
