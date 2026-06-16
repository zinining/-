/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStats, CollectibleItem } from '../types';
import { COLLECTIBLES } from '../data/characters';
import { audio } from '../utils/audio';
import { Award, Sparkles, Check, HelpCircle, Package, Coins } from 'lucide-react';
import CharacterSprite from './CharacterSprite';

interface GachaShopProps {
  stats: GameStats;
  onUpdateStats: (newStats: Partial<GameStats>) => void;
  onExit: () => void;
}

export default function GachaShop({ stats, onUpdateStats, onExit }: GachaShopProps) {
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [openedItem, setOpenedItem] = useState<CollectibleItem | null>(null);
  const [showCapsuleModal, setShowCapsuleModal] = useState<boolean>(false);
  const [capsuleColor, setCapsuleColor] = useState<string>('bg-yellow-400');

  const gachaCost = 10;

  const pullGachaItem = () => {
    if (stats.starCoins < gachaCost || isRolling) {
      audio.playBuzz();
      return;
    }

    setIsRolling(true);
    audio.playPing();
    
    // Select capsule shell color
    const colors = ['bg-rose-400', 'bg-sky-400', 'bg-purple-400', 'bg-amber-400', 'bg-emerald-400'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCapsuleColor(randomColor);

    // Random roll distribution weighted by rarity
    // 60% Common, 30% Rare, 10% Legendary
    setTimeout(() => {
      setIsRolling(false);
      audio.playCoin();

      const seed = Math.random() * 100;
      let selectedRarity: 'Common' | 'Rare' | 'Legendary' = 'Common';

      if (seed > 90) {
        selectedRarity = 'Legendary';
      } else if (seed > 60) {
        selectedRarity = 'Rare';
      }

      // Filter available candidates
      let candidates = COLLECTIBLES.filter((item) => item.rarity === selectedRarity);
      if (candidates.length === 0) candidates = COLLECTIBLES; // safety fallback

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      setOpenedItem(chosen);
      setShowCapsuleModal(true);

      // Save unlocked item to general statistics
      const updatedUnlocked = stats.unlockedCollectibles.includes(chosen.id)
        ? stats.unlockedCollectibles
        : [...stats.unlockedCollectibles, chosen.id];

      onUpdateStats({
        starCoins: stats.starCoins - gachaCost,
        unlockedCollectibles: updatedUnlocked
      });
    }, 1500); // Shake rattle timer
  };

  const getRarityBadge = (rarity: 'Common' | 'Rare' | 'Legendary') => {
    switch (rarity) {
      case 'Legendary':
        return <span className="bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider animate-pulse shadow-sm shadow-amber-300">🌟 Legendary</span>;
      case 'Rare':
        return <span className="bg-sky-500 text-white font-extrabold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide">🐱 Rare</span>;
      default:
        return <span className="bg-stone-300 text-stone-700 font-semibold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-normal">🌿 Common</span>;
    }
  };

  return (
    <div id="gacha-shop-view" className="flex flex-col items-center bg-fuchsia-50 border-4 border-fuchsia-300 rounded-3xl p-4 w-full shadow-xl select-none relative overflow-hidden">
      {/* Upper header banner */}
      <div className="flex justify-between items-center w-full bg-white border border-fuchsia-200 shadow-sm p-3 rounded-2xl mb-4 z-10">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-fuchsia-500 animate-bounce" />
          <div>
            <h4 className="font-bold text-stone-800 text-xs">데굴데굴 가챠 오피스</h4>
            <p className="text-[10px] text-stone-400 font-medium font-sans">모은 코인으로 깜찍한 피규어를 장식하세요!</p>
          </div>
        </div>

        {/* Coin counter display */}
        <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl flex items-center gap-1.5 font-mono text-stone-850 font-extrabold text-sm">
          <Coins size={15} className="text-amber-500 animate-spin" />
          <span>{stats.starCoins}</span>
        </div>
      </div>

      {/* Main Gacha Machine Visual block */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full bg-white/70 border border-fuchsia-100 rounded-2xl p-4 mb-6 relative">
        <div className="flex flex-col items-center justify-center relative w-full max-w-[200px]">
          {/* Bouncing Capsule toy machine representation */}
          <motion.div
            animate={isRolling ? { rotate: [-5, 5, -8, 8, -5, 5, 0], scale: [1, 1.05, 0.98, 1.03, 1] } : {}}
            transition={{ duration: 1.2, repeat: isRolling ? Infinity : 0 }}
            className="w-36 h-48 bg-rose-500 rounded-t-full border-4 border-stone-800 relative z-10 flex flex-col items-center shadow-lg"
          >
            {/* Glass transparent bubble dome for holding capsule balls */}
            <div className="w-28 h-24 bg-sky-100/70 border-4 border-stone-800 rounded-full mt-3 overflow-hidden relative flex flex-wrap gap-1 p-2 justify-center content-center">
              {/* Fake capsule balls inside */}
              {Array.from({ length: 8 }).map((_, i) => {
                const colorVariants = ['bg-rose-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400', 'bg-emerald-400', 'bg-orange-400'];
                return (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border border-stone-850 shadow ${colorVariants[i % colorVariants.length]}`}
                  />
                );
              })}
              <div className="absolute inset-x-0 bottom-0 h-4 bg-sky-200/50 pointer-events-none" />
            </div>

            {/* Base knob control */}
            <div className="absolute bottom-1 w-full flex flex-col items-center relative z-20">
              {/* Turning dial */}
              <motion.div
                animate={isRolling ? { rotate: [0, 180, 360] } : {}}
                transition={{ duration: 0.8 }}
                onClick={pullGachaItem}
                className="w-10 h-10 rounded-full bg-stone-100 border-4 border-stone-800 flex items-center justify-center font-black cursor-pointer hover:bg-stone-200 shadow active:scale-95"
              >
                ↻
              </motion.div>
              {/* Prize dispenser bottom flap */}
              <div className="w-10 h-6 bg-stone-900 border-2 border-stone-800 rounded-t-md mt-1" />
            </div>
          </motion.div>

          <button
            id="pull-capsule-button"
            disabled={stats.starCoins < gachaCost || isRolling}
            onClick={pullGachaItem}
            className={`mt-4 py-2 px-5 rounded-2xl w-full border font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              stats.starCoins < gachaCost
                ? 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-fuchsia-600 to-rose-500 hover:from-fuchsia-500 hover:to-rose-400 text-white border-fuchsia-500'
            }`}
          >
            🕹️ 뽑기 원판 돌리기 ({gachaCost} 코인)
          </button>
        </div>

        {/* Collection Stats Summary */}
        <div className="flex-1 w-full text-center md:text-left">
          <h4 className="font-extrabold text-stone-800 text-sm mb-1">피규어 기증 현황</h4>
          <p className="text-stone-500 text-[10px] leading-relaxed mb-3">
            인형 뽑기방에 오신 것을 환영해요! 미니게임을 통해 모은 소중한 스타 코인을 돌려 8명의 칭구들과 스페셜 황금 굿즈들을 모두 모아보세요!
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold text-stone-700 bg-fuchsia-100/40 p-3 rounded-xl border border-fuchsia-200/50">
            <div>• 수집 완료 수량:</div>
            <div className="text-right text-fuchsia-600">
              {stats.unlockedCollectibles.length} / {COLLECTIBLES.length} ({( (stats.unlockedCollectibles.length / COLLECTIBLES.length) * 100 ).toFixed(0)}%)
            </div>
            <div>• 뽑기 정산 비용:</div>
            <div className="text-right text-stone-500">회당 10 코인</div>
          </div>

          <button
            id="back-to-lobby-from-gacha"
            onClick={onExit}
            className="mt-4 px-4 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-500 hover:text-stone-700 font-bold text-[10px] transition-transform active:scale-95"
          >
            ◀ 오락실 로비로 나가기
          </button>
        </div>
      </div>

      {/* Figures Gallery Museum */}
      <div className="w-full bg-white border border-fuchsia-100 rounded-3xl p-4 shadow-sm z-10">
        <div className="flex items-center gap-1 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <h4 className="font-black text-stone-800 text-xs">🧸 우리들의 피규어 박물관 (도감)</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-1">
          {COLLECTIBLES.map((item) => {
            const isUnlocked = stats.unlockedCollectibles.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center text-center relative transition-all ${
                  isUnlocked
                    ? 'bg-fuchsia-50/50 border-fuchsia-200/80 hover:bg-fuchsia-100/60'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                {/* Visual figure representations */}
                {isUnlocked ? (
                  <div className="flex flex-col items-center">
                    {/* Rarity small dot */}
                    <div className="absolute top-1 right-1">
                      {item.rarity === 'Legendary' ? (
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      ) : item.rarity === 'Rare' ? (
                        <div className="w-2 h-2 rounded-full bg-sky-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-stone-300" />
                      )}
                    </div>

                    <div className="w-12 h-12 flex items-center justify-center mb-1 bg-white rounded-full">
                      <CharacterSprite id={item.imageType} size={42} />
                    </div>
                    <span className="font-bold text-[10px] text-stone-850 truncate max-w-full leading-none block mb-0.5">
                      {item.koreanName}
                    </span>
                    <span className="text-[7px] text-stone-400 font-semibold block leading-tight">
                      {item.rarity}
                    </span>
                  </div>
                ) : (
                  <div className="py-2 flex flex-col items-center justify-center">
                    <HelpCircle size={32} className="text-stone-300" />
                    <span className="font-bold text-[8px] text-stone-400 block mt-1">
                      미획득
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup Dialog Capsule Roll Reveal Modal */}
      <AnimatePresence>
        {showCapsuleModal && openedItem && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white border-4 border-fuchsia-300 rounded-3xl p-6 max-w-xs w-full text-center relative shadow-2xl overflow-hidden font-sans"
            >
              {/* Confetti sparkle overlays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300/10 via-transparent to-transparent pointer-events-none" />

              <div className="mb-3">
                <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">캡슐이 활짝 열렸습니다!</span>
                <div className="flex justify-center mt-2">
                  {getRarityBadge(openedItem.rarity)}
                </div>
              </div>

              {/* Opened visual item */}
              <div className="my-6 relative flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 360, 360] }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="w-24 h-24 flex items-center justify-center bg-fuchsia-50 rounded-full border border-fuchsia-200 shadow-inner mb-2 block select-none"
                >
                  <CharacterSprite id={openedItem.imageType} size={70} />
                </motion.div>

                {/* Sparkling dots */}
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                  <Sparkles className="w-14 h-14 text-yellow-400 absolute top-0 left-4 animate-ping opacity-60" />
                  <Sparkles className="w-14 h-14 text-fuchsia-400 absolute bottom-0 right-4 animate-bounce opacity-40" />
                </div>
              </div>

              {/* Title & Descriptors */}
              <h3 className="text-base font-black text-stone-850 mb-1">{openedItem.name}</h3>
              <p className="text-stone-500 text-[10px] leading-relaxed px-2 mb-6">
                "{openedItem.description}"
              </p>

              <button
                id="close-gacha-modal-btn"
                onClick={() => setShowCapsuleModal(false)}
                className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl font-bold text-xs shadow transition-all active:scale-95"
              >
                도감에 소중히 보관하기 🧸
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
