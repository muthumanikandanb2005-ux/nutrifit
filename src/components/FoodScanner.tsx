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
    <div className="max-w-5xl mx-auto px-2 py-4 space-y-6">
      {/* Title Banner */}
      <div className="bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-[var(--greenSoft)] text-[var(--greenDark)] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>AI Vision Nutrient Scanner</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Scan Any Food to Extract Instant Macros
        </h1>
        <p className="text-[var(--muted)] text-xs sm:text-sm max-w-2xl mx-auto">
          Snap a picture of your cooked Indian thalis, street food, or raw ingredients to calculate calories and protein.
        </p>

        {/* Raw vs Cooked State Selector Tabs */}
        <div className="flex justify-center pt-2">
          <div className="bg-[var(--surface2)] p-1.5 rounded-2xl border border-[var(--line)] inline-flex space-x-1">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterState === 'all' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              All Foods
            </button>
            <button
              onClick={() => setFilterState('cooked')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterState === 'cooked' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Cooked Meals
            </button>
            <button
              onClick={() => setFilterState('raw')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterState === 'raw' ? 'bg-[var(--surface)] text-[var(--greenDark)] shadow-sm font-bold' : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Raw & Ingredients
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Viewfinder Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[var(--surface2)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 text-center space-y-5 relative overflow-hidden shadow-sm min-h-[340px] flex flex-col items-center justify-center">
            
            {/* Live laser scan line animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--greenSoft)] to-transparent animate-scan z-10 pointer-events-none border-b-2 border-[var(--green)]" />
            )}

            {/* Hidden canvas for capturing frame */}
            <canvas ref={canvasRef} className="hidden" />

            {isCameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4 z-20">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-60 object-cover rounded-2xl border border-[var(--line)] shadow-sm"
                />
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCaptureLiveSnapshot}
                    className="px-5 py-2.5 bg-[var(--green)] hover:bg-[var(--greenDark)] text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & Analyze</span>
                  </button>
                  <button
                    onClick={stopLiveCamera}
                    className="p-2.5 bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)] rounded-xl text-xs font-medium hover:text-[var(--ink)] transition cursor-pointer flex items-center gap-1"
                  >
                    <VideoOff className="w-4 h-4" /> Stop
                  </button>
                </div>
              </div>
            ) : isScanning ? (
              <div className="space-y-3 relative z-20">
                <RefreshCw className="w-10 h-10 text-[var(--green)] animate-spin mx-auto" />
                <div className="space-y-1">
                  <div className="text-base font-bold text-[var(--ink)]">Analyzing Food Stream...</div>
                  <p className="text-xs text-[var(--muted)]">Extracting ingredients and nutritional profile</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 relative z-20">
                <div className="p-4 bg-[var(--surface)] rounded-full border border-[var(--line)] inline-block text-[var(--green)] shadow-sm">
                  <Camera className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[var(--ink)]">Capture or Stream Food Live</h3>
                  <p className="text-xs text-[var(--muted)]">Point your camera or upload a dish photo</p>
                </div>

                {cameraError && (
                  <p className="text-xs text-[#9b4e3f] bg-[var(--peach)] p-2 rounded-xl border border-[var(--line)]">
                    {cameraError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    onClick={startLiveCamera}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[var(--green)] hover:bg-[var(--greenDark)] text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open Camera</span>
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
                    className="w-full sm:w-auto px-4 py-2.5 bg-[var(--surface)] hover:bg-[var(--surface2)] border border-[var(--line)] text-[var(--ink)] font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4 text-[var(--muted)]" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Preset Chips */}
          <div className="bg-[var(--surface)] border border-[var(--line)] p-4 sm:p-5 rounded-2xl space-y-2.5 shadow-sm">
            <h4 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--green)]" />
              <span>Or Try Sample Foods</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayedPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleScanPreset(preset)}
                  className="p-2.5 bg-[var(--surface2)] hover:bg-[var(--greenSoft)] border border-[var(--line)] text-left rounded-xl text-xs transition-all cursor-pointer"
                >
                  <div className="font-semibold text-[var(--ink)] truncate">{preset.foodName}</div>
                  <div className="text-[10px] text-[var(--muted)] flex items-center space-x-1 mt-0.5">
                    <span>{preset.foodState === 'cooked' ? 'Cooked' : 'Raw'}</span>
                    <span>·</span>
                    <span>{preset.calories} kcal</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Results Panel */}
        <div className="lg:col-span-6 space-y-4">
          {scannedResult ? (
            <div className="bg-[var(--surface)] border border-[var(--line)] p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-[var(--greenSoft)] text-[var(--greenDark)] uppercase">
                      {scannedResult.foodState === 'cooked' ? 'Cooked Dish' : 'Raw Ingredient'}
                    </span>
                    <span className="text-[10px] text-[var(--greenDark)] bg-[var(--surface2)] px-2 py-0.5 rounded-md border border-[var(--line)] font-medium">
                      {scannedResult.confidence}% AI Match
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--ink)] mt-1">{scannedResult.foodName}</h2>
                  {scannedResult.hindiName && (
                    <p className="text-xs text-[var(--muted)] font-serif">({scannedResult.hindiName})</p>
                  )}
                </div>

                <div className="text-right bg-[var(--surface2)] p-2.5 rounded-xl border border-[var(--line)]">
                  <div className="text-xl font-bold text-[var(--green)]">{scannedResult.calories}</div>
                  <div className="text-[9px] text-[var(--muted)] uppercase font-semibold">Calories</div>
                </div>
              </div>

              {/* Portion size pill */}
              <div className="bg-[var(--surface2)] p-3 rounded-xl border border-[var(--line)] text-xs text-[var(--muted)] flex items-center justify-between">
                <span>Estimated Serving Portion:</span>
                <span className="font-bold text-[var(--ink)]">{scannedResult.estimatedServing}</span>
              </div>

              {/* Macros Breakdown Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[var(--surface2)] border border-[var(--line)] p-2.5 rounded-xl">
                  <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Protein</div>
                  <div className="text-base font-bold text-[var(--green)]">{scannedResult.protein}g</div>
                </div>
                <div className="bg-[var(--surface2)] border border-[var(--line)] p-2.5 rounded-xl">
                  <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Carbs</div>
                  <div className="text-base font-bold text-[#456b82]">{scannedResult.carbs}g</div>
                </div>
                <div className="bg-[var(--surface2)] border border-[var(--line)] p-2.5 rounded-xl">
                  <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Fats</div>
                  <div className="text-base font-bold text-[#966b36]">{scannedResult.fats}g</div>
                </div>
                <div className="bg-[var(--surface2)] border border-[var(--line)] p-2.5 rounded-xl">
                  <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Fiber</div>
                  <div className="text-base font-bold text-[#6d557a]">{scannedResult.fiber}g</div>
                </div>
              </div>

              {/* Thermal Cooking Note if present */}
              {scannedResult.cookingImpactNote && (
                <div className="bg-[var(--wheat)]/60 border border-[var(--line)] p-3.5 rounded-xl text-xs text-[var(--ink)] flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#966b36] shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[var(--muted)]">{scannedResult.cookingImpactNote}</p>
                </div>
              )}

              {/* Add Scanned Food to Daily Meal Plan */}
              <div className="bg-[var(--surface2)] border border-[var(--line)] p-4 rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-[var(--ink)]">Select Target Meal Slot:</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <select
                    value={targetSlot}
                    onChange={(e) => setTargetSlot(e.target.value as MealSlot)}
                    className="flex-1 bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--ink)] text-xs font-medium focus:outline-none focus:border-[var(--green)]"
                  >
                    <option value="early_morning">Early Morning</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snack">Evening Snack</option>
                    <option value="dinner">Dinner</option>
                  </select>

                  <button
                    onClick={handleAdd}
                    className="px-4 py-2.5 bg-[var(--green)] hover:bg-[var(--greenDark)] text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    {addedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{addedSuccess ? 'Logged to Plan' : 'Log to Meal Plan'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--line)] p-8 rounded-2xl text-center space-y-3 min-h-[340px] flex flex-col items-center justify-center text-[var(--muted)] shadow-sm">
              <div className="p-3 bg-[var(--surface2)] rounded-full border border-[var(--line)] text-[var(--muted)]">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)]">No Active Scan Result</h3>
              <p className="text-xs max-w-xs text-[var(--muted)]">
                Capture a photo or click a demo sample on the left to analyze cooked thalis or raw ingredients.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
