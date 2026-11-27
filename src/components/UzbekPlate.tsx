import React, { useRef, useState } from 'react';

interface UzbekPlateProps {
  region: string;
  firstLetter: string;
  digits: string;
  lastLetters: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  interactive3D?: boolean;
  isVip?: boolean;
  className?: string;
}

export const UzbekPlate: React.FC<UzbekPlateProps> = ({
  region,
  firstLetter,
  digits,
  lastLetters,
  size = 'md',
  interactive3D = true,
  isVip = false,
  className = '',
}) => {
  const plateRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive3D || !plateRef.current) return;
    const rect = plateRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 10;
    setTilt({
      rotateX,
      rotateY,
      glareX: x * 100,
      glareY: y * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const sizeConfig = {
    sm: {
      wrapper: 'h-11 rounded-[6px] border-[2px] px-1.5',
      regionText: 'text-sm pr-1.5',
      mainText: 'text-sm gap-1 px-1.5',
      digitsText: 'text-[15px]',
      flagW: 'w-4 h-2.5',
      uzText: 'text-[8px]',
      rivet: 'w-1 h-1',
    },
    md: {
      wrapper: 'h-16 sm:h-[70px] rounded-[8px] border-[2.5px] px-2',
      regionText: 'text-[22px] sm:text-[24px] pr-2.5',
      mainText: 'text-[22px] sm:text-[25px] gap-1.5 px-2.5',
      digitsText: 'text-[24px] sm:text-[27px]',
      flagW: 'w-5 h-3.5',
      uzText: 'text-[10px]',
      rivet: 'w-1.5 h-1.5',
    },
    lg: {
      wrapper: 'h-20 sm:h-24 rounded-[10px] border-[3px] px-3',
      regionText: 'text-3xl sm:text-[34px] pr-3.5',
      mainText: 'text-3xl sm:text-[36px] gap-2 px-3.5',
      digitsText: 'text-[32px] sm:text-[40px]',
      flagW: 'w-7 h-4',
      uzText: 'text-xs',
      rivet: 'w-2 h-2',
    },
    hero: {
      wrapper: 'h-24 sm:h-28 rounded-[12px] border-[3.5px] px-4',
      regionText: 'text-4xl sm:text-[44px] pr-4',
      mainText: 'text-4xl sm:text-[46px] gap-2.5 px-4',
      digitsText: 'text-[40px] sm:text-[50px]',
      flagW: 'w-8 h-5',
      uzText: 'text-[13px]',
      rivet: 'w-2 h-2',
    },
  }[size];

  return (
    <div
      className={`select-none ${className}`}
      style={{ perspective: '900px' }}
    >
      <div
        ref={plateRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: interactive3D
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
            : undefined,
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative flex items-center justify-between bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FA] to-[#E6E8EC] text-[#0B0C0E] border-[#111214] plate-emboss overflow-hidden ${sizeConfig.wrapper} ${
          isVip ? 'ring-1 ring-[#D4AF37]/50' : ''
        }`}
      >
        {/* Specular reflective sheen on hover */}
        {interactive3D && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(212,175,55,0.12) 28%, transparent 65%)`,
            }}
          />
        )}

        {/* Corner screw rivets */}
        <span
          aria-hidden="true"
          className={`absolute top-1.5 left-1.5 rounded-full bg-zinc-300 border border-zinc-400/70 shadow-inner ${sizeConfig.rivet}`}
        />
        <span
          aria-hidden="true"
          className={`absolute top-1.5 right-1.5 rounded-full bg-zinc-300 border border-zinc-400/70 shadow-inner ${sizeConfig.rivet}`}
        />

        {/* Region compartment */}
        <div
          className={`relative z-10 flex items-center justify-center h-full border-r-[2px] border-[#111214]/85 font-mono font-bold tracking-tight tabular-nums leading-none ${sizeConfig.regionText}`}
        >
          {region}
        </div>

        {/* Center alphanumeric compartment */}
        <div
          className={`relative z-10 flex-1 flex items-center justify-center font-mono font-bold tracking-tight tabular-nums leading-none ${sizeConfig.mainText}`}
        >
          <span className="font-sans font-extrabold tracking-tight">{firstLetter}</span>
          <span className={`font-mono font-bold ${sizeConfig.digitsText}`}>{digits}</span>
          <span className="font-sans font-extrabold tracking-tight">{lastLetters}</span>
        </div>

        {/* Uzbekistan Flag + UZ compartment */}
        <div className="relative z-10 flex flex-col items-center justify-center pl-1.5">
          <svg
            viewBox="0 0 36 22"
            className={`${sizeConfig.flagW} rounded-[1.5px] shadow-xs border border-black/10`}
            aria-label="O'zbekiston bayrog'i"
          >
            <rect width="36" height="7" y="0" fill="#0099B5" />
            <rect width="36" height="1" y="7" fill="#CE1126" />
            <rect width="36" height="6" y="8" fill="#FFFFFF" />
            <rect width="36" height="1" y="14" fill="#CE1126" />
            <rect width="36" height="7" y="15" fill="#1EB53A" />
            {/* Crescent & subtle stars */}
            <circle cx="5.2" cy="3.5" r="2.1" fill="#FFFFFF" />
            <circle cx="6.0" cy="3.5" r="1.75" fill="#0099B5" />
            <circle cx="8.8" cy="2.1" r="0.45" fill="#FFFFFF" />
            <circle cx="10.4" cy="2.1" r="0.45" fill="#FFFFFF" />
            <circle cx="12.0" cy="2.1" r="0.45" fill="#FFFFFF" />
            <circle cx="8.8" cy="3.5" r="0.45" fill="#FFFFFF" />
            <circle cx="10.4" cy="3.5" r="0.45" fill="#FFFFFF" />
            <circle cx="12.0" cy="3.5" r="0.45" fill="#FFFFFF" />
            <circle cx="8.8" cy="4.9" r="0.45" fill="#FFFFFF" />
            <circle cx="10.4" cy="4.9" r="0.45" fill="#FFFFFF" />
            <circle cx="12.0" cy="4.9" r="0.45" fill="#FFFFFF" />
          </svg>
          <span
            className={`font-sans font-extrabold tracking-wider text-[#0073A8] leading-none mt-0.5 ${sizeConfig.uzText}`}
          >
            UZ
          </span>
        </div>
      </div>
    </div>
  );
};
