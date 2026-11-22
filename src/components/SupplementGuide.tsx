import React, { useState } from 'react';
import { INDIAN_SUPPLEMENT_DATABASE } from '../data/supplementDatabase';
import { Pill, Clock, Check, Info } from 'lucide-react';

export const SupplementGuide: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = INDIAN_SUPPLEMENT_DATABASE.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] p-6 sm:p-8 rounded-3xl shadow-xs space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Pill className="w-4 h-4 text-[#EA580C]" />
          <span>Evidence-Based Supplement Advisor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Scientific Fitness & Herbal Supplements
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium max-w-xl mx-auto">
          Honest, clinical breakdown for Indian diets: Whey Protein, Creatine, Ashwagandha, Vitamin D3 & B12.
        </p>

        {/* Filter Categories */}
        <div className="flex justify-center pt-2">
          <div className="bg-stone-100 dark:bg-[#15100E] p-1.5 rounded-2xl border border-[#EEDEC1] dark:border-[#3A291E] inline-flex flex-wrap justify-center gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'protein', label: 'Protein' },
              { id: 'performance', label: 'Performance' },
              { id: 'herbal', label: 'Herbal (Ayurvedic)' },
              { id: 'vitamins', label: 'Vitamins' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#EA580C] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#201610] border border-amber-200 dark:border-[#38261A] flex items-center space-x-3 text-xs text-amber-900 dark:text-amber-200 font-medium">
        <Info className="w-4 h-4 text-[#EA580C] shrink-0" />
        <span>Supplements are intended to complete a solid whole-food Indian diet, not replace it. Always consult your healthcare physician before starting new supplementation.</span>
      </div>

      {/* Supplement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((supp) => (
          <div
            key={supp.id}
            className="bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] hover:border-[#EA580C] p-5 sm:p-6 rounded-3xl space-y-4 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-bold uppercase">
                      {supp.category}
                    </span>
                    <span className="text-[10px] bg-stone-100 dark:bg-[#201610] text-[#EA580C] px-2 py-0.5 rounded border border-[#EEDEC1] dark:border-[#38261A] font-black">
                      Grade {supp.scientificRating}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {supp.name}
                  </h3>
                </div>

                <span className="text-[11px] px-2.5 py-1 bg-stone-100 dark:bg-[#15100E] rounded-xl border border-[#EEDEC1] dark:border-[#3A291E] text-slate-700 dark:text-slate-300 font-bold shrink-0">
                  {supp.isVegetarian ? '100% Vegetarian' : 'Non-Veg Option'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {supp.description}
              </p>

              {/* Dosage & Timing */}
              <div className="bg-[#FFFBF5] dark:bg-[#15100E] p-3.5 rounded-2xl border border-[#EEDEC1] dark:border-[#2D1F16] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Recommended Dosage:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{supp.dosage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Best Timing:</span>
                  </span>
                  <span className="font-bold text-amber-900 dark:text-amber-200">{supp.bestTime}</span>
                </div>
              </div>

              {/* Benefits Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  Key Scientific Benefits
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {supp.benefits.map((b, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] bg-stone-100 dark:bg-[#19120E] text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-[#EEDEC1] dark:border-[#3A291E] flex items-center space-x-1 font-medium"
                    >
                      <Check className="w-3 h-3 text-[#EA580C]" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
