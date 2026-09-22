import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CatProfile, UserRole } from '../types';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Heart, 
  CheckCircle2, 
  Eye, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Info,
  CalendarCheck,
  Building2,
  Stethoscope,
  Activity,
  Receipt,
  Share2,
  Copy,
  QrCode,
  Home,
  Send,
  HelpCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Shield,
  FileText
} from 'lucide-react';
import { playPurrHaptic, playMeowSound } from '../utils/haptics';
import { FluffyCatCard } from './FluffyCatCard';

interface CatPassportModalProps {
  cat: CatProfile;
  userRole: UserRole;
  onClose: () => void;
  onSightingReport: (
    catId: string,
    extra?: { condition: 'active' | 'resting' | 'eating' | 'alert'; note: string }
  ) => void;
  onBecomeCurator: (catId: string) => void;
  onToggleFeedingSlot: (catId: string, slot: 'morning' | 'evening') => void;
  onDonateTreatment?: (catId: string, amount: number) => void;
  onCreateSosTicket?: (cat: CatProfile, customReason?: string) => void;
  onOpenShelter?: (shelterId: string) => void;
  onOpenClinics?: () => void;
}

type TabType = 'overview' | 'health' | 'care' | 'sightings' | 'share';

export const CatPassportModal: React.FC<CatPassportModalProps> = ({
  cat,
  userRole,
  onClose,
  onSightingReport,
  onBecomeCurator,
  onToggleFeedingSlot,
  onDonateTreatment,
  onCreateSosTicket,
  onOpenShelter,
  onOpenClinics,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [sightingConfirmed, setSightingConfirmed] = useState(false);
  const [isSightingJumping, setIsSightingJumping] = useState(false);
  const [isDetailedJumping, setIsDetailedJumping] = useState(false);
  const [jumpBurstKey, setJumpBurstKey] = useState(0);
  const [curatorRequested, setCuratorRequested] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedChip, setCopiedChip] = useState(false);

  // Sub-modals inside the passport
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateAmount, setDonateAmount] = useState<number>(500);
  const [donateCustomAmount, setDonateCustomAmount] = useState('');
  const [donateSuccess, setDonateSuccess] = useState(false);

  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [adoptionName, setAdoptionName] = useState('');
  const [adoptionPhone, setAdoptionPhone] = useState('');
  const [adoptionHasNets, setAdoptionHasNets] = useState(true);
  const [adoptionExperience, setAdoptionExperience] = useState('');
  const [adoptionSuccess, setAdoptionSuccess] = useState(false);

  const [showSosModal, setShowSosModal] = useState(false);
  const [sosReasonInput, setSosReasonInput] = useState('');

  // Sighting form state
  const [newSightingCondition, setNewSightingCondition] = useState<'active' | 'resting' | 'eating' | 'alert'>('active');
  const [newSightingNote, setNewSightingNote] = useState('');
  const [sightingAddedSuccess, setSightingAddedSuccess] = useState(false);

  // Meow-morphism tactile states
  const [purrCount, setPurrCount] = useState(0);
  const [isNoseBooped, setIsNoseBooped] = useState(false);

  const handleBoopNose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPurrHaptic();
    playMeowSound();
    setIsNoseBooped(true);
    setPurrCount((prev) => prev + 1);
    setTimeout(() => setIsNoseBooped(false), 900);
  };

  const isCurator = userRole === 'verified_curator';

  const handleQuickSighting = () => {
    playPurrHaptic();
    playMeowSound();
    setIsSightingJumping(true);
    setJumpBurstKey((k) => k + 1);
    onSightingReport(cat.id);
    setSightingConfirmed(true);
    setTimeout(() => setIsSightingJumping(false), 700);
    setTimeout(() => setSightingConfirmed(false), 3500);
  };

  const handleDetailedSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPurrHaptic();
    playMeowSound();
    setIsDetailedJumping(true);
    onSightingReport(cat.id, {
      condition: newSightingCondition,
      note: newSightingNote.trim() || 'Котик замечен в привычном месте обитания.',
    });
    setNewSightingNote('');
    setSightingAddedSuccess(true);
    setTimeout(() => setIsDetailedJumping(false), 700);
    setTimeout(() => setSightingAddedSuccess(false), 3500);
  };

  const handleCurator = () => {
    onBecomeCurator(cat.id);
    setCuratorRequested(true);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = donateCustomAmount ? parseInt(donateCustomAmount, 10) : donateAmount;
    if (finalAmount > 0 && onDonateTreatment) {
      onDonateTreatment(cat.id, finalAmount);
      setDonateSuccess(true);
      setTimeout(() => {
        setDonateSuccess(false);
        setShowDonateModal(false);
      }, 1800);
    }
  };

  const handleAdoptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adoptionName || !adoptionPhone) return;
    playPurrHaptic();
    setAdoptionSuccess(true);
    setTimeout(() => {
      setAdoptionSuccess(false);
      setShowAdoptionModal(false);
    }, 2200);
  };

  const handleSosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPurrHaptic();
    if (onCreateSosTicket) {
      onCreateSosTicket(cat, sosReasonInput.trim());
    }
  };

  const copyTextSafe = (text: string, onSuccess: () => void) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        // Fallback for iframe restrictions
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
        } catch {}
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
      } catch {}
    }
  };

  const handleCopyLink = () => {
    copyTextSafe(window.location.href, () => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCopyChip = (chip: string) => {
    copyTextSafe(chip, () => {
      setCopiedChip(true);
      setTimeout(() => setCopiedChip(false), 2000);
    });
  };

  const temperamentLabels: Record<string, { label: string; bg: string; text: string }> = {
    friendly: { label: 'Ласковый, идет на ручки', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    shy: { label: 'Пугливый, близко не подходить', bg: 'bg-amber-50', text: 'text-amber-700' },
    strict: { label: 'Строгий, независимый характер', bg: 'bg-rose-50', text: 'text-rose-700' },
    wet_food_lover: { label: 'Обожает влажный корм / паштет', bg: 'bg-blue-50', text: 'text-blue-700' },
    calm: { label: 'Спокойный мудрый наблюдатель', bg: 'bg-purple-50', text: 'text-purple-700' },
  };

  const statusConfig = {
    sos: {
      badge: 'SOS / Нужна помощь',
      bg: 'bg-rose-600',
      lightBg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      desc: 'Котик травмирован или болен. Требуется ветеринарный осмотр или срочный автоволонтер.',
    },
    adoptable: {
      badge: 'Ищет дом & Семью',
      bg: 'bg-sky-600',
      lightBg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-800',
      desc: 'Готов к переезду в квартиру. Обработан, привит, социализирован.',
    },
    osvv: {
      badge: 'ОСВВ (Стерилизован)',
      bg: 'bg-emerald-600',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      desc: 'Прошел городскую программу «Отлов — Стерилизация — Вакцинация — Возврат». Имеет метку на ушке.',
    },
    resident: {
      badge: 'Постоянный житель двора',
      bg: 'bg-amber-600',
      lightBg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      desc: 'Любимец местных жителей, имеет стабильный график кормления и теплое укрытие.',
    },
    foster: {
      badge: 'На передержке',
      bg: 'bg-purple-600',
      lightBg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      desc: 'Временно проживает у волонтера в безопасности до момента пристройства.',
    },
  };

  const currentStatus = statusConfig[cat.status] || statusConfig.resident;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFF9F2] texture-parchment rounded-3xl shadow-2xl overflow-hidden my-auto border-2 border-[#E7D6C3] max-h-[92vh] flex flex-col fur-shadow">
        
        {/* Decorative Cat Ears atop modal */}
        <div className="absolute -top-3.5 left-10 w-8 h-8 bg-[#F3E8DB] texture-felt rounded-tl-full border-t-2 border-l-2 border-[#E7D6C3] transform -rotate-12 pointer-events-none">
          <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-[#FFB4C8] rounded-tl-full transform -rotate-12 opacity-85" />
        </div>
        <div className="absolute -top-3.5 left-20 w-8 h-8 bg-[#F3E8DB] texture-felt rounded-tr-full border-t-2 border-r-2 border-[#E7D6C3] transform rotate-12 pointer-events-none">
          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FFB4C8] rounded-tr-full transform rotate-12 opacity-85" />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-dashed border-[#E7D6C3] bg-[#FAF2E8] texture-felt flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3E8DB] texture-kraft stitch-seam border-2 border-[#E7D6C3] text-[#3B2822] flex items-center justify-center font-bold text-xl shadow-xs">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                  Цифровой паспорт кота
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8DB] texture-kraft border border-[#E7D6C3] text-[#5A3E36]">
                  {cat.district}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#3B2822] leading-tight flex items-center gap-2 font-comfortaa">
                <span>{cat.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${currentStatus.bg} shadow-2xs`}>
                  {currentStatus.badge}
                </span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playPurrHaptic();
                setActiveTab('share');
              }}
              className="p-2 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
              title="QR-код и печать"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              id="close-cat-modal-btn"
              onClick={() => {
                playPurrHaptic();
                onClose();
              }}
              className="p-2 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
              title="Закрыть паспорт"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-4 sm:px-5 border-b border-[#F3E8DB] bg-[#FFF9F2] texture-felt overflow-x-auto no-scrollbar gap-1 flex-shrink-0">
          {[
            { id: 'overview', label: 'Досье & Описание', icon: FileText },
            { id: 'health', label: 'Ветпаспорт & Лечение', icon: Stethoscope },
            { id: 'care', label: 'Опека & Кормление', icon: CalendarCheck },
            { id: 'sightings', label: `Журнал встреч (${cat.sightingsCount})`, icon: Eye },
            { id: 'share', label: 'QR & Поделиться', icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playPurrHaptic();
                  setActiveTab(tab.id as TabType);
                }}
                className={`py-3 px-3 text-xs font-bold font-comfortaa border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#F59E42] text-[#3B2822]'
                    : 'border-transparent text-[#8C6D62] hover:text-[#3B2822]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F59E42]' : 'text-[#8C6D62]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FFF9F2] texture-parchment">
          {/* TAB 1: OVERVIEW & DOSSIER */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Photo Carousel & Tactile Interactive Boop */}
              <div className="space-y-2">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#F3E8DB] texture-felt border-2 border-[#E7D6C3] shadow-inner">
                  <img
                    src={cat.photos[activePhotoIndex]}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-all"
                  />
                  
                  {/* Photo Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {cat.status === 'sos' ? (
                      <span className="stamp-sos text-xs">
                        🚨 SOS: Срочно
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${currentStatus.bg}`}>
                        {currentStatus.badge}
                      </span>
                    )}
                    {cat.treatmentStatus && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981] text-white shadow-md flex items-center gap-1 font-comfortaa">
                        🏥 Проходит лечение в клинике
                      </span>
                    )}
                  </div>

                  {/* Interactive Meow-morphism Boop & Scratch Button */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <button
                      onClick={handleBoopNose}
                      className={`relative px-3.5 py-2 rounded-2xl texture-jelly-pad text-white border-2 border-white/60 shadow-md font-bold text-xs flex items-center gap-2 active:scale-95 transition-all select-none font-comfortaa ${
                        isNoseBooped ? 'scale-105' : ''
                      }`}
                      title="Нажми, чтобы почесать за ушком и услышать мурчание"
                    >
                      <span className="text-base animate-tail">🐾</span>
                      <span>Почесать за ушком</span>
                      {purrCount > 0 && (
                        <span className="bg-white text-[#E11D48] text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                          +{purrCount}
                        </span>
                      )}
                    </button>

                    {isNoseBooped && (
                      <span className="text-xs bg-[#FF8EAB] text-white font-bold px-2.5 py-1 rounded-full shadow-md animate-bounce border border-white/50">
                        Мур-р-р! 💖
                      </span>
                    )}
                  </div>

                  {cat.photos.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          playPurrHaptic();
                          setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : cat.photos.length - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          playPurrHaptic();
                          setActivePhotoIndex((prev) => (prev < cat.photos.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {cat.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              playPurrHaptic();
                              setActivePhotoIndex(idx);
                            }}
                            className={`h-2 rounded-full transition-all ${
                              activePhotoIndex === idx ? 'bg-white w-5' : 'bg-white/50 w-2'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* EXIF Privacy Strip Notice */}
                <div className="flex items-center gap-2 px-3.5 py-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-[#065F46] text-xs">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#10B981]" />
                  <span>
                    <strong>Zero-Harm Privacy:</strong> EXIF GPS метаданные фото очищены сервером. Координаты защищены от живодеров и догхантеров.
                  </span>
                </div>
              </div>

              {/* Status Explanation Banner */}
              <div className={`p-3.5 rounded-2xl border ${currentStatus.lightBg} ${currentStatus.border} ${currentStatus.text} text-xs flex items-start gap-2.5`}>
                <span className="text-base flex-shrink-0">ℹ️</span>
                <div className="space-y-0.5">
                  <span className="font-bold block">Статус: {currentStatus.badge}</span>
                  <p className="leading-relaxed opacity-95">{currentStatus.desc}</p>
                </div>
              </div>

              {/* SOS Alert Highlight (if applicable) */}
              {cat.status === 'sos' && cat.sosReason && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Срочная карточка экстренной помощи (SOS)
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-600 text-white">
                      Приоритет: Высокий
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    {cat.sosReason}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowSosModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Откликнуться / Помочь коту</span>
                    </button>
                    {onOpenClinics && (
                      <button
                        onClick={onOpenClinics}
                        className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-semibold hover:bg-rose-100/50 transition-colors"
                      >
                        🏥 Дежурные клиники Самары
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Key Specs Bento Grid */}
              <div>
                <span className="text-[#8C6D62] block text-[10px] uppercase font-bold tracking-wider mb-2 font-comfortaa">
                  Метрики и характеристики
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3]">
                    <span className="text-[#8C6D62] block text-[10px] uppercase font-semibold">Возраст & Пол</span>
                    <span className="font-bold text-[#3B2822] mt-0.5 block">
                      {cat.estimatedAge} · {cat.gender === 'male' ? 'Кот (♂)' : cat.gender === 'female' ? 'Кошка (♀)' : 'Не указан'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3]">
                    <span className="text-[#8C6D62] block text-[10px] uppercase font-semibold">Вес & Телосложение</span>
                    <span className="font-bold text-[#3B2822] mt-0.5 block">
                      {cat.weightKg ? `${cat.weightKg} кг (норма)` : 'Примерно 4 кг'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3]">
                    <span className="text-[#8C6D62] block text-[10px] uppercase font-semibold">Окрас</span>
                    <span className="font-bold text-[#3B2822] mt-0.5 block truncate" title={cat.coat}>
                      {cat.coat}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3]">
                    <span className="text-[#8C6D62] block text-[10px] uppercase font-semibold">Район обитания</span>
                    <span className="font-bold text-[#3B2822] mt-0.5 block">
                      {cat.district}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3]">
                    <span className="text-[#8C6D62] block text-[10px] uppercase font-semibold">Микрочип / ОСВВ</span>
                    <span className="font-bold text-[#3B2822] mt-0.5 block font-mono text-[11px] truncate">
                      {cat.microchipNumber || '✂️ Метка на ушке'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF2E8] texture-cardboard stitch-seam border border-[#D5C2AF]">
                    <span className="text-[#8C6D62] block text-[10px] uppercase font-semibold">Зимний домик</span>
                    {cat.assignedShelterName ? (
                      <button
                        onClick={() => cat.assignedShelterId && onOpenShelter && onOpenShelter(cat.assignedShelterId)}
                        className="font-bold text-amber-900 hover:text-amber-950 text-left mt-0.5 block truncate hover:underline"
                        title={cat.assignedShelterName}
                      >
                        🛖 {cat.assignedShelterName}
                      </button>
                    ) : (
                      <span className="text-[#5A3E36] font-medium mt-0.5 block">Теплый подвал</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aliases & Names */}
              <div className="p-3.5 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3] space-y-1">
                <span className="text-[#8C6D62] block text-[10px] uppercase font-bold tracking-wider font-comfortaa">
                  Народные клички и имена во дворе
                </span>
                <p className="text-xs font-semibold text-[#3B2822]">
                  {cat.aliases.length > 0 ? cat.aliases.join(' • ') : 'Только официальное имя'}
                </p>
                <p className="text-[11px] text-[#8C6D62]">
                  Горожане разных домов могут звать котика по-своему, но в базе он зафиксирован под единым ID.
                </p>
              </div>

              {/* Special Marks */}
              <div>
                <span className="text-[#8C6D62] block text-[10px] uppercase font-bold tracking-wider mb-2 font-comfortaa">
                  Особые визуальные приметы
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.specialMarks.map((mark, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF2E8] text-[#5A3E36] border border-[#E7D6C3] text-xs font-semibold flex items-center gap-1.5 font-comfortaa shadow-2xs"
                    >
                      <span>✂️</span>
                      <span>{mark}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Temperament */}
              <div>
                <span className="text-[#8C6D62] block text-[10px] uppercase font-bold tracking-wider mb-2 font-comfortaa">
                  Повадки и социализация
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.temperament.map((t, idx) => {
                    const info = temperamentLabels[t] || { label: t, bg: 'bg-[#FAF2E8]', text: 'text-[#5A3E36]' };
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E7D6C3] ${info.bg} ${info.text} font-comfortaa shadow-2xs`}
                      >
                        🐾 {info.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Adoption Story (if available) */}
              {cat.adoptionStory && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-sky-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-900 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    История и характер от волонтеров
                  </div>
                  <p className="text-xs leading-relaxed text-sky-900">
                    {cat.adoptionStory}
                  </p>
                  <button
                    onClick={() => setShowAdoptionModal(true)}
                    className="mt-1 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Подать заявку на адопцию</span>
                  </button>
                </div>
              )}

              {/* Location & Safety Fuzzing info */}
              <div className="p-4 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] space-y-1.5 texture-kraft stitch-seam">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#3B2822] font-comfortaa">
                    <MapPin className="w-4 h-4 text-[#F59E42]" />
                    <span>Ориентир обитания в Самаре</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-comfortaa ${
                    isCurator ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {isCurator ? 'Кураторский доступ' : 'Zero-Harm Fuzzed'}
                  </span>
                </div>
                <p className="text-xs text-[#5A3E36] leading-relaxed font-medium">
                  {cat.addressApprox}
                </p>
                {isCurator ? (
                  <p className="text-[11px] text-emerald-800 font-mono font-semibold">
                    📍 Точные GPS координаты: {cat.realCoords[0].toFixed(5)}, {cat.realCoords[1].toFixed(5)}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#8C6D62] leading-snug">
                    🛡️ Публичный режим: гео-шум радиусом ~100 м скрывает точное расположение логова ради защиты от жестокого обращения.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VET PASSPORT & HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-5 animate-fade-in">
              {/* Active Clinical Treatment Block (if in treatment) */}
              {cat.treatmentStatus ? (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        🏥
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                          Партнерская ветклиника Самары
                        </div>
                        <div className="text-sm font-bold text-emerald-950">
                          {cat.treatmentStatus.clinicName}
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      {cat.treatmentStatus.stage === 'examination' && 'Диагностика & Анализы'}
                      {cat.treatmentStatus.stage === 'surgery' && 'Хирургия'}
                      {cat.treatmentStatus.stage === 'rehabilitation' && 'Стационар & Реабилитация'}
                      {cat.treatmentStatus.stage === 'ready_for_discharge' && 'Готов к выписке'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 border border-emerald-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Диагноз ветеринарного врача:</span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed font-medium">
                      {cat.treatmentStatus.diagnosis}
                    </p>
                    <div className="text-[11px] text-emerald-700">
                      Дата поступления: {cat.treatmentStatus.admissionDate}
                    </div>
                  </div>

                  {cat.treatmentStatus.estimatedCost && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-950">
                        <span>Собрано на лечение:</span>
                        <span className="font-bold font-mono">
                          {cat.treatmentStatus.collectedAmount || 0} ₽ из {cat.treatmentStatus.estimatedCost} ₽
                        </span>
                      </div>
                      <div className="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.round(((cat.treatmentStatus.collectedAmount || 0) / cat.treatmentStatus.estimatedCost) * 100))}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-emerald-800">
                        <span>Депозитный расчетный счет: {cat.treatmentStatus.billAccount || 'Прямой счет клиники'}</span>
                        <span className="font-bold">
                          {Math.round(((cat.treatmentStatus.collectedAmount || 0) / cat.treatmentStatus.estimatedCost) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowDonateModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Помочь оплатить лечение ({cat.treatmentStatus.clinicName.split(' ')[0]})</span>
                    </button>
                    {onOpenClinics && (
                      <button
                        onClick={onOpenClinics}
                        className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition-colors"
                      >
                        Подробнее о клинике
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    На данный момент стационарное лечение не требуется. Котик клинически здоров.
                  </span>
                </div>
              )}

              {/* Veterinary Records Table */}
              <div>
                <span className="text-[#8C6D62] block text-[10px] uppercase font-bold tracking-wider mb-2 font-comfortaa">
                  Электронная ветеринарная карточка
                </span>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3] flex items-start justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#3B2822] flex items-center gap-2">
                        <span>✂️ Стерилизация / Кастрация</span>
                        <span className="stamp-osvv text-[10px]">
                          ОСВВ: Пройдено
                        </span>
                      </div>
                      <p className="text-[#8C6D62] text-[11px]">
                        {cat.sterilizedInfo || 'Стерилизован по городской программе Самары.'}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3] flex items-start justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#3B2822] flex items-center gap-2">
                        <span>💉 Вакцинация (бешенство + панлейкопения)</span>
                        <span className="stamp-osvv text-[10px]">
                          Привит
                        </span>
                      </div>
                      <p className="text-[#8C6D62] text-[11px]">
                        {cat.vaccinationInfo || 'Вакцинирован комплексной вакциной с ревакцинацией.'}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF2E8] texture-kraft stitch-seam border border-[#E7D6C3] flex items-start justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#3B2822] flex items-center gap-2">
                        <span>🛡️ Обработка от паразитов</span>
                        <span className="stamp-osvv text-[10px]">
                          Регулярно
                        </span>
                      </div>
                      <p className="text-[#8C6D62] text-[11px]">
                        {cat.parasiteControl || 'Обработан каплями на холку (каждые 3 месяца).'}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  </div>

                  {cat.microchipNumber && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF2E8] texture-cardboard stitch-seam border border-[#D5C2AF] flex items-start justify-between gap-3 shadow-2xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#3B2822] flex items-center gap-1.5">
                          <span>🏷️ Микрочип (ISO 11784/11785)</span>
                        </div>
                        <p className="text-[#5A3E36] font-mono text-[11px] font-bold">
                          {cat.microchipNumber}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyChip(cat.microchipNumber!)}
                        className="px-2.5 py-1 rounded-xl bg-white/80 border border-[#D5C2AF] hover:bg-white text-[#3B2822] text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        {copiedChip ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedChip ? 'Скопирован' : 'Копировать'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Diet & Vet Nutrition Guide */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>Ветеринарная памятка безопасного питания в Самаре</span>
                </div>
                <p className="text-amber-900 leading-relaxed font-medium">
                  {cat.dietRecommendation || 'Рекомендован качественный сухой премиум-корм или мясные влажные паучи.'}
                </p>
                <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200 text-amber-950 text-[11px] space-y-1">
                  <div className="font-bold text-rose-700">
                    ⚠️ Смертельно опасно для уличных кошек Поволжья:
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    <li>Сырая речная рыба из Волги и Самарки — 100% риск заражения описторхозом.</li>
                    <li>Куриные и мясные трубчатые кости — перфорация пищевода и желудка.</li>
                    <li>Коровье магазинное молоко — вызывает диарею и обезвоживание.</li>
                    <li>Колбасные обрезки и сосиски со специями/солью — токсичны для почек кошек.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARE & FEEDING SCHEDULE */}
          {activeTab === 'care' && (
            <div className="space-y-5 animate-fade-in">
              {/* Curator Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Официальный опекун котика
                  </span>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{cat.hasCurator ? cat.curatorName : 'Опекун не закреплен'}</span>
                    {cat.hasCurator && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Под опекой
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {cat.hasCurator
                      ? 'Опекун контролирует вакцинацию, график кормления и готовность домика к зиме.'
                      : 'Вы можете стать опекуном этого котика и присматривать за ним.'}
                  </p>
                </div>
                {!cat.hasCurator && (
                  <button
                    onClick={handleCurator}
                    disabled={curatorRequested}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex-shrink-0"
                  >
                    {curatorRequested ? 'Заявка отправлена' : 'Стать опекуном'}
                  </button>
                )}
              </div>

              {/* Feeding Schedule for Today */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    График кормления на сегодня
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Качественный сухой корм + чистая теплая вода
                  </span>
                </div>

                {cat.feedingSchedule ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Morning Slot */}
                    <div className={`p-3.5 rounded-2xl border transition-all ${
                      cat.feedingSchedule.morning.status === 'done'
                        ? 'bg-emerald-50/80 border-emerald-200'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>☀️ Утреннее кормление</span>
                          <span className="text-xs font-mono font-normal text-slate-500">
                            ({cat.feedingSchedule.morning.time})
                          </span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cat.feedingSchedule.morning.status === 'done'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cat.feedingSchedule.morning.status === 'done' ? '✅ Накормлен' : '⏳ Ожидает'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mb-2.5">
                        Дежурный волонтер: <span className="font-semibold text-slate-800">{cat.feedingSchedule.morning.volunteer}</span>
                      </div>
                      <button
                        onClick={() => onToggleFeedingSlot(cat.id, 'morning')}
                        className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                          cat.feedingSchedule.morning.status === 'done'
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                        }`}
                      >
                        {cat.feedingSchedule.morning.status === 'done' ? 'Отметить как голодный' : 'Покормить кота сейчас'}
                      </button>
                    </div>

                    {/* Evening Slot */}
                    <div className={`p-3.5 rounded-2xl border transition-all ${
                      cat.feedingSchedule.evening.status === 'done'
                        ? 'bg-emerald-50/80 border-emerald-200'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>🌙 Вечернее кормление</span>
                          <span className="text-xs font-mono font-normal text-slate-500">
                            ({cat.feedingSchedule.evening.time})
                          </span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cat.feedingSchedule.evening.status === 'done'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cat.feedingSchedule.evening.status === 'done' ? '✅ Накормлен' : '⏳ Ожидает'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mb-2.5">
                        Дежурный волонтер: <span className="font-semibold text-slate-800">{cat.feedingSchedule.evening.volunteer}</span>
                      </div>
                      <button
                        onClick={() => onToggleFeedingSlot(cat.id, 'evening')}
                        className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                          cat.feedingSchedule.evening.status === 'done'
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                        }`}
                      >
                        {cat.feedingSchedule.evening.status === 'done' ? 'Отметить как голодный' : 'Покормить кота сейчас'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    График регулярного кормления пока формируется опекунами двора.
                  </div>
                )}
              </div>

              {/* Winter Shelter Connection */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <span className="text-base">🛖</span>
                    <span>Зимнее убежище и обогрев</span>
                  </div>
                  <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    Зима в Самаре (-25°C)
                  </span>
                </div>
                <p className="text-amber-900 leading-relaxed font-medium">
                  {cat.assignedShelterName
                    ? `Котик закреплен за зимним домиком: ${cat.assignedShelterName}. В домике поддерживается плюсовая температура с помощью безопасных нагревательных пластин 12V.`
                    : 'Котик укрывается в подвальных нишах с трубами отопления. Рекомендуется установить утепленный фанерный котодомик с сеном.'}
                </p>
                {cat.assignedShelterId && onOpenShelter && (
                  <button
                    onClick={() => onOpenShelter(cat.assignedShelterId!)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Перейти к паспорту котодомика</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SIGHTINGS JOURNAL */}
          {activeTab === 'sightings' && (
            <div className="space-y-5 animate-fade-in">
              {/* Form: Add Sighting */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>Зафиксировать встречу с котиком</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Всего отметок: {cat.sightingsCount}
                  </span>
                </div>

                <form onSubmit={handleDetailedSightingSubmit} className="space-y-3 text-xs">
                  {/* Condition radio selector */}
                  <div>
                    <label className="text-slate-600 block mb-1.5 text-[11px] font-semibold">
                      Состояние и активность котика в момент встречи:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'active', label: '🐾 Активен', desc: 'Гуляет, бегает' },
                        { id: 'resting', label: '😴 Отдыхает', desc: 'Спит в тепле' },
                        { id: 'eating', label: '🥣 Кушает', desc: 'У кормушки' },
                        { id: 'alert', label: '⚠️ Тревога', desc: 'Хромает/болен' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setNewSightingCondition(item.id as any)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            newSightingCondition === item.id
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xs">{item.label}</div>
                          <div className="text-[10px] opacity-80">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 text-[11px] font-semibold">
                      Заметка или ориентир (опционально):
                    </label>
                    <input
                      type="text"
                      placeholder="Например: грелся на солнышке у лавочки, покушал паштет..."
                      value={newSightingNote}
                      onChange={(e) => setNewSightingNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Отметка добавится в ваш личный Котодекс и ленту Самары.
                    </span>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.95, y: 3 }}
                      animate={
                        isDetailedJumping
                          ? {
                              y: [0, 4, -18, -22, -14, 3, -2, 0],
                              scaleX: [1, 1.15, 0.88, 0.92, 0.98, 1.12, 1],
                              scaleY: [1, 0.82, 1.20, 1.15, 1.08, 0.90, 1],
                              rotate: [0, -3, 3, -2, 0],
                            }
                          : { y: 0, scaleX: 1, scaleY: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer origin-bottom"
                    >
                      <motion.span
                        animate={isDetailedJumping ? { y: [0, -8, -12, 0], rotate: [-15, 15, 0], scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.65 }}
                      >
                        {sightingAddedSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                      </motion.span>
                      <span>{sightingAddedSuccess ? '🐾 Прыг! Принято' : 'Сохранить отметку'}</span>
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Feed of Sightings */}
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-2">
                  Хроника наблюдений горожан
                </span>
                <div className="space-y-2.5">
                  {cat.sightingsHistory && cat.sightingsHistory.length > 0 ? (
                    cat.sightingsHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.date} в {item.time}
                          </span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
                            {item.author}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {item.note}
                        </p>
                        <div className="pt-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.condition === 'eating'
                              ? 'bg-blue-50 text-blue-800'
                              : item.condition === 'resting'
                              ? 'bg-emerald-50 text-emerald-800'
                              : item.condition === 'alert'
                              ? 'bg-rose-50 text-rose-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {item.condition === 'eating' && '🥣 Кушал'}
                            {item.condition === 'resting' && '😴 Отдыхал'}
                            {item.condition === 'alert' && '⚠️ Тревожное состояние'}
                            {item.condition === 'active' && '🐾 Активен'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                      Будьте первым, кто оставит подробную отметку о встрече с этим котиком!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: QR & SHARE */}
          {activeTab === 'share' && (
            <div className="space-y-5 animate-fade-in">
              {/* Interactive Meow-morphic Squash & Stretch Card Preview */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#8C6D62] font-comfortaa flex items-center gap-1.5 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E42]" />
                  <span>Интерактивная открытка котика (нажмите или погладьте для Meow-отклика):</span>
                </div>
                <div className="py-1">
                  <FluffyCatCard
                    name={cat.name}
                    avatarUrl={cat.photos[0]}
                    coatType={cat.coat}
                    district={cat.district}
                    approxAge={cat.estimatedAge}
                    isSterilized={cat.status === 'osvv' || !!cat.sterilizedInfo}
                    status={cat.status}
                    onPurrAction={() => {
                      playPurrHaptic();
                    }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col items-center text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-md">
                  🐱
                </div>
                <div>
                  <h3 className="text-lg font-bold">{cat.name}</h3>
                  <p className="text-xs text-slate-400">
                    {cat.district} · {cat.coat} · {currentStatus.badge}
                  </p>
                </div>

                {/* Simulated QR Code Canvas */}
                <div className="p-4 rounded-2xl bg-white text-slate-950 shadow-inner flex flex-col items-center">
                  <div className="w-40 h-40 bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Stylized QR grid pattern */}
                    <div className="w-full h-full border-4 border-amber-400 rounded-lg p-1.5 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-white rounded-md p-1">
                          <div className="w-full h-full bg-slate-950 rounded-xs"></div>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-md p-1">
                          <div className="w-full h-full bg-slate-950 rounded-xs"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center font-bold text-xs text-slate-950 shadow-md">
                          🐾
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-white rounded-md p-1">
                          <div className="w-full h-full bg-slate-950 rounded-xs"></div>
                        </div>
                        <div className="w-6 h-6 border-2 border-white rounded-xs"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700 mt-2">
                    ID: {cat.id.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    kotokarta.samara.ru/cat/{cat.id}
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                  Отсканировав этот код с ошейника или уличного объявления, горожанин сразу откроет цифровой паспорт котика, проверит прививки и сможет сообщить куратору о встрече.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Ссылка скопирована' : 'Скопировать ссылку'}</span>
                  </button>
                  <button
                    onClick={() => window.print?.()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Печать карточки / Адресника</span>
                  </button>
                </div>
              </div>

              {/* Zero-Harm Reminder for Flyers */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Правило расклейки уличных объявлений в Самаре
                </span>
                <p className="leading-relaxed text-[11px]">
                  Не указывайте на печатных флаерах точные ориентиры лазов в подвал и время кормления. Это защищает кошачьи колонии от догхантеров и отравителей.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-3.5 sm:p-4 border-t-2 border-[#E7D6C3] bg-[#FAF2E8] flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#8C6D62]">
            <Clock className="w-3.5 h-3.5 text-[#8C6D62]" />
            <span>Видели: <strong className="text-[#3B2822]">{cat.lastSeen}</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Sighting Button with tactile Jump animation */}
            <div className="relative">
              <AnimatePresence>
                {isSightingJumping && (
                  <motion.div
                    key={jumpBurstKey}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [-8, -38, -48],
                      scale: [0.6, 1.2, 1],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.72, ease: 'easeOut' }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center whitespace-nowrap"
                  >
                    <span className="text-[11px] font-comfortaa font-bold bg-[#F59E42] text-white px-2.5 py-0.5 rounded-full shadow-lg border border-white/80 flex items-center gap-1">
                      <span>🐾 Прыг!</span>
                      <span className="text-[9px] opacity-90">+1 Встреча</span>
                    </span>
                    <div className="flex gap-1 mt-0.5 text-[9px]">
                      <span>✨</span>
                      <span>🐾</span>
                      <span>✨</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                id="saw-cat-today-btn"
                type="button"
                onClick={handleQuickSighting}
                disabled={sightingConfirmed}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.94, y: 3 }}
                animate={
                  isSightingJumping
                    ? {
                        // Тактильная физика прыжка кота:
                        // 1. Приседание/группировка перед прыжком (Squash)
                        // 2. Взрывной толчок лапками вверх (Jump)
                        // 3. Апекс прыжка в воздухе (Apex)
                        // 4. Мягкое приземление на лапки (Land impact squash)
                        // 5. Пружинящий возврат в исходное положение
                        y: [0, 4, -20, -24, -16, 3, -2, 0],
                        scaleX: [1, 1.16, 0.88, 0.94, 0.98, 1.14, 0.98, 1],
                        scaleY: [1, 0.82, 1.22, 1.15, 1.08, 0.88, 1.03, 1],
                        rotate: [0, -3, 3, -2, 1, 0],
                        boxShadow: [
                          '0 2px 4px rgba(245, 158, 66, 0.1)',
                          '0 1px 2px rgba(245, 158, 66, 0.05)',
                          '0 14px 24px rgba(245, 158, 66, 0.35)',
                          '0 18px 28px rgba(245, 158, 66, 0.4)',
                          '0 10px 16px rgba(245, 158, 66, 0.25)',
                          '0 2px 4px rgba(245, 158, 66, 0.15)',
                          '0 2px 4px rgba(245, 158, 66, 0.1)',
                        ],
                      }
                    : { y: 0, scaleX: 1, scaleY: 1, rotate: 0 }
                }
                transition={{
                  duration: 0.68,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold font-comfortaa flex items-center gap-1.5 transition-colors cursor-pointer select-none origin-bottom ${
                  sightingConfirmed
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#FFF9F2] border-2 border-[#E7D6C3] hover:border-[#F59E42] text-[#3B2822] shadow-xs'
                }`}
              >
                <motion.span
                  animate={
                    isSightingJumping
                      ? {
                          y: [0, 2, -12, -14, -8, 1, 0],
                          rotate: [0, -18, 20, -8, 0],
                          scale: [1, 0.85, 1.35, 1.25, 1.1, 0.95, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 0.68, ease: 'easeOut' }}
                  className="inline-flex items-center justify-center text-sm"
                >
                  {sightingConfirmed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : isSightingJumping ? (
                    '🐾'
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-[#F59E42]" />
                  )}
                </motion.span>
                <span>
                  {sightingConfirmed
                    ? 'Отметка принята!'
                    : isSightingJumping
                    ? 'Прыг! На месте 🐾'
                    : 'Видел сегодня'}
                </span>
              </motion.button>
            </div>

            {/* Adopt Button (if adoptable or resident) */}
            {(cat.status === 'adoptable' || cat.status === 'resident') && (
              <button
                onClick={() => setShowAdoptionModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Хочу приютить</span>
              </button>
            )}

            {/* SOS Help Button (if status is SOS) */}
            {cat.status === 'sos' && (
              <button
                onClick={() => setShowSosModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-all shadow-xs animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>SOS Помощь</span>
              </button>
            )}

            {/* Treatment Support Button (if in treatment) */}
            {cat.treatmentStatus && (
              <button
                onClick={() => setShowDonateModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Помочь клинике</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-MODAL 1: DONATE TO CLINIC TREATMENT */}
      {showDonateModal && cat.treatmentStatus && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#3B2822]/60 backdrop-blur-md animate-fade-in">
          <div className="relative bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-[#E7D6C3] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D6C3] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏥</span>
                <div>
                  <h3 className="font-bold text-[#3B2822] text-sm font-comfortaa">Помощь в лечении кота</h3>
                  <p className="text-[11px] text-[#8C6D62]">{cat.treatmentStatus.clinicName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="p-1 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {donateSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2 text-emerald-900 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm font-comfortaa">Спасибо за ваше доброе сердце!</h4>
                <p className="text-xs">
                  Пожертвование мгновенно зачислено на прямой расчетный счет в клинике для лечения {cat.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] space-y-1">
                  <div className="text-[11px] text-[#8C6D62]">Диагноз:</div>
                  <div className="font-semibold text-[#3B2822]">{cat.treatmentStatus.diagnosis}</div>
                  <div className="text-[10px] text-emerald-800 font-mono mt-1 font-bold">
                    Счет: {cat.treatmentStatus.billAccount || 'Прямой безналичный депозит ветклиники'}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#3B2822] block mb-1.5 font-comfortaa">
                    Выберите сумму пожертвования:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[200, 500, 1000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setDonateAmount(amt);
                          setDonateCustomAmount('');
                        }}
                        className={`py-2 rounded-xl font-bold border transition-all font-comfortaa ${
                          donateAmount === amt && !donateCustomAmount
                            ? 'bg-[#10B981] text-white border-[#10B981] shadow-xs'
                            : 'bg-white/80 text-[#3B2822] border-[#E7D6C3] hover:bg-[#FAF2E8]'
                        }`}
                      >
                        {amt} ₽
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#3B2822] block mb-1 font-comfortaa">
                    Или укажите другую сумму (₽):
                  </label>
                  <input
                    type="number"
                    placeholder="Например, 1500"
                    value={donateCustomAmount}
                    onChange={(e) => setDonateCustomAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] text-xs focus:ring-2 focus:ring-[#10B981] focus:outline-none"
                  />
                </div>

                <div className="text-[10px] text-[#8C6D62] leading-snug">
                  🛡️ Проект «Котокарта — Самара» не собирает средства на личные банковские карты. Все перечисления поступают напрямую в ветеринарную клинику.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDonateModal(false)}
                    className="px-3 py-2 rounded-xl text-[#8C6D62] font-semibold hover:bg-[#F3E8DB]"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold transition-all shadow-xs font-comfortaa"
                  >
                    Подтвердить перевод
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: ADOPTION APPLICATION */}
      {showAdoptionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#3B2822]/60 backdrop-blur-md animate-fade-in">
          <div className="relative bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-[#E7D6C3] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D6C3] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏡</span>
                <div>
                  <h3 className="font-bold text-[#3B2822] text-sm font-comfortaa">Анкета усыновителя</h3>
                  <p className="text-[11px] text-[#8C6D62]">Заявка на котика: {cat.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdoptionModal(false)}
                className="p-1 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adoptionSuccess ? (
              <div className="p-6 rounded-2xl bg-amber-50 text-center space-y-2 text-amber-950 border border-amber-200">
                <CheckCircle2 className="w-10 h-10 text-amber-600 mx-auto" />
                <h4 className="font-bold text-sm font-comfortaa">Заявка принята куратором!</h4>
                <p className="text-xs">
                  Куратор {cat.curatorName || 'приюта'} свяжется с вами в течение дня для знакомства с {cat.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdoptionSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-[#3B2822] block mb-1 font-comfortaa">
                    Ваше имя:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Мария С."
                    value={adoptionName}
                    onChange={(e) => setAdoptionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] text-xs focus:ring-2 focus:ring-[#F59E42] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3B2822] block mb-1 font-comfortaa">
                    Телефон или Telegram для связи:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+7 (927) ... или @username"
                    value={adoptionPhone}
                    onChange={(e) => setAdoptionPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] text-xs focus:ring-2 focus:ring-[#F59E42] focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adoptionHasNets}
                      onChange={(e) => setAdoptionHasNets(e.target.checked)}
                      className="mt-0.5 rounded text-[#F59E42] focus:ring-[#F59E42]"
                    />
                    <span className="text-[11px] text-[#5A3E36] font-medium leading-relaxed">
                      В квартире установлены защитные сетки <strong>«Антикошка»</strong> (или я готов(а) их установить до переезда котика).
                    </span>
                  </label>
                </div>

                <div>
                  <label className="font-bold text-[#3B2822] block mb-1 font-comfortaa">
                    Опыт содержания кошек (опционально):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Были ли у вас питомцы, есть ли другие животные дома..."
                    value={adoptionExperience}
                    onChange={(e) => setAdoptionExperience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] text-xs focus:ring-2 focus:ring-[#F59E42] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdoptionModal(false)}
                    className="px-3 py-2 rounded-xl text-[#8C6D62] font-semibold hover:bg-[#F3E8DB]"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E42] to-[#E08628] hover:from-[#E08628] hover:to-[#C97218] text-white font-bold transition-all shadow-xs font-comfortaa"
                  >
                    Отправить анкету куратору
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: EMERGENCY SOS ASSISTANCE */}
      {showSosModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#3B2822]/60 backdrop-blur-md animate-fade-in">
          <div className="relative bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-[#E7D6C3] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D6C3] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚨</span>
                <div>
                  <h3 className="font-bold text-[#3B2822] text-sm font-comfortaa">Срочный SOS-сигнал</h3>
                  <p className="text-[11px] text-[#8C6D62]">{cat.name} ({cat.district})</p>
                </div>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="p-1 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSosSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs leading-relaxed">
                Заявка поступит в оперативный волонтерский чат «Котопатруль Самары» для координации автоволонтеров и мягкого отлова.
              </div>

              <div>
                <label className="font-bold text-[#3B2822] block mb-1 font-comfortaa">
                  Что случилось / Какая помощь требуется:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Опишите травму, поведение, требуется ли автоволонтер с переноской в клинику..."
                  value={sosReasonInput || cat.sosReason || ''}
                  onChange={(e) => setSosReasonInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSosModal(false)}
                  className="px-3 py-2 rounded-xl text-[#8C6D62] font-semibold hover:bg-[#F3E8DB]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold transition-all shadow-xs font-comfortaa"
                >
                  Передать в Волонтерский хаб
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
