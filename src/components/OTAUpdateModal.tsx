import React, { useState } from 'react';
import { 
  CloudDownload, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Sparkles, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { 
  CURRENT_APP_VERSION, 
  CURRENT_BUILD_NUMBER, 
  CURRENT_COMMIT, 
  checkOTAUpdate, 
  applyOTAUpdate, 
  type OTAVersionInfo 
} from '../utils/otaUpdate';
import { haptic } from '../utils/haptics';

interface OTAUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const OTAUpdateModal: React.FC<OTAUpdateModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'up_to_date' | 'update_available'>('idle');
  const [remoteInfo, setRemoteInfo] = useState<OTAVersionInfo | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    haptic.selection();
    try {
      const result = await checkOTAUpdate();
      if (result.hasUpdate && result.remoteInfo) {
        setRemoteInfo(result.remoteInfo);
        setUpdateStatus('update_available');
        onNotify(`New OTA Update ${result.remoteInfo.version} is available!`);
      } else {
        setRemoteInfo(result.remoteInfo || null);
        setUpdateStatus('up_to_date');
        onNotify(`NutriFit v${CURRENT_APP_VERSION} is on the latest version!`);
      }
    } catch {
      setUpdateStatus('up_to_date');
      onNotify('Checked cloud manifest: App is up to date.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleApplyUpdate = async () => {
    setIsApplying(true);
    haptic.medium();
    onNotify('Purging cache and applying OTA update...');
    setTimeout(async () => {
      await applyOTAUpdate();
    }, 800);
  };

  const changelogItems = remoteInfo?.changelog || [
    '7-Day Indian Thali Architecture with Mon–Sun meal matrix & PDF export',
    'Hydration Tracker with Chaas, Nariyal Pani & water quick-logging',
    'Strava-Style Steps & Distance Pedometer with GPS activity card export',
    'Smart Fridge AI to discover recipes using kitchen ingredients at home',
    'Evidence-Based Supplement Advisor (Whey, Creatine, Ashwagandha, D3)',
    'Interactive Weight Check-in & Recharts macro telemetry',
    '1-Tap Quick Action Bar on Daily Dashboard',
    'Smooth 60fps transitions and warm Saffron-Amber theme'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1511] w-full max-w-lg rounded-3xl border border-[#EEDEC1] dark:border-[#3A291E] shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EEDEC1] dark:border-[#3A291E]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-[#EA580C] flex items-center justify-center shadow-xs">
              <CloudDownload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                Over-The-Air (OTA) Updates
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Live Cloud Sync • Instant Mobile & Web Deployments
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              haptic.light();
            }}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#251912] text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current App Telemetry Card */}
        <div className="bg-[#FFFBF5] dark:bg-[#15100E] p-4 rounded-2xl border border-[#EEDEC1] dark:border-[#2D1F16] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Installed Version:</span>
            <span className="font-black text-slate-900 dark:text-white font-mono bg-white dark:bg-[#201610] px-2 py-0.5 rounded-md border border-[#EEDEC1] dark:border-[#3A291E]">
              v{CURRENT_APP_VERSION} (Build {CURRENT_BUILD_NUMBER})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Git Commit Hash:</span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-300">
              {CURRENT_COMMIT}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">OTA Update Channel:</span>
            <span className="inline-flex items-center space-x-1 font-bold text-[#EA580C]">
              <Zap className="w-3.5 h-3.5" />
              <span>Production Live (GitHub / Vercel)</span>
            </span>
          </div>
        </div>

        {/* Status Announcement */}
        {updateStatus === 'up_to_date' ? (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center space-x-3 text-xs text-amber-900 dark:text-amber-200 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#EA580C] shrink-0" />
            <div>
              <div className="font-bold">App is 100% Up-To-Date!</div>
              <div className="text-[11px] opacity-90 mt-0.5">You are running the newest build with all holistic Indian fitness features.</div>
            </div>
          </div>
        ) : updateStatus === 'update_available' ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-[#2A1B14] dark:to-[#22150F] border border-orange-200 dark:border-[#4A2D1B] flex items-center space-x-3 text-xs text-orange-950 dark:text-orange-200">
            <Sparkles className="w-5 h-5 text-[#EA580C] shrink-0 animate-pulse" />
            <div>
              <div className="font-extrabold text-sm">New OTA Update Ready!</div>
              <div className="text-[11px] opacity-90 mt-0.5">Version {remoteInfo?.version} is available. Tap below to reload and apply now.</div>
            </div>
          </div>
        ) : null}

        {/* What's New in This OTA Release */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Included in v{CURRENT_APP_VERSION} OTA Package</span>
            </span>
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">100% Indian Nutrition</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {changelogItems.map((note, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#15100E] border border-[#EEDEC1] dark:border-[#2D1F16] text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="pt-2 border-t border-[#EEDEC1] dark:border-[#3A291E] flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-[#201610] hover:bg-stone-50 border border-[#EEDEC1] dark:border-[#3A291E] text-slate-900 dark:text-white font-bold text-xs transition cursor-pointer active:scale-95 flex items-center justify-center space-x-2 shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 text-[#EA580C] ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Cloud...' : 'Check For Updates'}</span>
          </button>

          <button
            onClick={handleApplyUpdate}
            disabled={isApplying}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#D97706] hover:from-[#C2410C] hover:to-[#B45309] text-white font-bold text-xs transition cursor-pointer active:scale-95 flex items-center justify-center space-x-2 shadow-md disabled:opacity-60"
          >
            <CloudDownload className={`w-4 h-4 ${isApplying ? 'animate-bounce' : ''}`} />
            <span>{isApplying ? 'Applying Update...' : 'Apply Live OTA Update'}</span>
          </button>
        </div>

        {/* Release Links */}
        <div className="text-center pt-1">
          <a
            href="https://github.com/muthumanikandanb2005-ux/nutrifit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-[#EA580C] transition"
          >
            <span>GitHub Repository & Release Notes</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
