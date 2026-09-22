import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Camera, 
  HeartHandshake, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-amber-500" />,
      badge: 'Принцип №1',
      title: 'Политика Zero-Harm: Защита животных',
      description: (
        <>
          Мы защищаем уличных кошек Самары от догхантеров и живодеров. Для всех гостей координаты 
          котиков <b>намеренно размываются радиусом ~100 метров</b>. Никаких точных подвалов или номеров подъездов в открытом доступе.
        </>
      ),
      tip: 'Точные метки доступны только верифицированным кураторам зоозащитных фондов после проверки.',
    },
    {
      icon: <Camera className="w-10 h-10 text-emerald-500" />,
      badge: 'Принцип №2',
      title: 'Удаление метаданных и AI-проверка',
      description: (
        <>
          Каждая фотография проходит автоматическую очистку от <b>скрытых GPS-тегов (EXIF)</b> перед публикацией. 
          Нейросеть <b>Gemini Vision</b> мгновенно проверяет снимок, находит признаки программы стерилизации (ОСВВ) и фиксирует травмы.
        </>
      ),
      tip: 'Пожалуйста, не фотографируйте лица прохожих и номера автомобилей — берегите приватность соседей.',
    },
    {
      icon: <MapPin className="w-10 h-10 text-sky-500" />,
      badge: 'Принцип №3',
      title: 'Зимняя инфраструктура Самары',
      description: (
        <>
          На карте отмечены <b>утепленные зимние домики</b> с защитой от волжских ветров, кормушки и партнерские клиники со льготной стерилизацией. 
          Сканируйте QR-коды на домиках, чтобы узнать жильцов и правила рациона.
        </>
      ),
      tip: 'Помните: сырая рыба из Волги строго запрещена из-за высокого риска описторхоза!',
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-rose-500" />,
      badge: 'Готовы к работе',
      title: 'Станьте хранителем двора',
      description: (
        <>
          Нажимайте кнопку <b>«Видел сегодня»</b>, чтобы подтвердить, что кот жив и сыт. Координируйте утренние и вечерние кормления 
          и создавайте SOS-заявки, если животному требуется срочная автопомощь или ветеринар.
        </>
      ),
      tip: 'Вы можете в любой момент переключить режим просмотра на панели управления.',
    },
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('kotokarta_onboarding_completed', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2822]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FFF9F2] texture-parchment stitch-seam fur-shadow rounded-3xl shadow-2xl border-2 border-[#E7D6C3] overflow-hidden flex flex-col">
        {/* Decorative Cat Ears atop modal */}
        <div className="absolute -top-3.5 left-8 w-7 h-7 bg-[#F3E8DB] rounded-tl-full border-t-2 border-l-2 border-[#E7D6C3] transform -rotate-12 pointer-events-none">
          <div className="absolute top-1 left-1 w-3 h-3 bg-[#FFB4C8] rounded-tl-full transform -rotate-12 opacity-85" />
        </div>
        <div className="absolute -top-3.5 left-16 w-7 h-7 bg-[#F3E8DB] rounded-tr-full border-t-2 border-r-2 border-[#E7D6C3] transform rotate-12 pointer-events-none">
          <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFB4C8] rounded-tr-full transform rotate-12 opacity-85" />
        </div>

        {/* Индикатор прогресса */}
        <div className="flex h-1.5 bg-[#FAF2E8]">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-[#F59E42]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Тело слайда */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF2E8] border border-[#E7D6C3] flex items-center justify-center mb-4 shadow-xs">
            {step.icon}
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF2E8] text-[#8C6D62] text-[11px] font-bold tracking-wide uppercase mb-2">
            {step.badge}
          </span>

          <h3 className="text-lg font-bold text-[#3B2822] leading-snug mb-3 font-comfortaa">
            {step.title}
          </h3>

          <div className="text-xs text-[#6B4D44] leading-relaxed mb-4">
            {step.description}
          </div>

          {/* Плашка с подсказкой */}
          <div className="w-full p-3 rounded-2xl bg-[#F6EDE1] border border-[#E7D6C3] text-[11px] text-[#6B4D44] text-left flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#F59E42] flex-shrink-0 mt-0.5" />
            <span>{step.tip}</span>
          </div>
        </div>

        {/* Кнопки навигации */}
        <div className="p-4 bg-[#FAF2E8] border-t-2 border-[#E7D6C3] flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <button
              onClick={() => {
                playPurrHaptic();
                handlePrev();
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#8C6D62] hover:bg-[#F3E8DB] hover:text-[#3B2822] transition-colors flex items-center gap-1 font-comfortaa"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playPurrHaptic();
                onClose();
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#8C6D62] hover:text-[#3B2822] transition-colors font-comfortaa"
            >
              Пропустить
            </button>
          )}

          <button
            onClick={() => {
              playPurrHaptic();
              handleNext();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3B2822] text-[#FFF9F2] hover:bg-[#523A31] active:scale-95 transition-all flex items-center gap-1.5 shadow-md font-comfortaa"
          >
            <span>{currentStep === steps.length - 1 ? 'Начать исследование' : 'Далее'}</span>
            <ChevronRight className="w-4 h-4 text-[#F59E42]" />
          </button>
        </div>
      </div>
    </div>
  );
};
