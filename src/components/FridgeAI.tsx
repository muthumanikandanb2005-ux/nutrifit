import React, { useState } from 'react';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoodDatabase';
import { getIndianFoodImage } from '../utils/indianFoodImages';
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
    <div className="max-w-5xl mx-auto px-2 py-4 space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-xs space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
          <Refrigerator className="w-4 h-4 text-[#EA580C]" />
          <span>Smart Indian Fridge Finder</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-[var(--ink)] tracking-tight">
          What is in your kitchen right now?
        </h1>
        <p className="text-[var(--muted)] text-xs sm:text-sm max-w-xl mx-auto font-medium">
          Tap the ingredients available in your pantry or fridge, and we will instantly find high-protein traditional Indian dishes you can make!
        </p>

        {/* Ingredient Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {commonIngredients.map((ing) => {
            const isSelected = selectedIngs.includes(ing);
            return (
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all duration-150 cursor-pointer flex items-center space-x-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-xs'
                    : 'bg-[var(--surface2)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--ink)] hover:border-[#EA580C]'
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
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm sm:text-base font-black text-[var(--ink)] flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#EA580C]" />
          <span>Matching Indian Fitness Dishes ({matchingFoods.length})</span>
        </h2>
        <span className="text-xs text-[var(--muted)] font-medium">Tap any card to view recipe</span>
      </div>

      {/* Results Grid */}
      {matchingFoods.length === 0 ? (
        <div className="bg-[var(--surface2)] border border-[var(--line)] p-8 rounded-3xl text-center space-y-2 text-[var(--muted)]">
          <ChefHat className="w-8 h-8 mx-auto text-[var(--muted)] opacity-90" />
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
              className="w-full text-left bg-[var(--surface)] border border-[var(--line)] hover:border-[#EA580C] p-4 sm:p-5 rounded-2xl space-y-3 cursor-pointer transition-all duration-150 shadow-xs flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="flex items-start space-x-3 w-full">
                <img 
                  src={getIndianFoodImage(food)} 
                  alt={food.name} 
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[var(--line)] group-hover:scale-105 transition"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                      {food.slot.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[var(--muted)] flex items-center space-x-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{food.prepTimeMins}m</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[var(--ink)] truncate">{food.name}</h3>
                  <p className="text-xs text-[var(--muted)] truncate font-medium">{food.servingSize}</p>
                </div>
              </div>

              <div className="w-full pt-2.5 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <div className="space-x-2">
                  <span className="font-bold text-[var(--ink)]">{food.calories} kcal</span>
                  <span className="font-bold text-[#EA580C]">{food.protein}g protein</span>
                </div>

                <span className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-[#EA580C] border border-amber-200 dark:border-amber-800 rounded-lg font-bold text-xs">
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
