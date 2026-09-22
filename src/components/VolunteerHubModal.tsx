import React, { useState } from 'react';
import { SosTicket, CatProfile, UserRole, InfraPoint, SamaraDistrict } from '../types';
import { playPurrHaptic } from '../utils/haptics';
import { 
  X, 
  AlertTriangle, 
  Car, 
  HeartHandshake, 
  Calendar, 
  Plus, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Building2,
  Stethoscope
} from 'lucide-react';

interface VolunteerHubModalProps {
  tickets: SosTicket[];
  cats: CatProfile[];
  clinics?: InfraPoint[];
  userRole: UserRole;
  onClose: () => void;
  onTakeTicket: (ticketId: string, volunteerName: string) => void;
  onCreateTicket: (ticket: SosTicket) => void;
  onToggleFeedingSlot?: (catId: string, slot: 'morning' | 'evening') => void;
  onOpenClinicsList?: () => void;
  onOpenCaregiversHub?: () => void;
}

export const VolunteerHubModal: React.FC<VolunteerHubModalProps> = ({
  tickets,
  cats,
  clinics = [],
  userRole,
  onClose,
  onTakeTicket,
  onCreateTicket,
  onToggleFeedingSlot,
  onOpenClinicsList,
  onOpenCaregiversHub,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'auto_volunteers' | 'feeding' | 'new_ticket'>('tickets');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  // New ticket state
  const [newTitle, setNewTitle] = useState('');
  const [newDistrict, setNewDistrict] = useState<SamaraDistrict>('Самарский');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'medium'>('urgent');
  const [newCategory, setNewCategory] = useState<'injury' | 'trapping_osvv' | 'winter_cold' | 'kittens' | 'transport'>('injury');
  const [newDesc, setNewDesc] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPurrHaptic();
    const chosenClinic = clinics.find((c) => c.id === selectedClinicId);
    const created: SosTicket = {
      id: `sos-${Date.now()}`,
      title: newTitle.trim() || 'Срочная заявка волонтера',
      district: newDistrict,
      priority: newPriority,
      category: newCategory,
      description: newDesc.trim() || 'Срочная задача волонтерского хаба',
      route: newRoute.trim() || (chosenClinic ? `${newDistrict} → ${chosenClinic.name} (${chosenClinic.address})` : undefined),
      targetClinicId: chosenClinic?.id,
      targetClinicName: chosenClinic?.name,
      directClinicBillAccount: chosenClinic ? '40703810454400001290' : undefined,
      status: 'open',
      createdAt: 'Только что',
      targetFund: 'Самарский общественный фонд помощи животным',
    };
    onCreateTicket(created);
    setNewTitle('');
    setNewDesc('');
    setNewRoute('');
    setSelectedClinicId('');
    setActiveTab('tickets');
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl overflow-hidden my-auto border-2 border-[#E7D6C3] flex flex-col max-h-[90vh]">
        {/* Decorative Cat Ears atop modal */}
        <div className="absolute -top-3.5 left-10 w-7 h-7 bg-[#F3E8DB] rounded-tl-full border-t-2 border-l-2 border-[#E7D6C3] transform -rotate-12 pointer-events-none">
          <div className="absolute top-1 left-1 w-3 h-3 bg-[#FFB4C8] rounded-tl-full transform -rotate-12 opacity-85" />
        </div>
        <div className="absolute -top-3.5 left-18 w-7 h-7 bg-[#F3E8DB] rounded-tr-full border-t-2 border-r-2 border-[#E7D6C3] transform rotate-12 pointer-events-none">
          <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFB4C8] rounded-tr-full transform rotate-12 opacity-85" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#E7D6C3] bg-[#FAF2E8] texture-felt">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E11D48] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              🤝
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                Самарский координационный центр
              </div>
              <h2 className="text-base font-bold text-[#3B2822] leading-tight font-comfortaa">
                Волонтерский хаб и SOS-заявки
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C6D62] hover:text-[#3B2822] hover:bg-[#F3E8DB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b-2 border-[#E7D6C3] px-4 py-1.5 bg-[#FAF2E8] text-xs font-semibold overflow-x-auto no-scrollbar gap-1.5 font-comfortaa">
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('tickets');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'tickets' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS-тикеты ({tickets.filter(t => t.status === 'open').length})</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('auto_volunteers');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'auto_volunteers' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Автоволонтеры ({tickets.filter(t => t.route && t.status === 'open').length})</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('feeding');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'feeding' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Графики кормления</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('new_ticket');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'new_ticket' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Создать заявку</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'tickets' && (
            <>
              {/* Filter pills */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8C6D62] font-semibold text-[11px]">Приоритет:</span>
                  {(['all', 'urgent', 'high', 'medium'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        playPurrHaptic();
                        setFilterPriority(p);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        filterPriority === p ? 'bg-[#3B2822] text-white' : 'bg-[#FAF2E8] text-[#8C6D62] hover:bg-[#F3E8DB]'
                      }`}
                    >
                      {p === 'all' && 'Все'}
                      {p === 'urgent' && '🔴 Срочные'}
                      {p === 'high' && '🟠 Высокий'}
                      {p === 'medium' && '🟡 Обычный'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-cat Caregivers Service Banner */}
              {onOpenCaregiversHub && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl flex-shrink-0">🏡</span>
                    <div>
                      <div className="font-bold text-xs font-comfortaa text-amber-900">
                        Шефство над домашними мини-приютами Самары
                      </div>
                      <div className="text-[10px] text-amber-800 leading-tight">
                        Адресная доставка лечебных кормов, наполнителя и субботники для многокотовых опекунов
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCaregiversHub();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E08628] hover:from-[#E08628] hover:to-[#C97218] text-white font-bold text-[10px] font-comfortaa flex-shrink-0 transition-all active:scale-95 shadow-2xs"
                  >
                    Перейти к опекунам →
                  </button>
                </div>
              )}

              {/* Ticket Cards */}
              <div className="space-y-3">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border-2 border-[#E7D6C3] bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow fur-nap hover:border-[#D0B8A0] transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : t.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-800'
                          }`}>
                            {t.priority === 'urgent' && 'Срочно'}
                            {t.priority === 'high' && 'Высокий приоритет'}
                            {t.priority === 'medium' && 'Плановая задача'}
                          </span>
                          <span className="text-[#8C6D62] text-[10px]">
                            {t.district} · {t.createdAt}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#3B2822] text-sm mt-1 font-comfortaa">
                          {t.title}
                        </h3>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        t.status === 'open' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {t.status === 'open' ? 'Ищет волонтера' : 'В работе'}
                      </span>
                    </div>

                    <p className="text-[#6B4D44] leading-relaxed text-xs">
                      {t.description}
                    </p>

                    {/* Auto-volunteer route */}
                    {t.route && (
                      <div className="p-2.5 rounded-xl bg-[#F6EDE1] border border-[#E7D6C3] text-[#3B2822] flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#F59E42] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[11px] block">Маршрут автоволонтера:</span>
                          <span className="text-[11px] text-[#8C6D62]">{t.route}</span>
                        </div>
                      </div>
                    )}

                    {/* Transparent Direct Clinic Bill */}
                    {t.directClinicBillAccount && (
                      <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-950 flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-bold text-[11px] block text-teal-900">
                            {t.targetClinicName ? `Партнерская клиника: ${t.targetClinicName}` : 'Прозрачный сбор в клинику (без частных карт):'}
                          </span>
                          <span className="text-[11px] font-mono text-teal-800">
                            Депозитный счет: {t.directClinicBillAccount}
                          </span>
                          <span className="block text-[10px] text-teal-700">
                            Фонд: {t.targetFund}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#8C6D62] text-[11px]">
                        {t.assignedVolunteer ? `Экипаж: ${t.assignedVolunteer}` : 'Свободный тикет'}
                      </span>
                      {t.status === 'open' && (
                        <button
                          onClick={() => {
                            playPurrHaptic();
                            onTakeTicket(t.id, 'Вы (Самарский волонтер)');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Взять задачу в работу</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'auto_volunteers' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-start gap-2.5">
                <Car className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-xs">Диспетчерская автоволонтеров Самары</div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Срочная доставка травмированных и замерзающих кошек из дворов в партнерские круглосуточные ветклиники (на Ново-Садовой, Гагарина и Победы). Требуется наличие собственной автопереноски или коробки с теплой грелкой.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {tickets.filter(t => t.route).map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.priority === 'urgent' ? 'Срочный рейс' : 'Плановая перевозка'}
                      </span>
                      <span className="text-[11px] text-slate-400">{t.district}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-indigo-950 font-medium">
                      <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="text-xs">{t.route}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-[11px]">
                        {t.assignedVolunteer ? `Водитель: ${t.assignedVolunteer}` : 'Автомобиль не назначен'}
                      </span>
                      {t.status === 'open' ? (
                        <button
                          onClick={() => {
                            playPurrHaptic();
                            onTakeTicket(t.id, 'Вы (Автоволонтер Самары)');
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Car className="w-3.5 h-3.5" />
                          <span>Принять маршрут</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          Экипаж выехал
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'feeding' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-snug">
                🐾 <strong>Координация кормления по Самаре:</strong> графики позволяют избежать перекармливания котиков и прокисания еды в жару, а также обеспечивают стабильное поступление теплой воды и корма зимой.
              </div>

              <div className="space-y-2.5">
                {cats.filter(c => c.feedingSchedule).map((cat) => (
                  <div key={cat.id} className="p-3.5 rounded-2xl border-2 border-[#E7D6C3] bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={cat.photos[0]} alt="" className="w-8 h-8 rounded-full object-cover border border-[#E7D6C3]" />
                        <span className="font-bold text-[#3B2822] font-comfortaa">{cat.name} ({cat.district})</span>
                      </div>
                      <span className="text-[11px] text-[#8C6D62] font-medium">{cat.curatorName || 'Без куратора'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {/* Morning Slot */}
                      <button
                        type="button"
                        onClick={() => {
                          playPurrHaptic();
                          if (onToggleFeedingSlot) onToggleFeedingSlot(cat.id, 'morning');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                          cat.feedingSchedule?.morning.status === 'done'
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs'
                            : 'bg-[#FAF2E8] border-[#E7D6C3] text-[#5A3E36] hover:bg-[#F3E8DB]'
                        }`}
                      >
                        <div>
                          <span className="font-bold block font-comfortaa">Утро ({cat.feedingSchedule?.morning.time})</span>
                          <span className="text-[10px] text-[#8C6D62]">{cat.feedingSchedule?.morning.volunteer}</span>
                        </div>
                        <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                          cat.feedingSchedule?.morning.status === 'done'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {cat.feedingSchedule?.morning.status === 'done' ? '✅ Накормлен' : '⏳ Накормить'}
                        </span>
                      </button>

                      {/* Evening Slot */}
                      <button
                        type="button"
                        onClick={() => {
                          playPurrHaptic();
                          if (onToggleFeedingSlot) onToggleFeedingSlot(cat.id, 'evening');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                          cat.feedingSchedule?.evening.status === 'done'
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs'
                            : 'bg-[#FAF2E8] border-[#E7D6C3] text-[#5A3E36] hover:bg-[#F3E8DB]'
                        }`}
                      >
                        <div>
                          <span className="font-bold block font-comfortaa">Вечер ({cat.feedingSchedule?.evening.time})</span>
                          <span className="text-[10px] text-[#8C6D62]">{cat.feedingSchedule?.evening.volunteer}</span>
                        </div>
                        <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                          cat.feedingSchedule?.evening.status === 'done'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {cat.feedingSchedule?.evening.status === 'done' ? '✅ Накормлен' : '⏳ Накормить'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new_ticket' && (
            <form onSubmit={handleCreateTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-[#3B2822] font-semibold mb-1">
                  Заголовок заявки *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Котята в подвале на ул. Ленинградской"
                  className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] focus:outline-none focus:ring-2 focus:ring-[#F59E42]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#3B2822] font-semibold mb-1">
                    Район Самары
                  </label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] focus:outline-none focus:ring-2 focus:ring-[#F59E42]"
                  >
                    <option value="Самарский">Самарский</option>
                    <option value="Ленинский">Ленинский</option>
                    <option value="Октябрьский">Октябрьский</option>
                    <option value="Кировский (Безымянка)">Кировский (Безымянка)</option>
                    <option value="Промышленный">Промышленный</option>
                    <option value="Железнодорожный">Железнодорожный</option>
                    <option value="Советский">Советский</option>
                    <option value="Красноглинский">Красноглинский</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#3B2822] font-semibold mb-1">
                    Приоритет
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="urgent">🔴 Срочный (угроза жизни, травма)</option>
                    <option value="high">🟠 Высокий (отлов на ОСВВ)</option>
                    <option value="medium">🟡 Средний (утепление/корм)</option>
                  </select>
                </div>
              </div>

              {/* Clinic selector for hospitalisation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#3B2822] font-semibold flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                    Целевая партнерская ветеринарная клиника (госпитализация)
                  </label>
                  {onOpenClinicsList && (
                    <button
                      type="button"
                      onClick={() => {
                        playPurrHaptic();
                        onOpenClinicsList();
                      }}
                      className="text-emerald-800 hover:text-emerald-950 text-[11px] font-bold font-comfortaa"
                    >
                      Справочник клиник →
                    </button>
                  )}
                </div>
                <select
                  value={selectedClinicId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    setSelectedClinicId(cid);
                    const chosen = clinics.find((c) => c.id === cid);
                    if (chosen && !newRoute) {
                      setNewRoute(`${newDistrict} → ${chosen.name} (${chosen.address})`);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] focus:outline-none focus:ring-2 focus:ring-[#F59E42] text-xs"
                >
                  <option value="">Без предварительного бронирования клиники</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      🏥 {clinic.name} ({clinic.district}, {clinic.address})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#8C6D62] block mt-1">
                  При выборе клиники автоматически подставится маршрут автодоставки и будет прикреплен целевой депозитный счет клиники.
                </span>
              </div>

              <div>
                <label className="block text-[#3B2822] font-semibold mb-1">
                  Маршрут для автоволонтера (если требуется перевозка)
                </label>
                <input
                  type="text"
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  placeholder="Например: ул. Победы → Клиника на Ново-Садовой"
                  className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] focus:outline-none focus:ring-2 focus:ring-[#F59E42]"
                />
              </div>

              <div>
                <label className="block text-[#3B2822] font-semibold mb-1">
                  Описание ситуации и требуемой помощи *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Опишите состояние животного, точные ориентиры для волонтеров..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E7D6C3] bg-white text-[#3B2822] focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playPurrHaptic();
                    setActiveTab('tickets');
                  }}
                  className="px-4 py-2 rounded-xl border border-[#E7D6C3] font-semibold text-[#8C6D62] hover:bg-[#F3E8DB]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold transition-all shadow-xs font-comfortaa"
                >
                  Опубликовать в волонтерский чат
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
