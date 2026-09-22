import React, { useState } from 'react';
import { InfraPoint, ClinicWorkloadStatus } from '../types';
import { 
  Phone, 
  ShieldCheck, 
  Heart, 
  Navigation,
  X,
  Clock,
  CalendarCheck,
  AlertCircle,
  Siren,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  BedDouble,
  Activity
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';

interface VetClinicsModalProps {
  clinics: InfraPoint[];
  selectedDistrict?: string;
  onClose: () => void;
  onSelectClinicForSos?: (clinic: InfraPoint) => void;
  onSelectOnMap?: (clinic: InfraPoint) => void;
}

export const VetClinicsModal: React.FC<VetClinicsModalProps> = ({
  clinics,
  selectedDistrict: initialDistrict = 'all',
  onClose,
  onSelectClinicForSos,
  onSelectOnMap,
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>(initialDistrict);
  const [statusFilter, setStatusFilter] = useState<'all' | ClinicWorkloadStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | '24h' | 'osvv' | 'xray'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Только что');
  // Local state map for dynamic real-time status and operational capacity updates
  const [dynamicClinicStatuses, setDynamicClinicStatuses] = useState<Record<string, {
    workload: ClinicWorkloadStatus;
    label: string;
    queueEstimateMinutes: number;
    occupiedBeds: number;
    totalBeds: number;
    updatedAt: string;
    notice?: string;
  }>>({});

  const handleRefresh = () => {
    playPurrHaptic();
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate real-time operational status updates from clinic telemetry
      const updatedMap: typeof dynamicClinicStatuses = {};
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      clinics.forEach((clinic) => {
        const total = clinic.clinicStatus?.totalBeds || clinic.capacity || 12;
        const currentOccupied = clinic.clinicStatus?.occupiedBeds ?? Math.floor(total * 0.6);
        // Slightly vary occupied beds (-1, 0, or +1)
        const shift = Math.floor(Math.random() * 3) - 1;
        const newOccupied = Math.max(1, Math.min(total, currentOccupied + shift));
        const occupancyRate = newOccupied / total;

        let workload: ClinicWorkloadStatus;
        let label: string;
        let queue: number;
        let notice: string | undefined;

        if (occupancyRate >= 0.85) {
          workload = 'busy';
          label = 'Загружена';
          queue = 40 + Math.floor(Math.random() * 25);
          notice = 'Высокая загрузка хирургии и стационара. Прием экстренных и по живой очереди.';
        } else if (occupancyRate >= 0.55) {
          workload = 'by_appointment';
          label = 'Принимает по записи';
          queue = 15 + Math.floor(Math.random() * 15);
          notice = 'Плановый прием и хирургия по предварительной записи. Есть слоты на сегодня.';
        } else {
          workload = 'open_admission';
          label = 'Свободный прием';
          queue = 5 + Math.floor(Math.random() * 10);
          notice = 'Дежурный врач свободен, быстрое оформление без ожидания.';
        }

        updatedMap[clinic.id] = {
          workload,
          label,
          queueEstimateMinutes: queue,
          occupiedBeds: newOccupied,
          totalBeds: total,
          updatedAt: `Обновлено в ${nowFormatted}`,
          notice: notice || clinic.clinicStatus?.notice
        };
      });

      setDynamicClinicStatuses(updatedMap);
      setLastRefreshedAt(`Обновлено в ${nowFormatted}`);
      setIsRefreshing(false);
    }, 500);
  };

  const getEffectiveStatus = (clinic: InfraPoint) => {
    const dyn = dynamicClinicStatuses[clinic.id];
    if (dyn) {
      return {
        workload: dyn.workload,
        label: dyn.label,
        queueEstimateMinutes: dyn.queueEstimateMinutes,
        freeSurgeon: clinic.clinicStatus?.freeSurgeon ?? true,
        freeOsvvSlotsToday: clinic.clinicStatus?.freeOsvvSlotsToday ?? 2,
        updatedAt: dyn.updatedAt,
        notice: dyn.notice,
        occupiedBeds: dyn.occupiedBeds,
        totalBeds: dyn.totalBeds,
      };
    }
    return clinic.clinicStatus;
  };

  const filteredClinics = clinics.filter((c) => {
    if (districtFilter !== 'all' && c.district !== districtFilter) return false;
    
    const effStatus = getEffectiveStatus(c);
    // Status filter
    if (statusFilter !== 'all' && effStatus?.workload !== statusFilter) return false;

    // Service filters
    if (serviceFilter === '24h' && !c.description.toLowerCase().includes('круглосуточ')) return false;
    if (serviceFilter === 'osvv' && !c.description.toLowerCase().includes('освв')) return false;
    if (serviceFilter === 'xray' && !c.description.toLowerCase().includes('рентген') && !c.description.toLowerCase().includes('травм')) return false;
    
    return true;
  });

  const getStatusBadge = (status?: { workload: ClinicWorkloadStatus; label: string; queueEstimateMinutes?: number }) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FAF2E8] text-[#8C6D62] border border-[#E7D6C3]">
          <Clock className="w-3.5 h-3.5" />
          <span>Статус уточняется</span>
        </span>
      );
    }

    switch (status.workload) {
      case 'open_admission':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-comfortaa">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{status.label}</span>
            {status.queueEstimateMinutes !== undefined && (
              <span className="text-emerald-700 font-normal">· ~{status.queueEstimateMinutes} мин</span>
            )}
          </span>
        );
      case 'by_appointment':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs font-comfortaa">
            <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{status.label}</span>
            {status.queueEstimateMinutes !== undefined && (
              <span className="text-amber-700 font-normal">· ожидание ~{status.queueEstimateMinutes} мин</span>
            )}
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-orange-50 text-orange-900 border border-orange-300 shadow-2xs font-comfortaa">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>{status.label}</span>
            {status.queueEstimateMinutes !== undefined && (
              <span className="text-orange-700 font-normal">· очередь ~{status.queueEstimateMinutes} мин</span>
            )}
          </span>
        );
      case 'emergency_only':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-50 text-rose-900 border border-rose-300 shadow-2xs font-comfortaa">
            <Siren className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>{status.label}</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-300">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>Закрыта</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Helper component for clinic capacity badge & mini visual bar
  const renderCapacityBadge = (clinic: InfraPoint) => {
    const eff = getEffectiveStatus(clinic);
    const total = eff?.totalBeds || clinic.clinicStatus?.totalBeds || clinic.capacity || 10;
    const occupied = eff?.occupiedBeds !== undefined
      ? eff.occupiedBeds
      : (clinic.clinicStatus?.occupiedBeds !== undefined
        ? clinic.clinicStatus.occupiedBeds
        : clinic.residentsCatIds?.length || Math.round(total * 0.5));
    const available = Math.max(0, total - occupied);
    const percentage = Math.min(100, Math.round((occupied / total) * 100));

    let capacityColorClass = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    let progressColor = 'bg-emerald-500';
    let statusLabel = 'Свободно';

    if (percentage >= 90) {
      capacityColorClass = 'text-rose-900 bg-rose-50 border-rose-300';
      progressColor = 'bg-rose-500';
      statusLabel = 'Почти заполнено';
    } else if (percentage >= 65) {
      capacityColorClass = 'text-amber-900 bg-amber-50 border-amber-300';
      progressColor = 'bg-amber-500';
      statusLabel = 'Средняя загрузка';
    }

    return (
      <div className={`p-2.5 rounded-2xl border ${capacityColorClass} flex flex-col gap-1.5`}>
        <div className="flex items-center justify-between text-[11px] font-comfortaa">
          <div className="flex items-center gap-1.5 font-bold">
            <BedDouble className="w-3.5 h-3.5" />
            <span>Вместимость стационара:</span>
            <span className="font-mono text-xs">{occupied}/{total} мест</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/90 border border-current shadow-2xs">
            {available > 0 ? `${available} своб.` : 'Мест нет'} ({statusLabel})
          </span>
        </div>

        {/* Visual progress bar */}
        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden flex p-0.5">
          <div
            className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl overflow-hidden my-auto border border-[#E7D6C3] flex flex-col max-h-[88vh]">
        
        {/* Decorative Cat Ears atop modal */}
        <div className="absolute -top-3 left-10 w-6 h-6 bg-[#F3E8DB] rounded-tl-full border-t border-l border-[#E7D6C3] transform -rotate-12 pointer-events-none">
          <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-[#FFB4C8] rounded-tl-full opacity-80" />
        </div>
        <div className="absolute -top-3 left-18 w-6 h-6 bg-[#F3E8DB] rounded-tr-full border-t border-r border-[#E7D6C3] transform rotate-12 pointer-events-none">
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB4C8] rounded-tr-full opacity-80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7D6C3] bg-[#FAF2E8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xl shadow-xs">
              🏥
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                Самарская сеть заботы и ОСВВ
              </div>
              <h2 className="text-base font-bold text-[#3B2822] leading-tight font-comfortaa">
                Партнерские ветеринарные клиники
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/80 border border-[#E7D6C3] text-[10px] text-[#8C6D62] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{lastRefreshedAt}</span>
            </div>
            <button
              onClick={handleRefresh}
              title="Обновить актуальный статус приема клиник"
              className={`p-1.5 rounded-xl border border-[#E7D6C3] bg-[#FFF9F2] text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-all flex items-center gap-1 text-[11px] font-bold font-comfortaa ${
                isRefreshing ? 'rotate-180' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F59E42]' : ''}`} />
              <span className="hidden sm:inline">Обновить</span>
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

        {/* Filter Area */}
        <div className="px-5 py-3 border-b border-[#E7D6C3] bg-[#FFF9F2] flex flex-col gap-2.5 text-xs">
          {/* Row 1: District and Service Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8C6D62] font-bold font-comfortaa text-[11px]">Район:</span>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-2.5 py-1 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] font-semibold focus:outline-none focus:ring-2 focus:ring-[#F59E42]"
              >
                <option value="all">Все районы Самары</option>
                <option value="Ленинский">Ленинский</option>
                <option value="Самарский">Самарский</option>
                <option value="Октябрьский">Октябрьский</option>
                <option value="Кировский (Безымянка)">Кировский (Безымянка)</option>
                <option value="Промышленный">Промышленный</option>
              </select>
            </div>

            {/* Quick capability tags */}
            <div className="flex items-center gap-1 font-comfortaa text-[11px] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  serviceFilter === 'all'
                    ? 'bg-[#3B2822] text-[#FFF9F2]'
                    : 'bg-[#FAF2E8] text-[#6B4D44] hover:bg-[#F3E8DB]'
                }`}
              >
                Все типы
              </button>
              <button
                onClick={() => setServiceFilter('24h')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  serviceFilter === '24h'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FAF2E8] text-[#6B4D44] hover:bg-[#F3E8DB]'
                }`}
              >
                🌙 24/7
              </button>
              <button
                onClick={() => setServiceFilter('osvv')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  serviceFilter === 'osvv'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FAF2E8] text-[#6B4D44] hover:bg-[#F3E8DB]'
                }`}
              >
                ✂️ Квоты ОСВВ
              </button>
              <button
                onClick={() => setServiceFilter('xray')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  serviceFilter === 'xray'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FAF2E8] text-[#6B4D44] hover:bg-[#F3E8DB]'
                }`}
              >
                🦴 Рентген
              </button>
            </div>
          </div>

          {/* Row 2: Live Workload Status Filter */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#F3E8DB] overflow-x-auto no-scrollbar text-[11px] font-comfortaa">
            <span className="text-[#8C6D62] font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
              Статус приема:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#3B2822] text-white shadow-2xs'
                  : 'bg-[#FAF2E8] text-[#8C6D62] hover:bg-[#F3E8DB]'
              }`}
            >
              Любой
            </button>
            <button
              onClick={() => setStatusFilter('open_admission')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'open_admission'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Свободный прием</span>
            </button>
            <button
              onClick={() => setStatusFilter('by_appointment')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'by_appointment'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>📅 По записи</span>
            </button>
            <button
              onClick={() => setStatusFilter('busy')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'busy'
                  ? 'bg-orange-700 text-white shadow-2xs'
                  : 'bg-orange-50 text-orange-900 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <span>⏳ Загружена</span>
            </button>
            <button
              onClick={() => setStatusFilter('emergency_only')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'emergency_only'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span>🚨 Только экстренные</span>
            </button>
          </div>
        </div>

        {/* Zero-Scam Trust Banner */}
        <div className="mx-5 mt-3 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-snug">
            <span className="font-bold block text-emerald-900 font-comfortaa">
              Прямой депозитный расчетный счет клиники
            </span>
            <span className="text-emerald-800 text-[11px] block">
              Все клиники имеют договор с кураторской сетью Самары. Оплата лечения производится строго на безналичный счёт клиники без сбора на личные банковские карты.
            </span>
          </div>
        </div>

        {/* Clinics List */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs bg-[#FFF9F2]">
          {filteredClinics.length === 0 ? (
            <div className="text-center py-10 text-[#8C6D62] font-comfortaa space-y-1">
              <p className="font-bold text-sm">Клиник с выбранными параметрами не найдено</p>
              <p className="text-[11px]">Попробуйте сбросить фильтры района или статуса приема.</p>
            </div>
          ) : (
            filteredClinics.map((clinic) => {
              const effStatus = getEffectiveStatus(clinic);
              return (
              <div
                key={clinic.id}
                className="p-4 rounded-3xl border border-[#E7D6C3] bg-white/70 hover:bg-white texture-parchment stitch-seam fur-shadow hover:border-[#10B981] transition-all space-y-3 shadow-2xs"
              >
                {/* Header row: Name, District & Phone */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg bg-[#FAF2E8] text-[#5A3E36] text-[10px] font-bold border border-[#E7D6C3] font-comfortaa">
                        {clinic.district}
                      </span>
                      <span className="text-[#8C6D62] text-[11px]">
                        {clinic.address}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#3B2822] text-sm mt-1 font-comfortaa">
                      {clinic.name}
                    </h3>
                  </div>

                  {clinic.contactPhone && (
                    <a
                      href={`tel:${clinic.contactPhone}`}
                      onClick={() => playPurrHaptic()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors flex-shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{clinic.contactPhone}</span>
                    </a>
                  )}
                </div>

                {/* Live Status Container */}
                {effStatus && (
                  <div className="p-3 rounded-2xl bg-[#FAF2E8]/80 border border-[#E7D6C3] space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(effStatus)}
                        {effStatus.freeOsvvSlotsToday !== undefined && effStatus.freeOsvvSlotsToday > 0 && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-lg border border-emerald-300">
                            ✂️ Квоты ОСВВ: {effStatus.freeOsvvSlotsToday}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8C6D62] font-mono flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#F59E42]" />
                        <span>{effStatus.updatedAt}</span>
                      </span>
                    </div>

                    {/* Visual Capacity Badge with Progress Indicator */}
                    {renderCapacityBadge(clinic)}

                    {effStatus.notice && (
                      <p className="text-[11px] text-[#6B4D44] leading-relaxed pt-1 border-t border-[#E7D6C3]/60">
                        {effStatus.notice}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-[#5A3E36] leading-relaxed text-xs">
                  {clinic.description}
                </p>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-lg bg-[#FAF2E8] text-[#5A3E36] font-medium border border-[#E7D6C3]">
                    🏥 Стационар
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                    ✓ Скидка до 35% волонтерам
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                    💳 Целевой депозитный счет
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#F3E8DB] flex items-center justify-between gap-2">
                  {onSelectOnMap && (
                    <button
                      onClick={() => {
                        playPurrHaptic();
                        onSelectOnMap(clinic);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-[#E7D6C3] text-[#5A3E36] hover:bg-[#FAF2E8] font-bold text-xs flex items-center gap-1.5 transition-colors font-comfortaa"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#8C6D62]" />
                      <span>На карте</span>
                    </button>
                  )}

                  {onSelectClinicForSos && (
                    <button
                      onClick={() => {
                        playPurrHaptic();
                        onSelectClinicForSos(clinic);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs ml-auto font-comfortaa text-xs active:scale-95"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Выбрать для госпитализации</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
};
