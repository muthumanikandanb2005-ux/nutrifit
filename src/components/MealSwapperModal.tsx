import React from 'react';
import type { FoodItem, MealSlot, UserProfile } from '../types';
import { filterCompatibleFoods } from '../utils/mealPlanGenerator';
import { X, RefreshCw, Check } from 'lucide-react';
import { haptic } from '../utils/haptics';

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

  const compatibleOptions = filterCompatibleFoods(slot, profile);

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop touch to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative bg-slate-800 border-t sm:border border-slate-700/80 rounded-t-[32px] sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 max-h-[88vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        
        {/* Native Android Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-600 rounded-full mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 sm:p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Swap Meal ({slot.replace('_', ' ').toUpperCase()})</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Select alternative Indian food matching your macros</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-700 cursor-pointer active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Food Badge */}
        <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-slate-300">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400">Currently Selected</span>
            <div className="text-sm font-bold text-white">{currentFood.name}</div>
            <span className="text-slate-400">{currentFood.servingSize}</span>
          </div>
          <div className="text-right">
            <div className="font-extrabold text-amber-400 text-sm">{currentFood.calories} kcal</div>
            <div className="text-emerald-400 font-bold">{currentFood.protein}g Protein</div>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {compatibleOptions.map((item) => {
            const isSelected = item.id === currentFood.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500'
                    : 'bg-slate-900/60 border-slate-700 hover:border-slate-500 text-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">{item.name}</h3>
                    {item.hindiName && (
                      <span className="text-xs text-amber-300/80 font-serif">({item.hindiName})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Portion: {item.servingSize}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t, i) => (
                      <span key={i} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right text-xs">
                    <div className="font-bold text-amber-400">{item.calories} kcal</div>
                    <div className="font-bold text-emerald-400">{item.protein}g Prot</div>
                    <div className="text-[10px] text-slate-400">{item.carbs}g C • {item.fats}g F</div>
                  </div>

                  {isSelected ? (
                    <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-xs font-semibold rounded-xl transition-all">
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
