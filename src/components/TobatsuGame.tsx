/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCharacter, GameStats } from '../types';
import { audio } from '../utils/audio';
import { Shield, Heart, Sparkles, AlertCircle, Sword } from 'lucide-react';
import CharacterSprite from './CharacterSprite';

interface GameMonster {
  id: string;
  lane: number; // 0: Left, 1: Center, 2: Right
  y: number; // Percentage down the lane (0 to 100)
  speed: number;
  type: 'spike' | 'chimera' | 'beetle' | 'giant';
  name: string;
  points: number;
  size: number;
  color: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface TobatsuGameProps {
  character: GameCharacter;
  stats: GameStats;
  onUpdateStats: (newStats: Partial<GameStats>) => void;
  onExit: () => void;
}

const MONSTER_TEMPLATES: Array<Omit<GameMonster, 'id' | 'lane' | 'y'>> = [
  { type: 'spike', name: '가시성인 (Spike)', speed: 1.5, points: 10, size: 48, color: 'border-purple-400 bg-purple-100 text-purple-700' },
  { type: 'beetle', name: '대왕 갑충 (Beetle)', speed: 1.8, points: 15, size: 54, color: 'border-amber-500 bg-amber-100 text-amber-700' },
  { type: 'chimera', name: '우는 키메라 (Chimera)', speed: 1.2, points: 20, size: 60, color: 'border-pink-400 bg-pink-100 text-pink-700' },
  { type: 'giant', name: '엄청 큰 야수 (Giant)', speed: 1.0, points: 25, size: 70, color: 'border-teal-400 bg-teal-100 text-teal-800' }
];

export default function TobatsuGame({ character, stats, onUpdateStats, onExit }: TobatsuGameProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [playerLane, setPlayerLane] = useState<number>(1); // Start in Center lane (0, 1, 2)
  const [monsters, setMonsters] = useState<GameMonster[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSlashing, setIsSlashing] = useState<boolean>(false);
  const [isHurt, setIsHurt] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [subduedCount, setSubduedCount] = useState<number>(0);

  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const coinsRef = useRef<number>(0);
  const subduedRef = useRef<number>(0);

  // Sync refs to avoid stale closures in game loop
  useEffect(() => {
    scoreRef.current = score;
    coinsRef.current = coinsEarned;
    subduedRef.current = subduedCount;
  }, [score, coinsEarned, subduedCount]);

  // Handle keyboard inputs for accessibility and comfort
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerLane((prev) => Math.max(0, prev - 1));
        audio.playPing();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerLane((prev) => Math.min(2, prev + 1));
        audio.playPing();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerAttack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  const triggerAttack = () => {
    if (isSlashing) return;
    setIsSlashing(true);
    audio.playSlash();

    // Check hit collision
    setMonsters((prevMonsters) => {
      let hitAny = false;
      const updated = prevMonsters.filter((m) => {
        // Must be in the same lane and within landing zone range (y between 65 and 90)
        const inHitZone = m.lane === playerLane && m.y >= 60 && m.y <= 92;
        if (inHitZone) {
          hitAny = true;
          // Spawn flash particles
          const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: `p-${Date.now()}-${i}`,
            x: playerLane * 33 + 16 + (Math.random() - 0.5) * 15,
            y: 80 + (Math.random() - 0.5) * 10,
            color: character.id === 'chiikawa' ? '#FDA4AF' : character.id === 'hachiware' ? '#7DD3FC' : '#FCD34D'
          }));
          setParticles((p) => [...p, ...newParticles]);

          // Stat calculation
          setScore((s) => s + m.points);
          // 40% chance of gaining one extra Star Coin per subdue
          const coinGain = Math.random() < 0.4 ? 1 : 0;
          setCoinsEarned((c) => c + 1 + coinGain);
          setSubduedCount((sc) => sc + 1);
          return false; // Remove monster
        }
        return true;
      });

      if (hitAny) {
        audio.playCoin();
      }

      return updated;
    });

    setTimeout(() => {
      setIsSlashing(false);
    }, 150);
  };

  const startGame = () => {
    audio.startBGM();
    setScore(0);
    setCoinsEarned(0);
    setLives(3);
    setPlayerLane(1);
    setMonsters([]);
    setParticles([]);
    setSubduedCount(0);
    setIsGameOver(false);
    setIsPlaying(true);
    lastSpawnRef.current = Date.now();
  };

  // Main game loop ticker
  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const tick = () => {
      const now = Date.now();

      // Monster Spawning Logic (difficulty increases as score climbs up)
      const baseSpawnInterval = Math.max(1200, 3000 - scoreRef.current * 8);
      if (now - lastSpawnRef.current > baseSpawnInterval) {
        const randomTemplate = MONSTER_TEMPLATES[Math.floor(Math.random() * MONSTER_TEMPLATES.length)];
        const randomLane = Math.floor(Math.random() * 3);
        const newMonster: GameMonster = {
          ...randomTemplate,
          id: `monster-${now}-${Math.random()}`,
          lane: randomLane,
          y: 0,
          // Speed scale up with score
          speed: randomTemplate.speed + Math.min(1.5, scoreRef.current / 150)
        };
        setMonsters((prev) => [...prev, newMonster]);
        lastSpawnRef.current = now;
      }

      // Update Monsters position (falling downward)
      setMonsters((prev) => {
        let reachedBottom = false;
        const remaining = prev.map((m) => {
          return { ...m, y: m.y + m.speed * 1.5 };
        }).filter((m) => {
          if (m.y >= 95) {
            reachedBottom = true;
            return false; // delete monster
          }
          return true;
        });

        if (reachedBottom) {
          audio.playBuzz();
          setIsHurt(true);
          setTimeout(() => setIsHurt(false), 200);

          setLives((l) => {
            if (l <= 1) {
              handleGameOver();
              return 0;
            }
            return l - 1;
          });
        }

        return remaining;
      });

      // Gradually clear particles
      setParticles((prev) => prev.slice(-30));

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, isGameOver]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    audio.playFanfare();

    // Persist scores and coins
    const finalCoins = coinsRef.current;
    const finalScore = scoreRef.current;
    const finalSubdued = subduedRef.current;

    const statsCoins = stats.starCoins + finalCoins;
    const statsHighScore = Math.max(stats.highScores.tobatsu, finalScore);
    const updatedSubdued = stats.totalSubduedMonsters + finalSubdued;

    onUpdateStats({
      starCoins: statsCoins,
      highScores: {
        ...stats.highScores,
        tobatsu: statsHighScore
      },
      totalSubduedMonsters: updatedSubdued
    });
  };

  const currentHighScore = Math.max(stats.highScores.tobatsu, score);

  return (
    <div id="tobatsu-game-view" className="flex flex-col items-center bg-stone-900 border-4 border-stone-700 rounded-3xl p-4 w-full shadow-2xl relative overflow-hidden select-none">
      {/* Game frame corner lights */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse" />

      {/* Screen Header */}
      <div className="flex justify-between items-center w-full bg-stone-950 p-3 rounded-xl border border-stone-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg bg-stone-850" style={{ backgroundColor: character.avatarBg }}>
            <span className="text-xl">{character.weaponIcon}</span>
          </div>
          <div>
            <div className="text-stone-300 text-xs font-semibold">{character.name} (토벌대)</div>
            <div className="text-[#FFEBEB] text-[10px] font-mono uppercase bg-red-950 px-1.5 rounded inline-block text-center mt-0.5 border border-red-900">
              {character.weapon}
            </div>
          </div>
        </div>

        {/* Top Scores */}
        <div className="flex gap-4 font-mono text-right text-xs">
          <div>
            <div className="text-stone-500 text-[10px]">HI-SCORE</div>
            <div className="text-rose-400 font-bold">{currentHighScore}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[10px]">SCORE</div>
            <div className="text-yellow-400 font-bold">{score}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[10px]">COINS</div>
            <div className="text-emerald-400 font-bold flex items-center justify-end gap-0.5">
              ⭐ {coinsEarned}
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && !isGameOver ? (
        /* Intro / Start view */
        <div className="flex flex-col items-center text-center justify-center min-h-[350px] w-full bg-stone-950 rounded-2xl p-6 border border-stone-800">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            <div className="text-6xl mb-2">⚔️</div>
            <h3 className="text-xl font-bold text-[#FFEBEB] tracking-tight">토벌 대작전 (Monster Battle)</h3>
            <p className="text-stone-400 text-xs mt-2 px-4 max-w-sm">
              위쪽에서 밤하늘을 타고 떨어지는 알록달록 무서운 야수들을 타이밍 맞추어 멋지게 토벌하고 스타 코인을 획득하세요!
            </p>
          </motion.div>

          {/* Tutorial guides */}
          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 w-full max-w-xs mb-6 text-[11px] text-stone-300 text-left font-mono space-y-1">
            <div className="text-yellow-400 font-bold text-xs mb-1">🎮 조작 가이드:</div>
            <div>• <kbd className="bg-stone-800 px-1 border border-stone-700 rounded text-stone-200">←</kbd> / <kbd className="bg-stone-800 px-1 border border-stone-700 rounded text-stone-200">→</kbd> 또는 화면 레인 터치: 이동</div>
            <div>• <kbd className="bg-stone-800 px-1.5 border border-stone-700 rounded text-stone-200">Space</kbd> / <kbd className="bg-stone-800 px-1.5 border border-stone-700 rounded text-stone-200">Enter</kbd> 또는 공격 버튼: 토벌 찌르기!</div>
            <div>• 히트 존 <span className="text-rose-400">(분홍 레이더 라인)</span> 안에서 찔러야 명중해요!</div>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              id="back-to-menu-btn"
              onClick={onExit}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-900 active:scale-95 transition-all text-xs font-semibold"
            >
              로비로 나가기
            </button>
            <button
              id="start-tobatsu-test-btn"
              onClick={startGame}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg active:scale-95 transition-all text-sm font-bold flex items-center justify-center gap-1"
            >
              <Sword size={16} /> 토벌 시작!
            </button>
          </div>
        </div>
      ) : isGameOver ? (
        /* Game Over view */
        <div className="flex flex-col items-center text-center justify-center min-h-[350px] w-full bg-stone-950 rounded-2xl p-6 border border-stone-800">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-4"
          >
            <span className="text-6xl block mb-2">💫</span>
            <h3 className="text-2xl font-black text-rose-500 font-mono uppercase tracking-wider">GAME OVER</h3>
            <p className="text-stone-400 text-xs mt-1">체력이 모두 떨어졌습니다!</p>
          </motion.div>

          {/* Stats Summary */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 w-full max-w-xs mb-6 space-y-2 font-mono text-center">
            <div className="text-xs text-stone-400">토벌 결과 리포트</div>
            <div className="grid grid-cols-2 gap-2 text-stone-200 text-xs py-1">
              <div className="text-left">몬스터 토벌 수:</div>
              <div className="text-right text-rose-400 font-bold">{subduedCount} 마리</div>
              <div className="text-left">최종 획득 스코어:</div>
              <div className="text-right text-yellow-400 font-bold">{score} 점</div>
              <div className="text-left">획득한 스타 코인:</div>
              <div className="text-right text-emerald-400 font-bold">⭐ {coinsEarned} 개</div>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              id="gameover-exit-btn"
              onClick={onExit}
              className="flex-1 py-2 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900 text-xs font-semibold"
            >
              끝내기
            </button>
            <button
              id="gameover-retry-btn"
              onClick={startGame}
              className="flex-1 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all shadow-md"
            >
              다시 도전하기 🎉
            </button>
          </div>
        </div>
      ) : (
        /* Active Gaming View */
        <div className="relative w-full h-[380px] bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-inner font-mono">
          {/* Background stardust stars */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 opacity-100 z-0" />

          {/* Lane dividers */}
          <div className="absolute inset-y-0 left-1/3 border-r border-dashed border-stone-900/50 z-0" />
          <div className="absolute inset-y-0 left-2/3 border-r border-dashed border-stone-900/50 z-0" />

          {/* Lanes Background click handles */}
          <div className="absolute inset-0 grid grid-cols-3 z-10 opacity-0">
            <div onClick={() => { setPlayerLane(0); triggerAttack(); }} />
            <div onClick={() => { setPlayerLane(1); triggerAttack(); }} />
            <div onClick={() => { setPlayerLane(2); triggerAttack(); }} />
          </div>

          {/* HIT RADAR ZONE Indicator line */}
          <div className="absolute bottom-16 inset-x-0 h-10 border-t border-b border-rose-500/30 bg-rose-500/10 flex items-center justify-center pointer-events-none z-10">
            <span className="text-[9px] text-rose-400/80 uppercase font-bold tracking-widest animate-pulse">
              🎯 ATTACK AREA (스페이스바)
            </span>
          </div>

          {/* Render Active Monsters */}
          <AnimatePresence>
            {monsters.map((m) => (
              <motion.div
                key={m.id}
                initial={{ top: '0%' }}
                animate={{ top: `${m.y}%` }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                style={{
                  left: `calc(${m.lane * 33.3}%)`,
                  width: '33.3%',
                }}
                className="absolute flex flex-col items-center justify-center pt-2 z-20 pointer-events-none"
              >
                <div
                  style={{ width: `${m.size}px`, height: `${m.size}px` }}
                  className={`rounded-full border-2 p-1 ${m.color} flex flex-col items-center justify-center shadow-lg relative`}
                >
                  {/* Sleeping zzz or angry aura for chimera */}
                  {m.type === 'chimera' && (
                    <div className="absolute -top-3 text-[10px] bg-rose-600 text-white rounded px-1 scale-75 animate-bounce">
                      우끼-!
                    </div>
                  )}
                  {m.type === 'giant' && (
                    <div className="absolute -top-4 text-[10px] text-red-400 font-extrabold animate-pulse">
                      👹
                    </div>
                  )}

                  {/* Character face representation */}
                  <span className="text-xl">
                    {m.type === 'spike' ? '😈' : m.type === 'beetle' ? '🪲' : m.type === 'chimera' ? '👽' : '👹'}
                  </span>
                  <div className="text-[7px] text-center mt-0.5 truncate max-w-full font-bold">
                    {m.name.split(' ')[0]}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Particle blast effects */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none z-30 animate-ping"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color
              }}
            />
          ))}

          {/* User Hero Sprite Controller */}
          <div
            style={{
              left: `calc(${playerLane * 33.3}%)`,
              width: '33.3%',
            }}
            className="absolute bottom-2 h-20 transition-all duration-100 ease-out flex flex-col items-center justify-center z-30 pointer-events-none"
          >
            {/* Health representation */}
            <div className="flex gap-1 mb-1 absolute -top-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  size={10}
                  className={i < lives ? 'fill-red-500 text-red-500' : 'text-stone-700'}
                />
              ))}
            </div>

            <motion.div
              animate={isSlashing ? { scale: 1.25, y: -15, rotate: [0, -10, 10, 0] } : { scale: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.12 }}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center border-2 ${isHurt ? 'bg-red-500 border-red-300' : 'bg-stone-800 border-stone-600'} relative`}
            >
              {/* Sasumata / Sword Attack Slash Sweeper visual weapon pop-up */}
              {isSlashing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.5, y: -25 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 text-2xl z-40"
                >
                  {character.weaponIcon}💨
                </motion.div>
              )}

              {/* Character Face Bubble */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center relative bg-white border border-stone-700 overflow-hidden"
              >
                <CharacterSprite
                  id={character.id}
                  size={36}
                  mode={isHurt ? 'hurt' : isSlashing ? 'happy' : 'normal'}
                />
              </div>

              {/* Tag below character */}
              <span className="text-[8px] bg-stone-900 border border-stone-700 px-1 rounded-full text-stone-200 mt-1 font-semibold">
                {character.name}
              </span>
            </motion.div>
          </div>

          {/* Quick instructions HUD */}
          <div className="absolute bottom-1 right-2 text-[8px] text-stone-600 uppercase pointer-events-none">
            Arrow Key ◀ | ▶ to Move
          </div>
        </div>
      )}

      {/* Touch Action Controls (Crucial for mobile devices / preview pane) */}
      {isPlaying && !isGameOver && (
        <div className="grid grid-cols-2 gap-4 w-full mt-4 z-40">
          <div className="grid grid-cols-3 gap-2">
            <button
              id="move-left-btn"
              onClick={() => { setPlayerLane((prev) => Math.max(0, prev - 1)); audio.playPing(); }}
              className="py-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 rounded-xl active:scale-95 transition-transform text-lg flex items-center justify-center font-bold"
            >
              ◀
            </button>
            <div className="flex items-center justify-center">
              <span className="text-stone-500 font-mono text-[10px] text-center select-none uppercase tracking-wide">
                LANE {playerLane + 1}
              </span>
            </div>
            <button
              id="move-right-btn"
              onClick={() => { setPlayerLane((prev) => Math.min(2, prev + 1)); audio.playPing(); }}
              className="py-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 rounded-xl active:scale-95 transition-transform text-lg flex items-center justify-center font-bold"
            >
              ▶
            </button>
          </div>

          <button
            id="attack-btn"
            onClick={triggerAttack}
            className={`py-3 rounded-xl border font-bold text-center active:scale-95 transition-all text-xs flex items-center justify-center gap-1 shadow-md ${
              isSlashing
                ? 'bg-red-800 text-stone-200 border-red-600'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-500'
            }`}
          >
            <Sword size={14} className="animate-bounce" /> {character.weaponIcon} 찌르기 공격!
          </button>
        </div>
      )}
    </div>
  );
}
