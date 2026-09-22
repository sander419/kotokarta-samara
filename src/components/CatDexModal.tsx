import React, { useState } from 'react';
import { CatProfile, UserBadge, CatDexEntry } from '../types';
import { playPurrHaptic } from '../utils/haptics';
import { X, Award, BookOpen, QrCode, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface CatDexModalProps {
  cats: CatProfile[];
  badges: UserBadge[];
  dexEntries: CatDexEntry[];
  onClose: () => void;
  onOpenCat: (cat: CatProfile) => void;
  onScanCode: (code: string) => void;
}

export const CatDexModal: React.FC<CatDexModalProps> = ({
  cats,
  badges,
  dexEntries,
  onClose,
  onOpenCat,
  onScanCode,
}) => {
  const [activeTab, setActiveTab] = useState<'dex' | 'badges' | 'qr'>('dex');
  const [qrInput, setQrInput] = useState('KD-SAM-01');

  const metCatIds = new Set(dexEntries.map((d) => d.catId));

  const handleSimulateScan = (codeToScan: string) => {
    playPurrHaptic();
    onScanCode(codeToScan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2822]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl overflow-hidden my-auto border-2 border-[#E7D6C3] flex flex-col max-h-[90vh]">
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
            <div className="w-10 h-10 rounded-2xl bg-[#F59E42] text-[#3B2822] flex items-center justify-center font-bold text-lg shadow-xs">
              📖
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D62] font-comfortaa">
                Дневник встреч и городские прогулки
              </div>
              <h2 className="text-base font-bold text-[#3B2822] leading-tight font-comfortaa">
                Котодекс Самары
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

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-[#E7D6C3] px-4 py-1.5 bg-[#FAF2E8] text-xs font-semibold gap-1.5 overflow-x-auto no-scrollbar font-comfortaa">
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('dex');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'dex' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Кототека ({cats.length} котов)</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('badges');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'badges' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Бейджи ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              setActiveTab('qr');
            }}
            className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'qr' ? 'bg-[#3B2822] text-[#FFF9F2] shadow-xs' : 'text-[#8C6D62] hover:bg-[#F3E8DB]/80 hover:text-[#3B2822]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Сканер QR</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'dex' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#F6EDE1] border border-[#E7D6C3] text-[#6B4D44] leading-snug">
                🌿 Гуляйте по старым дворикам Самары и набережной, нажимайте <strong>«Видел сегодня»</strong> в карточке кота, чтобы подтверждать их статус «жив и на месте» без раскрытия точных координат.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cats.map((cat) => {
                  const isMet = metCatIds.has(cat.id) || cat.sightingsCount > 0;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        playPurrHaptic();
                        onClose();
                        onOpenCat(cat);
                      }}
                      className="p-3 rounded-2xl border-2 border-[#E7D6C3] hover:border-[#F59E42] bg-[#FFF9F2] texture-kraft stitch-seam fur-shadow fur-nap cursor-pointer transition-all flex items-center gap-3"
                    >
                      <img
                        src={cat.photos[0]}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E7D6C3] flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#3B2822] truncate font-comfortaa">{cat.name}</h4>
                          {isMet && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-semibold">
                              Встречен
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8C6D62] truncate">
                          {cat.district} · {cat.coat}
                        </p>
                        <span className="text-[10px] text-[#F59E42] font-bold">
                          Видели {cat.sightingsCount} раз
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all ${
                      b.unlocked
                        ? 'bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow fur-nap border-[#F59E42] text-[#3B2822]'
                        : 'bg-[#FAF2E8] border-[#E7D6C3] text-[#8C6D62] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {b.id === 'b-1' && '🛡️'}
                          {b.id === 'b-2' && '🍲'}
                          {b.id === 'b-3' && '👁️'}
                          {b.id === 'b-4' && '🚗'}
                        </span>
                        <h4 className="font-bold text-xs font-comfortaa">{b.title}</h4>
                      </div>
                      {b.unlocked ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] font-mono">
                          {b.progress}/{b.maxProgress}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-1.5 leading-snug">
                      {b.description}
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#E7D6C3] h-2 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#F59E42] to-[#E08628] h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (b.progress / b.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#3B2822] text-[#FFF9F2] space-y-2 shadow-md">
                <div className="flex items-center gap-2 text-[#F59E42] font-bold font-comfortaa">
                  <QrCode className="w-4 h-4" />
                  Умные таблички на утепленных котодомиках
                </div>
                <p className="text-[#E7D6C3] text-[11px] leading-relaxed">
                  Каждый официальный зимний котодомик в Самаре снабжен алюминиевой антивандальной QR-табличкой. При сканировании открывается карточка жильцов, памятка по безопасному рациону и график кормления.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E7D6C3] bg-[#FAF2E8] space-y-3">
                <span className="font-bold text-[#3B2822] block text-xs font-comfortaa">
                  Протестировать сканирование QR-кода домика:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleSimulateScan('KD-SAM-01')}
                    className="flex-1 p-3 rounded-xl border border-[#F59E42] bg-[#FFF9F2] text-[#3B2822] font-semibold hover:bg-white transition-all text-left shadow-2xs active:scale-[0.98]"
                  >
                    <div className="text-[11px] font-bold font-comfortaa text-[#3B2822]">🛖 Домик №1 «Самарский теремок»</div>
                    <div className="text-[10px] text-[#8C6D62]">Код: KD-SAM-01 (ул. Венцека)</div>
                  </button>

                  <button
                    onClick={() => handleSimulateScan('KD-OKT-04')}
                    className="flex-1 p-3 rounded-xl border border-[#E7D6C3] bg-[#FFF9F2] text-[#3B2822] font-semibold hover:bg-white transition-all text-left shadow-2xs active:scale-[0.98]"
                  >
                    <div className="text-[11px] font-bold font-comfortaa text-[#3B2822]">🛖 Котодомик «Октябрьский ковчег»</div>
                    <div className="text-[10px] text-[#8C6D62]">Код: KD-OKT-04 (сквер Фадеева)</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
