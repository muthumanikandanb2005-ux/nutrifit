import React from 'react';
import type { FoodItem } from '../types';
import { X, Utensils, Lightbulb, Play } from 'lucide-react';
import { haptic } from '../utils/haptics';
import { getIndianFoodImage } from '../utils/indianFoodImages';

interface RecipeModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onAddToPlan?: (food: FoodItem) => void;
  onStartCookMode?: (food: FoodItem) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ 
  food, 
  onClose, 
  onStartCookMode
}) => {
  if (!food) return null;

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  const dishImage = getIndianFoodImage(food);

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1611]/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      <div className="relative bg-white dark:bg-[#1C1511] border-t sm:border border-[#EEDEC1] dark:border-[#3A291E] rounded-t-[32px] sm:rounded-[32px] max-w-2xl w-full max-h-[90vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Android Native Drag Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Modal Header Banner with Dish Image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
          <img 
            src={dishImage} 
            alt={food.name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition cursor-pointer"
            aria-label="Close recipe details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EA580C] text-white">
                {food.slot.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-semibold text-white/80">
                ⏱ {food.prepTimeMins} mins
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-snug truncate">
              {food.name}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Quick Macro Pills Bento */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-[#FEF3C7] dark:bg-[#231811] border border-[#FED7AA] dark:border-[#273a2c]">
              <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Calories</div>
              <div className="text-base font-black text-[#9A3412] dark:text-[#FED7AA] font-bold">{food.calories}</div>
              <div className="text-[9px] text-slate-600 dark:text-slate-300 font-medium">kcal</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#FEF3C7] dark:bg-[#231811] border border-[#FED7AA] dark:border-[#273a2c]">
              <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Protein</div>
              <div className="text-base font-black text-[#9A3412] dark:text-[#FED7AA] font-bold">{food.protein}g</div>
              <div className="text-[9px] text-slate-600 dark:text-slate-300 font-medium">muscle fuel</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#f8faf8] dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E]">
              <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Carbs</div>
              <div className="text-base font-black text-slate-800 dark:text-slate-200">{food.carbs}g</div>
              <div className="text-[9px] text-slate-600 dark:text-slate-300 font-medium">clean energy</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#f8faf8] dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E]">
              <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Fats</div>
              <div className="text-base font-black text-slate-800 dark:text-slate-200">{food.fats}g</div>
              <div className="text-[9px] text-slate-600 dark:text-slate-300 font-medium">healthy fats</div>
            </div>
          </div>

          {/* Serving & Serving Size */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f8faf8] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E]">
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA] font-bold" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Portion Serving:</span>
            </div>
            <span className="text-xs font-black text-[#9A3412] dark:text-[#FED7AA] font-bold">
              {food.servingSize}
            </span>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
              Ingredients Required ({food.ingredients.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {food.ingredients.map((ing, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-2xl bg-[#fcfdfc] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ing.item}</span>
                  <span className="font-bold text-[#9A3412] dark:text-[#FED7AA] font-bold">{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Instructions */}
          {food.recipeInstructions && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                Step-by-Step Directions
              </h4>
              <div className="space-y-2">
                {food.recipeInstructions.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-[#fcfdfc] dark:bg-[#19120E] border border-[#EEDEC1] dark:border-[#3A291E] flex items-start space-x-3 text-xs leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Tips */}
          {food.tips && (
            <div className="p-3 rounded-2xl bg-[#FEF3C7] dark:bg-[#231811] border border-[#FED7AA] dark:border-[#3A291E] flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Lightbulb className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA] font-bold shrink-0 mt-0.5" />
              <span><strong>Nutritionist Note:</strong> {food.tips}</span>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-[#EEDEC1] dark:border-[#3A291E] bg-[#f8faf8] dark:bg-[#19120E] flex items-center justify-between gap-3">
          {onStartCookMode && (
            <button
              onClick={() => {
                onClose();
                onStartCookMode(food);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md active:scale-95 transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Start Hands-Free Cook Mode</span>
            </button>
          )}

          <button
            onClick={handleClose}
            className="py-3 px-5 rounded-2xl border border-[#EEDEC1] dark:border-[#3A2A1F] bg-white dark:bg-[#231811] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
