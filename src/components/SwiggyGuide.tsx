import React, { useState } from 'react';
import type { RestaurantSwapItem } from '../types';
import { ShoppingBag, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export const SWIGGY_SWAP_DATABASE: RestaurantSwapItem[] = [
  {
    id: 'sw_1',
    cuisine: 'north_indian',
    unhealthyChoice: 'Butter Naan + Paneer Butter Masala',
    unhealthyCalories: 850,
    healthySwap: '2 Tandoori Rotis + Tandoori Paneer Tikka / Paneer Bhurji',
    healthyCalories: 480,
    proteinSavedGrams: 12,
    reason: 'Eliminates heavy cream & maida flour while boosting protein density.'
  },
  {
    id: 'sw_2',
    cuisine: 'north_indian',
    unhealthyChoice: 'Dal Makhani + Jeera Rice',
    unhealthyCalories: 720,
    healthySwap: 'Yellow Moong Dal Tadka + Steamed Plain Rice / Roti',
    healthyCalories: 420,
    proteinSavedGrams: 4,
    reason: 'Cuts heavy butter/cream overload while preserving essential lentil proteins.'
  },
  {
    id: 'sw_3',
    cuisine: 'south_indian',
    unhealthyChoice: 'Ghee Paper Masala Dosa + Medu Vada (2)',
    unhealthyCalories: 780,
    healthySwap: '3 Steamed Steamed Idlis + Toor Dal Sambar & Mint Chutney',
    healthyCalories: 380,
    proteinSavedGrams: 8,
    reason: 'Deep-fried vada absorbs oil; steamed idlis with sambar provide clean fermented amino acids.'
  },
  {
    id: 'sw_4',
    cuisine: 'chinese',
    unhealthyChoice: 'Hakha Noodles + Veg Manchurian Gravy',
    unhealthyCalories: 890,
    healthySwap: 'Steamed Chicken/Tofu Momos + Hot & Sour Soup',
    healthyCalories: 390,
    proteinSavedGrams: 18,
    reason: 'Replaces deep-fried cornflour batter with steamed lean protein.'
  },
  {
    id: 'sw_5',
    cuisine: 'mughlai',
    unhealthyChoice: 'Mutton Galouti Kebab + Roomali Roti',
    unhealthyCalories: 820,
    healthySwap: 'Grilled Chicken Tikka + Green Salad + 1 Tandoori Roti',
    healthyCalories: 440,
    proteinSavedGrams: 22,
    reason: 'Lean chicken breast tikka provides 42g protein with zero hidden fat pastes.'
  }
];

export const SwiggyGuide: React.FC = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const filtered = SWIGGY_SWAP_DATABASE.filter((item) => {
    if (selectedCuisine === 'all') return true;
    return item.cuisine === selectedCuisine;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4" />
          <span>Swiggy, Zomato & Dhaba Healthy Ordering Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Smart Dining Out & Food Delivery Swaps
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          How to order online or eat at Indian restaurants without ruining your calorie deficit or macro targets!
        </p>

        {/* Cuisine Filter Pills */}
        <div className="flex justify-center pt-2">
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 inline-flex space-x-1">
            <button
              onClick={() => setSelectedCuisine('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCuisine === 'all' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cuisines
            </button>
            <button
              onClick={() => setSelectedCuisine('north_indian')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCuisine === 'north_indian' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              North Indian
            </button>
            <button
              onClick={() => setSelectedCuisine('south_indian')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCuisine === 'south_indian' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              South Indian
            </button>
            <button
              onClick={() => setSelectedCuisine('chinese')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCuisine === 'chinese' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Indo-Chinese
            </button>
            <button
              onClick={() => setSelectedCuisine('mughlai')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCuisine === 'mughlai' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mughlai
            </button>
          </div>
        </div>
      </div>

      {/* Swaps Grid */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Unhealthy Choice */}
            <div className="md:col-span-5 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-red-400">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>High Calorie Choice</span>
                </span>
                <span>{item.unhealthyCalories} kcal</span>
              </div>
              <h3 className="font-extrabold text-base text-white">{item.unhealthyChoice}</h3>
            </div>

            {/* Swap Arrow */}
            <div className="md:col-span-2 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 font-bold">
                <ArrowRight className="w-5 h-5 hidden md:block" />
                <span className="md:hidden text-xs">SWAP TO</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1">-{item.unhealthyCalories - item.healthyCalories} kcal Saved</span>
            </div>

            {/* Healthy Fitness Swap */}
            <div className="md:col-span-5 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Smart Fitness Swap</span>
                </span>
                <span>{item.healthyCalories} kcal</span>
              </div>
              <h3 className="font-extrabold text-base text-white">{item.healthySwap}</h3>
              <p className="text-[11px] text-slate-300 pt-1 leading-relaxed">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
