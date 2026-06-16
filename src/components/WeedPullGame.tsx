/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCharacter, GameStats } from '../types';
import { audio } from '../utils/audio';
import { Leaf, Award, CheckCircle, RotateCcw, XCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import CharacterSprite from './CharacterSprite';

interface WeedItem {
  id: string;
  gridIndex: number;
  type: 'normal' | 'rare' | 'poison';
  tapsRequired: number;
  tapsCollected: number;
  createdAt: number;
}

interface WeedPullGameProps {
  character: GameCharacter;
  stats: GameStats;
  onUpdateStats: (newStats: Partial<GameStats>) => void;
  onExit: () => void;
}

export default function WeedPullGame({ character, stats, onUpdateStats, onExit }: WeedPullGameProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [weeds, setWeeds] = useState<WeedItem[]>([]);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [passedExam, setPassedExam] = useState<boolean>(false);
  const [pulledCount, setPulledCount] = useState<number>(0);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const weedSpawnerRef = useRef<NodeJS.Timeout | null>(null);

  const passingScore = 45;

  const startExam = () => {
    audio.startBGM();
    setScore(0);
    setTimeLeft(25);
    setWeeds([]);
    setIsExamCompleted(false);
    setPassedExam(false);
    setPulledCount(0);
    setEarnedCoins(0);
    setIsPlaying(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || isExamCompleted) return;

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current!);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying, isExamCompleted]);

  // Spawning weeds in a 4x4 coordinate grid (indices 0 to 15)
  useEffect(() => {
    if (!isPlaying || isExamCompleted) return;

    const spawnWeed = () => {
      setWeeds((currWeeds) => {
        if (currWeeds.length >= 7) return currWeeds; // Cap maximum weeds simultaneously

        // Find empty grid spots
        const occupiedIndices = currWeeds.map((w) => w.gridIndex);
        const freeIndices = Array.from({ length: 16 }, (_, i) => i).filter(
          (idx) => !occupiedIndices.includes(idx)
        );

        if (freeIndices.length === 0) return currWeeds;

        const randomGridIndex = freeIndices[Math.floor(Math.random() * freeIndices.length)];
        const spawnSeed = Math.random();

        let type: 'normal' | 'rare' | 'poison' = 'normal';
        let taps = 1;

        if (spawnSeed > 0.85) {
          type = 'poison'; // Do not click trigger!
          taps = 1;
        } else if (spawnSeed > 0.65) {
          type = 'rare'; // Golden weed
          taps = 2; // Golden needs double taps!
        }

        const newWeed: WeedItem = {
          id: `weed-${Date.now()}-${randomGridIndex}`,
          gridIndex: randomGridIndex,
          type,
          tapsRequired: taps,
          tapsCollected: 0,
          createdAt: Date.now()
        };

        return [...currWeeds, newWeed];
      });
    };

    // Spawn first batch instantly
    spawnWeed();
    spawnWeed();
    spawnWeed();

    // Spawn every 900ms
    weedSpawnerRef.current = setInterval(spawnWeed, 900);

    return () => {
      if (weedSpawnerRef.current) clearInterval(weedSpawnerRef.current);
    };
  }, [isPlaying, isExamCompleted]);

  const handleWeedTap = (weed: WeedItem) => {
    if (!isPlaying || isExamCompleted) return;

    if (weed.type === 'poison') {
      // Tap penalty!
      audio.playBuzz();
      setScore((s) => Math.max(0, s - 5));
      // Remove noxious weed instantly
      setWeeds((prev) => prev.filter((w) => w.id !== weed.id));

      // Flapping red camera reaction or bounce
      return;
    }

    const nextTaps = weed.tapsCollected + 1;
    audio.playPing();

    if (nextTaps >= weed.tapsRequired) {
      // Pull successfully
      setPulledCount((pc) => pc + 1);
      const weedScore = weed.type === 'rare' ? 8 : 3;
      setScore((s) => s + weedScore);

      // Earn Coins (Rare weeds yield more)
      const coinYield = weed.type === 'rare' ? 3 : 1;
      setEarnedCoins((c) => c + coinYield);

      // Remove weed object
      setWeeds((prev) => prev.filter((w) => w.id !== weed.id));
    } else {
      // Partial tap register for golden weed
      setWeeds((prev) =>
        prev.map((w) => (w.id === weed.id ? { ...w, tapsCollected: nextTaps } : w))
      );
    }
  };

  const finishExam = () => {
    setIsExamCompleted(true);
    setIsPlaying(false);
    if (weedSpawnerRef.current) clearInterval(weedSpawnerRef.current);

    // Read final stats safely
    const finalScore = score;
    const isPassed = finalScore >= passingScore;
    setPassedExam(isPassed);
    audio.playFanfare();

    // Reward Extra Bounty if passed!
    const passedBounty = isPassed ? 15 : 4; // bonus coins for passing
    const finalStarCoins = stats.starCoins + earnedCoins + passedBounty;

    const statsHighScore = Math.max(stats.highScores.weed_pulling, finalScore);
    const statsTotalWeeds = stats.totalPulledWeeds + pulledCount;

    // License grade lock in (Grade 5)
    let finalLicense = stats.licenseGrade;
    if (isPassed && (stats.licenseGrade === null || stats.licenseGrade > 5)) {
      finalLicense = 5; // Unlocked 5th Grade License card!
    }

    onUpdateStats({
      starCoins: finalStarCoins,
      highScores: {
        ...stats.highScores,
        weed_pulling: statsHighScore
      },
      totalPulledWeeds: statsTotalWeeds,
      licenseGrade: finalLicense
    });
  };

  return (
    <div id="weed-pull-game-view" className="flex flex-col items-center bg-emerald-50 border-4 border-emerald-300 rounded-3xl p-4 w-full shadow-xl select-none relative overflow-hidden">
      {/* Decorative sky grass */}
      <div className="absolute top-0 inset-x-0 h-2 bg-emerald-300/40" />

      {/* Title Header bar */}
      <div className="flex justify-between items-center w-full bg-white border border-emerald-200/80 shadow-sm p-3 rounded-2xl mb-4 z-10">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500 animate-spin" />
          <div>
            <h4 className="font-bold text-stone-800 text-xs">잡초뽑기 검정시험 (Grade 5)</h4>
            <p className="text-[10px] text-stone-400 font-medium">풀을 뽑아 자격증을 따볼까요?</p>
          </div>
        </div>

        {/* Dashboard timers / scores */}
        <div className="flex gap-4 font-mono text-xs items-center">
          <div className="bg-emerald-100/60 px-2.5 py-1 rounded-xl text-center">
            <div className="text-[8px] text-emerald-600 font-bold uppercase">TIME</div>
            <div className={`font-bold text-sm ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-stone-700'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="bg-yellow-100/60 px-2.5 py-1 rounded-xl text-center">
            <div className="text-[8px] text-yellow-700 font-bold uppercase">PASS SCORE</div>
            <div className="font-bold text-stone-700 text-sm">
              {score}/{passingScore}
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && !isExamCompleted ? (
        /* Exam Tutorial Shell */
        <div className="flex flex-col items-center text-center justify-center min-h-[350px] w-full bg-white/90 rounded-2xl p-6 border border-emerald-100 z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-3"
          >
            <div className="text-6xl mb-1 text-center">🌱</div>
            <h3 className="text-lg font-bold text-stone-800 tracking-tight">잡초뽑기 검정 5급 자격 시험</h3>
            <p className="text-stone-500 text-xs mt-2 px-2 max-w-sm">
              {character.name} 친구와 함께 잡초 분류 뽑기 시험에 응시하세요! 제한 시간 25초 동안 빠르고 정확하게 잡초들을 골라 수확해보아요.
            </p>
          </motion.div>

          {/* Weed Dictionary */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs my-4 text-[10px]">
            <div className="flex flex-col items-center p-2 rounded-xl border border-emerald-100 bg-emerald-50/50">
              <span className="text-2xl animate-bounce">🌿</span>
              <span className="font-bold text-emerald-700 mt-1">일반 풀</span>
              <span className="text-stone-400">1번 탭 (+3점)</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl border border-yellow-200 bg-yellow-50/50 animate-pulse">
              <span className="text-2xl">✨🌾</span>
              <span className="font-bold text-amber-700 mt-1">황금 풀</span>
              <span className="text-stone-400">2번 탭 (+8점)</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl border border-rose-200 bg-rose-50/50">
              <span className="text-2xl">🍄</span>
              <span className="font-bold text-red-600 mt-1">독버섯</span>
              <span className="text-stone-400">클릭 금지 (-5점)</span>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-xs mt-2">
            <button
              id="exit-weed-exam-lobby-btn"
              onClick={onExit}
              className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-500 hover:text-stone-700 hover:bg-stone-50 active:scale-95 transition-all text-xs font-semibold"
            >
              포기하기
            </button>
            <button
              id="start-weed-button"
              onClick={startExam}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200 active:scale-95 transition-all text-xs font-bold"
            >
              시험 응시하기 📝
            </button>
          </div>
        </div>
      ) : isExamCompleted ? (
        /* Exam Completion & License Card design! */
        <div className="flex flex-col items-center text-center justify-center min-h-[350px] w-full bg-white/90 rounded-2xl p-5 border border-emerald-100 z-10 font-sans">
          {passedExam ? (
            /* PASSED RETRO LICENSE CARD DISPLAY */
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-3">
                <span className="text-5xl block animate-bounce">🎉</span>
                <h3 className="text-lg font-black text-emerald-600">축하합니다! 합격하셨습니다!</h3>
                <p className="text-stone-400 text-[10px]">먼작귀 잡초뽑기 협회 공식 회원 등록</p>
              </div>

              {/* License Envelope representation */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100/60 p-4 border-2 border-dashed border-amber-300 rounded-2xl relative shadow-md overflow-hidden text-left mb-4">
                <div className="absolute top-2 right-2 border-4 border-amber-500/30 text-amber-500/30 font-black rounded-full w-14 h-14 flex items-center justify-center text-xs rotate-12 select-none uppercase">
                  협회인증
                </div>

                <div className="flex items-center gap-2 border-b border-amber-200 pb-2 mb-2">
                  <Award size={20} className="text-amber-500 fill-amber-500" />
                  <span className="font-extrabold text-stone-800 text-xs uppercase tracking-wide">
                    잡초뽑기 검정 자격증 (5급)
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Photo frame */}
                  <div
                    className="w-16 h-16 rounded-xl border border-amber-300 flex items-center justify-center relative flex-shrink-0 bg-white"
                  >
                    <CharacterSprite id={character.id} size={50} mode="happy" />
                    <div className="absolute bottom-1 right-1 leading-none text-[8px] bg-amber-500 text-white rounded px-1 scale-90">
                      합격
                    </div>
                  </div>

                  {/* License Info */}
                  <div className="font-mono text-stone-700 text-[10px] space-y-1.5 flex-1">
                    <div>
                      <span className="text-stone-400 font-bold">성 명:</span> {character.name} ({character.jpName})
                    </div>
                    <div>
                      <span className="text-stone-400 font-bold">자격 번호:</span> CHI-50-{(728833 + score).toString()}
                    </div>
                    <div>
                      <span className="text-stone-400 font-bold">기록 점수:</span> {score}점 획득 (기준: 45점)
                    </div>
                    <div className="text-[8px] text-amber-700 font-bold py-0.5 border-t border-amber-200 mt-1">
                      ★ 협회장 라코 대장 보증 자격 보유
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 bg-stone-50 border border-stone-200 p-2 rounded-xl mb-4 font-sans inline-block">
                성공 보수: <span className="text-emerald-600 font-bold">⭐ {earnedCoins + 15} 코인</span> 적립!
              </div>
            </motion.div>
          ) : (
            /* FAILED VIEW WITH HACHIWARE CONSOLATION */
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-xs mb-3"
            >
              <div className="text-5xl block mb-2">😢</div>
              <h3 className="text-base font-bold text-stone-700">아쉬운 결과를 얻었습니다...</h3>
              <p className="text-stone-400 text-[10px] mt-1">기록: {score}점 (합격 기준인 {passingScore}점에 조금 모자라요)</p>

              {/* Sweet cartoon drawing of Hachiware */}
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 my-4 text-left flex gap-2 items-center">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-sky-200 flex-shrink-0">
                  <CharacterSprite id="hachiware" size={34} />
                </div>
                <div className="font-sans text-[10px] text-sky-800 leading-relaxed">
                  하치와레의 응원: <span className="font-bold">"괜찮아, {character.name}! 다음에 꼭 딸 수 있을 거야! 내가 공부용 모조 책 선물할게."</span>
                </div>
              </div>

              <div className="text-[10px] text-stone-500 mb-4 bg-stone-50 border p-1 px-2 rounded-full inline-block">
                참가 보수: <span className="text-emerald-600 font-bold">⭐ {earnedCoins + 4} 코인</span> 적립!
              </div>
            </motion.div>
          )}

          <div className="flex gap-3 w-full max-w-xs">
            <button
              id="exit-test-completely-btn"
              onClick={onExit}
              className="flex-1 py-1.5 rounded-xl border text-stone-500 hover:text-stone-700 text-xs font-semibold"
            >
              시험장 퇴장하기
            </button>
            <button
              id="retry-test-exam-btn"
              onClick={startExam}
              className="flex-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold shadow active:scale-95 transition-all text-center"
            >
              {passedExam ? '더 나은 점수 도전 📝' : '재시험 응시하기 📝'}
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE WEEDS GARDEN GRID VIEW */
        <div className="relative w-full aspect-square max-w-[340px] bg-gradient-to-b from-[#DCFCE7] to-[#86EFAC] border-4 border-white rounded-3xl overflow-hidden shadow-inner p-3 grid grid-cols-4 grid-rows-4 gap-2">
          {/* Garden Flowers backdrop rendering */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

          {/* Map Grid Elements */}
          {Array.from({ length: 16 }).map((_, idx) => {
            const weed = weeds.find((w) => w.gridIndex === idx);

            return (
              <div
                key={idx}
                className="relative bg-[#BBF7D0]/60 border border-[#86EFAC]/40 rounded-2xl flex items-center justify-center p-1 cursor-pointer hover:bg-[#86EFAC]/40 overflow-visible transition-colors"
              >
                <AnimatePresence>
                  {weed && (
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 1.5, opacity: 0, y: -20 }}
                      onClick={() => handleWeedTap(weed)}
                      className="absolute inset-0 flex flex-col items-center justify-center z-10 active:scale-90 select-none cursor-pointer"
                    >
                      {/* Weed visual asset drawing */}
                      {weed.type === 'normal' && (
                        <div className="text-center relative">
                          <span className="text-3xl filter drop-shadow block animate-bounce">🌿</span>
                          <span className="text-[6px] font-bold bg-emerald-600 text-white rounded-full px-1 py-0.5 absolute -bottom-1 left-1.5 leading-none scale-75">
                            잡초
                          </span>
                        </div>
                      )}

                      {weed.type === 'rare' && (
                        <div className="text-center relative">
                          {weed.tapsRequired - weed.tapsCollected > 1 && (
                            <span className="absolute -top-2 right-0 text-[8px] bg-amber-500 text-white leading-none scale-90 px-1 rounded-full animate-bounce">
                              Double!
                            </span>
                          )}
                          <span className="text-3xl filter drop-shadow block animate-bounce" style={{ filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.5))' }}>🌾</span>
                          <span className="text-[6px] font-bold bg-amber-600 text-stone-100 rounded-full px-1 py-0.5 absolute -bottom-1 left-1.5 leading-none scale-75">
                            {weed.tapsRequired - weed.tapsCollected}번 더
                          </span>
                        </div>
                      )}

                      {weed.type === 'poison' && (
                        <div className="text-center relative">
                          <span className="text-3xl filter drop-shadow block animate-ping absolute opacity-30">🍄</span>
                          <span className="text-3xl filter drop-shadow block">🍄</span>
                          <span className="text-[6px] font-bold bg-rose-600 text-white rounded-full px-1 py-0.5 absolute -bottom-1 left-1 leading-none scale-75 flex items-center justify-center gap-0.5 whitespace-nowrap">
                            <ShieldAlert size={6} /> 위험
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Garden progress HUD */}
      {isPlaying && !isExamCompleted && (
        <div className="mt-4 w-full text-center text-[10px] text-emerald-800 font-bold bg-emerald-100/50 p-2 border border-emerald-200 rounded-xl">
          💡 모지코 팁: <span className="font-extrabold text-amber-700">황금 잡초🌾</span>는 더 많은 점수를 주지만 <span className="underline">두 번</span> 쳐야 뽑혀요! 독버섯은 누르지 마세요!
        </div>
      )}
    </div>
  );
}
