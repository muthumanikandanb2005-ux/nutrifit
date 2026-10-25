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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop touch to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div 
        className="relative border-t sm:border rounded-t-[26px] sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 max-h-[88vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--line)',
          color: 'var(--ink)'
        }}
      >
        {/* Native Android Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 rounded-full mx-auto" style={{ background: 'var(--line)' }} />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div 
              className="p-2 sm:p-2.5 rounded-2xl"
              style={{
                background: 'var(--greenSoft)',
                color: 'var(--greenDark)',
                border: '1px solid var(--line)'
              }}
            >
              <RefreshCw className="w-5 h-5 animate-spin-reverse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--ink)' }}>
                Swap {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </h2>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Showing alternatives for {profile.dietType.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl transition-all cursor-pointer"
            style={{
              background: 'var(--surface2)',
              color: 'var(--muted)',
              border: '1px solid var(--line)'
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Selection Pill */}
        <div 
          className="p-3 sm:p-3.5 rounded-2xl flex items-center justify-between text-xs"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--line)'
          }}
        >
          <div>
            <span className="font-semibold" style={{ color: 'var(--muted)' }}>Current dish:</span>
            <span className="ml-2 font-bold" style={{ color: 'var(--ink)' }}>{currentFood.name}</span>
          </div>
          <span className="font-bold font-mono" style={{ color: 'var(--greenDark)' }}>
            {currentFood.calories} kcal · {currentFood.protein}g protein
          </span>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {compatibleOptions.map((item) => {
            const isSelected = item.id === currentFood.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between gap-4`}
                style={{
                  background: isSelected ? 'var(--greenSoft)' : 'var(--surface)',
                  borderColor: isSelected ? 'var(--green)' : 'var(--line)',
                  color: 'var(--ink)'
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{item.name}</h3>
                    {item.hindiName && (
                      <span className="text-xs font-serif" style={{ color: 'var(--muted)' }}>({item.hindiName})</span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Portion: {item.servingSize}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] px-1.5 py-0.5 rounded"
                        style={{
                          background: 'var(--surface2)',
                          color: 'var(--muted)',
                          border: '1px solid var(--line)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right text-xs">
                    <div className="font-bold" style={{ color: 'var(--greenDark)' }}>{item.calories} kcal</div>
                    <div className="font-semibold" style={{ color: 'var(--green)' }}>{item.protein}g P</div>
                  </div>

                  {isSelected ? (
                    <div 
                      className="p-1.5 rounded-xl font-bold"
                      style={{ background: 'var(--green)', color: '#fffefa' }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <button 
                      className="px-2.5 py-1 text-xs font-semibold rounded-xl transition-all"
                      style={{
                        background: 'var(--surface2)',
                        border: '1px solid var(--line)',
                        color: 'var(--ink)'
                      }}
                    >
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
