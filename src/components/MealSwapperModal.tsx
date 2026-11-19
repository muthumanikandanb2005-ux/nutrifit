import React from 'react';
import type { FoodItem, MealSlot, UserProfile } from '../types';
import { filterCompatibleFoods } from '../utils/mealPlanGenerator';
import { X, RefreshCw, Check, Sparkles } from 'lucide-react';
import { haptic } from '../utils/haptics';
import { getIndianFoodImage } from '../utils/indianFoodImages';

interface MealSwapperModalProps {
  slot: MealSlot | null;
  currentFood: FoodItem | null;
  profile: UserProfile;
  onClose: () => void;
  onSelectFood: (slot: MealSlot, food: FoodItem) => void;
}

export const MealSwapperModal: React.FC<MealSwapperModalProps> = ({
  slot,
  currentFood,
  profile,
  onClose,
  onSelectFood
}) => {
  if (!slot || !currentFood) return null;

  const compatibleOptions = filterCompatibleFoods(slot, profile).filter(f => f.id !== currentFood.id);

  const handleSelect = (item: FoodItem) => {
    haptic.success();
    onSelectFood(slot, item);
    onClose();
  };

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1611]/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative bg-white dark:bg-[#162019] border-t sm:border border-[#dae5dc] dark:border-[#28382c] rounded-t-[32px] sm:rounded-[32px] max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[88vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        
        {/* Android Native Drag Handle */}
        <div className="flex justify-center pt-1 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dae5dc] dark:border-[#28382c]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#006d41] text-white flex items-center justify-center shadow-xs">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ebf7ed] dark:bg-[#1f2b22] text-[#006d41] dark:text-[#5be196]">
                  {slot.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">Authentic Indian Swaps</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-[240px] sm:max-w-md">
                Swap: {currentFood.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#1f2923] text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close meal swapper"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Dish Preview */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf8] dark:bg-[#131c15] border border-[#dae5dc] dark:border-[#28382c] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Choice</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentFood.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-[#006d41] dark:text-[#5be196]">{currentFood.calories} kcal</div>
            <div className="text-[11px] text-slate-400">{currentFood.protein}g Protein</div>
          </div>
        </div>

        {/* Compatible Alternatives List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Available Alternatives ({compatibleOptions.length})</span>
            <span className="text-[#006d41] dark:text-[#5be196] flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Calibrated for your macros</span>
            </span>
          </div>

          {compatibleOptions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No additional alternatives found for this slot and diet combination.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {compatibleOptions.map((opt) => {
                const optImg = getIndianFoodImage(opt);
                const protDiff = opt.protein - currentFood.protein;

                return (
                  <div
                    key={opt.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#1c2920] border border-[#dae5dc] dark:border-[#293d2e] hover:border-[#006d41] dark:hover:border-[#5be196] transition flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img 
                        src={optImg} 
                        alt={opt.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#ebf7ed] dark:bg-[#233527] text-[#006d41] dark:text-[#5be196]">
                            {opt.servingSize}
                          </span>
                          <span className="text-[10px] text-slate-400">⏱ {opt.prepTimeMins}m</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {opt.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{opt.calories} kcal</span>
                          <span>•</span>
                          <span className="font-bold text-[#006d41] dark:text-[#5be196]">{opt.protein}g Protein</span>
                          {protDiff > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              (+{protDiff}g pro)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelect(opt)}
                      className="px-4 py-2 rounded-xl bg-[#006d41] hover:bg-[#005a36] text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition cursor-pointer flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Select</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
