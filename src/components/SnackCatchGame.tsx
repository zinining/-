/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCharacter, GameStats } from '../types';
import { audio } from '../utils/audio';
import { Cookie, Soup, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import CharacterSprite from './CharacterSprite';

interface FallingSnack {
  id: string;
  x: number; // Percent from left (0 to 90)
  y: number; // Percent from top (0 to 100)
  speed: number;
  type: 'ramen' | 'pudding' | 'parfait' | 'coin' | 'bomb';
  icon: string;
  label: string;
  points: number;
}

interface SnackCatchGameProps {
  character: GameCharacter;
  stats: GameStats;
  onUpdateStats: (newStats: Partial<GameStats>) => void;
  onExit: () => void;
}

const SNACK_TEMPLATES: Array<Omit<FallingSnack, 'id' | 'x' | 'y'>> = [
  { type: 'ramen', icon: '🍜', label: '차슈 라멘', speed: 1.8, points: 15 },
  { type: 'pudding', icon: '🍮', label: '노랑 푸딩', speed: 1.6, points: 10 },
  { type: 'parfait', icon: '🍨', label: '딸기 파페', speed: 2.0, points: 20 },
  { type: 'coin', icon: '⭐', label: '보너스 별', speed: 2.3, points: 5 },
  { type: 'bomb', icon: '💩', label: '썩은 도토리', speed: 1.5, points: -15 }
];

export default function SnackCatchGame({ character, stats, onUpdateStats, onExit }: SnackCatchGameProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [items, setItems] = useState<FallingSnack[]>([]);
  const [playerX, setPlayerX] = useState<number>(50); // Player position left percentage (0 to 100)
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [caughtCount, setCaughtCount] = useState<number>(0);

  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const coinsRef = useRef<number>(0);
  const playerXRef = useRef<number>(50);
  const caughtRef = useRef<number>(0);

  // Sync refs to avoid stale scoping in ticking loops
  useEffect(() => {
    scoreRef.current = score;
    coinsRef.current = coinsEarned;
    playerXRef.current = playerX;
    caughtRef.current = caughtCount;
  }, [score, coinsEarned, playerX, caughtCount]);

  // Keys control listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerX((x) => Math.max(5, x - 10));
        audio.playPing();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerX((x) => Math.min(95, x + 10));
        audio.playPing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  const startGame = () => {
    audio.startBGM();
    setScore(0);
    setCoinsEarned(0);
    setTimeLeft(30);
    setItems([]);
    setPlayerX(50);
    setCaughtCount(0);
    setIsGameOver(false);
    setIsPlaying(true);
    lastSpawnRef.current = Date.now();
  };

  // 30 seconds countdown timer
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver]);

  // Falling physics loop
  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const frameTick = () => {
      const now = Date.now();

      // Spawn falling desserts
      const baseSpawnInterval = Math.max(600, 1500 - scoreRef.current * 3);
      if (now - lastSpawnRef.current > baseSpawnInterval) {
        const template = SNACK_TEMPLATES[Math.floor(Math.random() * SNACK_TEMPLATES.length)];
        const newItem: FallingSnack = {
          ...template,
          id: `snack-${now}-${Math.random()}`,
          x: Math.random() * 85 + 5, // Keep within screen boundary
          y: 0,
          // Speed scale slightly as level advances
          speed: template.speed + Math.min(1.2, scoreRef.current / 200)
        };
        setItems((prev) => [...prev, newItem]);
        lastSpawnRef.current = now;
      }

      // Drop physics & catching detection
      setItems((prevItems) => {
        const active: FallingSnack[] = [];

        prevItems.forEach((item) => {
          const nextY = item.y + item.speed * 1.6;

          // Check coordinate intersection (around y target 80% to 90%)
          const distanceX = Math.abs(item.x - playerXRef.current);
          const reachedPlayerRow = nextY >= 77 && nextY <= 88;

          if (reachedPlayerRow && distanceX <= 12) {
            // CATCH SUCCESS!
            setCaughtCount((c) => c + 1);

            if (item.type === 'bomb') {
              audio.playBuzz();
              // Subtract coins and score
              setScore((s) => Math.max(0, s + item.points));
            } else {
              audio.playCoin();
              setScore((s) => s + item.points);

              // Coin distribution
              const coinYield = item.type === 'coin' ? 3 : Math.random() < 0.3 ? 1 : 0;
              setCoinsEarned((c) => c + coinYield);
            }
          } else if (nextY < 95) {
            // Keep dropping
            active.push({ ...item, y: nextY });
          }
        });

        return active;
      });

      gameLoopRef.current = requestAnimationFrame(frameTick);
    };

    gameLoopRef.current = requestAnimationFrame(frameTick);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver]);

  const finishGame = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    audio.playFanfare();

    // Export scores to general system stats in database
    const totalNewCoins = coinsRef.current + Math.floor(scoreRef.current / 10); // extra dividend for high performance!
    const statsCoins = stats.starCoins + totalNewCoins;

    const statsHighScore = Math.max(stats.highScores.snack_catch, scoreRef.current);
    const updatedCaught = stats.totalCaughtSnacks + caughtRef.current;

    onUpdateStats({
      starCoins: statsCoins,
      highScores: {
        ...stats.highScores,
        snack_catch: statsHighScore
      },
      totalCaughtSnacks: updatedCaught
    });
  };

  return (
    <div id="snack-catch-game-view" className="flex flex-col items-center bg-amber-50 border-4 border-amber-300 rounded-3xl p-4 w-full shadow-lg relative overflow-hidden select-none">
      {/* Conveyer top track visual representation */}
      <div className="absolute top-0 inset-x-0 h-4 bg-amber-900 border-b border-amber-950/40 z-0">
        <div className="flex justify-between w-full h-full px-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-2 h-full bg-amber-800 border-r border-amber-950/20" />
          ))}
        </div>
      </div>

      {/* Main HUD */}
      <div className="flex justify-between items-center w-full bg-white border border-amber-200 shadow-sm p-3 rounded-2xl mb-4 z-10 mt-1">
        <div className="flex items-center gap-2">
          <Cookie className="w-5 h-5 text-amber-500 animate-bounce" />
          <div>
            <h4 className="font-bold text-stone-800 text-xs">달콤한 간식 받기</h4>
            <p className="text-[10px] text-stone-400 font-medium">칭구들의 디저트를 쟁반에 모아요!</p>
          </div>
        </div>

        {/* Dashboard numbers */}
        <div className="flex gap-4 font-mono text-xs items-center">
          <div className="bg-amber-100/40 px-2 py-0.5 rounded-lg text-center flex items-center gap-1">
            <Clock size={11} className="text-amber-600" />
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-stone-700'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="bg-yellow-100/50 px-2 py-0.5 rounded-lg text-center">
            <span className="text-[9px] text-yellow-800 font-extrabold mr-1">POINT</span>
            <span className="font-bold text-stone-700">{score}</span>
          </div>
        </div>
      </div>

      {!isPlaying && !isGameOver ? (
        /* Tutorial Screen */
        <div className="flex flex-col items-center text-center justify-center min-h-[350px] w-full bg-white/90 rounded-2xl p-6 border border-amber-100 z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            <div className="text-6xl mb-2 text-center">🍰🍮</div>
            <h3 className="text-base font-black text-stone-800 tracking-tight">대용량 간식 배달 대작전</h3>
            <p className="text-stone-500 text-xs mt-2 px-2 max-w-sm">
              위쪽의 과자 기계에서 쏟아지는 푸딩과 라멘을 쟁반으로 요리조리 신명나게 받아 대접하세요! 썩은 도토리를 받으면 점수가 깎여요!
            </p>
          </motion.div>

          {/* Points list */}
          <div className="bg-stone-50 border p-3 rounded-xl w-full max-w-xs mb-6 grid grid-cols-2 gap-y-1.5 text-[10px] text-left text-stone-600 font-mono">
            <div className="flex items-center gap-1">
              <span>🍜 Ramen</span> <span className="text-amber-600 font-bold">+15점</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🍮 Pudding</span> <span className="text-amber-600 font-bold">+10점</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🍨 Parfait</span> <span className="text-amber-600 font-bold">+20점</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⭐ Coin Star</span> <span className="text-emerald-600 font-bold">+3코인</span>
            </div>
            <div className="col-span-2 border-t pt-1.5 flex items-center gap-1 text-red-500">
              <span>🪠똥/썩은 도토리(💩) :</span> <span>엄청난 감점 (-15점)!</span>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              id="exit-snack-game-btn"
              onClick={onExit}
              className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-500 hover:text-stone-700 hover:bg-stone-50 text-xs font-semibold"
            >
              포기하기
            </button>
            <button
              id="start-snack-button"
              onClick={startGame}
              className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-900 shadow-md font-bold text-xs"
            >
              간식 받기 시작! 🍰
            </button>
          </div>
        </div>
      ) : isGameOver ? (
        /* Game Over screen */
        <div className="flex flex-col items-center text-center justify-center min-h-[350px] w-full bg-white/90 rounded-2xl p-6 border border-amber-100 z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-4"
          >
            <span className="text-5xl block mb-2">🍞🥳</span>
            <h3 className="text-lg font-black text-amber-600">배달 완료! 고마워요-!</h3>
            <p className="text-stone-400 text-[10px] mt-1">칭구들이 대단히 흡족해합니다!</p>
          </motion.div>

          <div className="bg-amber-100/55 border border-amber-200 font-mono text-center rounded-2xl p-4 w-full max-w-xs mb-6 space-y-2">
            <div className="text-xs text-stone-500 font-bold">배달 실적 리포트</div>
            <div className="grid grid-cols-2 text-stone-700 text-xs py-1 text-left">
              <div>성공적으로 잡은 디저트:</div>
              <div className="text-right text-amber-700 font-bold">{caughtCount} 개</div>
              <div>누적 디저트 스코어:</div>
              <div className="text-right text-yellow-600 font-bold">{score} 점</div>
              <div className="border-t pt-1 mt-1 text-stone-500">배달 주급 정산:</div>
              <div className="border-t pt-1 mt-1 text-right text-emerald-600 font-bold">
                ⭐ {coinsEarned + Math.floor(score / 10)} 코인!
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              id="exit-gameover-gate-btn"
              onClick={onExit}
              className="flex-1 py-1.5 rounded-xl border text-stone-500 text-xs font-semibold"
            >
              종료하기
            </button>
            <button
              id="retry-snack-game-btn"
              onClick={startGame}
              className="flex-1 py-1.5 rounded-xl bg-amber-500 font-bold text-stone-900 text-xs hover:bg-amber-400 active:scale-95 transition-all"
            >
              다시 배달하기 🍰
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE GAMING SCREEN */
        <div className="relative w-full h-[320px] bg-gradient-to-b from-[#FEF3C7] via-amber-100 to-[#FEF3C7] border border-amber-200 rounded-3xl overflow-hidden shadow-inner p-3">
          {/* Falling items renderer */}
          <AnimatePresence>
            {items.map((it) => (
              <motion.div
                key={it.id}
                initial={{ top: '4%', x: `${it.x}%` }}
                animate={{ top: `${it.y}%` }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ left: `${it.x}%` }}
                className="absolute z-20 pointer-events-none p-1 text-3xl filter drop-shadow select-none"
              >
                {it.icon}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Running Hero Sprite holding a tray! */}
          <div
            style={{ left: `calc(${playerX}% - 28px)` }}
            className="absolute bottom-2 transition-all duration-75 ease-out h-24 w-14 z-30 flex flex-col items-center pointer-events-none"
          >
            {/* Wooden Tray catcher */}
            <motion.div
              animate={{ rotate: (playerX - 50) / 4 }}
              className="w-16 h-3 bg-amber-800 rounded-full border border-amber-950 flex shadow items-center justify-center relative -bottom-1"
            >
              <div className="w-12 h-1 bg-amber-700 rounded-full" />
              {/* Star coins particles floating optionally */}
              <Sparkles size={8} className="text-yellow-300 absolute -top-3 animate-ping" />
            </motion.div>

            {/* Avatar block */}
            <div
              className="w-11 h-11 rounded-full border border-stone-400 flex items-center justify-center relative shadow bg-white overflow-hidden"
            >
              <CharacterSprite id={character.id} size={38} mode="happy" />
            </div>

            {/* Character label */}
            <div className="text-[8px] bg-amber-800 text-[#FFFBEB] font-extrabold px-1.5 rounded-full border border-amber-900 mt-1 select-none leading-relaxed">
              {character.name}
            </div>
          </div>

          {/* Conveyor Belt indicators falling paths backdrop styling */}
          <div className="absolute bottom-5 inset-x-0 h-1 bg-amber-200/50 pointer-events-none" />

          {/* Quick instructions indicator */}
          <div className="absolute bottom-1 right-2 text-[8px] text-amber-800 font-bold uppercase pointer-events-none select-none">
            ◀ Touch / Slide Sidebars to Move ▶
          </div>
        </div>
      )}

      {/* Screen Side Touch controllers (Crucial for convenient laptop / preview / mobile gameplay) */}
      {isPlaying && !isGameOver && (
        <div className="grid grid-cols-2 gap-4 w-full mt-4 z-40">
          <button
            id="slide-left-btn"
            onClick={() => { setPlayerX((x) => Math.max(5, x - 15)); audio.playPing(); }}
            className="py-2.5 bg-amber-800 hover:bg-amber-750 border border-amber-900 text-stone-100 rounded-xl active:scale-95 transition-transform text-xs font-bold"
          >
            ◀ 왼쪽으로 이동
          </button>
          <button
            id="slide-right-btn"
            onClick={() => { setPlayerX((x) => Math.min(95, x + 15)); audio.playPing(); }}
            className="py-2.5 bg-amber-800 hover:bg-amber-750 border border-amber-900 text-stone-100 rounded-xl active:scale-95 transition-transform text-xs font-bold"
          >
            오른쪽으로 이동 ▶
          </button>
        </div>
      )}
    </div>
  );
}
