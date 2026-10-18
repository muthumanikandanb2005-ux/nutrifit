import React, { useState } from 'react';
import type { WorkoutEntry, UserProfile } from '../types';
import { Dumbbell, Flame, Clock, Plus, Trash2, Trophy, Activity } from 'lucide-react';

interface WorkoutTrackerProps {
  profile: UserProfile;
  workouts: WorkoutEntry[];
  onAddWorkout: (entry: WorkoutEntry) => void;
  onRemoveWorkout: (id: string) => void;
}

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  profile,
  workouts,
  onAddWorkout,
  onRemoveWorkout
}) => {
  const [workoutType, setWorkoutType] = useState<WorkoutEntry['category']>('weightlifting');
  const [duration, setDuration] = useState<number>(45);
  const [intensity, setIntensity] = useState<WorkoutEntry['intensity']>('moderate');
  const [customName, setCustomName] = useState<string>('');

  // Calculate calories burned based on MET values
  const calculateCaloriesBurned = (type: WorkoutEntry['category'], mins: number, int: WorkoutEntry['intensity'], weightKg: number) => {
    let met = 5;
    if (type === 'weightlifting') met = int === 'high' ? 6.0 : int === 'moderate' ? 4.5 : 3.5;
    if (type === 'hiit') met = int === 'high' ? 9.0 : int === 'moderate' ? 7.0 : 5.0;
    if (type === 'yoga') met = int === 'high' ? 4.0 : int === 'moderate' ? 3.0 : 2.5;
    if (type === 'running') met = int === 'high' ? 10.0 : int === 'moderate' ? 8.0 : 6.0;
    if (type === 'sports') met = int === 'high' ? 8.0 : int === 'moderate' ? 6.0 : 4.5;

    // Calories = MET * weight (kg) * (duration mins / 60)
    return Math.round(met * weightKg * (mins / 60));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const burned = calculateCaloriesBurned(workoutType, duration, intensity, profile.weightKg);

    const defaultNames: Record<WorkoutEntry['category'], string> = {
      weightlifting: 'Heavy Desi Gym Workout (Chest/Back/Legs)',
      hiit: 'Home Bodyweight HIIT & Pushups',
      yoga: 'Surya Namaskar & Pranayama',
      running: 'Morning Outdoor Jogging',
      sports: 'Cricket / Badminton Match',
    };

    const entry: WorkoutEntry = {
      id: `wrk_${Date.now()}`,
      name: customName.trim() || defaultNames[workoutType],
      category: workoutType,
      durationMins: duration,
      caloriesBurned: burned,
      intensity,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddWorkout(entry);
    setCustomName('');
  };

  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3.5 py-1 rounded-full text-xs font-semibold uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>Active Calorie Burn Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Log Workouts & Daily Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Calculated for your body weight ({profile.weightKg} kg) across Gym, Yoga, HIIT, and Sports.
          </p>
        </div>

        <div className="bg-slate-900 border border-orange-500/30 p-4 rounded-2xl text-center shrink-0">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Active Burned</div>
          <div className="text-3xl font-extrabold text-orange-400 tracking-tight">{totalCaloriesBurned} <span className="text-sm font-normal text-slate-400">kcal</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workout Form */}
        <form onSubmit={handleAdd} className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-700 pb-3">
            <Dumbbell className="w-5 h-5 text-amber-400" />
            <span>Log New Exercise Activity</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Workout Category</label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value as WorkoutEntry['category'])}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="weightlifting">🏋️ Gym Weightlifting / Strength</option>
              <option value="hiit">🔥 Home HIIT & Calisthenics</option>
              <option value="yoga">🧘 Yoga & Surya Namaskar</option>
              <option value="running">🏃 Morning Jogging / Brisk Walk</option>
              <option value="sports">🏏 Cricket / Badminton / Football</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Workout Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Chest & Triceps Blast or 12 Surya Namaskars"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="240"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Intensity</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as WorkoutEntry['intensity'])}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="low">Light (Conversational)</option>
                <option value="moderate">Moderate (Sweating)</option>
                <option value="high">High (All-out Effort)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Log Activity (~{calculateCaloriesBurned(workoutType, duration, intensity, profile.weightKg)} kcal)</span>
          </button>
        </form>

        {/* Workout History List */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Today's Logged Workouts ({workouts.length})</span>
            </span>
          </h2>

          {workouts.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl text-center space-y-2 text-slate-400">
              <Activity className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs">No workouts logged yet today. Add your gym session or morning jog above!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {workouts.map((w) => (
                <div
                  key={w.id}
                  className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-white">{w.name}</h3>
                      <span className="text-[10px] bg-slate-900 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700 uppercase">
                        {w.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{w.durationMins} mins</span>
                      </span>
                      <span>•</span>
                      <span>Intensity: <strong className="text-slate-300 capitalize">{w.intensity}</strong></span>
                      <span>•</span>
                      <span>{w.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="font-extrabold text-orange-400 text-base">-{w.caloriesBurned}</div>
                      <div className="text-[9px] text-slate-400 font-semibold uppercase">kcal burned</div>
                    </div>

                    <button
                      onClick={() => onRemoveWorkout(w.id)}
                      className="p-2 text-slate-500 hover:text-red-400 bg-slate-900 rounded-xl border border-slate-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
