/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterId =
  | 'chiikawa'
  | 'hachiware'
  | 'usagi'
  | 'momonga'
  | 'kurimanju'
  | 'rakko'
  | 'shisa'
  | 'kani';

export interface GameCharacter {
  id: CharacterId;
  name: string;
  jpName: string;
  description: string;
  color: string; // Tailwind bg color class
  accentColor: string; // Tailwind border/text color class
  textColor: string;
  avatarBg: string; // Hex or tailwind color
  weapon: string;
  weaponIcon: string;
  catchphrase: string;
  specialty: string;
  audioFrequency: number; // Pitch offset for customized synth voice clicks
}

export interface CollectibleItem {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  imageType: string; // SVG renderer marker
  isUnlocked: boolean;
}

export type GameMode = 'menu' | 'character_select' | 'tobatsu' | 'weed_pulling' | 'snack_catch' | 'gacha';

export interface GameStats {
  starCoins: number;
  highScores: {
    tobatsu: number;
    weed_pulling: number;
    snack_catch: number;
  };
  totalPulledWeeds: number;
  totalSubduedMonsters: number;
  totalCaughtSnacks: number;
  unlockedCollectibles: string[]; // List of CollectibleItem IDs
  licenseGrade: number | null; // Null, 5, 4, 3 etc.
}
