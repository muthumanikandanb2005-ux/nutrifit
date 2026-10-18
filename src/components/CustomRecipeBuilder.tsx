import React, { useState } from 'react';
import type { CustomRecipe } from '../types';
import { ChefHat, Plus, Trash2 } from 'lucide-react';

interface CustomRecipeBuilderProps {
  onSaveCustomRecipe: (recipe: CustomRecipe) => void;
  savedRecipes: CustomRecipe[];
}

export const CustomRecipeBuilder: React.FC<CustomRecipeBuilderProps> = ({
  onSaveCustomRecipe,
  savedRecipes: _savedRecipes
}) => {
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState<{ name: string; grams: number; proteinPer100g: number; calPer100g: number; carbsPer100g: number; fatPer100g: number }[]>([
    { name: 'Paneer (Low Fat)', grams: 100, proteinPer100g: 18, calPer100g: 200, carbsPer100g: 3, fatPer100g: 13 },
    { name: 'Besan (Gram Flour)', grams: 50, proteinPer100g: 22, calPer100g: 380, carbsPer100g: 58, fatPer100g: 6 }
  ]);

  const commonIngredientsPresets = [
    { name: 'Paneer (Low Fat)', proteinPer100g: 18, calPer100g: 200, carbsPer100g: 3, fatPer100g: 13 },
    { name: 'Chicken Breast (Raw)', proteinPer100g: 23, calPer100g: 110, carbsPer100g: 0, fatPer100g: 2.5 },
    { name: 'Whole Eggs (3 Eggs)', proteinPer100g: 13, calPer100g: 145, carbsPer100g: 1, fatPer100g: 10 },
    { name: 'Sattu Powder', proteinPer100g: 22, calPer100g: 400, carbsPer100g: 64, fatPer100g: 7 },
    { name: 'Rolled Oats', proteinPer100g: 13, calPer100g: 380, carbsPer100g: 66, fatPer100g: 7 },
    { name: 'Soya Chunks (Dry)', proteinPer100g: 52, calPer100g: 345, carbsPer100g: 33, fatPer100g: 0.5 },
  ];

  const handleAddIngredient = (preset: typeof commonIngredientsPresets[0]) => {
    setIngredients([...ingredients, { ...preset, grams: 100 }]);
  };

  const handleRemove = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Calculate totals
  let totalCal = 0;
  let totalProt = 0;
  let totalCarb = 0;
  let totalFat = 0;

  ingredients.forEach((ing) => {
    const factor = ing.grams / 100;
    totalCal += ing.calPer100g * factor;
    totalProt += ing.proteinPer100g * factor;
    totalCarb += ing.carbsPer100g * factor;
    totalFat += ing.fatPer100g * factor;
  });

  const calPerServing = Math.round(totalCal / servings);
  const protPerServing = Math.round(totalProt / servings);
  const carbPerServing = Math.round(totalCarb / servings);
  const fatPerServing = Math.round(totalFat / servings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeName.trim()) return;

    const recipe: CustomRecipe = {
      id: `cust_${Date.now()}`,
      name: recipeName,
      servingCount: servings,
      caloriesPerServing: calPerServing,
      proteinPerServing: protPerServing,
      carbsPerServing: carbPerServing,
      fatsPerServing: fatPerServing,
      ingredients: ingredients.map((i) => ({ name: i.name, grams: i.grams }))
    };

    onSaveCustomRecipe(recipe);
    setRecipeName('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <ChefHat className="w-4 h-4" />
          <span>Custom Indian Recipe Builder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Calculate Macros for Homemade Dishes
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Mix ingredients from your kitchen, specify grams and serving counts, and save your custom fitness recipe thali!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recipe Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Recipe Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mum's High Protein Paneer Besan Chilla"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Servings Yield</label>
              <input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Add Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400">Add Raw Ingredients:</span>
            <div className="flex flex-wrap gap-1.5">
              {commonIngredientsPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddIngredient(preset)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-950 border border-slate-700 text-xs text-amber-300 rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-300">Selected Ingredients ({ingredients.length})</span>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-700 text-xs">
                  <span className="font-bold text-white">{ing.name}</span>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={ing.grams}
                        onChange={(e) => {
                          const updated = [...ingredients];
                          updated[i].grams = Number(e.target.value);
                          setIngredients(updated);
                        }}
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white font-mono text-xs"
                      />
                      <span className="text-slate-400">grams</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Save Recipe to My Custom Dishes</span>
          </button>
        </form>

        {/* Live Macro Calculation Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl space-y-6 shadow-xl text-center">
            <h2 className="text-base font-bold text-white border-b border-slate-700 pb-3">Calculated Macros Per Serving</h2>

            <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/30 space-y-1">
              <span className="text-xs text-amber-400 font-bold uppercase">Calories / Serving</span>
              <div className="text-4xl font-extrabold text-white">{calPerServing} <span className="text-sm font-normal text-amber-300">kcal</span></div>
              <p className="text-[10px] text-slate-400">Yields {servings} total servings</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Protein</span>
                <div className="text-lg font-bold text-emerald-400">{protPerServing}g</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-sky-500/30">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Carbs</span>
                <div className="text-lg font-bold text-sky-400">{carbPerServing}g</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-yellow-500/30">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Fats</span>
                <div className="text-lg font-bold text-yellow-400">{fatPerServing}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
