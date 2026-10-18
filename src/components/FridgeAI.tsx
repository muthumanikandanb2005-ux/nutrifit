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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase">
          <Refrigerator className="w-4 h-4" />
          <span>Smart Indian Fridge Ingredient Finder</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          What's in your Indian Kitchen right now?
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Tap the ingredients available in your pantry or fridge, and we'll instantly generate high-protein fitness dishes you can make!
        </p>

        {/* Ingredient Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {commonIngredients.map((ing) => {
            const isSelected = selectedIngs.includes(ing);
            return (
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-amber-400" />}
                <span>{ing}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Matching Indian Fitness Dishes ({matchingFoods.length})</span>
        </h2>
        <span className="text-xs text-slate-400">Click any card to view detailed recipe</span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchingFoods.map((food) => (
          <div
            key={food.id}
            onClick={() => onSelectRecipe(food)}
            className="bg-slate-800/70 border border-slate-700/60 hover:border-amber-500/50 p-5 rounded-3xl space-y-3 cursor-pointer transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.02] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/20 font-semibold uppercase">
                  {food.slot.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{food.prepTimeMins}m</span>
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white">{food.name}</h3>
              {food.hindiName && (
                <p className="text-xs text-amber-300/80 font-serif">({food.hindiName})</p>
              )}
              <p className="text-xs text-slate-400">{food.servingSize}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <div className="space-x-2">
                <span className="font-bold text-amber-400">{food.calories} kcal</span>
                <span className="font-bold text-emerald-400">{food.protein}g Prot</span>
              </div>

              <button className="flex items-center space-x-1 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-xl font-semibold hover:bg-amber-500/30">
                <ChefHat className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
