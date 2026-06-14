import React, { useEffect, useState } from 'react';

interface AppLoaderProps {
  onFinish?: () => void;
}

export default function AppLoader({ onFinish }: AppLoaderProps) {
  const [stage, setStage] = useState<'idle' | 'enter' | 'hold' | 'exit'>('idle');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('enter'), 80);
    const t2 = setTimeout(() => setStage('hold'), 900);
    const t3 = setTimeout(() => setStage('exit'), 2400);
    const t4 = setTimeout(() => onFinish?.(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onFinish]);

  const entered = stage === 'enter' || stage === 'hold' || stage === 'exit';
  const held = stage === 'hold' || stage === 'exit';

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-out ${
        stage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo icon — scales up + fades in */}
      <div
        className={`transition-all duration-700 ease-out ${
          entered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <div className="w-[100px] h-[100px] rounded-full bg-white shadow-xl shadow-gray-900/[0.08] ring-1 ring-black/[0.04] flex items-center justify-center overflow-hidden">
          <img
            src="https://res.cloudinary.com/djpcokxvn/image/upload/w_400,h_400,c_fill,q_auto:best,f_auto/v1777118970/HairStudio/app_logo_premium.png"
            alt="Hair Studio"
            className="w-[100px] h-[100px] object-cover rounded-full"
          />
        </div>
      </div>

      {/* App name — slides up from below the icon */}
      <div
        className={`mt-5 flex flex-col items-center transition-all duration-600 ease-out ${
          entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          transitionDelay: entered ? '200ms' : '0ms',
        }}
      >
        <h1
          className="text-[22px] font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: '"Fascinate Inline", system-ui' }}
        >
          Hair Studio
        </h1>
        <p className="text-[13px] text-gray-400 font-medium -mt-0.5">AI Try-On Studio</p>
      </div>

      {/* Progress bar — appears after hold */}
      <div
        className={`absolute bottom-20 w-32 h-[3px] rounded-full bg-gray-100 overflow-hidden transition-opacity duration-400 ${
          held ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: held ? '100ms' : '0ms' }}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
          style={{
            animation: held ? 'loaderProgress 1.6s ease-in-out forwards' : 'none',
          }}
        />
      </div>

      <style>{`
        @keyframes loaderProgress {
          0% { width: 0%; }
          60% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}