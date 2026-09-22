import React, { useState } from 'react';
import { MultiCatCaregiver, SamaraDistrict, CaregiverNeedType, FosterCatBrief } from '../types';
import { 
  Heart, 
  Home, 
  MapPin, 
  ShoppingBag, 
  ShieldCheck, 
  Phone, 
  Send, 
  Calendar, 
  Car, 
  Sparkles, 
  Users, 
  Check, 
  Copy, 
  ExternalLink, 
  X, 
  AlertTriangle, 
  Package,
  PlusCircle,
  HelpCircle,
  Clock,
  Filter,
  Trophy,
  Award
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';
import { CaregiverRatingAndDeeds } from './CaregiverRatingAndDeeds';

interface CaregiversHubModalProps {
  caregivers: MultiCatCaregiver[];
  onClose: () => void;
  onOpenCatProfile?: (catName: string) => void;
}

export const CaregiversHubModal: React.FC<CaregiversHubModalProps> = ({
  caregivers,
  onClose,
  onOpenCatProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ratings' | 'food_bank' | 'adoption' | 'volunteering'>('catalog');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCaregiverForVolunteer, setSelectedCaregiverForVolunteer] = useState<MultiCatCaregiver | null>(null);
  
  // Volunteer signup form state
  const [volName, setVolName] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volType, setVolType] = useState<'subbotnik' | 'auto' | 'food_delivery' | 'photo'>('subbotnik');
  const [volSubmitted, setVolSubmitted] = useState(false);

  // New caregiver application form state
  const [applyName, setApplyName] = useState('');
  const [applyDistrict, setApplyDistrict] = useState<SamaraDistrict>('Самарский');
  const [applyAddress, setApplyAddress] = useState('');
  const [applyCatCount, setApplyCatCount] = useState('10');
  const [applySterilized, setApplySterilized] = useState('Все');
  const [applyNeeds, setApplyNeeds] = useState('Спецкорм и наполнитель');
  const [applyPhone, setApplyPhone] = useState('');
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Adoption inquiry state
  const [selectedCatForAdoption, setSelectedCatForAdoption] = useState<(FosterCatBrief & { caregiverName: string; district: string }) | null>(null);
  const [adoptInquirerName, setAdoptInquirerName] = useState('');
  const [adoptInquirerPhone, setAdoptInquirerPhone] = useState('');
  const [adoptInquirySent, setAdoptInquirySent] = useState(false);

  const filteredCaregivers = caregivers.filter((c) => {
    if (districtFilter !== 'all' && c.district !== districtFilter) return false;
    return true;
  });

  const handleCopyPvz = (id: string, text: string) => {
    playPurrHaptic();
    const onSuccess = () => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          onSuccess();
        } catch {
          onSuccess();
        }
      });
    } else {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        onSuccess();
      } catch {
        onSuccess();
      }
    }
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPurrHaptic();
    setVolSubmitted(true);
    setTimeout(() => {
      setVolSubmitted(false);
      setSelectedCaregiverForVolunteer(null);
      setVolName('');
      setVolPhone('');
    }, 2500);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPurrHaptic();
    setApplySubmitted(true);
    setTimeout(() => {
      setApplySubmitted(false);
      setShowApplyModal(false);
    }, 2500);
  };

  // Collect all foster cats ready for adoption
  const allFosterCats = caregivers.flatMap((cg) => 
    cg.cats.map((cat) => ({ ...cat, caregiverName: cg.name, district: cg.district }))
  );

  // Collect urgent food needs
  const allFoodNeeds = caregivers.flatMap((cg) => 
    cg.needs
      .filter((n) => n.type === 'food')
      .map((need) => ({ ...need, caregiver: cg }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/65 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl overflow-hidden my-auto border border-[#E7D6C3] flex flex-col max-h-[90vh]">
        
        {/* Decorative Cat Ears atop modal */}
        <div className="absolute -top-3.5 left-10 w-7 h-7 bg-[#F3E8DB] rounded-tl-full border-t border-l border-[#E7D6C3] transform -rotate-12 pointer-events-none">
          <div className="absolute top-1 left-1 w-3 h-3 bg-[#FFB4C8] rounded-tl-full opacity-80" />
        </div>
        <div className="absolute -top-3.5 left-20 w-7 h-7 bg-[#F3E8DB] rounded-tr-full border-t border-r border-[#E7D6C3] transform rotate-12 pointer-events-none">
          <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFB4C8] rounded-tr-full opacity-80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7D6C3] bg-[#FAF2E8]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-2xl shadow-xs">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                  Самарская сеть взаимной опеки
                </span>
                <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold">
                  Многокотовые семьи
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#3B2822] leading-tight font-comfortaa">
                Шефство над домашними мини-приютами
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playPurrHaptic();
                setShowApplyModal(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E08628] hover:from-[#E08628] hover:to-[#C97218] text-white font-bold text-xs font-comfortaa shadow-xs active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Я опекун / Нужна помощь</span>
            </button>
            <button
              onClick={() => {
                playPurrHaptic();
                onClose();
              }}
              className="p-1.5 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Intro Banner */}
        <div className="px-5 py-3 bg-[#FDF6ED] border-b border-[#E7D6C3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-[#5A3E36]">
            <Heart className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px] sm:text-xs">
              <strong>Кто такие многокотовые опекуны?</strong> Это неравнодушные жители Самары (пенсионеры, волонтёры, семьи), которые приютили у себя от 10 до 25+ спасённых уличных кошек. Они заботятся о них каждый день, но остро нуждаются в корме, наполнителях и мужских/женских руках для генеральных уборок.
            </p>
          </div>
          <button
            onClick={() => {
              playPurrHaptic();
              setShowApplyModal(true);
            }}
            className="sm:hidden w-full py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs font-comfortaa flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Заявка опекуна</span>
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-5 py-2.5 bg-[#FFF9F2] border-b border-[#E7D6C3] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 font-comfortaa overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                playPurrHaptic();
                setActiveTab('catalog');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs'
                  : 'bg-[#FAF2E8] text-[#5A3E36] hover:bg-[#F3E8DB]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Опекуны и приюты ({caregivers.length})</span>
            </button>
            <button
              onClick={() => {
                playPurrHaptic();
                setActiveTab('ratings');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ratings'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-[#FAF2E8] text-[#5A3E36] hover:bg-[#F3E8DB]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Кото-рейтинг и бейджи</span>
            </button>
            <button
              onClick={() => {
                playPurrHaptic();
                setActiveTab('food_bank');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'food_bank'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-[#FAF2E8] text-[#5A3E36] hover:bg-[#F3E8DB]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Кормовой банк ({allFoodNeeds.length})</span>
            </button>
            <button
              onClick={() => {
                playPurrHaptic();
                setActiveTab('adoption');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'adoption'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-[#FAF2E8] text-[#5A3E36] hover:bg-[#F3E8DB]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ищут семью ({allFosterCats.length})</span>
            </button>
            <button
              onClick={() => {
                playPurrHaptic();
                setActiveTab('volunteering');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'volunteering'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#FAF2E8] text-[#5A3E36] hover:bg-[#F3E8DB]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Субботники и авто</span>
            </button>
          </div>

          {/* District selector */}
          <div className="flex items-center gap-1.5 text-[11px] font-comfortaa">
            <span className="text-[#8C6D62] font-semibold">Район:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-2 py-1 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Все районы Самары</option>
              <option value="Самарский">Самарский</option>
              <option value="Ленинский">Ленинский</option>
              <option value="Октябрьский">Октябрьский</option>
              <option value="Кировский (Безымянка)">Кировский (Безымянка)</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-[#FFF9F2]">
          
          {/* TAB 1: CAREGIVERS CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              {filteredCaregivers.map((cg) => (
                <div
                  key={cg.id}
                  className="p-4 sm:p-5 rounded-3xl border border-[#E7D6C3] bg-white/80 hover:bg-white texture-parchment stitch-seam fur-shadow transition-all space-y-3.5 shadow-2xs"
                >
                  {/* Top: Avatar, Names, Verification Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={cg.avatarUrl}
                        alt={cg.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E7D6C3] shadow-xs flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold font-comfortaa">
                            {cg.district}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-bold font-comfortaa flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {cg.verifiedByFund}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#3B2822] text-base mt-1 font-comfortaa">
                          {cg.name}
                        </h3>
                        <p className="text-[11px] text-[#8C6D62] font-medium">
                          {cg.roleTitle} · {cg.addressApprox}
                        </p>
                      </div>
                    </div>

                    {/* Cat count pill */}
                    <div className="flex items-center sm:flex-col items-end gap-1 flex-shrink-0">
                      <div className="px-3 py-1.5 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] text-[#3B2822] font-comfortaa font-bold text-xs flex items-center gap-1.5">
                        <span>🐾</span>
                        <span>{cg.catCount} котиков под опекой</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        100% стерилизованы (ОСВВ)
                      </span>
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-[#5A3E36] leading-relaxed text-xs bg-[#FAF2E8]/60 p-3 rounded-2xl border border-[#E7D6C3]/60">
                    {cg.story}
                  </p>

                  {/* Koto-Rating, Badges & Collection of Good Deeds */}
                  <CaregiverRatingAndDeeds 
                    caregiver={cg} 
                    onOpenCatProfile={onOpenCatProfile} 
                  />

                  {/* Urgent Needs Section */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D62] font-comfortaa flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-600" />
                      <span>Текущие потребности мини-приюта ({cg.needs.length}):</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {cg.needs.map((need) => (
                        <div
                          key={need.id}
                          className={`p-3 rounded-2xl border text-xs space-y-2 flex flex-col justify-between ${
                            need.urgency === 'critical'
                              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                              : need.urgency === 'high'
                              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                              : 'bg-[#FAF2E8] border-[#E7D6C3] text-[#5A3E36]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold font-comfortaa text-xs flex items-center gap-1.5">
                                {need.type === 'food' && '🥣'}
                                {need.type === 'litter' && '📦'}
                                {need.type === 'hands' && '🧹'}
                                {need.type === 'transport' && '🚗'}
                                {need.type === 'vet_care' && '🩺'}
                                <span>{need.title}</span>
                              </span>
                              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                                need.urgency === 'critical'
                                  ? 'bg-rose-200 text-rose-900'
                                  : need.urgency === 'high'
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-stone-200 text-stone-800'
                              }`}>
                                {need.urgency === 'critical' ? 'Срочно' : need.urgency === 'high' ? 'Важно' : 'Планово'}
                              </span>
                            </div>
                            <p className="text-[11px] leading-snug opacity-90">
                              {need.description}
                            </p>
                          </div>

                          {/* Target and Actions */}
                          <div className="pt-2 border-t border-black/5 flex flex-wrap items-center justify-between gap-2">
                            {need.targetAmount && (
                              <span className="text-[10px] font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-black/5">
                                Цель: {need.targetAmount}
                              </span>
                            )}

                            {need.ozonPvzAddress && (
                              <button
                                onClick={() => handleCopyPvz(need.id, need.ozonPvzAddress!)}
                                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 shadow-2xs font-comfortaa ml-auto"
                              >
                                {copiedId === need.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-200" />
                                    <span>ПВЗ скопирован!</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>Заказать в Ozon ПВЗ</span>
                                  </>
                                )}
                              </button>
                            )}

                            {need.type === 'hands' && (
                              <button
                                onClick={() => {
                                  playPurrHaptic();
                                  setSelectedCaregiverForVolunteer(cg);
                                  setVolType('subbotnik');
                                }}
                                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 shadow-2xs font-comfortaa ml-auto"
                              >
                                <Users className="w-3 h-3" />
                                <span>Записаться помочь</span>
                              </button>
                            )}

                            {need.type === 'transport' && (
                              <button
                                onClick={() => {
                                  playPurrHaptic();
                                  setSelectedCaregiverForVolunteer(cg);
                                  setVolType('auto');
                                }}
                                className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 shadow-2xs font-comfortaa ml-auto"
                              >
                                <Car className="w-3 h-3" />
                                <span>Я на машине, помогу</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resident Cats Looking for homes (Mini preview) */}
                  {cg.cats.length > 0 && (
                    <div className="pt-2 border-t border-[#E7D6C3] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#8C6D62] font-comfortaa">
                          Ищут добрые руки из этой передержки:
                        </span>
                        <span className="text-[10px] text-amber-800 font-medium">
                          Забирая котика, вы разгружаете опекуна!
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {cg.cats.map((cat) => (
                          <div
                            key={cat.id}
                            className="flex items-center gap-2 p-2 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] flex-shrink-0 w-64 shadow-2xs"
                          >
                            <img
                              src={cat.photo}
                              alt={cat.name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#E7D6C3] flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-[#3B2822] text-xs font-comfortaa truncate">
                                  {cat.name}
                                </h4>
                                <span className="text-[10px] text-[#8C6D62]">{cat.age}</span>
                              </div>
                              <p className="text-[10px] text-[#6B4D44] line-clamp-1">
                                {cat.character}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                                  Стерилизован(а)
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Contact Bar */}
                  <div className="pt-2 border-t border-[#F3E8DB] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 text-[#8C6D62]">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Прием гостей/волонтеров: {cg.volunteeringDays?.join(' или ') || 'По договоренности'}</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      {cg.verifiedPhone && (
                        <a
                          href={`tel:${cg.verifiedPhone}`}
                          onClick={() => playPurrHaptic()}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span>{cg.verifiedPhone}</span>
                        </a>
                      )}
                      <button
                        onClick={() => {
                          playPurrHaptic();
                          setSelectedCaregiverForVolunteer(cg);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#3B2822] text-white font-bold font-comfortaa hover:bg-[#5A3E36] transition-colors"
                      >
                        Предложить помощь
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: CAREGIVER RATINGS & HONORS LEADERBOARD */}
          {activeTab === 'ratings' && (
            <div className="space-y-4 animate-fade-in">
              {/* Leaderboard Header Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base font-comfortaa">
                      Кото-рейтинг и Зал Славы кураторов Самары
                    </h3>
                    <p className="text-[11px] text-amber-100">
                      Открытый мониторинг спасённых жизней, закрытых SOS-тикетов и 100% учёта программ ОСВВ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/20 text-xs">
                  <div className="bg-black/15 p-2 rounded-xl">
                    <div className="text-[10px] text-amber-100">Всего спасено:</div>
                    <div className="font-black text-base font-comfortaa">
                      {filteredCaregivers.reduce((acc, c) => acc + (c.kotoRating?.rescuedTotal || 0), 0)} котиков
                    </div>
                  </div>
                  <div className="bg-black/15 p-2 rounded-xl">
                    <div className="text-[10px] text-amber-100">SOS-тикетов решено:</div>
                    <div className="font-black text-base font-comfortaa">
                      {filteredCaregivers.reduce((acc, c) => acc + (c.kotoRating?.closedSosTickets || 0), 0)}
                    </div>
                  </div>
                  <div className="bg-black/15 p-2 rounded-xl">
                    <div className="text-[10px] text-amber-100">Стерилизация ОСВВ:</div>
                    <div className="font-black text-base font-comfortaa">
                      {filteredCaregivers.reduce((acc, c) => acc + (c.kotoRating?.sterilizationCount || 0), 0)}
                    </div>
                  </div>
                  <div className="bg-black/15 p-2 rounded-xl">
                    <div className="text-[10px] text-amber-100">Пристроено в семьи:</div>
                    <div className="font-black text-base font-comfortaa">
                      {filteredCaregivers.reduce((acc, c) => acc + (c.kotoRating?.adoptedTotal || 0), 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* List of caregivers with their rating, badges & deeds */}
              <div className="space-y-4">
                {filteredCaregivers
                  .sort((a, b) => (b.kotoRating?.score || 0) - (a.kotoRating?.score || 0))
                  .map((cg, idx) => (
                    <div
                      key={cg.id}
                      className="p-4 sm:p-5 rounded-3xl border border-[#E7D6C3] bg-white texture-parchment stitch-seam fur-shadow space-y-3.5 shadow-2xs"
                    >
                      {/* Rank & Profile Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black font-comfortaa text-sm shadow-xs border ${
                            idx === 0
                              ? 'bg-amber-400 text-amber-950 border-amber-300'
                              : idx === 1
                              ? 'bg-stone-200 text-stone-800 border-stone-300'
                              : idx === 2
                              ? 'bg-amber-700 text-amber-100 border-amber-600'
                              : 'bg-[#FAF2E8] text-[#5A3E36] border-[#E7D6C3]'
                          }`}>
                            #{idx + 1}
                          </div>
                          <img
                            src={cg.avatarUrl}
                            alt={cg.name}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E7D6C3] shadow-xs flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold text-[#3B2822] text-sm font-comfortaa">
                                {cg.name}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-bold font-comfortaa">
                                {cg.kotoRating?.tier || 'Куратор'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8C6D62]">
                              {cg.roleTitle} · {cg.district}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:ml-auto">
                          <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs font-comfortaa">
                            {cg.kotoRating?.score || 700} баллов добра
                          </div>
                          <button
                            onClick={() => {
                              playPurrHaptic();
                              setSelectedCaregiverForVolunteer(cg);
                            }}
                            className="px-3 py-1 rounded-xl bg-[#3B2822] hover:bg-[#5A3E36] text-white font-bold text-xs font-comfortaa shadow-2xs transition-colors"
                          >
                            Помочь
                          </button>
                        </div>
                      </div>

                      {/* Embed the rating, animated badges and good deeds collection component */}
                      <CaregiverRatingAndDeeds
                        caregiver={cg}
                        onOpenCatProfile={onOpenCatProfile}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: CORM / FOOD BANK */}
          {activeTab === 'food_bank' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900 font-comfortaa">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  Как работает безопасная доставка корма через Ozon / Wildberries?
                </div>
                <p className="text-[11px] leading-relaxed">
                  Пожилым опекунам тяжело носить 10–15 кг мешки из магазинов, а пускать незнакомых людей в дом часто тревожно. 
                  Вы можете просто заказать нужный корм в указанный <strong>пункт выдачи (ПВЗ) рядом с домом опекуна</strong>.
                  Куратор фонда или волонтёр заберёт посылку и бережно доставит её прямо до двери бабушки.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allFoodNeeds.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl border border-[#E7D6C3] bg-white texture-parchment stitch-seam fur-shadow space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#8C6D62] uppercase tracking-wider font-comfortaa">
                          {item.caregiver.name} ({item.caregiver.district})
                        </span>
                        <h4 className="font-bold text-[#3B2822] text-sm mt-0.5 font-comfortaa">
                          {item.title}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        item.urgency === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.urgency === 'critical' ? 'Осталось на 2-3 дня' : 'Требуется пополнение'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5A3E36] leading-relaxed">
                      {item.description}
                    </p>

                    {item.recommendedBrands && (
                      <div className="p-2 rounded-xl bg-[#FAF2E8] border border-[#E7D6C3] space-y-1">
                        <span className="text-[10px] text-[#8C6D62] font-bold block">Рекомендованные марки:</span>
                        <div className="flex flex-wrap gap-1">
                          {item.recommendedBrands.map((b) => (
                            <span key={b} className="text-[10px] bg-white px-2 py-0.5 rounded-md text-[#3B2822] font-medium border border-[#E7D6C3]">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#F3E8DB] flex items-center justify-between gap-2">
                      <div className="text-[10px] text-[#8C6D62]">
                        {item.ozonPvzAddress && <span>ПВЗ: {item.ozonPvzAddress}</span>}
                      </div>

                      {item.ozonPvzAddress && (
                        <button
                          onClick={() => handleCopyPvz(item.id, item.ozonPvzAddress!)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E08628] hover:from-[#E08628] hover:to-[#C97218] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs font-comfortaa active:scale-95"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Адрес ПВЗ скопирован!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Скопировать адрес для Ozon</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADOPTION GALLERY */}
          {activeTab === 'adoption' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 font-comfortaa">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Пристройство — лучшая помощь домашним передержкам!
                </div>
                <p className="text-[11px] leading-relaxed">
                  Когда один подопечный находит любящую семью, у опекуна освобождается место, ресурсы и время для ухода за остальными кошками. Все котики полностью социализированы, здоровы и стерилизованы.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {allFosterCats.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-3xl border border-[#E7D6C3] bg-white texture-parchment stitch-seam fur-shadow flex flex-col justify-between space-y-3 shadow-2xs"
                  >
                    <div>
                      <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-2.5">
                        <img
                          src={cat.photo}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-emerald-700/90 text-white font-bold text-[10px] font-comfortaa backdrop-blur-xs">
                          Ищет дом
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 text-white font-medium text-[10px] backdrop-blur-xs">
                          {cat.caregiverName} ({cat.district})
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#3B2822] text-sm font-comfortaa">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] text-[#8C6D62] font-semibold">{cat.age}</span>
                      </div>

                      <p className="text-[11px] text-[#5A3E36] leading-relaxed mt-1">
                        {cat.character}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          ✓ Стерилизован(а)
                        </span>
                        {cat.healthStatus && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF2E8] text-[#6B4D44] border border-[#E7D6C3]">
                            {cat.healthStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playPurrHaptic();
                        setSelectedCatForAdoption(cat);
                        setAdoptInquirySent(false);
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs font-comfortaa active:scale-95 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Хочу познакомиться с {cat.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VOLUNTEERING & HANDS */}
          {activeTab === 'volunteering' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-[#FAF2E8] border border-[#E7D6C3] space-y-2 text-[#3B2822]">
                <h3 className="font-bold text-sm font-comfortaa flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Субботники «Чистый дом» и автопомощь в Самаре
                </h3>
                <p className="text-[11px] text-[#5A3E36] leading-relaxed">
                  Многие бабушки-опекуны в силу возраста или проблем со здоровьем не могут в одиночку мыть десятки кошачьих лотков, двигать мебель для дезинфекции пола или везти тяжелые переноски с котами через весь город в клинику на Ново-Садовую.
                  Ваши руки и свободный час времени — это неоценимая поддержка!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-3xl border border-[#E7D6C3] bg-white texture-parchment stitch-seam fur-shadow space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold">
                      🧹
                    </div>
                    <div>
                      <h4 className="font-bold text-xs font-comfortaa text-[#3B2822]">
                        Субботник «Чистый дом»
                      </h4>
                      <span className="text-[10px] text-[#8C6D62]">2-3 часа в выходной день</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-[#5A3E36] space-y-1.5 list-disc list-inside">
                    <li>Мытье и дезинфекция кошачьих лотков безопасными средствами</li>
                    <li>Влажная уборка когтеточек и комплексов от шерсти</li>
                    <li>Замена наполнителя и подъем тяжелых мешков на этаж</li>
                    <li>Смена сеток на окнах («Антикошка»)</li>
                  </ul>
                  <button
                    onClick={() => {
                      playPurrHaptic();
                      setSelectedCaregiverForVolunteer(caregivers[0]);
                      setVolType('subbotnik');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-comfortaa transition-all shadow-xs"
                  >
                    Записаться на ближайший субботник
                  </button>
                </div>

                <div className="p-4 rounded-3xl border border-[#E7D6C3] bg-white texture-parchment stitch-seam fur-shadow space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-lg font-bold">
                      🚗
                    </div>
                    <div>
                      <h4 className="font-bold text-xs font-comfortaa text-[#3B2822]">
                        Самарский авто-экипаж
                      </h4>
                      <span className="text-[10px] text-[#8C6D62]">Поездки в партнерские клиники</span>
                    </div>
                  </div>
                  <ul className="text-[11px] text-[#5A3E36] space-y-1.5 list-disc list-inside">
                    <li>Перевозка котиков в переносках на плановую вакцинацию и УЗИ</li>
                    <li>Доставка тяжелых партий корма из оптовых баз Самары</li>
                    <li>Маршруты: «Безымянка → Ново-Садовая», «Старый город → Революционная»</li>
                  </ul>
                  <button
                    onClick={() => {
                      playPurrHaptic();
                      setSelectedCaregiverForVolunteer(caregivers[1]);
                      setVolType('auto');
                    }}
                    className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs font-comfortaa transition-all shadow-xs"
                  >
                    Я водитель, готов помочь с перевозкой
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: VOLUNTEER SIGNUP FORM */}
      {selectedCaregiverForVolunteer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl p-5 border border-[#E7D6C3] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E7D6C3] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#3B2822] font-comfortaa">
                    Помощь опекуну {selectedCaregiverForVolunteer.name}
                  </h3>
                  <span className="text-[10px] text-[#8C6D62]">{selectedCaregiverForVolunteer.district}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCaregiverForVolunteer(null)}
                className="p-1 text-[#8C6D62] hover:text-[#3B2822]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {volSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-sm text-[#3B2822] font-comfortaa">
                  Спасибо за вашу отзывчивость!
                </h4>
                <p className="text-xs text-[#5A3E36]">
                  Куратор свяжется с вами по указанному телефону для согласования удобного времени.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    Тип помощи:
                  </label>
                  <select
                    value={volType}
                    onChange={(e: any) => setVolType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                  >
                    <option value="subbotnik">Субботник «Чистый дом» (уборка, лотки)</option>
                    <option value="auto">Автопомощь (поездка в клинику)</option>
                    <option value="food_delivery">Доставка тяжелого корма/наполнителя до двери</option>
                    <option value="photo">Фотосъемка котиков для пристройства</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    Ваше имя:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например, Анна"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    Контактный телефон / Telegram:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCaregiverForVolunteer(null)}
                    className="px-3 py-1.5 rounded-xl border border-[#E7D6C3] text-[#5A3E36] font-bold text-xs"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-xs font-comfortaa shadow-xs active:scale-95"
                  >
                    Отправить заявку
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CAREGIVER ASSISTANCE APPLICATION FORM */}
      {showApplyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl p-5 border border-[#E7D6C3] shadow-2xl space-y-3.5 my-auto">
            <div className="flex items-center justify-between border-b border-[#E7D6C3] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏡</span>
                <div>
                  <h3 className="font-bold text-sm text-[#3B2822] font-comfortaa">
                    Заявка на шефство и поддержку опекуна
                  </h3>
                  <span className="text-[10px] text-[#8C6D62]">
                    Для жителей Самары, у которых живёт много котиков
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 text-[#8C6D62] hover:text-[#3B2822]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {applySubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
                  🐾
                </div>
                <h4 className="font-bold text-sm text-[#3B2822] font-comfortaa">
                  Заявка принята в работу фонда!
                </h4>
                <p className="text-xs text-[#5A3E36] max-w-sm mx-auto">
                  Куратор самарской программы поддержки свяжется с вами для уточнения потребностей в корме, наполнителях и включения в график бесплатных квот ОСВВ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                <p className="text-[11px] text-[#5A3E36] leading-relaxed bg-[#FAF2E8] p-2.5 rounded-xl border border-[#E7D6C3]">
                  Если у вас дома живёт много спасённых кошек, либо вы знаете пожилого человека в своём подъезде, который содержит много животных и едва справляется — заполните эту форму.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                      Имя опекуна:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Имя / Имя Отчество"
                      value={applyName}
                      onChange={(e) => setApplyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                      Район Самары:
                    </label>
                    <select
                      value={applyDistrict}
                      onChange={(e: any) => setApplyDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                    >
                      <option value="Самарский">Самарский</option>
                      <option value="Ленинский">Ленинский</option>
                      <option value="Октябрьский">Октябрьский</option>
                      <option value="Кировский (Безымянка)">Кировский (Безымянка)</option>
                      <option value="Промышленный">Промышленный</option>
                      <option value="Советский">Советский</option>
                      <option value="Железнодорожный">Железнодорожный</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                      Сколько кошек под опекой:
                    </label>
                    <input
                      type="number"
                      min="3"
                      required
                      value={applyCatCount}
                      onChange={(e) => setApplyCatCount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                      Стерилизация (ОСВВ):
                    </label>
                    <select
                      value={applySterilized}
                      onChange={(e) => setApplySterilized(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                    >
                      <option value="Все">Все стерилизованы</option>
                      <option value="Частично">Частично (нужны квоты)</option>
                      <option value="Требуется">Требуется полная стерилизация</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    В чем самая острая потребность сейчас:
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Например: заканчивается корм при МКБ, тяжело поднимать наполнитель на 4 этаж без лифта, нужна помощь с уборкой."
                    value={applyNeeds}
                    onChange={(e) => setApplyNeeds(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    Контактный телефон для связи с куратором:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (846) ___ - __ - __"
                    value={applyPhone}
                    onChange={(e) => setApplyPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-3 py-1.5 rounded-xl border border-[#E7D6C3] text-[#5A3E36] font-bold text-xs"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#E08628] text-white font-bold text-xs font-comfortaa shadow-xs active:scale-95"
                  >
                    Подать заявку кураторам
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADOPTION CONTACT & MEET INQUIRY MODAL */}
      {selectedCatForAdoption && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl p-5 border border-[#E7D6C3] shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedCatForAdoption(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedCatForAdoption.photo}
                alt={selectedCatForAdoption.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 font-comfortaa">
                  Знакомство с подопечным
                </span>
                <h3 className="font-bold text-base text-[#3B2822] font-comfortaa">
                  Котик {selectedCatForAdoption.name}
                </h3>
                <p className="text-[11px] text-[#8C6D62]">
                  Опекун: {selectedCatForAdoption.caregiverName} ({selectedCatForAdoption.district})
                </p>
              </div>
            </div>

            {adoptInquirySent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm font-comfortaa">Заявка на знакомство отправлена!</h4>
                <p className="text-xs text-emerald-800">
                  Куратор {selectedCatForAdoption.caregiverName} свяжется с вами по указанному телефону, чтобы договориться о встрече или гостевом визите.
                </p>
                <button
                  onClick={() => setSelectedCatForAdoption(null)}
                  className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold font-comfortaa"
                >
                  Понятно, жду звонка
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  playPurrHaptic();
                  setAdoptInquirySent(true);
                }}
                className="space-y-3 text-xs"
              >
                <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 text-[11px] leading-relaxed">
                  🐈 <strong>Условия пристройства:</strong> передача животного по договору ответственного содержания, наличие сеток-антикошка на окнах и готовность ненавязчиво делиться приветами из дома.
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    Ваше имя:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Мария"
                    value={adoptInquirerName}
                    onChange={(e) => setAdoptInquirerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A3E36] mb-1 font-comfortaa">
                    Контактный телефон (Telegram / WhatsApp):
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={adoptInquirerPhone}
                    onChange={(e) => setAdoptInquirerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCatForAdoption(null)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#E7D6C3] text-[#5A3E36] font-bold text-xs"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs font-comfortaa shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Отправить куратору</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
