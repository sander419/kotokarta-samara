import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  HeartHandshake, 
  BookOpen, 
  MapPin, 
  Filter, 
  Info,
  Sparkles,
  ChevronDown,
  X,
  Stethoscope,
  Building2,
  SlidersHorizontal,
  ThermometerSun,
  ShieldAlert as AlertIcon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { playPurrHaptic, isSoundMuted, toggleSoundMuted } from '../utils/haptics';

interface HeaderProps {
  userRole: UserRole;
  onToggleRole: () => void;
  activeFilter: string;
  onChangeFilter: (status: string) => void;
  infraFilter: string;
  onChangeInfraFilter: (infra: string) => void;
  districtFilter: string;
  onChangeDistrict: (dist: string) => void;
  onOpenAddCat: () => void;
  onOpenVolunteerHub: () => void;
  onOpenCatDex: () => void;
  onOpenAbout: () => void;
  onOpenTutorial?: () => void;
  onOpenClinics?: () => void;
  onOpenCaregiversHub?: () => void;
  sosCount: number;
}

const DISTRICTS = [
  { id: 'all', label: 'Вся Самара' },
  { id: 'Самарский', label: 'Самарский' },
  { id: 'Ленинский', label: 'Ленинский' },
  { id: 'Октябрьский', label: 'Октябрьский' },
  { id: 'Кировский (Безымянка)', label: 'Безымянка' },
  { id: 'Промышленный', label: 'Промышленный' },
  { id: 'Железнодорожный', label: 'Железнодорожный' },
  { id: 'Советский', label: 'Советский' },
  { id: 'Красноглинский', label: 'Красноглинский' },
];

const CAT_STATUSES = [
  { id: 'all', label: 'Все хвостатые', emoji: '🐾' },
  { id: 'osvv', label: 'ОСВВ (бирка)', emoji: '✂️' },
  { id: 'adoptable', label: 'Ищет семью', emoji: '💖' },
  { id: 'sos', label: 'SOS / Срочно', emoji: '⚠️' },
  { id: 'resident', label: 'Жители дворов', emoji: '🏘️' },
];

const INFRA_TYPES = [
  { id: 'all', label: 'Вся инфраструктура', emoji: '🏠' },
  { id: 'shelter', label: 'Зимние котодомики', emoji: '🛖' },
  { id: 'vet_clinic', label: 'Ветклиники', emoji: '🏥' },
  { id: 'pet_friendly', label: 'Pet-friendly кафе', emoji: '☕' },
  { id: 'feeder', label: 'Кормушки и поилки', emoji: '🥣' },
];

