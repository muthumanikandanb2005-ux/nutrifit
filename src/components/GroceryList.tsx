import React, { useState, useMemo } from 'react';
import type { DailyMealPlan, GroceryItem } from '../types';
import { ShoppingBag, CheckSquare, Square, Copy, Check } from 'lucide-react';

interface GroceryListProps {
  mealPlan: DailyMealPlan;
}

export const GroceryList: React.FC<GroceryListProps> = ({ mealPlan }) => {
  const [checkedNames, setCheckedNames] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Consolidate ingredients from current meal plan and preserve uniqueness
  const items = useMemo<GroceryItem[]>(() => {
    const map = new Map<string, GroceryItem>();

    Object.values(mealPlan.meals).forEach((food) => {
      food.ingredients.forEach((ing) => {
        const key = `${ing.category}_${ing.item.toLowerCase()}`;
        if (map.has(key)) {
          const existing = map.get(key)!;
          if (!existing.amount.includes(ing.amount)) {
            existing.amount = `${existing.amount} + ${ing.amount}`;
          }
        } else {
          map.set(key, {
            name: ing.item,
            amount: ing.amount,
            category: ing.category,
            checked: false
          });
        }
      });
    });

    return Array.from(map.values());
  }, [mealPlan]);

  const toggleCheck = (name: string) => {
    setCheckedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const categories: { key: GroceryItem['category']; title: string; icon: string }[] = [
    { key: 'grains', title: 'Atta, Rice & Grains (अनाज)', icon: '🌾' },
    { key: 'dairy_poultry', title: 'Dairy, Eggs & Meats (दूध, अंडा, चिकन)', icon: '🥛' },
    { key: 'legumes', title: 'Dals, Chana & Soya (दाल और सोया)', icon: '🫘' },
    { key: 'vegetables', title: 'Fresh Produce & Veggies (सब्जियां)', icon: '🥬' },
    { key: 'spices_pantry', title: 'Spices, Oils & Nuts (मसाले और ड्राई फ्रूट्स)', icon: '🧂' }
  ];

  const handleCopy = async () => {
    const listText = categories
      .map((cat) => {
        const catItems = items.filter((i) => i.category === cat.key);
        if (catItems.length === 0) return '';
        return `*${cat.title}*\n` + catItems.map((i) => `- ${i.name} (${i.amount})`).join('\n');
      })
      .filter(Boolean)
      .join('\n\n');

    const fullContent = `🛒 *NutriFit Weekly Kirana Shopping List*\n\n${listText}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullContent);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Kirana & Supermarket Auto-Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Weekly Indian Grocery Checklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automatically compiled from your active meal plan items and serving sizes.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-2xl shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Kirana List'}</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const categoryItems = items.filter((i) => i.category === cat.key);
          if (categoryItems.length === 0) return null;

          return (
            <div
              key={cat.key}
              className="bg-slate-800/70 border border-slate-700/60 rounded-3xl p-6 space-y-4 shadow-md"
            >
              <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-700/60 pb-3">
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.title}</span>
              </h2>

              <div className="space-y-2">
                {categoryItems.map((item) => {
                  const isChecked = checkedNames.has(item.name);
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => toggleCheck(item.name)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                          : 'bg-slate-900/80 border-slate-700/60 text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="font-semibold text-sm">{item.name}</span>
                      </div>
                      <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">
                        {item.amount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
