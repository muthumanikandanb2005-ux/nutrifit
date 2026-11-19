import React, { useState, useEffect } from 'react';
import type { FoodItem } from '../types';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  ChefHat, 
  Clock, 
  Check
} from 'lucide-react';
import { haptic } from '../utils/haptics';
import confetti from 'canvas-confetti';

interface HandsFreeCookingModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const HandsFreeCookingModal: React.FC<HandsFreeCookingModalProps> = ({
  food,
  isOpen,
  onClose,
  onCompleted
}) => {
  if (!isOpen || !food) return null;

  const instructions = food.recipeInstructions && food.recipeInstructions.length > 0 
    ? food.recipeInstructions 
    : [
        'Prepare all fresh ingredients, spices, and wash vegetables thoroughly.',
        'Heat a pan or kadai with minimal oil or ghee on medium flame.',
        'Add spices, ingredients and cook until aromatic and properly simmered.',
        'Garnish with fresh coriander, serve hot with your measured portion.'
      ];

  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  
  // Cooking Timer State
  const defaultTimerSeconds = Math.max(180, (food.prepTimeMins || 10) * 60);
  const [timeLeft, setTimeLeft] = useState(defaultTimerSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Speech Synthesis
  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Step ${currentStep + 1}: ${instructions[currentStep]}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    haptic.light();
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer Tick Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            haptic.success();
            try {
              confetti({ particleCount: 40, spread: 60 });
            } catch { /* ignore */ }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleIngredient = (idx: number) => {
    haptic.selection();
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleNextStep = () => {
    haptic.light();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentStep < instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completed all steps!
      haptic.success();
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch { /* ignore */ }
      if (onCompleted) onCompleted();
      onClose();
    }
  };

  const handlePrevStep = () => {
    haptic.light();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-[#0e1611]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1C1511] rounded-[32px] border border-[#EEDEC1] dark:border-[#3A291E] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between bg-[#f8faf8] dark:bg-[#19120E]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] font-bold">
                  Hands-Free Cook Mode
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {food.prepTimeMins} mins
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-[240px] sm:max-w-md">
                {food.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#251C17] border border-[#EEDEC1] dark:border-[#3A2A1F] text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close cook mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Step Progress Visual Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 font-semibold">
              <span className="text-[#9A3412] dark:text-[#FED7AA] font-bold">Step {currentStep + 1} of {instructions.length}</span>
              <span>{Math.round(((currentStep + 1) / instructions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FAF0DC] dark:bg-[#202d23] overflow-hidden">
              <div 
                className="h-full bg-[#EA580C] dark:bg-[#FB923C] rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / instructions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Active Card (Big Readable Type for Kitchen) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFBF5] dark:bg-[#1c2920] border-2 border-[#FED7AA] dark:border-[#2f4234] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-black text-sm shadow-xs">
                {currentStep + 1}
              </span>
              <button
                onClick={speakCurrentStep}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A2A1F] text-xs font-bold text-[#9A3412] dark:text-[#FED7AA] font-bold shadow-xs active:scale-95 transition cursor-pointer"
                title="Read step out loud"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-rose-500">Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Read Step</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {instructions[currentStep]}
            </p>

            {food.tips && currentStep === 0 && (
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#141d16] border border-[#EEDEC1] dark:border-[#3A2A1F] flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-[#9A3412] dark:text-[#FED7AA] font-bold shrink-0 mt-0.5" />
                <span><strong>Chef's Tip:</strong> {food.tips}</span>
              </div>
            )}
          </div>

          {/* Built-in Kitchen Timer */}
          <div className="p-4 rounded-3xl bg-[#f8faf8] dark:bg-[#1C1511] border border-[#EEDEC1] dark:border-[#3A291E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] dark:bg-[#261B14] text-[#9A3412] dark:text-[#FED7AA] font-bold flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kitchen Timer</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {formatTimer(timeLeft)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  haptic.medium();
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer ${
                  isTimerRunning 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>
              <button
                onClick={() => {
                  haptic.light();
                  setTimeLeft(prev => prev + 60);
                }}
                className="px-2.5 py-2 rounded-2xl bg-white dark:bg-[#2D2018] border border-[#EEDEC1] dark:border-[#3A2A1F] text-xs font-bold text-slate-700 dark:text-slate-200 active:scale-95 transition cursor-pointer"
                title="Add 1 minute"
              >
                +1 min
              </button>
              <button
                onClick={() => {
                  haptic.light();
                  setIsTimerRunning(false);
                  setTimeLeft(defaultTimerSeconds);
                }}
                className="w-8 h-8 rounded-2xl bg-white dark:bg-[#2D2018] border border-[#EEDEC1] dark:border-[#3A2A1F] text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center active:scale-95 transition cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                Ingredients Checklist ({checkedIngredients.size}/{food.ingredients.length})
              </h4>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium font-medium">Tap to check off</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {food.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.has(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isChecked 
                        ? 'bg-[#FEF3C7] dark:bg-[#1c2920] border-[#FED7AA] dark:border-[#2c4031] text-slate-400 line-through'
                        : 'bg-white dark:bg-[#231811] border-[#EEDEC1] dark:border-[#3A291E] text-slate-800 dark:text-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isChecked 
                          ? 'bg-[#EA580C] border-[#EA580C] text-white' 
                          : 'border-slate-300 dark:border-slate-600 bg-transparent'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold">{ing.item}</span>
                    </div>
                    <span className="text-[11px] font-bold opacity-75">{ing.amount}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-[#EEDEC1] dark:border-[#3A291E] flex items-center justify-between bg-[#f8faf8] dark:bg-[#19120E]">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-2xl border border-[#EEDEC1] dark:border-[#3A2A1F] text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-[#251C17] flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition cursor-pointer"
            >
              <span>{currentStep === instructions.length - 1 ? 'Finish & Mark Eaten' : 'Next Step'}</span>
              {currentStep === instructions.length - 1 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
