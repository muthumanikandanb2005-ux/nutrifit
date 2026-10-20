import React, { useState, useEffect } from 'react';
import type { FastingState, FastingProtocol } from '../types';
import { Timer, Play, Square } from 'lucide-react';

interface FastingTimerProps {
  fastingState: FastingState;
  setFastingState: React.Dispatch<React.SetStateAction<FastingState>>;
}

export const FastingTimer: React.FC<FastingTimerProps> = ({
  fastingState,
  setFastingState
}) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!fastingState.isFasting || !fastingState.startTime) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [fastingState.isFasting, fastingState.startTime]);

  const elapsedSeconds = fastingState.isFasting && fastingState.startTime
    ? Math.max(0, Math.floor((now - fastingState.startTime) / 1000))
    : 0;

  const targetSeconds = fastingState.targetDurationHours * 3600;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));

  const hoursElapsed = elapsedSeconds / 3600;

  // Calculate metabolic stage
  let stageName = 'Anabolic / Digestion';
  let stageDesc = 'Insulin is elevated, digesting recent thali meals.';
  let stageColor = 'border-amber-500/40 text-amber-400';
  let stageBadge = '🩸 Digestion Phase';

  if (hoursElapsed >= 4 && hoursElapsed < 8) {
    stageName = 'Blood Sugar Normalization';
    stageDesc = 'Insulin drops, body starts mobilizing stored glycogen.';
    stageColor = 'border-sky-500/40 text-sky-400';
    stageBadge = '⚖️ Glycogen Release';
  } else if (hoursElapsed >= 8 && hoursElapsed < 12) {
    stageName = 'Glycogen Depletion';
    stageDesc = 'Liver glycogen depleting; shifting towards lipid oxidation.';
    stageColor = 'border-indigo-500/40 text-indigo-400';
    stageBadge = '⚡ Lipid Shift';
  } else if (hoursElapsed >= 12 && hoursElapsed < 16) {
    stageName = 'Ketosis & Accelerated Fat Burn';
    stageDesc = 'Body is actively burning fat stores for ketone energy.';
    stageColor = 'border-emerald-500/40 text-emerald-400';
    stageBadge = '🔥 Max Fat Burning';
  } else if (hoursElapsed >= 16) {
    stageName = 'Autophagy & Cellular Regeneration';
    stageDesc = 'Cells recycle damaged organelles and reduce systemic inflammation.';
    stageColor = 'border-purple-500/40 text-purple-400';
    stageBadge = '✨ Autophagy Active';
  }

  const handleStartFasting = (protocol: FastingProtocol, hours: number) => {
    setFastingState((prev) => ({
      ...prev,
      isFasting: true,
      startTime: prev.isFasting && prev.startTime ? prev.startTime : Date.now(),
      targetDurationHours: hours,
      protocol
    }));
    setNow(Date.now());
  };

  const handleStopFasting = () => {
    setFastingState({
      isFasting: false,
      startTime: null,
      targetDurationHours: 16,
      protocol: '16_8'
    });
  };

  const formatHMS = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Timer className="w-4 h-4 animate-spin-slow" />
          <span>Intermittent Fasting & Desi Vrat Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Fasting & Metabolic Tracker
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Track 16:8, 18:6, or Navratri/Ekadashi Vrat fasting to accelerate fat loss, improve insulin sensitivity, and trigger cellular autophagy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Visual Circular Timer Ring */}
        <div className="md:col-span-6 bg-slate-800/80 border border-slate-700/60 p-8 rounded-3xl text-center space-y-6 shadow-xl flex flex-col items-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-900 stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-indigo-500 stroke-current transition-all duration-1000 ease-linear"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                {fastingState.isFasting ? 'Fasting Elapsed' : 'Ready to Start'}
              </span>
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {fastingState.isFasting ? formatHMS(elapsedSeconds) : '00:00:00'}
              </div>
              <span className="text-xs text-slate-400">
                {fastingState.isFasting ? `Remaining: ${formatHMS(remainingSeconds)}` : 'Select protocol below'}
              </span>
            </div>
          </div>

          {/* Action Start / Stop Button */}
          {fastingState.isFasting ? (
            <button
              onClick={handleStopFasting}
              className="w-full py-3.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-extrabold text-sm rounded-2xl transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>End Fast & Log Thali Meal</span>
            </button>
          ) : (
            <button
              onClick={() => handleStartFasting('16_8', 16)}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 16:8 Fast Now</span>
            </button>
          )}
        </div>

        {/* Metabolic Stage & Protocol Picker */}
        <div className="md:col-span-6 space-y-6">
          {/* Active Metabolic Stage Badge */}
          <div className={`bg-slate-800/80 border p-5 rounded-3xl space-y-2 shadow-xl ${stageColor}`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Metabolic Stage</span>
              <span className="bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-700">{stageBadge}</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">{stageName}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{stageDesc}</p>
          </div>

          {/* Protocol Selection */}
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Fasting Protocol</h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleStartFasting('16_8', 16)}
                className={`p-3 rounded-2xl border text-left transition ${
                  fastingState.protocol === '16_8' && fastingState.isFasting
                    ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-white">16:8 Leangains</div>
                <div className="text-[10px] text-slate-400">16h Fast • 8h Eating Window</div>
              </button>

              <button
                onClick={() => handleStartFasting('14_10', 14)}
                className={`p-3 rounded-2xl border text-left transition ${
                  fastingState.protocol === '14_10' && fastingState.isFasting
                    ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-white">14:10 Beginner</div>
                <div className="text-[10px] text-slate-400">14h Fast • 10h Eating Window</div>
              </button>

              <button
                onClick={() => handleStartFasting('18_6', 18)}
                className={`p-3 rounded-2xl border text-left transition ${
                  fastingState.protocol === '18_6' && fastingState.isFasting
                    ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-white">18:6 Advanced</div>
                <div className="text-[10px] text-slate-400">18h Fast • 6h Eating Window</div>
              </button>

              <button
                onClick={() => handleStartFasting('vrat', 24)}
                className={`p-3 rounded-2xl border text-left transition ${
                  fastingState.protocol === 'vrat' && fastingState.isFasting
                    ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-amber-300">🙏 Desi Vrat (24h)</div>
                <div className="text-[10px] text-slate-400">Sattvic Water/Fluid Vrat</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
