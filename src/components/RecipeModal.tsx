import React from 'react';
import type { FoodItem } from '../types';
import { X, ChefHat, Clock, Utensils, Lightbulb } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface RecipeModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onAddToPlan?: (food: FoodItem) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ food, onClose, onAddToPlan }) => {
  if (!food) return null;

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop tap to close */}
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      <div 
        className="relative border-t sm:border rounded-t-[26px] sm:rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--line)',
          color: 'var(--ink)'
        }}
      >
        {/* Android Native Drag Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'var(--line)' }} />
        </div>

        {/* Modal Header */}
        <div 
          className="flex items-start justify-between p-4 sm:p-6 pb-3"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <div className="space-y-1 pr-2">
            <div className="flex items-center space-x-2">
              <span 
                className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: 'var(--greenSoft)',
                  color: 'var(--greenDark)',
                  border: '1px solid var(--line)'
                }}
              >
                Indian Recipe
              </span>
              <span className="text-xs flex items-center space-x-1" style={{ color: 'var(--muted)' }}>
                <Clock className="w-3.5 h-3.5" />
                <span>{food.prepTimeMins} mins</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-baseline space-x-2" style={{ color: 'var(--ink)' }}>
              <span>{food.name}</span>
              {food.hindiName && (
                <span className="text-sm font-normal font-serif" style={{ color: 'var(--muted)' }}>({food.hindiName})</span>
              )}
            </h2>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Serving Size: {food.servingSize}</p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full cursor-pointer shrink-0 transition-colors"
            style={{
              background: 'var(--surface2)',
              color: 'var(--muted)',
              border: '1px solid var(--line)'
            }}
            aria-label="Close recipe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain pb-[max(2rem,env(safe-area-inset-bottom))]">
          {/* Nutritional Facts Grid */}
          <div 
            className="grid grid-cols-4 gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl text-center"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--line)'
            }}
          >
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold" style={{ color: 'var(--muted)' }}>Calories</span>
              <div className="text-base sm:text-lg font-bold" style={{ color: 'var(--greenDark)' }}>{food.calories}</div>
              <span className="text-[9px]" style={{ color: 'var(--muted)' }}>kcal</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold" style={{ color: 'var(--muted)' }}>Protein</span>
              <div className="text-base sm:text-lg font-bold" style={{ color: 'var(--green)' }}>{food.protein}g</div>
              <span className="text-[9px]" style={{ color: 'var(--muted)' }}>protein</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold" style={{ color: 'var(--muted)' }}>Carbs</span>
              <div className="text-base sm:text-lg font-bold" style={{ color: 'var(--ink)' }}>{food.carbs}g</div>
              <span className="text-[9px]" style={{ color: 'var(--muted)' }}>carbs</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold" style={{ color: 'var(--muted)' }}>Fats</span>
              <div className="text-base sm:text-lg font-bold" style={{ color: 'var(--muted)' }}>{food.fats}g</div>
              <span className="text-[9px]" style={{ color: 'var(--muted)' }}>fats</span>
            </div>
          </div>

          {/* Ingredients Required */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold flex items-center space-x-2" style={{ color: 'var(--ink)' }}>
              <Utensils className="w-4 h-4" style={{ color: 'var(--green)' }} />
              <span>Ingredients Required</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {food.ingredients.map((ing, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs"
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--line)'
                  }}
                >
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>{ing.item}</span>
                  <span 
                    className="font-mono font-bold px-2 py-0.5 rounded"
                    style={{ background: 'var(--surface)', color: 'var(--greenDark)' }}
                  >
                    {ing.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          {food.recipeInstructions && food.recipeInstructions.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs sm:text-sm font-bold flex items-center space-x-2" style={{ color: 'var(--ink)' }}>
                <ChefHat className="w-4 h-4" style={{ color: 'var(--green)' }} />
                <span>Step-by-Step Preparation</span>
              </h3>

              <div className="space-y-2">
                {food.recipeInstructions.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-3 text-xs p-3 rounded-xl"
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)'
                    }}
                  >
                    <span 
                      className="flex items-center justify-center w-5 h-5 rounded-full font-bold text-[11px] shrink-0"
                      style={{
                        background: 'var(--greenSoft)',
                        color: 'var(--greenDark)',
                        border: '1px solid var(--line)'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed" style={{ margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desi Chef Tip */}
          {food.tips && (
            <div 
              className="p-3.5 sm:p-4 rounded-2xl flex items-start space-x-3 text-xs"
              style={{
                background: 'var(--yellow)',
                border: '1px solid var(--line)',
                color: 'var(--ink)'
              }}
            >
              <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--greenDark)' }} />
              <div>
                <span className="font-bold" style={{ color: 'var(--greenDark)' }}>Kitchen tip:</span>
                <p className="mt-0.5 leading-relaxed" style={{ margin: 0 }}>{food.tips}</p>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          {onAddToPlan && (
            <div className="pt-2">
              <button
                onClick={() => {
                  haptic.medium();
                  onAddToPlan(food);
                  onClose();
                }}
                className="primary w-full"
                type="button"
              >
                ＋ Add to meal plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
