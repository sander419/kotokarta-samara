import React from 'react';

interface BiscuitLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BiscuitLoader: React.FC<BiscuitLoaderProps> = ({
  label = 'Котик месит лапками...',
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none animate-fade-in">
      {/* Paws Kneading Animation */}
      <div className="relative flex items-center justify-center gap-3 py-2">
        {/* Dough Pillow */}
        <div className="absolute -bottom-1 w-24 h-6 bg-[#F3E8DB] rounded-full border-2 border-[#E7D6C3] shadow-inner" />

        {/* Left Paw */}
        <div className="relative z-10 animate-knead-left flex flex-col items-center">
          <div className={`${isSm ? 'w-7 h-9' : 'w-9 h-11'} bg-[#FFF9F2] rounded-t-full rounded-b-2xl border-2 border-[#E7D6C3] shadow-xs p-1 flex flex-col justify-end items-center`}>
            {/* Paw Pads */}
            <div className="flex gap-0.5 mb-0.5">
              <div className="w-1.5 h-2 bg-[#FFB4C8] rounded-full" />
              <div className="w-1.5 h-2.5 bg-[#FFB4C8] rounded-full" />
              <div className="w-1.5 h-2 bg-[#FFB4C8] rounded-full" />
            </div>
            <div className="w-4 h-3 bg-[#FF8EAB] rounded-full" />
          </div>
        </div>

        {/* Right Paw */}
        <div className="relative z-10 animate-knead-right flex flex-col items-center">
          <div className={`${isSm ? 'w-7 h-9' : 'w-9 h-11'} bg-[#FFF9F2] rounded-t-full rounded-b-2xl border-2 border-[#E7D6C3] shadow-xs p-1 flex flex-col justify-end items-center`}>
            {/* Paw Pads */}
            <div className="flex gap-0.5 mb-0.5">
              <div className="w-1.5 h-2 bg-[#FFB4C8] rounded-full" />
              <div className="w-1.5 h-2.5 bg-[#FFB4C8] rounded-full" />
              <div className="w-1.5 h-2 bg-[#FFB4C8] rounded-full" />
            </div>
            <div className="w-4 h-3 bg-[#FF8EAB] rounded-full" />
          </div>
        </div>
      </div>

      {label && (
        <span className="text-xs font-bold text-[#5A3E36] mt-2 font-comfortaa tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};
