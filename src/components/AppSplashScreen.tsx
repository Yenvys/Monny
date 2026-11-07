import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface AppSplashScreenProps {
  onFinish?: () => void;
}

// Ensure the splash screen only ever triggers once when launching the app
let splashHasRunInSession = false;

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ onFinish }) => {
  const { language } = useWallet();
  const [visible, setVisible] = useState(() => !splashHasRunInSession);
  const [fadingOut, setFadingOut] = useState(false);
  const [cardEjected, setCardEjected] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(10);

  const stepsId = [
    'Mempersiapkan Dompet Digital...',
    'Sinkronisasi Arus Kas & Saldo...',
    'Enkripsi Data Lokal Aktif...',
    'Monny Siap Digunakan',
  ];

  const stepsEn = [
    'Preparing Digital Wallet...',
    'Syncing Balances & Cashflow...',
    'Local Storage Encryption Active...',
    'Monny is Ready',
  ];

  const steps = language === 'en' ? stepsEn : stepsId;

  useEffect(() => {
    if (splashHasRunInSession) {
      setVisible(false);
      return;
    }
    splashHasRunInSession = true;

    // Stage 1: Card peeks out
    const tCard = setTimeout(() => setCardEjected(true), 280);

    // Dynamic progress increments
    const tProg1 = setTimeout(() => {
      setProgress(40);
      setLoadingStep(1);
    }, 350);

    const tProg2 = setTimeout(() => {
      setProgress(78);
      setLoadingStep(2);
    }, 700);

    const tProg3 = setTimeout(() => {
      setProgress(100);
      setLoadingStep(3);
    }, 1050);

    // Stage 4: Spectacular Zoom & Fade Out
    const tFade = setTimeout(() => {
      setFadingOut(true);
    }, 1350);

    // Stage 5: Complete & Unmount
    const tEnd = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1750);

    return () => {
      clearTimeout(tCard);
      clearTimeout(tProg1);
      clearTimeout(tProg2);
      clearTimeout(tProg3);
      clearTimeout(tFade);
      clearTimeout(tEnd);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] bg-[#070709] text-white select-none transition-all duration-500 ease-in-out ${
        fadingOut
          ? 'opacity-0 scale-105 pointer-events-none filter blur-xs'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Radial Spotlight */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-neutral-800/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800/80 text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>OFFLINE SECURE WALLET</span>
        </div>
      </div>

      {/* Center Spectacular Visual Anchor */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        {/* Dynamic Shockwave Rings */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Shockwave ring 1 */}
          <div className="absolute w-18 h-18 rounded-2xl border border-white/20 animate-shockwave-1 pointer-events-none" />
          {/* Shockwave ring 2 */}
          <div className="absolute w-18 h-18 rounded-2xl border border-white/10 animate-shockwave-2 pointer-events-none" />

          {/* Floating Particle Accents */}
          <div className="absolute -top-2.5 -right-2.5 text-neutral-400 animate-bounce duration-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="absolute -bottom-2 -left-2 text-neutral-600 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>

          {/* Main 3D Icon Card with Metallic Gleam */}
          <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-b from-neutral-850 to-neutral-950 border border-neutral-750 p-2 shadow-2xl shadow-black overflow-hidden animate-float-gentle">
            {/* Gleam light beam sweep */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gleam pointer-events-none" />

            {/* Custom Layered Wallet Art with animated card ejection */}
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Peeking platinum card with ejection slide animation */}
              <div
                className={`absolute w-11 h-7 rounded-sm bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400 shadow-md border border-neutral-300/40 transition-all duration-700 ease-out flex items-center px-1 ${
                  cardEjected
                    ? '-translate-y-3.5 scale-100 opacity-100'
                    : 'translate-y-0 scale-90 opacity-60'
                }`}
              >
                <div className="w-2.5 h-1.5 rounded-xs bg-neutral-800/20 mr-1" />
                <div className="w-3 h-0.5 rounded-full bg-neutral-600/40" />
              </div>

              {/* Main crisp white wallet body */}
              <div className="relative z-10 w-13 h-9 rounded-lg bg-white text-neutral-950 shadow-xl border border-neutral-200/50 flex flex-col justify-between p-1 mt-1.5">
                {/* Pocket slit line */}
                <div className="w-full h-0.5 bg-neutral-900/30 rounded-full mt-2" />
                
                {/* Clasp with shiny rivet */}
                <div className="self-end mr-0.5 mb-0.5 w-2.5 h-2.5 rounded-full bg-neutral-950 flex items-center justify-center shadow-xs">
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Kinetic Typography */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white font-sans uppercase">
            Monny
          </h1>
          <p className="text-xs text-neutral-400 font-medium tracking-wide">
            {language === 'en' ? 'Personal Wallet & Expense Tracker' : 'Dompet & Catatan Finansial Personal'}
          </p>
        </div>

        {/* Dynamic Progress Bar with Glow */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="w-48 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 p-px relative">
            <div
              className="h-full bg-gradient-to-r from-neutral-400 to-white rounded-full transition-all duration-300 ease-out shadow-sm shadow-white/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stepped Status Text */}
          <p className="text-[11px] font-mono text-neutral-400 tracking-wide transition-all duration-200 h-4">
            {steps[loadingStep]}
          </p>
        </div>
      </div>

      {/* Bottom Subtle Footer */}
      <div className="relative z-10 text-[10px] text-neutral-600 font-mono tracking-widest uppercase">
        {language === 'en' ? 'VERSION 1.0.0 • ENGINE READY' : 'VERSI 1.0.0 • MEMUAT ENGINE'}
      </div>
    </div>
  );
};
