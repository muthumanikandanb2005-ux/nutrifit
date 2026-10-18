import React, { useState, useEffect, useRef } from 'react';
import type { StepsLogEntry, UserProfile } from '../types';
import { Footprints, Navigation, Share2, Download, Play, Square, Trophy, MapPin, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';

interface StepsTrackerProps {
  profile: UserProfile;
  stepsLogs: StepsLogEntry[];
  onAddStepsLog: (entry: StepsLogEntry) => void;
}

export const StepsTracker: React.FC<StepsTrackerProps> = ({ profile, stepsLogs, onAddStepsLog }) => {
  // Goal default 10,000 steps
  const stepGoal = 10000;

  // Live activity tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [activeMins, setActiveMins] = useState(0);
  const [activityTitle, setActivityTitle] = useState('Morning Strava Walk & Jog');
  const [activityType, setActivityType] = useState<'walk' | 'run' | 'hike' | 'treadmill'>('walk');

  // Modal for Strava Share Card
  const [selectedShareLog, setSelectedShareLog] = useState<StepsLogEntry | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Interval timer for tracking steps
  useEffect(() => {
    let interval: any = null;
    if (isTracking) {
      interval = setInterval(() => {
        // Increment steps based on activity type
        const stepIncrement = activityType === 'run' ? Math.floor(Math.random() * 12) + 14 : Math.floor(Math.random() * 6) + 6;
        setCurrentSteps((prev) => prev + stepIncrement);
        setActiveMins((prev) => prev + 0.1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking, activityType]);

  // Calculate metrics based on steps & profile weight
  // Avg stride length = heightCm * 0.414 (in cm) -> converted to km
  const strideKm = ((profile.heightCm || 175) * 0.414) / 100000;
  const distanceKm = Number((currentSteps * strideKm).toFixed(2));
  // Calories burned estimate: ~0.04 kcal per step for walking, ~0.06 for running
  const calorieRate = activityType === 'run' ? 0.055 : 0.04;
  const caloriesBurned = Math.round(currentSteps * calorieRate * (profile.weightKg / 70));
  const avgPace = distanceKm > 0 ? (activeMins / distanceKm).toFixed(2) : '0.00';

  // Total steps logged today
  const todayTotalSteps = stepsLogs.reduce((acc, curr) => acc + curr.steps, 0) + currentSteps;
  const todayTotalKm = Number((stepsLogs.reduce((acc, curr) => acc + curr.distanceKm, 0) + distanceKm).toFixed(2));
  const todayTotalBurn = stepsLogs.reduce((acc, curr) => acc + curr.caloriesBurned, 0) + caloriesBurned;
  const goalProgressPercent = Math.min(100, Math.round((todayTotalSteps / stepGoal) * 100));

  const handleStartStopActivity = () => {
    if (isTracking) {
      // Finish Activity
      if (currentSteps > 50) {
        const newLog: StepsLogEntry = {
          id: `step_${Date.now()}`,
          date: 'Today',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: activityTitle,
          steps: currentSteps,
          distanceKm,
          caloriesBurned,
          durationMins: Math.max(1, Math.round(activeMins)),
          avgPaceMinutesPerKm: Number(avgPace) || 6.5,
          activityType,
        };
        onAddStepsLog(newLog);
        setSelectedShareLog(newLog);
      }
      setIsTracking(false);
      setCurrentSteps(0);
      setActiveMins(0);
    } else {
      // Start Activity
      setIsTracking(true);
    }
  };

  const handleDownloadShareCard = async () => {
    if (!shareCardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `Strava_NutriBharat_${selectedShareLog?.title.replace(/\s+/g, '_') || 'Activity'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    if (!selectedShareLog) return;
    const text = `🏃 ${selectedShareLog.title}\n👟 Steps: ${selectedShareLog.steps.toLocaleString()}\n📏 Distance: ${selectedShareLog.distanceKm} km\n🔥 Calories: ${selectedShareLog.caloriesBurned} kcal\n⏱️ Pace: ${selectedShareLog.avgPaceMinutesPerKm} min/km\n\nTracked on NutriBharat • AhaarFit 🇮🇳`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedShareLog.title,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Activity summary copied to clipboard! You can paste and share it on WhatsApp, Instagram, or Strava.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-orange-950/40 text-orange-200 text-xs font-bold rounded-full border border-orange-300/30 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-amber-300" /> STRAVA STYLE STEP & CARDIO TRACKER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Steps & Calorie Social Tracker
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
              Track daily steps, walk/run workouts, GPS pace, and share high-energy Strava-style graphic cards on Instagram, WhatsApp & Strava!
            </p>
          </div>

          <div className="bg-orange-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[200px]">
            <span className="text-xs font-medium text-orange-200 uppercase tracking-wider">Today's Total Steps</span>
            <div className="text-3xl font-black text-amber-300 tracking-tight mt-0.5">
              {todayTotalSteps.toLocaleString()} <span className="text-xs font-normal text-white">/ {stepGoal.toLocaleString()}</span>
            </div>
            <div className="w-full bg-orange-950/60 rounded-full h-2 mt-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${goalProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Tracker Controls + Daily Log & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live GPS / Pedometer Simulation Controller (7 cols) */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-orange-500/20 rounded-2xl border border-orange-500/30">
                <Navigation className="w-6 h-6 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Live Activity Session</h2>
                <p className="text-xs text-slate-400">Record run/walk & compute live calories</p>
              </div>
            </div>

            {isTracking && (
              <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" /> REC LIVE
              </span>
            )}
          </div>

          {/* Activity Setup Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Activity Title</label>
              <input
                type="text"
                disabled={isTracking}
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Activity Type</label>
              <select
                disabled={isTracking}
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none disabled:opacity-50"
              >
                <option value="walk">🚶 Outdoor Walk</option>
                <option value="run">🏃 Outdoor Run</option>
                <option value="hike">🥾 Trail Hike</option>
                <option value="treadmill">🏋️ Treadmill Walk/Run</option>
              </select>
            </div>
          </div>

          {/* Live Metrics Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Steps</span>
              <div className="text-2xl font-black text-white">{currentSteps.toLocaleString()}</div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Distance</span>
              <div className="text-2xl font-black text-amber-400">{distanceKm} <span className="text-xs text-slate-400 font-normal">km</span></div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Calories</span>
              <div className="text-2xl font-black text-orange-400">{caloriesBurned} <span className="text-xs text-slate-400 font-normal">kcal</span></div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pace</span>
              <div className="text-2xl font-black text-emerald-400">{avgPace} <span className="text-xs text-slate-400 font-normal">/km</span></div>
            </div>
          </div>

          {/* Simulated Strava Route Map Preview */}
          <div className="relative h-44 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
            {/* SVG Strava Style Route Graphic */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path
                d="M 40 110 Q 120 40 220 90 T 360 50 T 480 120 T 600 70"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray={isTracking ? "6 6" : "none"}
                className={isTracking ? "animate-pulse" : ""}
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center space-y-2 bg-slate-900/80 backdrop-blur-md p-3 px-5 rounded-2xl border border-slate-700/60 text-center">
              <MapPin className="w-5 h-5 text-orange-500 animate-bounce" />
              <span className="text-xs text-slate-300 font-medium">
                {isTracking ? 'GPS Route Live Telemetry Active...' : 'Press Start Activity to Begin Tracking'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartStopActivity}
            className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer ${
              isTracking
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-900/40'
            }`}
          >
            {isTracking ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>Finish & Save Activity ({currentSteps} steps)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Strava GPS Activity Tracker</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Today's Summary & Past Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Stat Highlights */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Daily Activity Milestones
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Distance</span>
                <div className="text-xl font-extrabold text-amber-300 mt-1">{todayTotalKm} km</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Calories Burned</span>
                <div className="text-xl font-extrabold text-orange-400 mt-1">{todayTotalBurn} kcal</div>
              </div>
            </div>
          </div>

          {/* Activity Logs History */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Footprints className="w-5 h-5 text-orange-400" /> Completed Activities
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{stepsLogs.length} Logged</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {stepsLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No step activities recorded yet today. Click "Start Strava GPS Activity" to track your walk or run!
                </div>
              ) : (
                stepsLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-900 border border-slate-700/70 hover:border-orange-500/50 transition rounded-2xl p-4 flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-white group-hover:text-orange-400 transition">
                          {log.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full">
                          {log.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <span>👟 <strong>{log.steps.toLocaleString()}</strong> steps</span>
                        <span>📏 <strong>{log.distanceKm}</strong> km</span>
                        <span>🔥 <strong>{log.caloriesBurned}</strong> kcal</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedShareLog(log)}
                      className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-xl text-xs font-bold hover:bg-orange-500 hover:text-white transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strava Social Media Graphic Card Modal */}
      {selectedShareLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" /> Strava Graphic Share Card
              </h3>
              <button
                onClick={() => setSelectedShareLog(null)}
                className="text-slate-400 hover:text-white font-extrabold text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Rendered Share Graphic Container */}
            <div
              ref={shareCardRef}
              className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 border-2 border-orange-500/40 rounded-3xl p-6 text-white space-y-5 shadow-2xl relative overflow-hidden"
            >
              {/* Background Graphic Lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <img src="/logo.png" alt="NutriFit" className="w-8 h-8 rounded-xl border border-white/20" />
                  <div>
                    <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
                      NutriFit 🇮🇳
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold">{selectedShareLog.date} • {selectedShareLog.time}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-orange-500 text-slate-950 text-[10px] font-black rounded-lg uppercase tracking-wider shadow">
                  STRAVA VERIFIED
                </span>
              </div>

              {/* Activity Name */}
              <div>
                <h4 className="text-xl font-black text-white tracking-tight">{selectedShareLog.title}</h4>
                <p className="text-xs text-orange-300 font-medium">By {profile.name || 'Indian Athlete'}</p>
              </div>

              {/* Big Stats Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Steps Logged</span>
                  <span className="text-2xl font-black text-amber-400">{selectedShareLog.steps.toLocaleString()}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance</span>
                  <span className="text-2xl font-black text-white">{selectedShareLog.distanceKm} <span className="text-xs font-normal">km</span></span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calories Burned</span>
                  <span className="text-2xl font-black text-orange-400">{selectedShareLog.caloriesBurned} <span className="text-xs font-normal">kcal</span></span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Pace</span>
                  <span className="text-2xl font-black text-emerald-400">{selectedShareLog.avgPaceMinutesPerKm} <span className="text-xs font-normal">/km</span></span>
                </div>
              </div>

              {/* Simulated Strava Route Graphic */}
              <div className="h-24 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 60 Q 80 10 160 50 T 280 20 T 380 70" fill="none" stroke="#f97316" strokeWidth="5" />
                </svg>
                <span className="absolute bottom-2 right-3 text-[9px] font-bold text-slate-400">MAPBOX GPS RUN TRACK</span>
              </div>

              {/* Footer Badge */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>#NutriBharat #StravaFitness #IndianAthlete</span>
                <span className="font-bold text-orange-400">www.ahaarfit.in</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadShareCard}
                disabled={isExporting}
                className="py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isExporting ? 'Generating PNG...' : 'Download Image'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to Socials</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
