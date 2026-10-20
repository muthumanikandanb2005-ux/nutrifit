import React, { useState, useRef, useEffect } from 'react';
import type { ScannedFoodResult, MealSlot } from '../types';
import { analyzeFoodImage, SCANNED_FOOD_DATABASE } from '../utils/aiFoodScanner';
import { Camera, Upload, Sparkles, CheckCircle2, Utensils, RefreshCw, PlusCircle, ShieldCheck, Video, VideoOff } from 'lucide-react';

interface FoodScannerProps {
  onAddScannedFoodToPlan: (scanned: ScannedFoodResult, targetSlot: MealSlot) => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({ onAddScannedFoodToPlan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<ScannedFoodResult | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'raw' | 'cooked'>('all');
  const [targetSlot, setTargetSlot] = useState<MealSlot>('lunch');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error('Video play error:', err);
      });
    }
  }, [isCameraActive]);

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check camera permissions.');
      setIsCameraActive(false);
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCaptureLiveSnapshot = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    setIsScanning(true);
    setScannedResult(null);
    setAddedSuccess(false);

    const stateFilter = filterState === 'all' ? undefined : filterState;
    const result = await analyzeFoodImage(null, undefined, stateFilter);
    setScannedResult(result);
    setIsScanning(false);
  };

  const handleScanPreset = async (food: ScannedFoodResult) => {
    setIsScanning(true);
    setScannedResult(null);
    setAddedSuccess(false);

    const result = await analyzeFoodImage(null, food.foodName, food.foodState);
    setScannedResult(result);
    setIsScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedResult(null);
    setAddedSuccess(false);

    const stateFilter = filterState === 'all' ? undefined : filterState;
    const result = await analyzeFoodImage(file, undefined, stateFilter);
    setScannedResult(result);
    setIsScanning(false);
  };

  const handleAdd = () => {
    if (!scannedResult) return;
    onAddScannedFoodToPlan(scannedResult, targetSlot);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const displayedPresets = SCANNED_FOOD_DATABASE.filter((item) => {
    if (filterState === 'all') return true;
    return item.foodState === filterState;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Banner */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-4 h-4 animate-pulse" />
          <span>AI Vision Nutrient Scanner (Cooked & Raw Foods)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Scan Any Food to Extract Instant Macros
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
          Snap a picture of your cooked Indian thalis, street food, or raw grocery ingredients (eggs, almonds, raw chicken, sprouts) to calculate exact calories and protein.
        </p>

        {/* Raw vs Cooked State Selector Tabs */}
        <div className="flex justify-center pt-2">
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 inline-flex space-x-1">
            <button
              onClick={() => setFilterState('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterState === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Foods
            </button>
            <button
              onClick={() => setFilterState('cooked')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterState === 'cooked' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Cooked Meals
            </button>
            <button
              onClick={() => setFilterState('raw')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterState === 'raw' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌱 Raw & Ingredients
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scanner Viewfinder Box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border-2 border-dashed border-amber-500/40 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden shadow-2xl min-h-[380px] flex flex-col items-center justify-center">
            
            {/* Live laser scan line animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent animate-scan z-10 pointer-events-none border-b-2 border-amber-400" />
            )}

            {/* Viewfinder Target Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

            {/* Hidden canvas for capturing frame */}
            <canvas ref={canvasRef} className="hidden" />

            {isCameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4 z-20">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-2xl border border-slate-700 shadow-md"
                />
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCaptureLiveSnapshot}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & Analyze Nutrients</span>
                  </button>
                  <button
                    onClick={stopLiveCamera}
                    className="p-2.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-2xl text-xs font-bold hover:bg-red-500 hover:text-white transition cursor-pointer flex items-center gap-1"
                  >
                    <VideoOff className="w-4 h-4" /> Turn Off
                  </button>
                </div>
              </div>
            ) : isScanning ? (
              <div className="space-y-4 relative z-20">
                <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <div className="text-lg font-bold text-white">Scanning Live Food Video Stream...</div>
                  <p className="text-xs text-amber-300">Extracting thali ingredients & macronutrient density</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative z-20">
                <div className="p-5 bg-slate-800/80 rounded-full border border-slate-700 inline-block text-amber-400 shadow-inner">
                  <Camera className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Capture or Stream Food Live</h3>
                  <p className="text-xs text-slate-400">Live Camera Feed & Snapshot AI Vision Scanner</p>
                </div>

                {cameraError && (
                  <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-xl border border-red-500/30">
                    {cameraError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={startLiveCamera}
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open Live WebCam Stream</span>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Preset Chips */}
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Or Try Quick Preset Samples</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayedPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleScanPreset(preset)}
                  className="p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-amber-500 text-left rounded-xl text-xs transition-all"
                >
                  <div className="font-bold text-white truncate">{preset.foodName}</div>
                  <div className="text-[10px] text-amber-300 flex items-center space-x-1 mt-0.5">
                    <span>{preset.foodState === 'cooked' ? '🔥 Cooked' : '🌱 Raw'}</span>
                    <span>•</span>
                    <span>{preset.calories} kcal</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Results Panel */}
        <div className="lg:col-span-6 space-y-6">
          {scannedResult ? (
            <div className="bg-slate-800/90 border border-slate-700/80 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      scannedResult.foodState === 'cooked'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {scannedResult.foodState === 'cooked' ? '🔥 COOKED DISH' : '🌱 RAW INGREDIENT'}
                    </span>
                    <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      {scannedResult.confidence}% AI Match
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">{scannedResult.foodName}</h2>
                  {scannedResult.hindiName && (
                    <p className="text-xs text-amber-300/80 font-serif">({scannedResult.hindiName})</p>
                  )}
                </div>

                <div className="text-right bg-slate-900 p-3 rounded-2xl border border-slate-700">
                  <div className="text-2xl font-extrabold text-amber-400">{scannedResult.calories}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Calories</div>
                </div>
              </div>

              {/* Portion size pill */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                <span>Estimated Serving Portion:</span>
                <span className="font-mono font-bold text-amber-300">{scannedResult.estimatedServing}</span>
              </div>

              {/* Macros Breakdown Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Protein</div>
                  <div className="text-lg font-extrabold text-emerald-400">{scannedResult.protein}g</div>
                </div>
                <div className="bg-slate-900/80 border border-sky-500/30 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Carbs</div>
                  <div className="text-lg font-extrabold text-sky-400">{scannedResult.carbs}g</div>
                </div>
                <div className="bg-slate-900/80 border border-yellow-500/30 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fats</div>
                  <div className="text-lg font-extrabold text-yellow-400">{scannedResult.fats}g</div>
                </div>
                <div className="bg-slate-900/80 border border-purple-500/30 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fiber</div>
                  <div className="text-lg font-extrabold text-purple-400">{scannedResult.fiber}g</div>
                </div>
              </div>

              {/* Thermal Cooking Note if present */}
              {scannedResult.cookingImpactNote && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200 flex items-start space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{scannedResult.cookingImpactNote}</p>
                </div>
              )}

              {/* Add Scanned Food to Daily Meal Plan */}
              <div className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-slate-300">Select Target Meal Slot:</label>
                <div className="flex items-center space-x-3">
                  <select
                    value={targetSlot}
                    onChange={(e) => setTargetSlot(e.target.value as MealSlot)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="early_morning">Early Morning</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snack">Evening Snack</option>
                    <option value="dinner">Dinner</option>
                  </select>

                  <button
                    onClick={handleAdd}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    {addedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{addedSuccess ? 'Logged!' : 'Log to Meal Plan'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/60 p-8 rounded-3xl text-center space-y-3 min-h-[380px] flex flex-col items-center justify-center text-slate-400">
              <Utensils className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-slate-300">No Active Scan Result</h3>
              <p className="text-xs max-w-xs">
                Capture a photo or click a demo sample on the left to analyze cooked thalis or raw ingredients.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
