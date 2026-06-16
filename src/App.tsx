/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHARACTERS } from './data/characters';
import { audio } from './utils/audio';
import { GameStats, GameMode, GameCharacter } from './types';

// Component imports
import TobatsuGame from './components/TobatsuGame';
import WeedPullGame from './components/WeedPullGame';
import SnackCatchGame from './components/SnackCatchGame';
import GachaShop from './components/GachaShop';
import CharacterSprite from './components/CharacterSprite';

// Lucide icons
import {
  Volume2,
  VolumeX,
  Trophy,
  Award,
  Sparkles,
  Gamepad2,
  Gift,
  Heart,
  User,
  Zap,
  BookOpen
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'chiikawa_arcade_stats_v1';

const DEFAULT_STATS: GameStats = {
  starCoins: 40, // Let's give them 40 booster coins to pull some Gacha instantly!
  highScores: {
    tobatsu: 0,
    weed_pulling: 0,
    snack_catch: 0
  },
  totalPulledWeeds: 0,
  totalSubduedMonsters: 0,
  totalCaughtSnacks: 0,
  unlockedCollectibles: [],
  licenseGrade: null
};

export default function App() {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [selectedChar, setSelectedChar] = useState<GameCharacter>(CHARACTERS[0]); // Default to Chiikawa
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showIntroduction, setShowIntroduction] = useState<boolean>(true);

  // Load stats from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load local stats:', e);
    }
  }, []);

  // Sync state mutation helper
  const handleUpdateStats = (newFields: Partial<GameStats>) => {
    setStats((prev) => {
      const updated = { ...prev, ...newFields };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save stats locally:', e);
      }
      return updated;
    });
  };

  const selectCharacter = (char: GameCharacter) => {
    setSelectedChar(char);
    // Play high pitch beep matching character's audio frequency!
    audio.playSpeak(char.audioFrequency);
  };

  const handleMuteToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const resetAllStats = () => {
    if (window.confirm('정말로 주급과 콜렉션 피규어 도감을 포함한 모든 기록을 초기화하시겠습니까? 🥺')) {
      setStats(DEFAULT_STATS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
      audio.playBuzz();
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-3 sm:p-6 font-sans text-stone-800 antialiased selection:bg-rose-200">
      {/* Background cute shapes and stars */}
      <div className="absolute top-10 left-10 w-8 h-8 text-pink-300 animate-pulse select-none pointer-events-none">✨</div>
      <div className="absolute bottom-12 right-12 w-10 h-10 text-pink-300 animate-bounce select-none pointer-events-none">🌟</div>
      <div className="absolute top-1/3 right-10 w-6 h-6 text-pink-300 select-none pointer-events-none">🌸</div>

      {/* Retro Pink Arcade Cabinet Outer Chassis */}
      <div className="w-full max-w-[620px] bg-[#FFF0F2] border-[10px] border-rose-300 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative">
        <div className="absolute top-4 inset-x-0 h-1.5 bg-white/40 pointer-events-none" />

        {/* Arcade Cabinet Marquee Header */}
        <header className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 text-white p-4 text-center border-b-[6px] border-rose-300 relative">
          <div className="flex justify-between items-center px-1">
            {/* Audio Toggle button */}
            <button
              id="mute-button"
              onClick={handleMuteToggle}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 active:scale-95 transition-transform cursor-pointer"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Marquee Title */}
            <div>
              <h1 className="font-black text-lg sm:text-xl font-mono uppercase tracking-widest text-[#FFF5F6] drop-shadow-md flex items-center justify-center gap-1.5">
                <span>⚔️</span> 먼작귀 오락실 <span>🎮</span>
              </h1>
              <p className="text-[10px] text-[#FFE4E6] font-semibold tracking-wide">
                CHIIKAWA MINI ARCADE COIN GAME
              </p>
            </div>

            {/* Total balance display */}
            <div className="bg-white/20 border border-white/30 px-2 py-1 rounded-xl flex items-center gap-1 text-[11px] font-mono font-bold">
              <span>⭐</span>
              <span className="text-yellow-100">{stats.starCoins}</span>
            </div>
          </div>
        </header>

        {/* Screen inner shell viewport */}
        <main className="p-4 sm:p-5 flex-1 flex flex-col bg-[#FFF9FA]">
          <AnimatePresence mode="wait">
            {/* MAIN ARCADE MENU VIEW */}
            {gameMode === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                {/* Introduction tutorial callout overlay */}
                {showIntroduction && (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex gap-3 items-center relative">
                    <span className="text-4xl animate-bounce">🥺</span>
                    <div className="text-left">
                      <h4 className="font-black text-rose-600 text-xs">안녕! 먼작귀 오락실에 어서 와!</h4>
                      <p className="text-[10px] text-stone-500 leading-relaxed mt-0.5">
                        사진 속의 귀여운 8칭구들과 함께 밤하늘의 나쁜 야수를 토벌하고 시사의 라멘 간식이나 풀 뽑기를 즐겨봐! 획득한 스타 코인으로 캡슐을 돌려 컬렉션을 다 모을 수 있을까?
                      </p>
                    </div>
                    <button
                      id="close-intro-btn"
                      onClick={() => setShowIntroduction(false)}
                      className="absolute top-1 right-2 text-rose-300 hover:text-rose-500 text-xs font-bold font-sans"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Character Selection Slider view */}
                <section className="bg-white/85 border border-rose-100 p-4 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-1.5 mb-3">
                    <User className="w-4 h-4 text-rose-500" />
                    <h3 className="font-extrabold text-[#FC587E] text-xs">함께 플레이할 캐릭터 선택</h3>
                  </div>

                  {/* Character horizontal cards scroll */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {CHARACTERS.map((char) => {
                      const isSelected = selectedChar.id === char.id;
                      return (
                        <button
                          key={char.id}
                          id={`char-select-${char.id}`}
                          onClick={() => selectCharacter(char)}
                          style={{ backgroundColor: isSelected ? char.avatarBg : '' }}
                          className={`p-1 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-rose-400 scale-105 shadow shadow-rose-200'
                              : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                          }`}
                        >
                          {/* Cute avatar drawing */}
                          <div className="w-10 h-10 flex items-center justify-center">
                            <CharacterSprite id={char.id} size={34} />
                          </div>
                          <span className="text-[9.5px] font-bold text-stone-700 mt-0.5 truncate max-w-full">
                            {char.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Character Bio Panel */}
                  <motion.div
                    key={selectedChar.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex gap-3 text-left items-center font-sans"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl border border-stone-300 flex items-center justify-center flex-shrink-0 bg-white"
                    >
                      <CharacterSprite id={selectedChar.id} size={48} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-rose-500 text-xs">{selectedChar.name}</span>
                        <span className="text-[8px] text-stone-400 font-mono font-bold leading-normal bg-stone-200/50 px-1.5 rounded">{selectedChar.jpName}</span>
                      </div>
                      <p className="text-[10px] text-stone-550 leading-relaxed mt-0.5 line-clamp-2">
                        {selectedChar.description}
                      </p>
                      <div className="text-[8px] text-rose-500 font-bold font-mono mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>💬 핵심 대사: "{selectedChar.catchphrase}"</span>
                        <span>🛡️ 주무기: {selectedChar.weapon}</span>
                      </div>
                    </div>
                  </motion.div>
                </section>

                {/* Mini-Games Grid Select Launcher */}
                <section className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-rose-500" />
                    <h3 className="font-extrabold text-stone-800 text-xs">오락기 미니게임 선택</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Game 1: Tobatsu */}
                    <button
                      id="launch-tobatsu-btn"
                      onClick={() => { setGameMode('tobatsu'); audio.playPing(); }}
                      className="p-3 bg-white hover:bg-red-50/50 border-2 border-red-200 hover:border-red-300 rounded-3xl transition-all hover:-translate-y-0.5 text-left flex gap-3 cursor-pointer shadow-sm relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 h-1.5 w-1/3 bg-red-400" />
                      <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-xl flex-shrink-0">
                        ⚔️
                      </div>
                      <div>
                        <h4 className="font-black text-stone-850 text-xs flex items-center gap-1">
                          토벌 대작전
                        </h4>
                        <p className="text-[9px] text-stone-400 mt-0.5">야수를 무찌르는 액션 토벌!</p>
                        <div className="text-[8px] text-red-500 font-bold font-mono mt-2 bg-red-50 p-0.5 px-1 rounded inline-block">
                          최고 기록: {stats.highScores.tobatsu}점
                        </div>
                      </div>
                    </button>

                    {/* Game 2: Weed pull */}
                    <button
                      id="launch-weed-btn"
                      onClick={() => { setGameMode('weed_pulling'); audio.playPing(); }}
                      className="p-3 bg-white hover:bg-emerald-50/50 border-2 border-emerald-200 hover:border-emerald-300 rounded-3xl transition-all hover:-translate-y-0.5 text-left flex gap-3 cursor-pointer shadow-sm relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 h-1.5 w-1/3 bg-emerald-400" />
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                        🌱
                      </div>
                      <div>
                        <h4 className="font-black text-stone-850 text-xs">잡초뽑기 시험</h4>
                        <p className="text-[9px] text-stone-400 mt-0.5">5급 자격 취득을 장식해요!</p>
                        <div className="text-[8px] text-emerald-600 font-bold font-mono mt-2 bg-emerald-50 p-0.5 px-1 rounded inline-block">
                          최고 기록: {stats.highScores.weed_pulling}점
                        </div>
                      </div>
                    </button>

                    {/* Game 3: Snack catcher */}
                    <button
                      id="launch-snack-btn"
                      onClick={() => { setGameMode('snack_catch'); audio.playPing(); }}
                      className="p-3 bg-white hover:bg-amber-50/50 border-2 border-amber-200 hover:border-amber-300 rounded-3xl transition-all hover:-translate-y-0.5 text-left flex gap-3 cursor-pointer shadow-sm relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 h-1.5 w-1/3 bg-amber-400" />
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                        🍰
                      </div>
                      <div>
                        <h4 className="font-black text-stone-850 text-xs">달콤 피규어 간식</h4>
                        <p className="text-[9px] text-stone-400 mt-0.5">쏟아지는 고양이 디저트!</p>
                        <div className="text-[8px] text-yellow-600 font-bold font-mono mt-2 bg-yellow-50 p-0.5 px-1 rounded inline-block">
                          최고 기록: {stats.highScores.snack_catch}점
                        </div>
                      </div>
                    </button>
                  </div>
                </section>

                {/* Achievements & Gacha Launcher Row */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Shop & Collection card */}
                  <div className="bg-gradient-to-br from-[#FFF5F6] to-[#FFE4E8] border border-rose-200 rounded-3xl p-4 flex gap-4 text-left items-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-1 right-2 text-rose-300 animate-pulse text-xs">★</div>
                    <div className="w-11 h-11 rounded-full bg-rose-200/50 flex flex-shrink-0 items-center justify-center text-2xl">
                      🧸
                    </div>
                    <div>
                      <h4 className="font-black text-rose-700 text-xs">피규어 캡슐 뽑기</h4>
                      <p className="text-[9px] text-stone-500 mt-0.5">내 피규어 수치: <span className="font-bold text-rose-500">{stats.unlockedCollectibles.length} / 10종</span></p>
                      <button
                        id="enter-gacha-menu-btn"
                        onClick={() => { setGameMode('gacha'); audio.playPing(); }}
                        className="mt-2 py-1 px-3 bg-rose-500 hover:bg-rose-600 active:scale-95 transition-transform text-[9px] font-bold text-white rounded-full flex items-center gap-1"
                      >
                        <Gift size={9} /> 피규어 뽑으러 가기!
                      </button>
                    </div>
                  </div>

                  {/* Hall of Fame statistics */}
                  <div className="bg-stone-50 border border-stone-200 rounded-3xl p-4 text-left font-mono relative">
                    <h4 className="font-black text-stone-700 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Trophy size={11} className="text-yellow-500" /> 오락실 누적 영광 실적
                    </h4>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-stone-500 font-bold">
                      <span>• 총 잡초 수확량:</span> <span className="text-right text-emerald-600">{stats.totalPulledWeeds}개</span>
                      <span>• 물리친 야수 수:</span> <span className="text-right text-red-500">{stats.totalSubduedMonsters}마리</span>
                      <span>• 획득한 별주급:</span> <span className="text-right text-yellow-600">⭐ {stats.starCoins}코인</span>
                      <span>• 자격 마스터:</span>
                      <span className="text-right">
                        {stats.licenseGrade !== null ? (
                          <span className="text-yellow-600 font-black bg-yellow-100 text-[8px] px-1.5 rounded-full inline-block border border-yellow-300 leading-none py-0.5 animate-pulse">
                            🎓 {stats.licenseGrade}급 자격증
                          </span>
                        ) : (
                          <span className="text-stone-400">자격 무</span>
                        )}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Footer utilities */}
                <div className="flex justify-between items-center text-[10px] text-stone-400 font-sans border-t pt-3 border-stone-100 font-medium">
                  <span>©nagano / 포토그레이 콜라보 귀여운 먼작귀 보드게임</span>
                  <button
                    id="reset-history-btn"
                    onClick={resetAllStats}
                    className="text-stone-400 hover:text-red-400 font-semibold"
                  >
                    데이터 초기화 ⚙️
                  </button>
                </div>
              </motion.div>
            )}

            {/* TOBATSU GAME PANEL */}
            {gameMode === 'tobatsu' && (
              <motion.div
                key="tobatsu"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <TobatsuGame
                  character={selectedChar}
                  stats={stats}
                  onUpdateStats={handleUpdateStats}
                  onExit={() => setGameMode('menu')}
                />
              </motion.div>
            )}

            {/* WEED PULL GAME PANEL */}
            {gameMode === 'weed_pulling' && (
              <motion.div
                key="weed_pulling"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <WeedPullGame
                  character={selectedChar}
                  stats={stats}
                  onUpdateStats={handleUpdateStats}
                  onExit={() => setGameMode('menu')}
                />
              </motion.div>
            )}

            {/* SNACK CATCH GAME PANEL */}
            {gameMode === 'snack_catch' && (
              <motion.div
                key="snack_catch"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <SnackCatchGame
                  character={selectedChar}
                  stats={stats}
                  onUpdateStats={handleUpdateStats}
                  onExit={() => setGameMode('menu')}
                />
              </motion.div>
            )}

            {/* GACHA SHOP PANEL */}
            {gameMode === 'gacha' && (
              <motion.div
                key="gacha"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <GachaShop
                  stats={stats}
                  onUpdateStats={handleUpdateStats}
                  onExit={() => setGameMode('menu')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Decorative controller console drawer at bottom */}
        <div className="bg-rose-200 border-t-4 border-rose-300 p-4 shrink-0 flex justify-center items-center gap-6 relative select-none">
          <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />

          {/* D-Pad controls decorative panel */}
          <div className="flex gap-1 items-center">
            <div className="w-8 h-8 rounded-lg bg-stone-700 border-2 border-stone-800 shadow" />
            <div className="flex flex-col gap-1">
              <div className="w-8 h-8 rounded-lg bg-stone-700 border-2 border-stone-800 shadow" />
              <div className="w-8 h-8 rounded-lg bg-stone-700 border-2 border-stone-800 shadow" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-stone-700 border-2 border-stone-800 shadow" />
          </div>

          <p className="text-[10px] text-rose-600/70 font-mono font-bold tracking-widest text-center select-none max-w-28 uppercase hidden sm:block">
            Munjakgui Retro Cabinet System
          </p>

          {/* Large round shiny arcade buttons */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 border-4 border-red-700 shadow-md transform hover:scale-105 active:scale-95 transition-transform" />
            <div className="w-10 h-10 rounded-full bg-yellow-400 border-4 border-yellow-600 shadow-md transform hover:scale-105 active:scale-95 transition-transform" />
            <div className="w-10 h-10 rounded-full bg-sky-400 border-4 border-sky-600 shadow-md transform hover:scale-105 active:scale-95 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
