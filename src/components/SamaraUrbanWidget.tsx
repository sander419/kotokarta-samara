import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Home,
  CheckCircle2
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';

interface SamaraUrbanWidgetProps {
  totalCatsCount: number;
  osvvCount: number;
  activeSheltersCount: number;
  openTicketsCount: number;
  onOpenSheltersList?: () => void;
  onOpenVolunteerHub?: () => void;
}

export const SamaraUrbanWidget: React.FC<SamaraUrbanWidgetProps> = ({
  totalCatsCount,
  osvvCount,
  activeSheltersCount,
  openTicketsCount,
  onOpenSheltersList,
  onOpenVolunteerHub,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-20 left-4 z-20 hidden md:flex flex-col text-xs select-none">
      <div 
        className={`bg-[#FFF9F2]/90 backdrop-blur-xl border border-[#E7D6C3] rounded-3xl shadow-[0_8px_30px_rgb(59,40,34,0.08)] texture-parchment fur-shadow transition-all duration-300 ${
          isExpanded ? 'w-80 p-3.5 space-y-3' : 'w-auto px-3.5 py-2'
        }`}
      >
        {/* Compact Bar / Header */}
        <div 
          onClick={() => {
            playPurrHaptic();
            setIsExpanded((prev) => !prev);
          }}
          className="flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#3B2822] font-comfortaa text-[11px] flex items-center gap-1.5">
              <span>Самара · Набережная</span>
              <span className="text-[#8C6D62] font-normal">| +16°C</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#8C6D62] group-hover:text-[#3B2822]">
            <span className="text-[10px] font-medium hidden sm:inline">
              {isExpanded ? 'Свернуть' : 'Сводка'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-2.5 pt-1 border-t border-[#F3E8DB] text-[11px] animate-fade-in">
            {/* Weather & Comfort */}
            <div className="p-2 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#F59E42]" />
                <div>
                  <div className="font-bold text-[#3B2822]">Погода для котиков</div>
                  <div className="text-[10px] text-[#8C6D62]">Волга: слабый бриз, сухо</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Комфортно
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-white/80 border border-[#E7D6C3]/60 shadow-2xs">
                <div className="text-base font-black text-[#3B2822] font-comfortaa">
                  {totalCatsCount}
                </div>
                <div className="text-[10px] text-[#8C6D62] font-medium">Под опекой</div>
                <div className="text-[9px] text-emerald-700 font-bold mt-0.5">
                  {osvvCount} по ОСВВ ✂️
                </div>
              </div>

              <div 
                onClick={onOpenSheltersList}
                className="p-2 rounded-2xl bg-white/80 border border-[#E7D6C3]/60 shadow-2xs cursor-pointer hover:border-[#F59E42] transition-colors"
              >
                <div className="text-base font-black text-[#965C38] font-comfortaa flex items-center justify-center gap-1">
                  <span>{activeSheltersCount}</span>
                  <span className="text-xs">🛖</span>
                </div>
                <div className="text-[10px] text-[#8C6D62] font-medium">Зимних домика</div>
                <div className="text-[9px] text-[#965C38] font-bold mt-0.5 flex items-center justify-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span>Обогрев в норме</span>
                </div>
              </div>
            </div>

            {/* Schedule & Volunteer alert */}
            <div className="p-2 rounded-2xl bg-[#FFF9F2] border border-[#E7D6C3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F59E42]" />
                <span className="text-[#5A3E36] font-medium">Вечернее кормление:</span>
              </div>
              <span className="font-bold text-[#3B2822] font-comfortaa text-[10px]">
                через 1 ч 15 мин
              </span>
            </div>

            {openTicketsCount > 0 && (
              <button
                onClick={onOpenVolunteerHub}
                className="w-full py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] font-comfortaa flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Открыто {openTicketsCount} SOS-заявок</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
