
import React from 'react';

export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {/* Main Central Atmosphere - Smaller, softer, gentle sway */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-[#c8102e]/15 rounded-full filter blur-[100px] animate-sway"></div>
      
      {/* Secondary Ambient Light - Very subtle */}
      <div className="absolute top-[20%] left-[35%] w-[300px] h-[300px] bg-[#b30d27]/10 rounded-full filter blur-[120px] animate-sway delay-1000"></div>
      <div className="absolute top-[20%] right-[35%] w-[300px] h-[300px] bg-[#ff1f45]/5 rounded-full filter blur-[120px] animate-sway delay-2000"></div>
      
      <style>{`
        @keyframes sway {
          0%, 100% { transform: translate(-50%, 0); opacity: 0.8; }
          50% { transform: translate(-40%, 0); opacity: 1; }
        }
        .animate-sway {
          animation: sway 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