export const Header: React.FC<HeaderProps> = ({
  userRole,
  onToggleRole,
  activeFilter,
  onChangeFilter,
  infraFilter,
  onChangeInfraFilter,
  districtFilter,
  onChangeDistrict,
  onOpenAddCat,
  onOpenVolunteerHub,
  onOpenCatDex,
  onOpenAbout,
  onOpenTutorial,
  onOpenClinics,
  onOpenCaregiversHub,
  sosCount,
}) => {
  const [isFilterTrayOpen, setIsFilterTrayOpen] = useState(false);
  const [muted, setMuted] = useState(isSoundMuted());
  const filterTrayRef = useRef<HTMLDivElement>(null);

  const handleToggleMute = () => {
    const nextState = toggleSoundMuted();
    setMuted(nextState);
    if (!nextState) {
      playPurrHaptic();
    }
  };

  // Close filter shelf on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterTrayRef.current && !filterTrayRef.current.contains(event.target as Node)) {
        setIsFilterTrayOpen(false);
      }
    }
    if (isFilterTrayOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterTrayOpen]);

  // Active filters count
  const activeFiltersCount = 
    (districtFilter !== 'all' ? 1 : 0) + 
    (activeFilter !== 'all' ? 1 : 0) + 
    (infraFilter !== 'all' ? 1 : 0);

  return (
    <div className="fixed top-3 left-3 right-3 z-30 pointer-events-none flex flex-col items-center">
      {/* Primary Floating Bento Bar */}
      <div className="w-full max-w-7xl pointer-events-auto flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-3xl bg-[#FFF9F2]/90 backdrop-blur-xl border border-[#E7D6C3]/80 shadow-[0_8px_30px_rgb(59,40,34,0.08)] texture-parchment fur-shadow transition-all">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
          <div className="relative group cursor-pointer" onClick={onOpenAbout}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#F59E42] to-[#E08628] text-white flex items-center justify-center font-bold text-lg shadow-sm border border-[#FDE5CC] transition-transform group-hover:scale-105 active:scale-95">
              🐾
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" title="Zero-Harm сервис активен" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-black text-[#3B2822] font-comfortaa tracking-tight leading-none">
                Котокарта
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#3B2822] text-[#FFF9F2] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase font-comfortaa">
                Самара
              </span>
            </div>
            <p className="text-[10px] text-[#8C6D62] hidden md:block leading-none mt-1 font-medium">
              Zero-Harm ГИС защиты уличных кошек
            </p>
          </div>
        </div>

        {/* Center: District & Filter Toggle Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              playPurrHaptic();
              setIsFilterTrayOpen((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold font-comfortaa border transition-all ${
              isFilterTrayOpen || activeFiltersCount > 0
                ? 'bg-[#3B2822] text-[#FFF9F2] border-[#3B2822] shadow-sm'
                : 'bg-[#FAF2E8] hover:bg-[#F3E8DB] text-[#5A3E36] border-[#E7D6C3]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F59E42]" />
            <span className="hidden min-[480px]:inline">
              {districtFilter === 'all' ? 'Фильтры' : districtFilter}
            </span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F59E42] text-white text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${isFilterTrayOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Role Toggle Switch */}
          <div className="hidden lg:flex items-center p-0.5 bg-[#FAF2E8] rounded-2xl border border-[#E7D6C3]">
            <button
              onClick={() => {
                if (userRole === 'verified_curator') {
                  playPurrHaptic();
                  onToggleRole();
                }
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold font-comfortaa flex items-center gap-1.5 transition-all ${
                userRole === 'guest'
                  ? 'bg-white text-[#3B2822] shadow-xs'
                  : 'text-[#8C6D62] hover:text-[#3B2822]'
              }`}
              title="Гостевой режим: координаты размыты на ~100м для безопасности"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F59E42]" />
              <span>Zero-Harm</span>
            </button>
            <button
              onClick={() => {
                if (userRole === 'guest') {
                  playPurrHaptic();
                  onToggleRole();
                }
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold font-comfortaa flex items-center gap-1.5 transition-all ${
                userRole === 'verified_curator'
                  ? 'bg-[#3B2822] text-white shadow-xs'
                  : 'text-[#8C6D62] hover:text-[#3B2822]'
              }`}
              title="Режим куратора: точные точки и карточки"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Куратор</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="flex items-center gap-1 sm:gap-1.5 pr-1">
          {/* Volunteer SOS Button */}
          <button
            onClick={() => {
              playPurrHaptic();
              onOpenVolunteerHub();
            }}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold font-comfortaa border transition-all ${
              sosCount > 0
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 shadow-xs'
                : 'bg-[#FAF2E8] hover:bg-[#F3E8DB] text-[#5A3E36] border-[#E7D6C3]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">SOS-Хаб</span>
            {sosCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                {sosCount}
              </span>
            )}
          </button>

          {/* CatDex Button */}
          <button
            onClick={() => {
              playPurrHaptic();
              onOpenCatDex();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold font-comfortaa bg-[#FAF2E8] hover:bg-[#F3E8DB] text-[#5A3E36] border border-[#E7D6C3] transition-all"
            title="Котодекс: дневник встреч и бейджи"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F59E42]" />
            <span className="hidden md:inline">Котодекс</span>
          </button>

          {/* Multi-cat Caregivers Hub Button */}
          {onOpenCaregiversHub && (
            <button
              onClick={() => {
                playPurrHaptic();
                onOpenCaregiversHub();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold font-comfortaa bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/90 transition-all"
              title="Шефство над домашними мини-приютами и многокотовыми опекунами"
            >
              <span className="text-xs">🏡</span>
              <span className="hidden lg:inline">Опекуны</span>
            </button>
          )}

          {/* Clinics Button */}
          {onOpenClinics && (
            <button
              onClick={() => {
                playPurrHaptic();
                onOpenClinics();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-bold font-comfortaa bg-[#ECFDF5] hover:bg-[#D1FAE5] text-emerald-800 border border-emerald-200 transition-all hidden sm:flex"
              title="Партнерские ветклиники Самары"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Ветклиники</span>
            </button>
          )}

          {/* Add Cat Button (Primary CTA) */}
          <button
            onClick={() => {
              playPurrHaptic();
              onOpenAddCat();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs font-bold font-comfortaa bg-gradient-to-r from-[#F59E42] to-[#E08628] hover:from-[#E08628] hover:to-[#C97218] text-white shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden min-[480px]:inline">Добавить кота</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-2xl transition-colors ${
              muted 
                ? 'text-[#A68A7E] hover:text-[#5A3E36] bg-[#FAF2E8]/60 hover:bg-[#FAF2E8]' 
                : 'text-[#F59E42] hover:text-[#E08628] bg-amber-50/80 hover:bg-amber-100/80'
            }`}
            title={muted ? 'Включить уютные звуки (мурчание и мяу)' : 'Отключить звуки (тихий режим)'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Safety & Info */}
          <button
            onClick={() => {
              playPurrHaptic();
              onOpenAbout();
            }}
            className="p-2 rounded-2xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#FAF2E8] transition-colors"
            title="О проекте Zero-Harm"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Frosted Filter Shelf */}
      {isFilterTrayOpen && (
        <div
          ref={filterTrayRef}
          className="w-full max-w-7xl mt-2 pointer-events-auto p-4 rounded-3xl bg-[#FFF9F2]/95 backdrop-blur-2xl border border-[#E7D6C3] shadow-[0_16px_40px_rgb(59,40,34,0.12)] texture-parchment animate-fade-in text-xs space-y-3.5"
        >
          <div className="flex items-center justify-between border-b border-[#F3E8DB] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🗺️</span>
              <span className="font-bold text-xs sm:text-sm font-comfortaa text-[#3B2822]">
                Фильтры карты Самары
              </span>
            </div>
            <div className="flex items-center gap-2">
              {(districtFilter !== 'all' || activeFilter !== 'all' || infraFilter !== 'all') && (
                <button
                  onClick={() => {
                    playPurrHaptic();
                    onChangeDistrict('all');
                    onChangeFilter('all');
                    onChangeInfraFilter('all');
                  }}
                  className="text-[11px] text-[#F59E42] hover:underline font-bold"
                >
                  Сбросить всё
                </button>
              )}
              <button
                onClick={() => setIsFilterTrayOpen(false)}
                className="p-1 rounded-xl text-[#8C6D62] hover:bg-[#FAF2E8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 1: Districts */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D62] mb-1.5 flex items-center gap-1 font-comfortaa">
              <MapPin className="w-3 h-3 text-[#F59E42]" />
              <span>Район города:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DISTRICTS.map((dist) => (
                <button
                  key={dist.id}
                  onClick={() => {
                    playPurrHaptic();
                    onChangeDistrict(dist.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    districtFilter === dist.id
                      ? 'bg-[#3B2822] text-white shadow-xs font-bold'
                      : 'bg-[#FAF2E8] hover:bg-[#F3E8DB] text-[#5A3E36] border border-[#E7D6C3]'
                  }`}
                >
                  {dist.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Statuses */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D62] mb-1.5 flex items-center gap-1 font-comfortaa">
              <Filter className="w-3 h-3 text-[#F59E42]" />
              <span>Статус котика:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CAT_STATUSES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    playPurrHaptic();
                    onChangeFilter(st.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                    activeFilter === st.id
                      ? 'bg-[#F59E42] text-white shadow-xs font-bold'
                      : 'bg-[#FAF2E8] hover:bg-[#F3E8DB] text-[#5A3E36] border border-[#E7D6C3]'
                  }`}
                >
                  <span>{st.emoji}</span>
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Infrastructure */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D62] mb-1.5 flex items-center gap-1 font-comfortaa">
              <Building2 className="w-3 h-3 text-[#F59E42]" />
              <span>Городская инфраструктура:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INFRA_TYPES.map((inf) => (
                <button
                  key={inf.id}
                  onClick={() => {
                    playPurrHaptic();
                    onChangeInfraFilter(inf.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                    infraFilter === inf.id
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'bg-[#FAF2E8] hover:bg-[#F3E8DB] text-[#5A3E36] border border-[#E7D6C3]'
                  }`}
                >
                  <span>{inf.emoji}</span>
                  <span>{inf.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
