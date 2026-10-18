import React, { useState } from 'react';
import type { SupplementInfo } from '../types';
import { Pill, Clock, Check } from 'lucide-react';

export const INDIAN_SUPPLEMENT_DATABASE: SupplementInfo[] = [
  {
    id: 'supp_1',
    name: 'Whey Protein Isolate / Concentrate',
    hindiName: 'वे प्रोटीन',
    category: 'protein',
    dosage: '1 Scoop (24g - 27g protein)',
    bestTime: 'Immediately Post-Workout or Breakfast',
    benefits: ['Fast Muscle Recovery', 'Prevents Muscle Breakdown', 'Highest Biological Value'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'Extracted from milk curd during cheese production. 100% vegetarian, rapidly digested within 30-45 minutes after strength training.'
  },
  {
    id: 'supp_2',
    name: 'Creatine Monohydrate',
    hindiName: 'क्रिएटिन',
    category: 'performance',
    dosage: '3g - 5g daily (unflavored with water)',
    bestTime: 'Post-Workout with Carbs or Daily Morning',
    benefits: ['Increases Muscle Strength & Power', 'Boosts ATP Cellular Energy', 'Improves Muscle Hydration & Volume'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'The most thoroughly researched fitness supplement in the world. Synthesizes phosphocreatine in muscle tissue for explosive lift power.'
  },
  {
    id: 'supp_3',
    name: 'KSM-66 Ashwagandha Root Extract',
    hindiName: 'अश्वगंधा',
    category: 'herbal',
    dosage: '300mg - 600mg standardized extract',
    bestTime: 'At Bedtime with Warm Milk / Water',
    benefits: ['Lowers Stress & Cortisol Levels', 'Supports Natural Testosterone', 'Enhances Deep Sleep & Recovery'],
    isVegetarian: true,
    scientificRating: 'A',
    description: 'Traditional Ayurvedic adaptogen proven in modern clinical trials to reduce serum cortisol levels and accelerate recovery from intense weight training.'
  },
  {
    id: 'supp_4',
    name: 'Vitamin D3 (Cholecalciferol) + K2',
    hindiName: 'विटामिन D3',
    category: 'vitamins',
    dosage: '2000 IU - 60000 IU (as per doctor lab test)',
    bestTime: 'With a Fat-Containing Meal (Lunch)',
    benefits: ['Bone Mineral Density', 'Optimal Hormone Balance', 'Immunity Boost'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'Over 70% of urban Indians are Vitamin D deficient due to indoor office jobs. Fat-soluble vitamin essential for calcium absorption and muscle strength.'
  },
  {
    id: 'supp_5',
    name: 'Vitamin B12 (Methylcobalamin)',
    hindiName: 'विटामिन B12',
    category: 'vitamins',
    dosage: '1000mcg Sublingual / Tablet',
    bestTime: 'Morning with Breakfast',
    benefits: ['Nerve System Health', 'Reduces Fatigue & Lethargy', 'Red Blood Cell Synthesis'],
    isVegetarian: true,
    scientificRating: 'A+',
    description: 'Essential nutrient missing in strict vegetarian and vegan diets. Prevents nerve numbness and chronic workout fatigue.'
  },
  {
    id: 'supp_6',
    name: 'Omega-3 Fish Oil / Algal Oil',
    hindiName: 'ओमेगा-3 फ़िश/एल्गल ऑयल',
    category: 'performance',
    dosage: '1000mg (with 180mg EPA / 120mg DHA)',
    bestTime: 'With Main Meals (Lunch or Dinner)',
    benefits: ['Reduces Workout Joint Inflammation', 'Heart & Lipid Profile Support', 'Brain Cognitive Function'],
    isVegetarian: false,
    scientificRating: 'A',
    description: 'Rich in essential fatty acids (EPA & DHA) that reduce delayed onset muscle soreness (DOMS) and cushion joints under heavy squatting.'
  }
];

export const SupplementGuide: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = INDIAN_SUPPLEMENT_DATABASE.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Pill className="w-4 h-4" />
          <span>Evidence-Based Supplement Advisor (सप्लीमेंट गाइड)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Scientific Fitness & Herbal Supplements
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Clear, honest breakdown of supplements for Indian diets (Whey, Creatine, Ashwagandha, B12, D3).
        </p>

        {/* Filter Categories */}
        <div className="flex justify-center pt-2">
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 inline-flex space-x-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'all' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('protein')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'protein' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Protein
            </button>
            <button
              onClick={() => setFilterCategory('performance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'performance' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setFilterCategory('herbal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'herbal' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Herbal (Ayurvedic)
            </button>
            <button
              onClick={() => setFilterCategory('vitamins')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === 'vitamins' ? 'bg-purple-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vitamins
            </button>
          </div>
        </div>
      </div>

      {/* Supplement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((supp) => (
          <div
            key={supp.id}
            className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-bold uppercase">
                      {supp.category}
                    </span>
                    <span className="text-xs bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 font-bold">
                      Grade {supp.scientificRating}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">{supp.name}</h3>
                  {supp.hindiName && (
                    <p className="text-xs text-amber-300/80 font-serif">({supp.hindiName})</p>
                  )}
                </div>

                <span className="text-xs px-2 py-1 bg-slate-900 rounded-lg border border-slate-700 text-slate-300">
                  {supp.isVegetarian ? '🥦 100% Veg' : '🐟 Non-Veg Option'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{supp.description}</p>

              {/* Dosage & Timing */}
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Recommended Dosage:</span>
                  <span className="font-bold text-amber-300 font-mono">{supp.dosage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Best Time:</span>
                  </span>
                  <span className="font-bold text-sky-300">{supp.bestTime}</span>
                </div>
              </div>

              {/* Benefits Pills */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Key Scientific Benefits</span>
                <div className="flex flex-wrap gap-1.5">
                  {supp.benefits.map((b, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-400" />
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
