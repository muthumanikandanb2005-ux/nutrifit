import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 text-white font-extrabold text-lg">
              <img src="/logo.png" alt="NutriFit" className="w-6 h-6 rounded-lg border border-white/20" />
              <span>NutriFit 🇮🇳</span>
            </div>
            <p className="leading-relaxed">
              Empowering India with scientific fitness nutrition, precise macro tracking, and authentic regional Indian meal plans for sustainable weight loss and muscle growth.
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Key Indian Superfoods Included</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Roasted Chana Sattu (Desi Natural Whey)</li>
              <li>• Sprouted Moong & Black Chana</li>
              <li>• Low-Fat Paneer & Tofu</li>
              <li>• Jowar & Multigrain Rotis</li>
              <li>• Makhana & Soaked Dry Fruits</li>
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Medical & Health Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              NutriBharat calorie & macro calculations are based on standard metabolic formulas (Mifflin-St Jeor). Always consult a certified clinical dietitian or medical professional before starting any extreme calorie deficit or dietary regimen.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NutriBharat AhaarFit. Designed with ❤️ for Indian Fitness Enthusiasts.</p>
          <div className="flex space-x-4 text-xs text-slate-400">
            <span>Made in India 🇮🇳</span>
            <span>•</span>
            <span>Pure Veg • Non-Veg • Jain • South & North Indian</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
