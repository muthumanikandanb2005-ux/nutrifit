import React, { useState } from 'react';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoodDatabase';
import type { FoodItem } from '../types';
import { Sparkles, Refrigerator, ChefHat, Check, Plus, Clock } from 'lucide-react';

interface FridgeAIProps {
  onSelectRecipe: (food: FoodItem) => void;
}

export const FridgeAI: React.FC<FridgeAIProps> = ({ onSelectRecipe }) => {
  const commonIngredients = [
    'Paneer', 'Eggs', 'Sattu', 'Sprouted Green Moong', 'Chicken Breast', 
    'Besan', 'Oats', 'Curd', 'Soya Chunks', 'Makhana', 'Black Chana', 
    'Rajma', 'Spinach', 'Lemon', 'Fish', 'Almonds', 'Walnuts'
  ];

  const [selectedIngs, setSelectedIngs] = useState<string[]>(['Paneer', 'Curd']);

  const toggleIngredient = (ing: string) => {
    if (selectedIngs.includes(ing)) {
      setSelectedIngs(selectedIngs.filter((i) => i !== ing));
    } else {
      setSelectedIngs([...selectedIngs, ing]);
    }
  };

  // Find matches from food database
  const matchingFoods = INDIAN_FOOD_DATABASE.filter((food) => {
    if (selectedIngs.length === 0) return true;
    return food.ingredients.some((ing) =>
      selectedIngs.some((selected) => ing.item.toLowerCase().includes(selected.toLowerCase()))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-2 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-[var(--greenSoft)] text-[var(--greenDark)] px-3.5 py-1 rounded-full text-xs font-semibold">
          <Refrigerator className="w-4 h-4" />
          <span>Smart Indian Fridge Finder</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
          What is in your kitchen right now?
        </h1>
        <p className="text-[var(--muted)] text-xs sm:text-sm max-w-xl mx-auto">
          Tap the ingredients available in your pantry or fridge, and we will instantly find high-protein traditional Indian dishes you can make!
        </p>

        {/* Ingredient Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-3">
          {commonIngredients.map((ing) => {
            const isSelected = selectedIngs.includes(ing);
            return (
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[var(--greenSoft)] text-[var(--greenDark)] border-[var(--green)] shadow-sm font-bold'
                    : 'bg-[var(--surface2)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--ink)]'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-[var(--muted)]" />}
                <span>{ing}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--ink)] flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[var(--green)]" />
          <span>Matching Indian Fitness Dishes ({matchingFoods.length})</span>
        </h2>
        <span className="text-xs text-[var(--muted)]">Tap any card to view recipe</span>
      </div>

      {/* Results Grid */}
      {matchingFoods.length === 0 ? (
        <div className="bg-[var(--surface2)] border border-[var(--line)] p-8 rounded-3xl text-center space-y-2 text-[var(--muted)]">
          <ChefHat className="w-8 h-8 mx-auto text-[var(--muted)] opacity-60" />
          <h3 className="text-base font-bold text-[var(--ink)]">No Matching Dishes Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Try selecting additional Indian ingredients (like Paneer, Besan, Eggs, or Oats) above to discover recipes!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {matchingFoods.map((food) => (
            <button
              type="button"
              key={food.id}
              onClick={() => onSelectRecipe(food)}
              className="w-full text-left bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--green)] p-4 sm:p-5 rounded-2xl space-y-2.5 cursor-pointer transition-all duration-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5 w-full">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-[var(--greenSoft)] text-[var(--greenDark)] px-2.5 py-0.5 rounded-full font-semibold uppercase">
                    {food.slot.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[var(--muted)] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{food.prepTimeMins}m</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[var(--ink)]">{food.name}</h3>
                {food.hindiName && (
                  <p className="text-xs text-[var(--muted)] font-serif">({food.hindiName})</p>
                )}
                <p className="text-xs text-[var(--muted)]">{food.servingSize}</p>
              </div>

              <div className="w-full pt-2.5 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <div className="space-x-2">
                  <span className="font-semibold text-[var(--ink)]">{food.calories} kcal</span>
                  <span className="font-semibold text-[var(--green)]">{food.protein}g protein</span>
                </div>

                <span className="flex items-center space-x-1 px-2.5 py-1 bg-[var(--surface2)] text-[var(--greenDark)] rounded-lg font-medium text-xs">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>View</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
