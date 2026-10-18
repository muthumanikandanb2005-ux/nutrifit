import React from 'react';
import type { FoodItem } from '../types';
import { X, ChefHat, Clock, Utensils, Lightbulb } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface RecipeModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ food, onClose }) => {
  if (!food) return null;

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop tap to close */}
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      <div className="relative bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-[32px] sm:rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
        
        {/* Android Native Drag Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-4 sm:p-6 pb-3">
          <div className="space-y-1 pr-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Indian Fitness Recipe
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{food.prepTimeMins} mins</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-baseline space-x-2">
              <span>{food.name}</span>
              {food.hindiName && (
                <span className="text-sm font-normal text-amber-300 font-serif">({food.hindiName})</span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Serving Size: {food.servingSize}</p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 active:bg-slate-700 rounded-full border border-slate-700 cursor-pointer shrink-0"
            aria-label="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain pb-[max(2rem,env(safe-area-inset-bottom))]">
          {/* Nutritional Facts Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 text-center">
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Calories</span>
              <div className="text-base sm:text-lg font-black text-amber-400">{food.calories}</div>
              <span className="text-[9px] text-slate-500">kcal</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Protein</span>
              <div className="text-base sm:text-lg font-black text-emerald-400">{food.protein}g</div>
              <span className="text-[9px] text-slate-500">muscle</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Carbs</span>
              <div className="text-base sm:text-lg font-black text-sky-400">{food.carbs}g</div>
              <span className="text-[9px] text-slate-500">energy</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Fats</span>
              <div className="text-base sm:text-lg font-black text-yellow-400">{food.fats}g</div>
              <span className="text-[9px] text-slate-500">healthy</span>
            </div>
          </div>

          {/* Ingredients Required */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Ingredients Required</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {food.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-200 font-medium">{ing.item}</span>
                  <span className="text-amber-300 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded">{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          {food.recipeInstructions && food.recipeInstructions.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                <ChefHat className="w-4 h-4 text-amber-400" />
                <span>Step-by-Step Preparation</span>
              </h3>

              <div className="space-y-2">
                {food.recipeInstructions.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <span className="flex items-center justify-center w-5 h-5 bg-amber-500/20 text-amber-400 rounded-full font-bold text-[11px] shrink-0 border border-amber-500/30">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desi Chef Tip */}
          {food.tips && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 sm:p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-200">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400">Pro Indian Kitchen Tip:</span>
                <p className="mt-0.5 text-slate-300 leading-relaxed">{food.tips}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
