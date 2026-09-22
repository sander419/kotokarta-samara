import React from 'react';
import { InfraPoint, CatProfile } from '../types';
import { X, MapPin, Phone, Flame, QrCode, Home, HeartHandshake } from 'lucide-react';
import { ShelterTelemetryView } from './ShelterTelemetryView';
import { playPurrHaptic } from '../utils/haptics';

interface InfraModalProps {
  infra: InfraPoint;
  allCats: CatProfile[];
  onClose: () => void;
  onOpenCat: (cat: CatProfile) => void;
  onScanQr: (qrId: string) => void;
}

export const InfraModal: React.FC<InfraModalProps> = ({
  infra,
  allCats,
  onClose,
  onOpenCat,
  onScanQr,
}) => {
  const residentCats = allCats.filter((c) => infra.residentsCatIds?.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl overflow-hidden my-auto border border-[#E7D6C3] flex flex-col">
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
            <span className="text-2xl">
              {infra.type === 'shelter' && '🛖'}
              {infra.type === 'vet_clinic' && '🏥'}
              {infra.type === 'pet_friendly' && '☕'}
              {infra.type === 'feeder' && '🥣'}
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                Городская инфраструктура Самары
              </div>
              <h2 className="text-base font-bold text-[#3B2822] leading-tight font-comfortaa">
                {infra.name}
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
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Если это утепленный котодомик — отображаем детальную телеметрию микроклимата */}
          {infra.type === 'shelter' ? (
            <ShelterTelemetryView
              shelter={infra}
              residentCats={residentCats}
              onOpenCat={(cat: CatProfile) => {
                onClose();
                onOpenCat(cat);
              }}
              onCallCurator={() => {
                playPurrHaptic();
                alert(`Запрос на связь с куратором убежища "${infra.name}" отправлен в волонтерский чат.`);
              }}
            />
          ) : (
            <>
              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] text-[#5A3E36] leading-relaxed text-xs">
                {infra.description}
              </div>

              {/* District and Address */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-[#E7D6C3]">
                  <span className="text-[10px] text-[#8C6D62] uppercase font-bold block font-comfortaa">Район</span>
                  <span className="font-semibold text-[#3B2822] mt-0.5 block">{infra.district}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-[#E7D6C3]">
                  <span className="text-[10px] text-[#8C6D62] uppercase font-bold block font-comfortaa">Адрес</span>
                  <span className="font-semibold text-[#3B2822] mt-0.5 block">{infra.address}</span>
                </div>
              </div>

              {/* Contact or Capacity */}
              <div className="flex flex-wrap gap-2 pt-1">
                {infra.capacity && (
                  <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-700" />
                    Вместимость: до {infra.capacity} котиков
                  </div>
                )}
                {infra.contactPhone && (
                  <a
                    href={`tel:${infra.contactPhone}`}
                    className="px-3.5 py-2 rounded-2xl bg-teal-50 text-teal-900 border border-teal-200 font-semibold flex items-center gap-1.5 hover:bg-teal-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-700" />
                    {infra.contactPhone}
                  </a>
                )}
              </div>
            </>
          )}

          {/* QR Code Action for Shelters */}
          {infra.qrCodeId && (
            <div className="p-3.5 rounded-2xl bg-[#3B2822] text-[#FFF9F2] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <QrCode className="w-5 h-5 text-[#F59E42]" />
                <div>
                  <div className="font-bold text-xs font-comfortaa">Антивандальная QR-табличка</div>
                  <div className="text-[10px] text-[#C4B2A7]">Идентификатор: {infra.qrCodeId}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playPurrHaptic();
                  onScanQr(infra.qrCodeId!);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F59E42] to-[#E08628] hover:from-[#E08628] hover:to-[#C97218] text-white font-bold text-xs transition-all shadow-xs active:scale-95 font-comfortaa"
              >
                Открыть инфо
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
