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
  let stageColor = 'border-[var(--line)] bg-[var(--surface2)] text-[var(--ink)]';
  let stageBadge = 'Digestion Phase';

  if (hoursElapsed >= 4 && hoursElapsed < 8) {
    stageName = 'Blood Sugar Normalization';
    stageDesc = 'Insulin drops, body starts mobilizing stored glycogen.';
    stageColor = 'border-[var(--greenSoft)] bg-[var(--greenSoft)] text-[var(--greenDark)]';
    stageBadge = 'Glycogen Release';
  } else if (hoursElapsed >= 8 && hoursElapsed < 12) {
    stageName = 'Glycogen Depletion';
    stageDesc = 'Liver glycogen depleting; shifting towards lipid oxidation.';
    stageColor = 'border-[var(--line)] bg-[var(--surface2)] text-[var(--ink)]';
    stageBadge = 'Lipid Shift';
  } else if (hoursElapsed >= 12 && hoursElapsed < 16) {
    stageName = 'Ketosis & Accelerated Fat Burn';
    stageDesc = 'Body is actively burning fat stores for ketone energy.';
    stageColor = 'border-[var(--greenSoft)] bg-[var(--greenSoft)] text-[var(--greenDark)]';
    stageBadge = 'Optimal Fat Burn';
  } else if (hoursElapsed >= 16) {
    stageName = 'Autophagy & Cellular Regeneration';
    stageDesc = 'Cells recycle damaged organelles and reduce systemic inflammation.';
    stageColor = 'border-[var(--greenSoft)] bg-[var(--greenSoft)] text-[var(--greenDark)]';
    stageBadge = 'Autophagy Active';
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
    <div className="max-w-4xl mx-auto px-2 py-4 space-y-6">
      {/* Title Header */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-[var(--greenSoft)] text-[var(--greenDark)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Timer className="w-4 h-4" />
          <span>Intermittent Fasting & Vrat Engine</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Live Fasting & Metabolic Tracker
        </h1>
        <p className="text-[var(--muted)] text-xs sm:text-sm max-w-xl mx-auto">
          Track 16:8, 14:10, or traditional Indian Vrat fasting to support insulin sensitivity and cellular vitality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Circular Timer Ring */}
        <div className="md:col-span-6 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl text-center space-y-5 shadow-sm flex flex-col items-center">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-[var(--surface2)]"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-[var(--green)] transition-all duration-1000 ease-linear"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">
                {fastingState.isFasting ? 'Fasting Elapsed' : 'Ready to Start'}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight font-mono">
                {fastingState.isFasting ? formatHMS(elapsedSeconds) : '00:00:00'}
              </div>
              <span className="text-xs text-[var(--muted)]">
                {fastingState.isFasting ? `Remaining: ${formatHMS(remainingSeconds)}` : 'Select protocol below'}
              </span>
            </div>
          </div>

          {/* Action Start / Stop Button */}
          {fastingState.isFasting ? (
            <button
              onClick={handleStopFasting}
              className="w-full py-3 bg-[var(--surface2)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>End Fast & Log Thali Meal</span>
            </button>
          ) : (
            <button
              onClick={() => handleStartFasting('16_8', 16)}
              className="w-full py-3 bg-[var(--green)] hover:bg-[var(--greenDark)] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 16:8 Fast Now</span>
            </button>
          )}
        </div>

        {/* Metabolic Stage & Protocol Picker */}
        <div className="md:col-span-6 space-y-4">
          {/* Active Metabolic Stage Badge */}
          <div className={`border p-4 sm:p-5 rounded-2xl space-y-1.5 shadow-sm ${stageColor}`}>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Metabolic Stage</span>
              <span className="bg-[var(--surface)] text-[var(--greenDark)] px-2.5 py-0.5 rounded-full text-[10px] border border-[var(--line)] font-medium">
                {stageBadge}
              </span>
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">{stageName}</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{stageDesc}</p>
          </div>

          {/* Protocol Selection */}
          <div className="bg-[var(--surface)] border border-[var(--line)] p-4 sm:p-5 rounded-2xl space-y-2.5 shadow-sm">
            <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Select Protocol</h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleStartFasting('16_8', 16)}
                className={`p-3 rounded-xl border text-left transition ${
                  fastingState.protocol === '16_8' && fastingState.isFasting
                    ? 'bg-[var(--greenSoft)] border-[var(--green)] text-[var(--greenDark)] font-bold'
                    : 'bg-[var(--surface2)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--green)]'
                }`}
              >
                <div className="font-semibold text-xs text-[var(--ink)]">16:8 Routine</div>
                <div className="text-[10px] text-[var(--muted)]">16h Fast · 8h Window</div>
              </button>

              <button
                onClick={() => handleStartFasting('14_10', 14)}
                className={`p-3 rounded-xl border text-left transition ${
                  fastingState.protocol === '14_10' && fastingState.isFasting
                    ? 'bg-[var(--greenSoft)] border-[var(--green)] text-[var(--greenDark)] font-bold'
                    : 'bg-[var(--surface2)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--green)]'
                }`}
              >
                <div className="font-semibold text-xs text-[var(--ink)]">14:10 Gentle</div>
                <div className="text-[10px] text-[var(--muted)]">14h Fast · 10h Window</div>
              </button>

              <button
                onClick={() => handleStartFasting('18_6', 18)}
                className={`p-3 rounded-xl border text-left transition ${
                  fastingState.protocol === '18_6' && fastingState.isFasting
                    ? 'bg-[var(--greenSoft)] border-[var(--green)] text-[var(--greenDark)] font-bold'
                    : 'bg-[var(--surface2)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--green)]'
                }`}
              >
                <div className="font-semibold text-xs text-[var(--ink)]">18:6 Deep</div>
                <div className="text-[10px] text-[var(--muted)]">18h Fast · 6h Window</div>
              </button>

              <button
                onClick={() => handleStartFasting('vrat', 24)}
                className={`p-3 rounded-xl border text-left transition ${
                  fastingState.protocol === 'vrat' && fastingState.isFasting
                    ? 'bg-[var(--greenSoft)] border-[var(--green)] text-[var(--greenDark)] font-bold'
                    : 'bg-[var(--surface2)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--green)]'
                }`}
              >
                <div className="font-semibold text-xs text-[var(--ink)]">24h Vrat</div>
                <div className="text-[10px] text-[var(--muted)]">Sattvic Water Fast</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
