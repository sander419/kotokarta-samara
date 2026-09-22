import React, { useState } from 'react';
import { CaregiverBadge, CaregiverGoodDeed, MultiCatCaregiver } from '../types';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Trophy, 
  AlertCircle, 
  Activity, 
  Calendar, 
  Info,
  ExternalLink
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';

interface CaregiverRatingAndDeedsProps {
  caregiver: MultiCatCaregiver;
  onOpenCatProfile?: (catName: string) => void;
}

export const CaregiverRatingAndDeeds: React.FC<CaregiverRatingAndDeedsProps> = ({
  caregiver,
  onOpenCatProfile,
}) => {
  const [activeSection, setActiveSection] = useState<'rating' | 'badges' | 'deeds'>('rating');
  const [selectedBadge, setSelectedBadge] = useState<CaregiverBadge | null>(null);
  const [deedFilter, setDeedFilter] = useState<'all' | 'rescue' | 'sos_ticket' | 'sterilization' | 'adoption'>('all');

  const rating = caregiver.kotoRating || {
    score: 850,
    tier: 'Кот-Хранитель',
    level: 15,
    rescuedTotal: caregiver.catCount * 3,
    closedSosTickets: 18,
    sterilizationCount: caregiver.catCount * 2,
    sterilizationStatus: '100% стерилизованы (ОСВВ Самара)',
    adoptedTotal: caregiver.catCount * 2,
    yearsOfService: 8,
  };

  const badges = caregiver.badges || [];
  const deeds = caregiver.goodDeeds || [];

  const filteredDeeds = deeds.filter((d) => {
    if (deedFilter === 'all') return true;
    return d.category === deedFilter;
  });

  const getAnimationClass = (anim: CaregiverBadge['animation']) => {
    switch (anim) {
      case 'bounce-gentle':
        return 'animate-bounce-gentle';
      case 'glow-paw':
        return 'animate-glow-paw';
      case 'shimmer':
        return 'animate-badge-shimmer';
      case 'spin-slow':
        return 'animate-spin-slow';
      case 'pulse-slow':
      default:
        return 'animate-pulse-glow';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Легенда Самары':
        return 'from-amber-600 via-yellow-500 to-amber-700 text-amber-950 border-amber-300';
      case 'Кот-Хранитель':
        return 'from-rose-500 via-pink-500 to-amber-600 text-rose-950 border-rose-300';
      case 'Мастер Мурлыканья':
        return 'from-sky-600 via-indigo-500 to-sky-700 text-sky-950 border-sky-300';
      case 'Герой Хвостиков':
      default:
        return 'from-emerald-600 via-teal-500 to-emerald-700 text-emerald-950 border-emerald-300';
    }
  };

  return (
    <div className="rounded-3xl border border-[#E7D6C3] bg-[#FAF2E8]/80 overflow-hidden shadow-2xs space-y-3 p-3.5 sm:p-4">
      {/* Top Header Bar: Switch between Rating, Badges & Collection of Good Deeds */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E7D6C3]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#3B2822] text-xs font-comfortaa">
                Кото-рейтинг и добрые дела куратора
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[9px] font-comfortaa">
                Ур. {rating.level}
              </span>
            </div>
            <p className="text-[10px] text-[#8C6D62]">
              Подтверждённая спасательная активность и учёт ОСВВ
            </p>
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex items-center gap-1 bg-white/70 p-1 rounded-2xl border border-[#E7D6C3] text-[10px] font-bold font-comfortaa w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveSection('rating');
            }}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 ${
              activeSection === 'rating'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-[#6B4D44] hover:bg-[#FAF2E8]'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Рейтинг</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveSection('badges');
            }}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 ${
              activeSection === 'badges'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'text-[#6B4D44] hover:bg-[#FAF2E8]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Бейджи ({badges.length})</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveSection('deeds');
            }}
            className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 ${
              activeSection === 'deeds'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-[#6B4D44] hover:bg-[#FAF2E8]'
            }`}
          >
            <Heart className="w-3 h-3" />
            <span>Добрые дела ({deeds.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: KOTO-RATING & 4 CORE METRICS */}
      {activeSection === 'rating' && (
        <div className="space-y-3 animate-fade-in">
          {/* Main Tier Card */}
          <div className="p-3 rounded-2xl bg-white/90 border border-[#E7D6C3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 p-0.5 shadow-xs">
                  <div className="w-full h-full rounded-2xl bg-[#FFF9F2] flex flex-col items-center justify-center">
                    <span className="text-xl">🐱</span>
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-600 text-white text-[9px] font-black rounded-full font-comfortaa border border-white shadow-xs">
                  {rating.level}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#3B2822] font-comfortaa">
                    Звание:
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-black text-xs font-comfortaa tracking-wide border border-amber-200 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-600" />
                    {rating.tier}
                  </span>
                </div>
                <div className="text-[11px] text-[#6B4D44] mt-0.5">
                  Опыт опекунства: <span className="font-bold text-[#3B2822]">{rating.yearsOfService} лет</span> · Индекс признания: <span className="font-bold text-amber-800">{rating.score} очков</span>
                </div>
              </div>
            </div>

            {/* Progress bar to next tier */}
            <div className="w-full sm:w-48 bg-[#FAF2E8] p-2 rounded-xl border border-[#E7D6C3] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-[#8C6D62] font-comfortaa mb-1">
                <span>Прогресс ранга</span>
                <span className="font-bold text-[#3B2822]">{(rating.score % 100) * 1}% / 100%</span>
              </div>
              <div className="h-2 w-full bg-[#E7D6C3] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(25, rating.score % 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* 4 Interactive Metric Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* 1. Rescued Cats */}
            <div className="p-2.5 rounded-2xl bg-white/95 border border-[#E7D6C3] flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between text-[10px] text-[#8C6D62] font-comfortaa">
                <span>Спасенные кошки</span>
                <span className="text-base">🐾</span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-black text-[#3B2822] font-comfortaa">
                  {rating.rescuedTotal}
                </span>
                <span className="text-[10px] text-[#8C6D62] ml-1">хвостиков</span>
              </div>
              <div className="text-[9px] text-emerald-700 font-bold mt-1 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                +{rating.adoptedTotal} пристроено в семьи
              </div>
            </div>

            {/* 2. Closed SOS Tickets */}
            <div className="p-2.5 rounded-2xl bg-white/95 border border-[#E7D6C3] flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between text-[10px] text-[#8C6D62] font-comfortaa">
                <span>SOS-тикеты</span>
                <span className="text-base">🚨</span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-black text-[#3B2822] font-comfortaa">
                  {rating.closedSosTickets}
                </span>
                <span className="text-[10px] text-[#8C6D62] ml-1">закрыто</span>
              </div>
              <div className="text-[9px] text-rose-700 font-bold mt-1 bg-rose-50 px-1.5 py-0.5 rounded-md">
                100% отработаны
              </div>
            </div>

            {/* 3. Sterilization Count & ОСВВ */}
            <div className="p-2.5 rounded-2xl bg-white/95 border border-[#E7D6C3] flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between text-[10px] text-[#8C6D62] font-comfortaa">
                <span>Стерилизовано</span>
                <span className="text-base">🩺</span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-black text-emerald-800 font-comfortaa">
                  {rating.sterilizationCount}
                </span>
                <span className="text-[10px] text-[#8C6D62] ml-1">по ОСВВ</span>
              </div>
              <div className="text-[9px] text-emerald-700 font-bold mt-1 bg-emerald-50 px-1.5 py-0.5 rounded-md truncate">
                Квоты Самары
              </div>
            </div>

            {/* 4. Official Sterilization Status */}
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-[10px] text-emerald-800 font-comfortaa">
                <span>Статус ОСВВ</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-1">
                <span className="text-xs font-bold text-emerald-950 font-comfortaa leading-tight block">
                  {rating.sterilizationStatus}
                </span>
              </div>
              <div className="text-[9px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>Безопасная популяция</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ANIMATED BADGES WITH TOOLTIP / DETAIL */}
      {activeSection === 'badges' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] text-[#8C6D62] font-comfortaa">
            <span>Уникальные анимированные знаки отличия ({badges.length}):</span>
            <span className="text-[10px] text-purple-800 font-semibold">Нажмите на бейдж для описания</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((b) => {
              const isSelected = selectedBadge?.id === b.id;
              const animClass = getAnimationClass(b.animation);

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    playPurrHaptic();
                    setSelectedBadge(isSelected ? null : b);
                  }}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-200'
                      : 'bg-white/90 border-[#E7D6C3] hover:bg-white hover:border-purple-300 shadow-2xs'
                  }`}
                >
                  {/* Badge Icon with unique animated effect */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs border ${
                      b.badgeLevel === 'legendary'
                        ? 'bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 border-amber-300 text-white'
                        : b.badgeLevel === 'gold'
                        ? 'bg-gradient-to-tr from-amber-100 to-amber-200 border-amber-300 text-amber-900'
                        : 'bg-gradient-to-tr from-stone-100 to-stone-200 border-stone-300 text-stone-900'
                    }`}>
                      <span className={animClass}>{b.icon}</span>
                    </div>
                    {b.badgeLevel === 'legendary' && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                    )}
                  </div>

                  {/* Badge Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-[#3B2822] text-xs font-comfortaa truncate">
                        {b.title}
                      </h4>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider flex-shrink-0 ${
                        b.badgeLevel === 'legendary'
                          ? 'bg-rose-100 text-rose-900'
                          : b.badgeLevel === 'gold'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {b.badgeLevel === 'legendary' ? 'Легенда' : b.badgeLevel === 'gold' ? 'Золото' : 'Серебро'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6B4D44] mt-0.5 line-clamp-2">
                      {b.description}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-[#8C6D62] mt-1.5 pt-1.5 border-t border-[#F3E8DB]">
                      <span>Разблокирован: {b.unlockedAt}</span>
                      <span className="text-purple-700 font-semibold font-comfortaa">
                        {b.animation === 'glow-paw' && '✨ Сияние'}
                        {b.animation === 'pulse-slow' && '💓 Пульсация'}
                        {b.animation === 'bounce-gentle' && '🐾 Мягкий отскок'}
                        {b.animation === 'shimmer' && '🌟 Перелив'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal / Expanded popover details if selected */}
          {selectedBadge && (
            <div className="p-3 rounded-2xl bg-purple-50/90 border border-purple-200 text-purple-950 text-xs space-y-1 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedBadge.icon}</span>
                <span className="font-bold font-comfortaa">{selectedBadge.title}</span>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="ml-auto text-purple-700 hover:text-purple-900 text-[10px] font-bold"
                >
                  ✕ Закрыть
                </button>
              </div>
              <p className="text-[11px] text-purple-900 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: COLLECTION OF GOOD DEEDS */}
      {activeSection === 'deeds' && (
        <div className="space-y-3 animate-fade-in">
          {/* Sub-Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] font-comfortaa">
            <span className="text-[#8C6D62] font-semibold">Фильтр добрых дел:</span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(['all', 'rescue', 'sos_ticket', 'sterilization', 'adoption'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playPurrHaptic();
                    setDeedFilter(cat);
                  }}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    deedFilter === cat
                      ? 'bg-[#3B2822] text-[#FFF9F2]'
                      : 'bg-white text-[#6B4D44] hover:bg-[#F3E8DB]'
                  }`}
                >
                  {cat === 'all' && 'Все'}
                  {cat === 'rescue' && 'Спасения'}
                  {cat === 'sos_ticket' && 'SOS-тикеты'}
                  {cat === 'sterilization' && 'ОСВВ'}
                  {cat === 'adoption' && 'Дома'}
                </button>
              ))}
            </div>
          </div>

          {/* Deeds Feed */}
          <div className="space-y-2">
            {filteredDeeds.length === 0 ? (
              <div className="p-4 text-center text-[#8C6D62] text-xs">
                В этой категории пока нет записей
              </div>
            ) : (
              filteredDeeds.map((deed) => (
                <div
                  key={deed.id}
                  className="p-3 rounded-2xl bg-white/95 border border-[#E7D6C3] flex items-start gap-3 shadow-2xs hover:bg-white transition-all"
                >
                  {/* Cat Photo or Deed Icon */}
                  {deed.catPhoto ? (
                    <img
                      src={deed.catPhoto}
                      alt={deed.catName || deed.title}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E7D6C3] flex-shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl flex-shrink-0">
                      {deed.badgeIcon || '❤️'}
                    </div>
                  )}

                  {/* Deed Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <h4 className="font-bold text-[#3B2822] text-xs font-comfortaa">
                        {deed.title}
                      </h4>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded-md font-comfortaa">
                        +{deed.pointsEarned} баллов добра
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5A3E36] mt-0.5 leading-relaxed">
                      {deed.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#8C6D62] mt-1.5 pt-1 border-t border-[#F3E8DB]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>{deed.date}</span>
                      </span>

                      {deed.catName && onOpenCatProfile && (
                        <button
                          onClick={() => {
                            playPurrHaptic();
                            onOpenCatProfile(deed.catName!);
                          }}
                          className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 font-comfortaa"
                        >
                          <span>Профиль котика</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
