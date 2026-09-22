import React from 'react';
import { X, ShieldCheck, AlertOctagon, Heart, Users, MapPin, Sparkles } from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';

interface AboutSafetyModalProps {
  onClose: () => void;
}

export const AboutSafetyModal: React.FC<AboutSafetyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl overflow-hidden my-auto border border-[#E7D6C3] flex flex-col max-h-[90vh]">
        {/* Decorative Cat Ears atop modal */}
        <div className="absolute -top-3 left-10 w-6 h-6 bg-[#F3E8DB] rounded-tl-full border-t border-l border-[#E7D6C3] transform -rotate-12 pointer-events-none">
          <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-[#FFB4C8] rounded-tl-full opacity-80" />
        </div>
        <div className="absolute -top-3 left-18 w-6 h-6 bg-[#F3E8DB] rounded-tr-full border-t border-r border-[#E7D6C3] transform rotate-12 pointer-events-none">
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB4C8] rounded-tr-full opacity-80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7D6C3] bg-[#FAF2E8]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛡️</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                Манифест и стандарты безопасности
              </div>
              <h2 className="text-base font-bold text-[#3B2822] leading-tight font-comfortaa">
                О проекте «Котокарта» (Самара)
              </h2>
            </div>
          </div>
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto leading-relaxed text-[#5A3E36]">
          {/* Zero-Harm Policy Card */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900 font-comfortaa">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              Ключевое правило: Политика Zero-Harm
            </div>
            <p className="text-[11px] leading-relaxed">
              Точные координаты бездомных животных <strong>никогда не публикуются в открытом доступе</strong>. Для защиты от живодеров и догхантеров публичные пользователи видят приблизительную метку с рандомизированным гео-шумом (радиус 70–150 м).
            </p>
            <p className="text-[11px] leading-relaxed">
              Точные метки, история болезней, номера бирок ОСВВ и маршруты доставки доступны исключительно верифицированным кураторам и проверенным волонтерам.
            </p>
          </div>

          {/* Samara Context */}
          <div className="p-4 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#3B2822] font-comfortaa">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              Локальная специфика региона — Самара
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#6B4D44] list-disc list-inside">
              <li>
                <strong>Исторический центр (Самарский и Ленинский районы):</strong> уютные закрытые дворы деревянного и купеческого фонда — естественные укрытия котов, требующие уважения приватности жильцов.
              </li>
              <li>
                <strong>Суровые самарские зимы и ветра с Волги:</strong> необходимость утепления домиков минеральной ватой и сухой ржаной соломой (не сеном, которое преет).
              </li>
              <li>
                <strong>Ветеринарная этика:</strong> запрет на кормление сырой волжской рыбой из-за эндемичного риска описторхоза.
              </li>
              <li>
                <strong>Логистика:</strong> автоволонтерские коридоры связывают удаленные районы (Безымянка, Металлург, Поляна Фрунзе) с круглосуточными партнерскими клиниками.
              </li>
            </ul>
          </div>

          {/* Expert Board */}
          <div className="p-4 rounded-2xl bg-[#3B2822] text-[#FFF9F2] space-y-2 shadow-md">
            <div className="flex items-center gap-2 font-bold text-xs text-[#F59E42] font-comfortaa">
              <Users className="w-4 h-4" />
              Объединенный экспертный штаб платформы
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#E7D6C3]">
              <div>• <strong>CPO:</strong> Продуктовые сценарии и волонтерство</div>
              <div>• <strong>Lead GIS:</strong> Картография и защитные тайлы</div>
              <div>• <strong>Senior UX/UI:</strong> Meow-morphism и доступность</div>
              <div>• <strong>Bio-Safety:</strong> Протоколы Zero-Harm и ОСВВ Самары</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
