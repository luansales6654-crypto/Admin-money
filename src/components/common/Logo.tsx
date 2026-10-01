import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized "A" with money green upward surge geometry */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#151D18] to-[#101613] border border-[#1F2B23] shadow-lg shadow-black/50 overflow-hidden group`}>
        {/* Subtle glowing money green accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00E676]/25 to-[#00B359]/10 opacity-70 group-hover:opacity-100 transition-opacity" />
        
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 relative z-10"
        >
          {/* Left leg of A in clean metallic white */}
          <path
            d="M7 25L13.5 7.5C13.8 6.6 15 6.6 15.3 7.5L18 15"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dynamic upward financial arrow in vibrant money green */}
          <path
            d="M14.5 22L20.5 7L26 12.5"
            stroke="#00E676"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Horizontal crossbar in money green accent */}
          <path
            d="M10.5 18H22"
            stroke="#00E676"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Glowing financial trend apex dot */}
          <circle cx="26" cy="12.5" r="1.6" fill="#00E676" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-bold tracking-tight text-white flex items-center gap-1.5 ${textSizes[size]}`}>
            <span>Admin</span>
            <span className="text-[#00E676] font-extrabold">Money</span>
          </div>
          <span className="text-[10px] tracking-widest text-[#65796A] uppercase font-mono mt-0.5">Micro-SaaS Fintech</span>
        </div>
      )}
    </div>
  );
};
