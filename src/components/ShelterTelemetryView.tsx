import React, { useState } from 'react';
import { InfraPoint, CatProfile } from '../types';
import { 
  Thermometer, 
  BatteryCharging, 
  Flame, 
  Calendar, 
  Utensils, 
  ShieldCheck 
} from 'lucide-react';

interface ShelterTelemetryViewProps {
  shelter: InfraPoint;
  residentCats: CatProfile[];
  onOpenCat: (cat: CatProfile) => void;
  onCallCurator: (shelterId: string) => void;
}

export const ShelterTelemetryView: React.FC<ShelterTelemetryViewProps> = ({
  shelter,
  residentCats,
  onOpenCat,
  onCallCurator,
}) => {
  const [strawRefreshed, setStrawRefreshed] = useState(false);

  // Симуляция данных телеметрии для самарской зимы
  const telemetry = {
    internalTemp: 9.4, // Внутри домика
    externalTemp: -14.2, // На улице в Самаре
    humidity: 48,
    battery: 86,
    heater: 'active' as const,
    lastStrawChange: '18 сентября (сухая ржаная солома)',
    deltaTemp: 23.6, // Разница температур благодаря термоизоляции
  };

  const handleStrawLog = () => {
    setStrawRefreshed(true);
    setTimeout(() => setStrawRefreshed(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4 text-[#3B2822]">
      {/* Виджет микроклимата (Зимний мониторинг) */}
      <div className="bg-[#2D221E] text-white rounded-3xl p-4.5 shadow-xl border-2 border-[#4A3832]">
        <div className="flex items-center justify-between border-b border-[#4A3832] pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm font-comfortaa">Телеметрия микроклимата</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Онлайн (LoRaWAN)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-[#3D2F2A] rounded-2xl p-2.5 border border-[#524039] shadow-inner">
            <div className="text-[11px] text-[#C4B2A7]">Внутри</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">
              +{telemetry.internalTemp}°C
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Комфортно</div>
          </div>

          <div className="bg-[#3D2F2A] rounded-2xl p-2.5 border border-[#524039] shadow-inner">
            <div className="text-[11px] text-[#C4B2A7]">За бортом</div>
            <div className="text-lg font-black text-sky-400 mt-0.5">
              {telemetry.externalTemp}°C
            </div>
            <div className="text-[10px] text-[#A8988D]">Волжский ветер</div>
          </div>

          <div className="bg-[#3D2F2A] rounded-2xl p-2.5 border border-[#524039] shadow-inner">
            <div className="text-[11px] text-[#C4B2A7]">Термоизоляция</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">
              +{telemetry.deltaTemp}°C
            </div>
            <div className="text-[10px] text-[#A8988D]">Дельта удержания</div>
          </div>
        </div>

        {/* Дополнительные параметры */}
        <div className="mt-3 pt-2.5 border-t border-[#4A3832] flex items-center justify-between text-xs text-[#C4B2A7]">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Обогрев: греющий кабель 12V (активен)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>АКБ: {telemetry.battery}%</span>
          </div>
        </div>
      </div>

      {/* Жильцы домика */}
      <div className="bg-[#FFF9F2] texture-kraft stitch-seam rounded-3xl p-4 border border-[#E7D6C3] shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D62] font-comfortaa mb-2.5">
          Постоянные жильцы ({residentCats.length})
        </h4>

        {residentCats.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {residentCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onOpenCat(cat)}
                className="flex items-center gap-2.5 p-2 rounded-2xl border border-[#E7D6C3] bg-white hover:border-[#F59E42] hover:bg-[#FAF2E8] transition-all text-left group shadow-2xs"
              >
                <img
                  src={cat.photos[0]}
                  alt={cat.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-[#E7D6C3]"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#3B2822] group-hover:text-amber-900 truncate font-comfortaa">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-[#8C6D62] truncate">
                    {cat.coat}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8C6D62]">
            В данный момент домик открыт для заселения уличных котов квартала.
          </p>
        )}
      </div>

      {/* Ветеринарный регламент рациона (Памятка для жителей квартала) */}
      <div className="bg-[#FFF6EA] texture-cardboard stitch-seam border-2 border-[#E7D6C3] rounded-3xl p-4.5 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-[#5A3E36] font-bold mb-2 font-comfortaa">
          <Utensils className="w-4 h-4 text-amber-700" />
          <span>Регламент кормления (Самарский протокол)</span>
        </div>
        <ul className="space-y-1.5 text-[#5A3E36]">
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Сухой сбалансированный корм премиум/стандарт или теплые мясные консервы.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-rose-600 font-bold">✕</span>
            <span><b>Категорически запрещена</b> сырая рыба из Волги (эндемичный очаг описторхоза!).</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-rose-600 font-bold">✕</span>
            <span>Запрещены трубчатые куриные кости и молоко (вызывает опасные расстройства ЖКТ).</span>
          </li>
        </ul>
      </div>

      {/* Санитарный журнал и смена подстилки из ржаной соломы */}
      <div className="bg-[#FAF2E8] texture-sisal stitch-seam rounded-3xl p-4.5 border-2 border-[#D5C2AF] text-xs flex items-center justify-between shadow-xs">
        <div>
          <div className="font-bold text-[#3B2822] flex items-center gap-1.5 font-comfortaa">
            <Calendar className="w-3.5 h-3.5 text-[#8C6D62]" />
            <span>Подстилка: сухая ржаная солома</span>
          </div>
          <div className="text-[#8C6D62] text-[11px] mt-0.5">
            {strawRefreshed ? '🌾 Обновлено только что!' : telemetry.lastStrawChange}
          </div>
        </div>

        <button
          onClick={handleStrawLog}
          className="px-3.5 py-1.5 rounded-xl font-bold bg-[#FFF9F2] texture-kraft border border-[#D5C2AF] text-[#3B2822] hover:bg-white transition-all shadow-xs active:scale-95"
        >
          {strawRefreshed ? 'Зафиксировано' : 'Отметить замену'}
        </button>
      </div>

      {/* Связь с куратором убежища */}
      <button
        onClick={() => onCallCurator(shelter.id)}
        className="w-full py-3.5 rounded-2xl font-bold text-xs bg-[#3B2822] text-[#FFF9F2] hover:bg-[#523A31] transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 font-comfortaa"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Связаться с куратором убежища ({shelter.curatorContact || 'Дежурный волонтер'})</span>
      </button>
    </div>
  );
};
