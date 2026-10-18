import React from 'react';
import { Droplet, Plus, RotateCcw, Info } from 'lucide-react';

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
  const addWater = (amount: number) => {
    setWaterLoggedMl((prev) => Math.min(prev + amount, 8000));
  };

  const resetWater = () => {
    setWaterLoggedMl(0);
  };

  const percentage = Math.min(100, Math.round((waterLoggedMl / targetMl) * 100));
  const glassCount = Math.round(waterLoggedMl / 250);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Droplet className="w-4 h-4 animate-bounce" />
          <span>Hydration & Fluid Intake Tracker (जल ट्रैकर)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Track Daily Water & Desi Hydration
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Proper hydration improves nutrient absorption, prevents muscle cramps during workouts, and boosts fat metabolism.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Animated Water Circle & Progress */}
        <div className="md:col-span-5 bg-slate-800/80 border border-slate-700/60 p-8 rounded-3xl text-center space-y-6 shadow-xl flex flex-col items-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-900 stroke-current"
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
              <Droplet className="w-8 h-8 text-sky-400 animate-pulse mb-1" />
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {(waterLoggedMl / 1000).toFixed(1)} <span className="text-sm font-normal text-sky-300">L</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Target: {(targetMl / 1000).toFixed(1)} L</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-sky-400">{percentage}% Achieved</div>
            <p className="text-xs text-slate-400">Equivalent to ~{glassCount} glasses of water</p>
          </div>
        </div>

        {/* Quick Log Buttons & Controls */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Quick Add Intake</span>
              </h2>

              <button
                onClick={resetWater}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Log</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addWater(250)}
                className="p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-sky-500 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🥛</span>
                  <span className="text-xs text-sky-400 font-bold group-hover:scale-110 transition">+250 ml</span>
                </div>
                <div className="font-bold text-xs text-white mt-2">1 Glass Water</div>
                <p className="text-[10px] text-slate-400">Standard Tumbler</p>
              </button>

              <button
                onClick={() => addWater(500)}
                className="p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-sky-500 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🍼</span>
                  <span className="text-xs text-sky-400 font-bold group-hover:scale-110 transition">+500 ml</span>
                </div>
                <div className="font-bold text-xs text-white mt-2">Water Bottle</div>
                <p className="text-[10px] text-slate-400">Gym Shaker / Bottle</p>
              </button>

              <button
                onClick={() => addWater(300)}
                className="p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-sky-500 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🥤</span>
                  <span className="text-xs text-sky-400 font-bold group-hover:scale-110 transition">+300 ml</span>
                </div>
                <div className="font-bold text-xs text-white mt-2">Masala Chaas / Lassi</div>
                <p className="text-[10px] text-slate-400">Electrolytes & Gut Probiotics</p>
              </button>

              <button
                onClick={() => addWater(300)}
                className="p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-sky-500 rounded-2xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🥥</span>
                  <span className="text-xs text-sky-400 font-bold group-hover:scale-110 transition">+300 ml</span>
                </div>
                <div className="font-bold text-xs text-white mt-2">Nariyal Pani</div>
                <p className="text-[10px] text-slate-400">Natural Coconut Electrolytes</p>
              </button>
            </div>
          </div>

          {/* Desi Hydration Tip */}
          <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl flex items-start space-x-3 text-xs text-sky-200">
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sky-300">Indian Kitchen Hydration Tip:</span>
              <p className="leading-relaxed text-slate-300">
                Drink clay matka water or add jeera-hing to cold Chaas (Buttermilk). This cools internal body temperature and prevents acidity during intense heavy weight training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
