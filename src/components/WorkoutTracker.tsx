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
    <div className="max-w-5xl mx-auto px-2 py-4 space-y-6">
      {/* Title Header */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-[var(--greenSoft)] text-[var(--greenDark)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>Active Energy Burn Tracker</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
            Log Workouts & Daily Movement
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Calculated for your body weight ({profile.weightKg} kg) across Gym, Yoga, HIIT, and Sports.
          </p>
        </div>

        <div className="bg-[var(--surface2)] border border-[var(--line)] p-4 rounded-2xl text-center shrink-0">
          <div className="text-xs text-[var(--muted)] uppercase font-semibold">Total Active Burn</div>
          <div className="text-2xl sm:text-3xl font-bold text-[var(--green)] tracking-tight">{totalCaloriesBurned} <span className="text-xs font-normal text-[var(--muted)]">kcal</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workout Form */}
        <form onSubmit={handleAdd} className="lg:col-span-6 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-[var(--ink)] flex items-center space-x-2 border-b border-[var(--line)] pb-3">
            <Dumbbell className="w-4 h-4 text-[var(--green)]" />
            <span>Log Exercise Activity</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Workout Category</label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value as WorkoutEntry['category'])}
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--green)]"
            >
              <option value="weightlifting">Gym Strength & Weightlifting</option>
              <option value="hiit">HIIT & Calisthenics</option>
              <option value="yoga">Yoga & Surya Namaskar</option>
              <option value="running">Jogging & Brisk Walk</option>
              <option value="sports">Sports (Cricket, Badminton, Football)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Workout Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Upper Body Push or 12 Surya Namaskars"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--green)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="240"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Intensity</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as WorkoutEntry['intensity'])}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--green)]"
              >
                <option value="low">Light (Conversational)</option>
                <option value="moderate">Moderate (Paced)</option>
                <option value="high">High (Challenging)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--green)] hover:bg-[var(--greenDark)] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity (~{calculateCaloriesBurned(workoutType, duration, intensity, profile.weightKg)} kcal)</span>
          </button>
        </form>

        {/* Workout History List */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-base font-bold text-[var(--ink)] flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-[var(--green)]" />
              <span>Today's Logged Workouts ({workouts.length})</span>
            </span>
          </h2>

          {workouts.length === 0 ? (
            <div className="bg-[var(--surface2)] border border-[var(--line)] p-8 rounded-3xl text-center space-y-2 text-[var(--muted)]">
              <Activity className="w-8 h-8 text-[var(--muted)] opacity-50 mx-auto" />
              <p className="text-xs">No workouts logged yet today. Add your training session above!</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {workouts.map((w) => (
                <div
                  key={w.id}
                  className="bg-[var(--surface)] border border-[var(--line)] p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-[var(--ink)]">{w.name}</h3>
                      <span className="text-[10px] bg-[var(--greenSoft)] text-[var(--greenDark)] px-2 py-0.5 rounded-full font-semibold uppercase">
                        {w.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-[var(--muted)]">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{w.durationMins} mins</span>
                      </span>
                      <span>·</span>
                      <span>Intensity: <strong className="text-[var(--ink)] capitalize font-medium">{w.intensity}</strong></span>
                      <span>·</span>
                      <span>{w.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-[var(--green)] text-base">-{w.caloriesBurned}</div>
                      <div className="text-[9px] text-[var(--muted)] font-semibold uppercase">kcal burned</div>
                    </div>

                    <button
                      onClick={() => onRemoveWorkout(w.id)}
                      className="p-2 text-[var(--muted)] hover:text-red-600 bg-[var(--surface2)] rounded-lg border border-[var(--line)] transition"
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
