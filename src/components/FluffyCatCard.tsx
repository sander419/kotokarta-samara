import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MapPin } from 'lucide-react';
import { playPurrHaptic, playMeowSound } from '../utils/haptics';

export interface FluffyCatCardProps {
  name: string;
  avatarUrl: string;
  coatType: string;
  district: string;
  approxAge: string;
  isSterilized: boolean;
  status?: string;
  onPurrAction?: () => void;
  onClickDetails?: () => void;
}

export const FluffyCatCard: React.FC<FluffyCatCardProps> = ({
  name,
  avatarUrl,
  coatType,
  district,
  approxAge,
  isSterilized,
  status,
  onPurrAction,
  onClickDetails,
}) => {
  const [purred, setPurred] = useState(false);
  const [bopsCount, setBopsCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isNosePressed, setIsNosePressed] = useState(false);
  const [isPawPressed, setIsPawPressed] = useState(false);
  const [squashIntensity, setSquashIntensity] = useState<'gentle' | 'deep'>('gentle');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const triggerSquashReaction = (source: 'nose' | 'paw' = 'paw', clientX?: number, clientY?: number) => {
    playPurrHaptic();
    playMeowSound();
    setPurred(true);
    setSquashIntensity(source === 'nose' ? 'deep' : 'gentle');
    setBopsCount((prev) => prev + 1);

    // Spawn floating mini hearts & purr remarks upon squash
    const remarks = ['мурр!', 'мяу!', 'пурр~', 'лапки!', 'теплышко!'];
    const randomRemark = remarks[Math.floor(Math.random() * remarks.length)];
    const newId = Date.now() + Math.random();

    setFloatingHearts((prev) => [
      ...prev.slice(-4),
      {
        id: newId,
        x: (Math.random() - 0.5) * 70,
        y: (Math.random() - 0.5) * 35,
        text: source === 'nose' ? 'чмок!' : randomRemark,
      },
    ]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newId));
    }, 1200);

    if (onPurrAction) onPurrAction();
    setTimeout(() => setPurred(false), 750);
  };

  const handleBopNose = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSquashReaction('nose', e.clientX, e.clientY);
  };

  const handlePetPaw = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSquashReaction('paw', e.clientX, e.clientY);
  };

  return (
    <motion.div 
      className="relative w-full max-w-sm pt-6 mx-auto select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 1. Декоративные кошачьи ушки на фоне карточки с синхронным squash & stretch при нажатии */}
      <motion.div 
        className={`absolute top-1 left-8 w-12 h-12 bg-[#F3E8DB] rounded-tl-full border-t-4 border-l-4 border-[#E7D6C3] z-0 origin-bottom-center ${
          purred || isPressed || isPawPressed || isNosePressed ? 'animate-ear-squash-l animate-ear-squash' : ''
        }`}
        animate={
          purred || isPressed || isPawPressed || isNosePressed
            ? {
                rotate: [-12, -28, -10, -12],
                scaleX: [1, 1.3, 0.95, 1],
                scaleY: [1, 0.7, 1.12, 1],
                y: [0, 5, -2, 0],
              }
            : { rotate: -12, scaleX: 1, scaleY: 1, y: 0 }
        }
        whileHover={{ rotate: -18, scale: 1.05 }}
        transition={{
          duration: purred ? 0.6 : 0.2,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <div className="absolute top-2 left-2 w-6 h-6 bg-[#FFB4C8] rounded-tl-full opacity-80" />
      </motion.div>

      <motion.div 
        className={`absolute top-1 right-8 w-12 h-12 bg-[#F3E8DB] rounded-tr-full border-t-4 border-r-4 border-[#E7D6C3] z-0 origin-bottom-center ${
          purred || isPressed || isPawPressed || isNosePressed ? 'animate-ear-squash-r animate-ear-squash' : ''
        }`}
        animate={
          purred || isPressed || isPawPressed || isNosePressed
            ? {
                rotate: [12, 28, 10, 12],
                scaleX: [1, 1.3, 0.95, 1],
                scaleY: [1, 0.7, 1.12, 1],
                y: [0, 5, -2, 0],
              }
            : { rotate: 12, scaleX: 1, scaleY: 1, y: 0 }
        }
        whileHover={{ rotate: 18, scale: 1.05 }}
        transition={{
          duration: purred ? 0.6 : 0.2,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#FFB4C8] rounded-tr-full opacity-80" />
      </motion.div>

      {/* Floating squash hearts celebration */}
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, scale: 0.3, x: heart.x, y: 15 }}
              animate={{
                opacity: 0,
                scale: [0.5, 1.35, 1],
                x: heart.x * 1.8,
                y: -120 + heart.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: 'easeOut' }}
              className="absolute text-rose-500 font-bold text-sm drop-shadow-md flex items-center gap-1.5"
            >
              <span className="text-base">🐾</span>
              <span className="text-xs font-bold font-comfortaa bg-white/90 px-2 py-0.5 rounded-full border border-rose-200 text-rose-600 shadow-2xs">
                {heart.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. Основное тело карточки с выраженным Meow-morphism Squash & Stretch откликом */}
      <motion.div 
        onClick={onClickDetails}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
        whileHover={{
          scale: 1.015,
          y: -2,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }}
        whileTap={{
          // Классический Squash & Stretch: объект сплющивается по вертикали (scaleY: 0.92) и расширяется в стороны (scaleX: 1.06)
          scaleX: 1.055,
          scaleY: 0.935,
          y: 6,
          transition: { type: 'spring', stiffness: 500, damping: 15 },
        }}
        animate={
          purred
            ? {
                // Пружинный отскок после смятия (Squash -> Stretch -> Settle)
                scaleX: [1, 1.08, 0.95, 1.02, 1],
                scaleY: [1, 0.91, 1.06, 0.98, 1],
                y: [0, 4, -4, 1, 0],
              }
            : {
                scaleX: 1,
                scaleY: 1,
                y: 0,
              }
        }
        transition={{
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        style={{ transformOrigin: 'center bottom' }}
        className={`relative z-10 bg-[#FFF9F2] texture-parchment stitch-seam fur-fluffy-border fur-shadow p-5 overflow-hidden transition-colors ${
          purred || isPressed || isPawPressed || isNosePressed ? 'animate-meow-squash' : ''
        } ${onClickDetails ? 'cursor-pointer hover:border-[#E2CEB9]' : ''}`}
      >
        {/* Статус и район */}
        <div className="flex items-center justify-between mb-3 gap-2">
          {status === 'sos' ? (
            <motion.span 
              className="stamp-sos text-xs inline-block"
              whileHover={{ scale: 1.08, rotate: 0 }}
              whileTap={{ scale: 0.92 }}
            >
              🚨 SOS: Помощь
            </motion.span>
          ) : isSterilized ? (
            <motion.span 
              className="stamp-osvv text-xs inline-block"
              whileHover={{ scale: 1.08, rotate: 0 }}
              whileTap={{ scale: 0.92 }}
            >
              ✂️ ОСВВ: Привит
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F3E8DB] texture-kraft text-[#5A3E36] border border-[#E7D6C3] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E42]" />
              {status === 'adoptable' ? '🏡 Ищет семью' : 'Местный бродяга'}
            </span>
          )}
          <span className="text-xs font-bold text-[#5A3E36] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF8EAB]" />
            {district}
          </span>
        </div>

        {/* Аватар котика в мягкой овальной рамке с "шерстяной" каймой и эффектом вдавливания */}
        <div className="relative group mx-auto w-48 h-48 mb-4">
          <motion.div 
            className="w-full h-full rounded-[40px] overflow-hidden border-4 border-white shadow-inner bg-[#EFE3D5] texture-felt"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <motion.img 
              src={avatarUrl} 
              alt={name} 
              className="w-full h-full object-cover"
              animate={
                purred
                  ? {
                      scale: [1, 1.07, 0.98, 1],
                      filter: [
                        'brightness(1)',
                        'brightness(1.08) contrast(1.05)',
                        'brightness(1)',
                      ],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          
          {/* Интерактивный бархатный носик-кнопка прямо на фото с упругим squash-эффектом */}
          <motion.button
            type="button"
            onClick={handleBopNose}
            onTapStart={() => setIsNosePressed(true)}
            onTap={() => setIsNosePressed(false)}
            onTapCancel={() => setIsNosePressed(false)}
            title="Чмокнуть в кожаный носик!"
            className={`absolute bottom-2 right-2 texture-jelly-nose text-white p-3 rounded-full shadow-lg z-10 select-none border-2 border-white/60 cursor-pointer origin-center ${
              isNosePressed || purred ? 'animate-meow-squash' : ''
            }`}
            whileHover={{ 
              scale: 1.18, 
              boxShadow: '0 8px 20px rgba(59, 40, 34, 0.45)',
              transition: { type: 'spring', stiffness: 500, damping: 15 }
            }}
            whileTap={{
              // Тактильное смятие носика (Squash: сжимается по Y до 0.65 и упруго расширяется по X до 1.38)
              scaleX: 1.38,
              scaleY: 0.65,
              y: 4,
              boxShadow: '0 2px 5px rgba(59, 40, 34, 0.25)',
              transition: { type: 'spring', stiffness: 900, damping: 10 },
            }}
            animate={
              purred && squashIntensity === 'deep'
                ? {
                    scaleX: [1, 1.35, 0.82, 1.15, 0.95, 1],
                    scaleY: [1, 0.68, 1.25, 0.9, 1.05, 1],
                    y: [0, 3, -3, 1, 0],
                  }
                : { scaleX: 1, scaleY: 1, y: 0 }
            }
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                purred ? 'fill-[#FF8EAB] text-[#FF8EAB]' : 'fill-white text-white'
              }`} 
            />
          </motion.button>
        </div>

        {/* Информационный блок */}
        <div className="text-center mb-4">
          <motion.h3 
            className="text-2xl font-black text-[#3B2822] tracking-tight font-comfortaa"
            animate={purred ? { scale: [1, 1.06, 0.98, 1], y: [0, -3, 0] } : {}}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {name || 'Усатый незнакомец'}
          </motion.h3>
          <p className="text-xs text-[#6B4F45] mt-0.5 font-medium">
            Окрас: {coatType} • Примерно {approxAge}
          </p>
        </div>

        {/* 3. Кнопка «Погладить / Видел сегодня» в форме мягкой резиновой подушечки лапки с тактильным Squash & Stretch */}
        <motion.button
          type="button"
          onClick={handlePetPaw}
          onTapStart={() => setIsPawPressed(true)}
          onTap={() => setIsPawPressed(false)}
          onTapCancel={() => setIsPawPressed(false)}
          whileHover={{
            scale: 1.035,
            y: -2,
            boxShadow: '0 8px 24px rgba(255, 142, 171, 0.5)',
            transition: { type: 'spring', stiffness: 450, damping: 20 },
          }}
          whileTap={{
            // Эффект глубокого вдавливания в мягкую подушечку лапки (Squash: 1.12 по X, 0.82 по Y)
            scaleX: 1.12,
            scaleY: 0.82,
            y: 5,
            boxShadow: '0 1px 4px rgba(225, 29, 72, 0.3)',
            transition: { type: 'spring', stiffness: 700, damping: 12 },
          }}
          animate={
            purred
              ? {
                  // Прыжок котика: присед перед прыжком (squash), взлет вверх (jump arc), апекс, приземление на лапки и пружинный возврат
                  scaleX: [1, 1.18, 0.86, 0.92, 1.12, 0.98, 1],
                  scaleY: [1, 0.80, 1.22, 1.15, 0.88, 1.04, 1],
                  y: [0, 5, -20, -24, 3, -2, 0],
                  rotate: [0, -2, 3, -1, 0],
                }
              : { scaleX: 1, scaleY: 1, y: 0, rotate: 0 }
          }
          transition={{
            duration: 0.65,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className={`w-full py-3.5 px-4 texture-jelly-pad text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 select-none border-2 border-white/50 cursor-pointer origin-bottom ${
            isPawPressed || purred ? 'animate-meow-squash' : ''
          }`}
        >
          {/* SVG иконка кошачьей лапки с прыжком в воздухе */}
          <motion.svg 
            className="w-5 h-5 fill-current" 
            viewBox="0 0 24 24"
            animate={
              purred 
                ? { 
                    y: [0, 2, -14, -16, -8, 1, 0],
                    rotate: [-8, -18, 20, -6, 0], 
                    scale: [1, 0.85, 1.35, 1.25, 1.1, 0.95, 1] 
                  } 
                : {}
            }
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <ellipse cx="6.5" cy="8" rx="2" ry="3"/>
            <ellipse cx="12" cy="6" rx="2" ry="3.2"/>
            <ellipse cx="17.5" cy="8" rx="2" ry="3"/>
            <ellipse cx="3.5" cy="13" rx="1.8" ry="2.5"/>
            <path d="M12 11c-3.5 0-6 2.5-6 6.5 0 2.2 1.8 3.5 3.5 3.5 1.5 0 2.5-.8 2.5-.8s1 .8 2.5 .8c1.7 0 3.5-1.3 3.5-3.5 0-4-2.5-6.5-6-6.5z"/>
          </motion.svg>
          <span className="tracking-wide font-comfortaa text-xs sm:text-sm drop-shadow-xs font-bold">
            {purred ? 'Мурррр! (Поглажен)' : 'Погладить (Видел сегодня)'}
          </span>
        </motion.button>

        {/* Счетчик нежностей */}
        {bopsCount > 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-center text-[#A68A7E] mt-2 font-medium"
          >
            Поглажен самарцами {bopsCount} {bopsCount === 1 ? 'раз' : 'раза'} ✨
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

