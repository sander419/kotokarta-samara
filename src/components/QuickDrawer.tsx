import React, { useState } from 'react';
import { CatProfile, InfraPoint } from '../types';
import { 
  ChevronRight, 
  Search, 
  ChevronDown, 
  MapPin, 
  Home, 
  Stethoscope, 
  X, 
  SlidersHorizontal,
  ExternalLink,
  ChevronUp,
  LayoutGrid,
  List
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';
import { FluffyCatCard } from './FluffyCatCard';

interface QuickDrawerProps {
  cats: CatProfile[];
  infraPoints: InfraPoint[];
  selectedCatId: string | null;
  onSelectCat: (cat: CatProfile) => void;
  onSelectInfra: (infra: InfraPoint) => void;
  onOpenClinics: () => void;
  onOpenVolunteerHub: () => void;
  onOpenCaregiversHub?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const QuickDrawer: React.FC<QuickDrawerProps> = ({
  cats,
  infraPoints,
  selectedCatId,
  onSelectCat,
  onSelectInfra,
  onOpenClinics,
  onOpenVolunteerHub,
  onOpenCaregiversHub,
  isOpen,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'cats' | 'shelters' | 'clinics'>('cats');
  const [catDisplayMode, setCatDisplayMode] = useState<'compact' | 'fluffy'>('compact');

  const filteredCats = cats.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.district.toLowerCase().includes(term) ||
      c.coat.toLowerCase().includes(term)
    );
  });

  const shelters = infraPoints.filter((i) => i.type === 'shelter');
  const clinics = infraPoints.filter((i) => i.type === 'vet_clinic');

  const filteredShelters = shelters.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.address.toLowerCase().includes(term);
  });

  const filteredClinics = clinics.filter((cl) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return cl.name.toLowerCase().includes(term) || cl.address.toLowerCase().includes(term);
  });

  const sosCount = cats.filter((c) => c.status === 'sos').length;

  return (
    <div
      className={`absolute bottom-4 left-4 z-20 transition-all duration-300 ease-out flex flex-col ${
        isOpen ? 'w-[calc(100vw-2rem)] sm:w-[410px] max-h-[75vh]' : 'w-auto'
      }`}
    >
      {!isOpen ? (
        <button
          onClick={() => {
            playPurrHaptic();
            onToggle();
          }}
          className="relative group flex items-center gap-2.5 px-4 py-2.5 bg-[#FFF9F2]/95 backdrop-blur-xl texture-parchment stitch-seam hover:bg-white text-[#3B2822] rounded-3xl shadow-[0_8px_30px_rgb(59,40,34,0.12)] border border-[#E7D6C3] transition-all hover:-translate-y-0.5 fur-shadow select-none"
        >
          {/* Decorative ears */}
          <div className="absolute -top-3 left-6 w-5 h-5 bg-[#F3E8DB] rounded-tl-full border-t border-l border-[#E7D6C3] transform -rotate-12 pointer-events-none group-hover:-rotate-18 transition-transform">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-[#FFB4C8] rounded-tl-full opacity-80" />
          </div>
          <div className="absolute -top-3 left-12 w-5 h-5 bg-[#F3E8DB] rounded-tr-full border-t border-r border-[#E7D6C3] transform rotate-12 pointer-events-none group-hover:rotate-18 transition-transform">
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB4C8] rounded-tr-full opacity-80" />
          </div>

          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E42] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E42]"></span>
          </span>
          <span className="text-xs font-bold text-[#3B2822] font-comfortaa">
            Реестр Самары ({cats.length})
          </span>
          {sosCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse shadow-xs">
              {sosCount} SOS
            </span>
          )}
          <ChevronUp className="w-4 h-4 text-[#8C6D62]" />
        </button>
      ) : (
        <div className="relative flex flex-col bg-[#FFF9F2]/95 backdrop-blur-2xl texture-parchment rounded-3xl shadow-[0_16px_40px_rgb(59,40,34,0.15)] border border-[#E7D6C3] overflow-hidden animate-fade-in text-xs fur-shadow">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3E8DB] bg-[#FAF2E8]/80">
            <div className="flex items-center gap-2">
              <span className="text-base">🐾</span>
              <h3 className="font-bold text-[#3B2822] text-sm font-comfortaa">
                Городской реестр Самары
              </h3>
            </div>
            <button
              onClick={() => {
                playPurrHaptic();
                onToggle();
              }}
              className="p-1 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Tabs */}
          <div className="p-3 border-b border-[#F3E8DB] bg-[#FFF9F2] space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D62]" />
              <input
                type="text"
                placeholder="Поиск по кличке, району, окрасу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 py-2 rounded-2xl border border-[#E7D6C3] bg-[#FAF2E8]/60 text-[#3B2822] placeholder-[#A68A7E] text-xs focus:outline-none focus:ring-2 focus:ring-[#F59E42] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C6D62] hover:text-[#3B2822]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Segmented control tabs */}
            <div className="flex items-center p-1 bg-[#FAF2E8] rounded-2xl border border-[#E7D6C3]/80">
              <button
                onClick={() => setActiveTab('cats')}
                className={`flex-1 py-1.5 rounded-xl font-bold font-comfortaa text-[11px] transition-all ${
                  activeTab === 'cats'
                    ? 'bg-[#3B2822] text-white shadow-xs'
                    : 'text-[#5A3E36] hover:text-[#3B2822]'
                }`}
              >
                Котики ({cats.length})
              </button>
              <button
                onClick={() => setActiveTab('shelters')}
                className={`flex-1 py-1.5 rounded-xl font-bold font-comfortaa text-[11px] transition-all ${
                  activeTab === 'shelters'
                    ? 'bg-[#965C38] text-white shadow-xs'
                    : 'text-[#5A3E36] hover:text-[#3B2822]'
                }`}
              >
                Домики ({shelters.length})
              </button>
              <button
                onClick={() => setActiveTab('clinics')}
                className={`flex-1 py-1.5 rounded-xl font-bold font-comfortaa text-[11px] transition-all ${
                  activeTab === 'clinics'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-[#5A3E36] hover:text-[#3B2822]'
                }`}
              >
                Клиники ({clinics.length})
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="overflow-y-auto max-h-80 p-2.5 space-y-2 bg-[#FFF9F2]">
            {activeTab === 'cats' && (
              <>
                {/* View Mode Switch for Cats */}
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-[11px] font-bold text-[#8C6D62] font-comfortaa">
                    Найдено: {filteredCats.length}
                  </span>
                  <div className="flex items-center gap-1 bg-[#FAF2E8] p-0.5 rounded-xl border border-[#E7D6C3]">
                    <button
                      onClick={() => setCatDisplayMode('compact')}
                      className={`p-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                        catDisplayMode === 'compact'
                          ? 'bg-[#3B2822] text-white shadow-xs'
                          : 'text-[#8C6D62] hover:text-[#3B2822]'
                      }`}
                      title="Компактный список"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Список</span>
                    </button>
                    <button
                      onClick={() => setCatDisplayMode('fluffy')}
                      className={`p-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                        catDisplayMode === 'fluffy'
                          ? 'bg-[#F59E42] text-[#3B2822] shadow-xs font-bold'
                          : 'text-[#8C6D62] hover:text-[#3B2822]'
                      }`}
                      title="Пушистые открытки со сминанием (Squash & Stretch)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Пушистые</span>
                    </button>
                  </div>
                </div>

                {filteredCats.length === 0 ? (
                  <div className="text-center py-6 text-[#8C6D62]">
                    Хвостатые не найдены
                  </div>
                ) : catDisplayMode === 'fluffy' ? (
                  <div className="space-y-3 pt-1">
                    {filteredCats.map((cat) => (
                      <FluffyCatCard
                        key={cat.id}
                        name={cat.name}
                        avatarUrl={cat.photos[0]}
                        coatType={cat.coat}
                        district={cat.district}
                        approxAge={cat.estimatedAge}
                        isSterilized={cat.status === 'osvv' || !!cat.sterilizedInfo}
                        status={cat.status}
                        onClickDetails={() => {
                          playPurrHaptic();
                          onSelectCat(cat);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  filteredCats.map((cat) => {
                    const isSelected = selectedCatId === cat.id;
                    const isEarTipped = cat.specialMarks?.some(
                      (m) => m.toLowerCase().includes('ушко') || m.toLowerCase().includes('освв')
                    ) || cat.status === 'osvv';

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          playPurrHaptic();
                          onSelectCat(cat);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border stitch-seam fur-nap ${
                          isSelected
                            ? 'border-[#F59E42] bg-[#FAF2E8] shadow-sm'
                            : 'border-[#E7D6C3] hover:border-[#D5C2AF] hover:bg-[#FAF2E8]/60 bg-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={cat.photos[0]}
                              alt={cat.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-[#E7D6C3]"
                            />
                            {cat.status === 'sos' && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full border-2 border-white animate-ping" />
                            )}
                            {cat.status === 'sos' && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full border-2 border-white" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-[#3B2822] truncate flex items-center gap-1.5 font-comfortaa">
                              <span className="text-xs sm:text-sm">{cat.name}</span>
                              {isEarTipped && (
                                <span className="text-[10px] text-emerald-700 font-bold" title="Стерилизован по программе ОСВВ">
                                  ✂️
                                </span>
                              )}
                              {cat.treatmentStatus && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                  В клинике
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-[#8C6D62] truncate">
                              <MapPin className="w-3 h-3 text-[#F59E42] flex-shrink-0" />
                              <span className="truncate">{cat.district}</span>
                              <span>·</span>
                              <span className="truncate">{cat.coat}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-[#A68A7E]">
                                Встреч: {cat.sightingsCount}
                              </span>
                              {cat.hasCurator && (
                                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                  ✓ Под опекой
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-comfortaa ${
                              cat.status === 'sos'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : cat.status === 'adoptable'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : cat.status === 'osvv'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : 'bg-[#FAF2E8] text-[#5A3E36] border border-[#E7D6C3]'
                            }`}
                          >
                            {cat.status === 'sos'
                              ? '⚠️ SOS'
                              : cat.status === 'adoptable'
                              ? 'Ищет дом'
                              : cat.status === 'osvv'
                              ? 'ОСВВ'
                              : 'Житель'}
                          </span>
                          <span className="text-[10px] text-[#F59E42] font-bold flex items-center gap-0.5">
                            <span>Паспорт</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'shelters' && (
              <>
                {filteredShelters.map((sh) => (
                  <div
                    key={sh.id}
                    onClick={() => {
                      playPurrHaptic();
                      onSelectInfra(sh);
                    }}
                    className="p-3 rounded-2xl border border-[#E7D6C3] hover:border-[#965C38] bg-white/70 hover:bg-[#FAF2E8] stitch-seam fur-nap cursor-pointer transition-all shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#3B2822] flex items-center gap-1.5 font-comfortaa text-xs">
                        <span>🛖</span>
                        <span>{sh.name}</span>
                      </h4>
                      {sh.isWinterHeated && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">
                          ❄️ Обогрев
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8C6D62] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#965C38]" />
                      <span>{sh.address}</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#5A3E36] pt-1 border-t border-[#F3E8DB]">
                      <span>Вместимость: до {sh.capacity || 6} котиков</span>
                      <span className="text-[#965C38] font-bold">На карте →</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'clinics' && (
              <>
                {filteredClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    onClick={() => {
                      playPurrHaptic();
                      onSelectInfra(clinic);
                    }}
                    className="p-3 rounded-2xl border border-[#E7D6C3] hover:border-emerald-500 bg-white/70 hover:bg-emerald-50/40 stitch-seam fur-nap cursor-pointer transition-all shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#3B2822] flex items-center gap-1.5 font-comfortaa text-xs truncate">
                        <span>🏥</span>
                        <span className="truncate">{clinic.name}</span>
                      </h4>
                      {clinic.clinicStatus ? (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                          clinic.clinicStatus.workload === 'open_admission'
                            ? 'bg-emerald-100 text-emerald-800'
                            : clinic.clinicStatus.workload === 'busy'
                            ? 'bg-orange-100 text-orange-800'
                            : clinic.clinicStatus.workload === 'emergency_only'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {clinic.clinicStatus.label}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          Партнер ОСВВ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8C6D62] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{clinic.address}</span>
                    </p>
                    {clinic.contactPhone && (
                      <div className="text-[10px] text-emerald-800 font-medium">
                        Тел: {clinic.contactPhone}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Quick Footer for Caregivers Hub */}
          {onOpenCaregiversHub && (
            <div className="p-2.5 border-t border-[#E7D6C3] bg-[#FAF2E8] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#5A3E36]">
                <span>🏡</span>
                <span className="font-bold font-comfortaa text-[11px]">Много кошек дома?</span>
              </div>
              <button
                onClick={() => {
                  playPurrHaptic();
                  onOpenCaregiversHub();
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] font-comfortaa shadow-2xs transition-all active:scale-95"
              >
                Шефство над опекунами
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
