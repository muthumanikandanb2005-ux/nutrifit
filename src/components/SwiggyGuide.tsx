import React, { useState } from 'react';
import { SWIGGY_SWAP_DATABASE } from '../data/swiggyDatabase';
import { ShoppingBag, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export const SwiggyGuide: React.FC = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const filtered = SWIGGY_SWAP_DATABASE.filter((item) => {
    if (selectedCuisine === 'all') return true;
    return item.cuisine === selectedCuisine;
  });

  return (
    <div className="max-w-5xl mx-auto px-2 py-4 space-y-6">
      {/* Title Header */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-[var(--greenSoft)] text-[var(--greenDark)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4" />
          <span>Dining Out & Delivery Guide</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Smart Dining Out & Food Delivery Swaps
        </h1>
        <p className="text-[var(--muted)] text-xs sm:text-sm max-w-xl mx-auto">
          How to order online or eat at Indian restaurants while keeping your nutrition and health goals on track.
        </p>

        {/* Cuisine Filter Pills */}
        <div className="flex justify-center pt-2">
          <div className="bg-[var(--surface2)] p-1.5 rounded-2xl border border-[var(--line)] inline-flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCuisine('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCuisine === 'all' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              All Cuisines
            </button>
            <button
              onClick={() => setSelectedCuisine('north_indian')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCuisine === 'north_indian' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              North Indian
            </button>
            <button
              onClick={() => setSelectedCuisine('south_indian')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCuisine === 'south_indian' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              South Indian
            </button>
            <button
              onClick={() => setSelectedCuisine('chinese')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCuisine === 'chinese' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Indo-Chinese
            </button>
            <button
              onClick={() => setSelectedCuisine('mughlai')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCuisine === 'mughlai' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
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
            className="bg-[var(--surface)] border border-[var(--line)] p-5 sm:p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
          >
            {/* Standard Choice */}
            <div className="md:col-span-5 bg-[var(--peach)] border border-[var(--line)] p-4 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#9b4e3f]">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Heavier Choice</span>
                </span>
                <span>{item.unhealthyCalories} kcal</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--ink)]">{item.unhealthyChoice}</h3>
            </div>

            {/* Swap Arrow */}
            <div className="md:col-span-2 text-center flex flex-col items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-[var(--surface2)] text-[var(--green)] flex items-center justify-center border border-[var(--line)]">
                <ArrowRight className="w-4 h-4 hidden md:block" />
                <span className="md:hidden text-[10px] font-bold">SWAP</span>
              </div>
              <span className="text-[10px] text-[var(--greenDark)] font-semibold mt-1">
                -{item.unhealthyCalories - item.healthyCalories} kcal
              </span>
            </div>

            {/* Healthy Fitness Swap */}
            <div className="md:col-span-5 bg-[var(--greenSoft)] border border-[var(--line)] p-4 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[var(--greenDark)]">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Nourishing Swap</span>
                </span>
                <span>{item.healthyCalories} kcal</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--ink)]">{item.healthySwap}</h3>
              <p className="text-xs text-[var(--muted)] pt-0.5 leading-relaxed">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
