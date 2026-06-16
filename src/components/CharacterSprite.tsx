/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CharacterSpriteProps {
  id: string;
  size?: number;
  mode?: 'normal' | 'happy' | 'hurt' | 'sleeping';
  className?: string;
}

export default function CharacterSprite({ id, size = 48, mode = 'normal', className = '' }: CharacterSpriteProps) {
  // Normalize IDs
  const normId = id.toLowerCase().replace('fig_', '');

  // Render different SVG illustrations based on the character ID and state
  const renderSVG = () => {
    switch (normId) {
      case 'chiikawa':
        return (
          <g>
            {/* Ears */}
            <path d="M 24 24 C 20 8, 38 8, 38 22 Z" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 76 24 C 80 8, 62 8, 62 22 Z" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Inner Ears */}
            <path d="M 25 21 C 23 13, 33 13, 34 20 Z" fill="#FFE2E6" />
            <path d="M 75 21 C 77 13, 67 13, 66 20 Z" fill="#FFE2E6" />

            {/* Head Base */}
            <ellipse cx="50" cy="54" rx="38" ry="32" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Eyes */}
            {mode === 'hurt' ? (
              // Crying / hurt eyes
              <>
                <path d="M 33 46 Q 37 40 40 45" stroke="#4A4A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 67 46 Q 63 40 60 45" stroke="#4A4A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Teardrops */}
                <path d="M 30 48 Q 28 58 34 54 Z" fill="#7DD3FC" />
                <path d="M 70 48 Q 72 58 66 54 Z" fill="#7DD3FC" />
              </>
            ) : mode === 'happy' ? (
              // Joyful curved eyes
              <>
                <path d="M 30 46 Q 36 40 42 46" stroke="#4A4A4A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 58 46 Q 64 40 70 46" stroke="#4A4A4A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </>
            ) : (
              // Standard wide cute eyes
              <>
                <ellipse cx="36" cy="46" rx="4.5" ry="5.5" fill="#2E2E2E" />
                <ellipse cx="64" cy="46" rx="4.5" ry="5.5" fill="#2E2E2E" />
                {/* Eye Highlights */}
                <ellipse cx="34.5" cy="44.5" rx="1.5" ry="2" fill="#FFFFFF" />
                <ellipse cx="62.5" cy="44.5" rx="1.5" ry="2" fill="#FFFFFF" />
              </>
            )}

            {/* Eyebrows (Slanted cute) */}
            {mode === 'hurt' ? (
              <>
                <path d="M 30 36 Q 34 38 38 33" stroke="#4A4A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 70 36 Q 66 38 62 33" stroke="#4A4A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M 30 35 Q 35 32 39 36" stroke="#4A4A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 70 35 Q 65 32 61 36" stroke="#4A4A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Rosy Chemises Blushes */}
            <ellipse cx="25" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.8" />
            <ellipse cx="75" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.8" />
            {/* Blush Lines */}
            <line x1="22" y1="58" x2="25" y2="55" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="25" y1="59" x2="28" y2="56" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="72" y1="58" x2="75" y2="55" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="75" y1="59" x2="78" y2="56" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

            {/* Mouth */}
            {mode === 'happy' ? (
              <path d="M 46 54 Q 50 63 54 54 Z" fill="#E11D48" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" />
            ) : mode === 'hurt' ? (
              <path d="M 46 59 Q 50 54 54 59" stroke="#4A4A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 46 55 Q 50 57 54 55" stroke="#4A4A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            
            {/* Tiny pink tongue inside happy mouth */}
            {mode === 'happy' && <path d="M 48 58 Q 50 61 52 58 Z" fill="#FDA4AF" />}
          </g>
        );

      case 'hachiware':
        return (
          <g>
            {/* Ears (Pointy cat ears) */}
            <path d="M 20 25 C 10 10, 32 8, 35 22 Z" fill="#47A5FF" stroke="#4A4A4A" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 80 25 C 90 10, 68 8, 65 22 Z" fill="#47A5FF" stroke="#4A4A4A" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Inner Ears */}
            <path d="M 21 21 C 15 13, 28 12, 30 18 Z" fill="#FFE2E6" />
            <path d="M 79 21 C 85 13, 72 12, 70 18 Z" fill="#FFE2E6" />

            {/* Head Base */}
            <ellipse cx="50" cy="54" rx="38" ry="32" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Blue Forehead Mask overlay (Hachiware blue pattern) */}
            <path d="M 14 46 C 20 30, 36 24, 45 36 C 47 38, 53 38, 55 36 C 64 24, 80 30, 86 46 C 84 41, 74 34, 62 33 C 57 32, 53 34, 50 36 C 47 34, 43 32, 38 33 C 26 34, 16 41, 14 46 Z" fill="#47A5FF" />
            <path d="M 12.5 50 C 13 36, 32 23, 50 38 C 68 23, 87 36, 87.5 50 C 82 46, 70 34, 50 42 C 30 34, 18 46, 12.5 50 Z" fill="#47A5FF" />

            {/* Eyes */}
            {mode === 'happy' ? (
              <>
                <path d="M 30 46 Q 36 40 42 46" stroke="#4A4A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 58 46 Q 64 40 70 46" stroke="#4A4A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="36" cy="46" rx="4.5" ry="5.5" fill="#2E2E2E" />
                <ellipse cx="64" cy="46" rx="4.5" ry="5.5" fill="#2E2E2E" />
                <ellipse cx="34.5" cy="44.5" rx="1.5" ry="2" fill="#FFFFFF" />
                <ellipse cx="62.5" cy="44.5" rx="1.5" ry="2" fill="#FFFFFF" />
              </>
            )}

            {/* Eyebrows */}
            <path d="M 31 36 Q 35 32 39 35" stroke="#4A4A4A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 69 36 Q 65 32 61 35" stroke="#4A4A4A" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Blush cheeks */}
            <ellipse cx="24" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.8" />
            <ellipse cx="76" cy="58" rx="6" ry="4" fill="#FFB3C1" opacity="0.8" />

            {/* Mouth (Cheerful open smile) */}
            {mode === 'happy' ? (
              <path d="M 45 53 Q 50 63 55 53 Z" fill="#E11D48" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M 46 54 C 48 52, 50 52, 52 54 C 53 52, 55 52, 57 54" stroke="#4A4A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            {/* Whiskers (super subtle cute kitten) */}
            <line x1="12" y1="56" x2="6" y2="55" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="60" x2="5" y2="61" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="88" y1="56" x2="94" y2="55" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="88" y1="60" x2="95" y2="61" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'usagi':
        return (
          <g>
            {/* Long tall bunny ears */}
            <path d="M 31 30 C 20 -2, 40 -4, 42 28 Z" fill="#FCE79C" stroke="#4A4A4A" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 69 30 C 80 -2, 60 -4, 58 28 Z" fill="#FCE79C" stroke="#4A4A4A" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Inner Ears (Pink) */}
            <path d="M 32 25 C 28 6, 38 6, 39 24 Z" fill="#FFE2E6" />
            <path d="M 68 25 C 72 6, 62 6, 61 24 Z" fill="#FFE2E6" />

            {/* Head Base */}
            <ellipse cx="50" cy="56" rx="38" ry="32" fill="#FCE79C" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Wide goofy round eyes */}
            <ellipse cx="36" cy="46" rx="5" ry="6" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="64" cy="46" rx="5" ry="6" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2" />
            {/* Tiny pupils for that crazy usagi energy! */}
            <circle cx="36" cy="46" r="2" fill="#2E2E2E" />
            <circle cx="64" cy="46" r="2" fill="#2E2E2E" />

            {/* Rosy blushing cheeks */}
            <ellipse cx="24" cy="60" rx="6" ry="4" fill="#FFB3C1" opacity="0.8" />
            <ellipse cx="76" cy="60" rx="6" ry="4" fill="#FFB3C1" opacity="0.8" />

            {/* Big Open Goofy Triangular Mouth */}
            <path d="M 44 54 Q 50 66 56 54 Z" fill="#EF4444" stroke="#4A4A4A" strokeWidth="2" />
            <circle cx="50" cy="62" r="3" fill="#FCA5A5" />
          </g>
        );

      case 'momonga':
        return (
          <g>
            {/* Puff squirrel ears */}
            <circle cx="24" cy="24" r="10" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="76" cy="24" r="10" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="6" fill="#FFE2E6" />
            <circle cx="76" cy="24" r="6" fill="#FFE2E6" />

            {/* Head Base */}
            <ellipse cx="50" cy="54" rx="38" ry="32" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Big beautiful shiny anime eyes (turquoise teal) */}
            <ellipse cx="34" cy="46" rx="7.5" ry="8.5" fill="#38BDF8" stroke="#4A4A4A" strokeWidth="2.5" />
            <ellipse cx="66" cy="46" rx="7.5" ry="8.5" fill="#38BDF8" stroke="#4A4A4A" strokeWidth="2.5" />
            {/* Outer dark ring pupillary offset */}
            <ellipse cx="34" cy="46" rx="4.5" ry="5.5" fill="#1E3A8A" />
            <ellipse cx="66" cy="46" rx="4.5" ry="5.5" fill="#1E3A8A" />
            {/* Sparkle reflections */}
            <circle cx="32" cy="43" r="2.2" fill="#FFFFFF" />
            <circle cx="36" cy="49" r="1.1" fill="#FFFFFF" />
            <circle cx="64" cy="43" r="2.2" fill="#FFFFFF" />
            <circle cx="68" cy="49" r="1.1" fill="#FFFFFF" />

            {/* Big soft fluffy blushes */}
            <ellipse cx="22" cy="58" rx="7" ry="5" fill="#FF9EAF" opacity="0.85" />
            <ellipse cx="78" cy="58" rx="7" ry="5" fill="#FF9EAF" opacity="0.85" />

            {/* Mouth */}
            <path d="M 46 56 Q 50 53 54 56 Q 50 60 46 56" fill="#E11D48" stroke="#4A4A4A" strokeWidth="1.8" />
          </g>
        );

      case 'kurimanju':
        return (
          <g>
            {/* Small ear bumps */}
            <ellipse cx="20" cy="30" rx="6" ry="6" fill="#D97706" stroke="#4A4A4A" strokeWidth="2.5" />
            <ellipse cx="80" cy="30" rx="6" ry="6" fill="#D97706" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Whole chestnut split shell head */}
            <ellipse cx="50" cy="56" rx="38" ry="32" fill="#FFFBEB" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Brown chestnut pastry topping */}
            <path d="M 12 50 C 13 25, 87 25, 88 50 C 72 40, 28 40, 12 50 Z" fill="#D97706" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Relaxed drinking satisfied squint eyes */}
            <path d="M 28 48 Q 34 44 40 48" stroke="#4A4A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 60 48 Q 66 44 72 48" stroke="#4A4A4A" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Rosy warm alcohol/juice flush cheek circles */}
            <circle cx="23" cy="58" r="6" fill="#F87171" opacity="0.75" />
            <circle cx="77" cy="58" r="6" fill="#F87171" opacity="0.75" />

            {/* Satisfied sigh mouth */}
            <ellipse cx="50" cy="57" rx="3.5" ry="4.5" fill="#7F1D1D" stroke="#4A4A4A" strokeWidth="1.8" />
          </g>
        );

      case 'rakko':
        return (
          <g>
            {/* Sea otter wavy ears */}
            <path d="M 22 26 C 14 18, 30 14, 32 24 Z" fill="#D6D3D1" stroke="#4A4A4A" strokeWidth="2" />
            <path d="M 78 26 C 86 18, 70 14, 68 24 Z" fill="#D6D3D1" stroke="#4A4A4A" strokeWidth="2" />

            {/* Head Base */}
            <ellipse cx="50" cy="54" rx="38" ry="32" fill="#E7E5E4" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Dark Star mark scar on left side of forehead */}
            <path d="M 33 22 L 35 27 L 40 27 L 36 30 L 38 35 L 33 32 L 28 35 L 30 30 L 26 27 L 31 27 Z" fill="#78716C" stroke="#4A4A4A" strokeWidth="1" />

            {/* Thick cool hero eyebrows */}
            <path d="M 27 38 L 39 36" stroke="#4A4A4A" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 73 38 L 61 36" stroke="#4A4A4A" strokeWidth="3.5" strokeLinecap="round" />

            {/* Calm, serious little eyes */}
            <circle cx="33" cy="45" r="3.5" fill="#2E2E2E" />
            <circle cx="67" cy="45" r="3.5" fill="#2E2E2E" />
            <circle cx="32.5" cy="44" r="1.2" fill="#FFFFFF" />
            <circle cx="66.5" cy="44" r="1.2" fill="#FFFFFF" />

            {/* Blush cheeks */}
            <ellipse cx="24" cy="56" rx="5" ry="3" fill="#FCA5A5" opacity="0.6" />
            <ellipse cx="76" cy="56" rx="5" ry="3" fill="#FCA5A5" opacity="0.6" />

            {/* Cool determined whiskers & muzzle mouth */}
            <circle cx="47" cy="53" r="3" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="1.5" />
            <circle cx="53" cy="53" r="3" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="1.5" />
            <path d="M 50 51 L 50 55" stroke="#4A4A4A" strokeWidth="1.5" />
            <polygon points="48,49 52,49 50,51" fill="#4A4A4A" />
          </g>
        );

      case 'shisa':
        return (
          <g>
            {/* Orange Lion Mane fluffy clouds left/right */}
            <circle cx="16" cy="40" r="10" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="14" cy="55" r="10" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="20" cy="70" r="9" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="84" cy="40" r="10" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="86" cy="55" r="10" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />
            <circle cx="80" cy="70" r="9" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Mane crown on top */}
            <path d="M 35 25 Q 50 10 65 25" fill="#F97316" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Lion Head Base */}
            <ellipse cx="50" cy="55" rx="33" ry="30" fill="#FEF08A" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Curly Cute Shisa Eyebrows */}
            <path d="M 28 35 Q 34 30 38 35" stroke="#F97316" strokeWidth="3" fill="none" />
            <path d="M 72 35 Q 66 30 62 35" stroke="#F97316" strokeWidth="3" fill="none" />

            {/* Eyes */}
            <circle cx="36" cy="45" r="4.5" fill="#2E2E2E" />
            <circle cx="64" cy="45" r="4.5" fill="#2E2E2E" />
            <circle cx="34.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            <circle cx="62.5" cy="43.5" r="1.5" fill="#FFFFFF" />

            {/* Blush cheeks */}
            <ellipse cx="24" cy="57" rx="5" ry="3.5" fill="#EF4444" opacity="0.8" />
            <ellipse cx="76" cy="57" rx="5" ry="3.5" fill="#EF4444" opacity="0.8" />

            {/* Double wave smile */}
            <path d="M 44 54 Q 50 63 56 54 Z" fill="#EF4444" stroke="#4A4A4A" strokeWidth="1.8" />
          </g>
        );

      case 'kani':
        return (
          <g>
            {/* Crab Hat claws and body on top */}
            <ellipse cx="50" cy="24" rx="22" ry="12" fill="#F472B6" stroke="#4A4A4A" strokeWidth="2" />
            {/* Crab eyes */}
            <circle cx="42" cy="12" r="4" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="1.5" />
            <circle cx="58" cy="12" r="4" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="1.5" />
            <circle cx="42" cy="12" r="1.5" fill="#1A1A1A" />
            <circle cx="58" cy="12" r="1.5" fill="#1A1A1A" />
            {/* Left/Right crab claw hands */}
            <path d="M 24 24 Q 15 15 28 8" stroke="#4A4A4A" strokeWidth="2" fill="none" />
            <path d="M 76 24 Q 85 15 72 8" stroke="#4A4A4A" strokeWidth="2" fill="none" />

            {/* Head Base */}
            <ellipse cx="50" cy="56" rx="36" ry="30" fill="#FDF4FF" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Gentle, grateful shy eyes */}
            <path d="M 30 46 Q 36 41 40 47" stroke="#4A4A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 70 46 Q 64 41 60 47" stroke="#4A4A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Cheeks */}
            <ellipse cx="23" cy="58" rx="5" ry="3.5" fill="#F472B6" opacity="0.8" />
            <ellipse cx="77" cy="58" rx="5" ry="3.5" fill="#F472B6" opacity="0.8" />

            {/* Quiet friendly smile */}
            <path d="M 46 56 Q 50 59 54 56" stroke="#4A4A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'golden_sasumata':
        return (
          <g>
            {/* Golden Spear Weapon Art */}
            <path d="M 50 15 L 50 90" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            <path d="M 40 30 Q 50 10 60 30" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 40 28 L 36 22 L 44 24 Z" fill="#F59E0B" />
            <path d="M 60 28 L 64 22 L 56 24 Z" fill="#F59E0B" />
            <circle cx="50" cy="40" r="6" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
            <path d="M 50 12 L 50 20" stroke="#F59E0B" strokeWidth="3" />
            {/* Glow star reflections */}
            <polygon points="50,2 52,8 58,10 52,12 50,18 48,12 42,10 48,8" fill="#FFF" />
          </g>
        );

      case 'ramen':
        return (
          <g>
            {/* Large Red Ramen Bowl */}
            <path d="M 15 50 Q 50 95 85 50 Z" fill="#EF4444" stroke="#4A4A4A" strokeWidth="3" />
            <rect x="25" y="85" width="50" height="8" fill="#B91C1C" stroke="#4A4A4A" strokeWidth="2" rx="2" />

            {/* Noodles overlay */}
            <ellipse cx="50" cy="50" rx="32" ry="10" fill="#FEF08A" stroke="#4A4A4A" strokeWidth="2.5" />

            {/* Hot soup waves */}
            <path d="M 22 50 Q 35 46 50 50 Q 65 54 78 50" stroke="#F59E0B" strokeWidth="3" fill="none" />

            {/* Special chashu meat swirls */}
            <circle cx="34" cy="52" r="8" fill="#FCA5A5" stroke="#4A4A4A" strokeWidth="1.5" />
            <path d="M 34 52 Q 31 49 34 46 Q 37 49 34 52 Z" fill="#FECDD3" />

            {/* Soft boiled egg half */}
            <ellipse cx="65" cy="51" rx="7" ry="5" fill="#FFFFFF" stroke="#4A4A4A" strokeWidth="1.5" />
            <ellipse cx="65" cy="51" rx="4" ry="2.5" fill="#F59E0B" />

            {/* Green onion bits */}
            <rect x="44" y="47" width="4" height="4" fill="#22C55E" transform="rotate(25)" />
            <rect x="52" y="49" width="4" height="4" fill="#22C55E" transform="rotate(-15)" />

            {/* Rising steam clouds */}
            <path d="M 40 35 Q 43 25 40 18" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M 60 35 Q 63 25 60 18" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
          </g>
        );

      default:
        return (
          <g>
            {/* Placeholders */}
            <circle cx="50" cy="50" r="40" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="3" />
            <text x="50" y="58" fontSize="24" textAnchor="middle" fill="#9CA3AF" fontWeight="bold">?</text>
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block select-none pointer-events-none transform active:scale-95 transition-transform ${className}`}
      style={{ minWidth: size, minHeight: size }}
    >
      {renderSVG()}
    </svg>
  );
}
