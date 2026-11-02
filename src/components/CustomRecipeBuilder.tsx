import React, { useState } from 'react';
import type { CustomRecipe } from '../types';
import { ChefHat, Plus, Trash2 } from 'lucide-react';

interface CustomRecipeBuilderProps {
  onSaveCustomRecipe: (recipe: CustomRecipe) => void;
  savedRecipes: CustomRecipe[];
}

export const CustomRecipeBuilder: React.FC<CustomRecipeBuilderProps> = ({
  onSaveCustomRecipe,
  savedRecipes
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

  const validServings = Math.max(1, servings || 1);
  const calPerServing = Math.round(totalCal / validServings);
  const protPerServing = Math.round(totalProt / validServings);
  const carbPerServing = Math.round(totalCarb / validServings);
  const fatPerServing = Math.round(totalFat / validServings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeName.trim()) return;

    const recipe: CustomRecipe = {
      id: `cust_${Date.now()}`,
      name: recipeName,
      servingCount: validServings,
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
    <div className="max-w-5xl mx-auto px-2 py-4 space-y-6">
      {/* Title Header */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-[var(--greenSoft)] text-[var(--greenDark)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <ChefHat className="w-4 h-4" />
          <span>Custom Recipe Builder</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Calculate Macros for Homemade Dishes
        </h1>
        <p className="text-[var(--muted)] text-xs sm:text-sm max-w-xl mx-auto">
          Mix ingredients from your kitchen, specify grams and serving counts, and save your custom fitness recipe!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recipe Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] p-5 sm:p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Recipe Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mum's High Protein Paneer Besan Chilla"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2 text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Servings Yield</label>
              <input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2 text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--green)]"
              />
            </div>
          </div>

          {/* Quick Add Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--muted)]">Add Raw Ingredients:</span>
            <div className="flex flex-wrap gap-1.5">
              {commonIngredientsPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddIngredient(preset)}
                  className="px-2.5 py-1 bg-[var(--surface2)] hover:bg-[var(--greenSoft)] border border-[var(--line)] text-xs text-[var(--ink)] rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[var(--green)]" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-[var(--ink)]">Selected Ingredients ({ingredients.length})</span>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--line)] text-xs">
                  <span className="font-semibold text-[var(--ink)]">{ing.name}</span>

                  <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={ing.grams}
                        onChange={(e) => {
                          const updated = [...ingredients];
                          updated[i].grams = Math.max(0, Number(e.target.value) || 0);
                          setIngredients(updated);
                        }}
                        className="w-16 bg-[var(--surface)] border border-[var(--line)] rounded-lg px-2 py-1 text-center text-[var(--ink)] font-mono text-xs"
                      />
                      <span className="text-[var(--muted)]">g</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="p-1.5 text-[var(--muted)] hover:text-[#9b4e3f] bg-[var(--surface)] border border-[var(--line)] rounded-lg cursor-pointer transition"
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
            className="w-full py-3 bg-[var(--green)] hover:bg-[var(--greenDark)] text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Save Recipe to My Custom Dishes</span>
          </button>
        </form>

        {/* Live Macro Calculation Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] p-5 rounded-2xl space-y-4 shadow-sm text-center">
            <h2 className="text-sm font-semibold text-[var(--ink)] border-b border-[var(--line)] pb-2.5">Calculated Macros Per Serving</h2>

            <div className="bg-[var(--surface2)] p-4 rounded-xl border border-[var(--line)] space-y-1">
              <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">Calories / Serving</span>
              <div className="text-3xl font-bold text-[var(--ink)]">{calPerServing} <span className="text-xs font-normal text-[var(--muted)]">kcal</span></div>
              <p className="text-[10px] text-[var(--muted)]">Yields {validServings} total servings</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--line)]">
                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase">Protein</span>
                <div className="text-base font-bold text-[var(--green)]">{protPerServing}g</div>
              </div>
              <div className="bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--line)]">
                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase">Carbs</span>
                <div className="text-base font-bold text-[#456b82]">{carbPerServing}g</div>
              </div>
              <div className="bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--line)]">
                <span className="text-[10px] text-[var(--muted)] font-semibold uppercase">Fats</span>
                <div className="text-base font-bold text-[#966b36]">{fatPerServing}g</div>
              </div>
            </div>
          </div>

          {/* Saved Custom Recipes Card */}
          {savedRecipes && savedRecipes.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--line)] p-4 rounded-2xl space-y-3 shadow-sm">
              <h3 className="text-xs font-semibold text-[var(--ink)] uppercase tracking-wider flex items-center justify-between">
                <span>My Saved Custom Dishes</span>
                <span className="bg-[var(--greenSoft)] text-[var(--greenDark)] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  {savedRecipes.length} saved
                </span>
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {savedRecipes.map((r) => (
                  <div key={r.id} className="bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--line)] space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-[var(--ink)]">{r.name}</h4>
                      <span className="text-[10px] text-[var(--green)] font-semibold">{r.caloriesPerServing} kcal</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[var(--muted)]">
                      <span>Yields {r.servingCount} servings</span>
                      <span className="text-[var(--green)] font-semibold">{r.proteinPerServing}g P</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
