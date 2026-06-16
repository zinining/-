/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameCharacter, CollectibleItem } from '../types';

export const CHARACTERS: GameCharacter[] = [
  {
    id: 'chiikawa',
    name: '치이카와',
    jpName: 'ちいかわ',
    description: '조금 심약하고 울보지만, 친구들을 위해서 누구보다 용기를 내는 귀여운 하얀 친구예요. 가끔 눈물을 훔치며 토벌을 나간답니다.',
    color: 'bg-rose-50 border-rose-300 hover:bg-rose-100',
    accentColor: 'border-rose-300 text-rose-500 bg-rose-100',
    textColor: 'text-rose-700',
    avatarBg: '#FFE4E6',
    weapon: '핑크 사수마타 (Forked Spear)',
    weaponIcon: '⚔️',
    catchphrase: '와아... 후에에... 홧-!',
    specialty: '도망가다 반격하기, 풀 뽑기 무기 사용',
    audioFrequency: 659.25 // E5 (high Cute pitch)
  },
  {
    id: 'hachiware',
    name: '하치와레',
    jpName: 'ハチワレ',
    description: '파란색 무늬가 주위를 감싼 귀여운 고양이 친구! 어려운 단어도 잘 쓰고 말을 가장 똑부러지게 잘하며, 언제나 "어떻게든 될 거야(난토카 나레!)"라고 긍정적으로 생각해요.',
    color: 'bg-sky-50 border-sky-300 hover:bg-sky-100',
    accentColor: 'border-sky-300 text-sky-500 bg-sky-100',
    textColor: 'text-sky-700',
    avatarBg: '#E0F2FE',
    weapon: '블루 사수마타 (Blue Spear)',
    weaponIcon: '🔱',
    catchphrase: '난토카 나레-! (어떻게든 될 거야!)',
    specialty: '조리있게 설명하기, 친구 위로하기',
    audioFrequency: 523.25 // C5 (medium-high cheerful)
  },
  {
    id: 'usagi',
    name: '우사기',
    jpName: 'うさぎ',
    description: '항상 에너지가 넘치다 못해 폭발하는 노란 토끼! 무슨 생각을 하는지 알 수 없으며 "야하-!", "우라앗-!", "푸루루" 같은 기묘한 외침과 함께 대범한 괴력을 보인답니다.',
    color: 'bg-amber-50 border-amber-300 hover:bg-amber-100',
    accentColor: 'border-amber-300 text-amber-500 bg-amber-100',
    textColor: 'text-amber-700',
    avatarBg: '#FEF3C7',
    weapon: '마법의 리볼빙 비눗방울 스틱',
    weaponIcon: '🪄',
    catchphrase: '우라앗-! 야하-! 푸루루루루!!',
    specialty: '엄청난 공중 제비, 몬스터 단숨에 날리기',
    audioFrequency: 783.99 // G5 (Super high hyperactive pitch)
  },
  {
    id: 'momonga',
    name: '모몽가',
    jpName: 'モモンガ',
    description: '하얀 하늘다람쥐 모습을 한 욕심쟁이 친구! 온 세상 사람들에게 잔뜩 예쁨받고 응석부리는 것이 인생 최고의 목표랍니다. "날 찬양해라!"',
    color: 'bg-purple-50 border-purple-300 hover:bg-purple-100',
    accentColor: 'border-purple-300 text-purple-500 bg-purple-100',
    textColor: 'text-purple-700',
    avatarBg: '#F3E8FF',
    weapon: '앙탈부리기 액션 & 날카로운 꼬리',
    weaponIcon: '✨',
    catchphrase: '날 예뻐해랏!! 어서 귀여워하란 말야!',
    specialty: '눈 흘기며 귀여운 척하기, 간식 뺏어먹기',
    audioFrequency: 587.33 // D5 (Slightly snarky cute)
  },
  {
    id: 'kurimanju',
    name: '크리만쥬',
    jpName: 'くりまんじゅう',
    description: '밤만쥬를 닮은 점잖고 풍류를 즐기는 선배 친구! 매사에 차분하며 식사나 맛있는 주스를 마신 뒤에 고개를 살포시 젖히며 "캬아-!"라고 깊은 한숨을 쉬어요.',
    color: 'bg-amber-100 border-amber-400 hover:bg-amber-200',
    accentColor: 'border-amber-400 text-amber-600 bg-amber-200',
    textColor: 'text-amber-800',
    avatarBg: '#FEF3C7',
    weapon: '상큼한 탄산 드링크 캔',
    weaponIcon: '🥫',
    catchphrase: '캬하아-! (한 모금 들이키고 머리를 흔든다)',
    specialty: '드링크 안주 환상 케미 찾기, 진동 마사지',
    audioFrequency: 329.63 // E4 (low husky sound)
  },
  {
    id: 'rakko',
    name: '라코',
    jpName: 'ラッコ',
    description: '이마의 별 상처가 상징이자, 토벌 실력 넘버원인 베테랑 해달 대장님! 항상 멋지게 망토를 휘날리지만, 달콤한 초코 크레페를 마주하면 수줍게 귀가 빨개진답니다.',
    color: 'bg-stone-100 border-stone-400 hover:bg-stone-200',
    accentColor: 'border-stone-400 text-stone-600 bg-stone-200',
    textColor: 'text-stone-800',
    avatarBg: '#F5F5F4',
    weapon: '전설의 고강도 광선 소드',
    weaponIcon: '⚔️',
    catchphrase: '훗... 침착해라. 토벌은 기세다.',
    specialty: '디저트 카페 맛집 투어, 몬스터 1초 컷 베기',
    audioFrequency: 261.63 // C4 (deep cool leader)
  },
  {
    id: 'shisa',
    name: '시사',
    jpName: 'シーサー',
    description: '오키나와에서 온 친절한 사자 친구! 아르바이트 자격증 공부를 위해 매일 밤새워 열공하며, 라멘 가게인 "로오우(郎)"에서 성실하게 손님을 응대하고 있답니다.',
    color: 'bg-orange-50 border-orange-300 hover:bg-orange-100',
    accentColor: 'border-orange-300 text-orange-500 bg-orange-100',
    textColor: 'text-orange-700',
    avatarBg: '#FFEDD5',
    weapon: '최고급 갈릭 어시스트 국자',
    weaponIcon: '🍜',
    catchphrase: '시사-! 우레시이자! (기뻐라!)',
    specialty: '비장의 차슈 얹기, 알바 면접 폰트 연구',
    audioFrequency: 554.37 // C#5 (Slightly warm tone)
  },
  {
    id: 'kani',
    name: '카니 (고블린 친구)',
    jpName: '古本屋 (カニ)',
    description: '귀여운 연분홍 꽃게 모자를 쓰고 헌책방을 운영하기도 해요. 치이카와와 하치와레에게 무척 세심하게 친절을 베풀어주는 수줍음 많은 친구예요.',
    color: 'bg-fuchsia-50 border-fuchsia-300 hover:bg-fuchsia-100',
    accentColor: 'border-fuchsia-300 text-fuchsia-500 bg-fuchsia-100',
    textColor: 'text-fuchsia-700',
    avatarBg: '#FDF4FF',
    weapon: '우정의 꽃게 집게 댄스',
    weaponIcon: '🦀',
    catchphrase: '헤헤... 고마워요. 이 책 읽어볼래요?',
    specialty: '헌책 찾기, 우정 조각 스크랩북 만들기',
    audioFrequency: 493.88 // B4 (gentle mellow pitch)
  }
];

export const COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'fig_chiikawa',
    name: '일반 치이카와 피규어',
    koreanName: '치이카와 인형',
    description: '항상 소중하게 간직하는 핑크빛 사수마타를 꼬옥 쥐고 있는 기본 형태 피규어. 볼이 아주 촉촉해요!',
    rarity: 'Common',
    imageType: 'chiikawa',
    isUnlocked: false
  },
  {
    id: 'fig_hachiware_guitar',
    name: '기타 연주 하치와레',
    koreanName: '낭만 하치와레',
    description: '리사이클 숍에서 산 파란 파스텔 기타를 사랑스레 조율하며 촉촉히 노래하는 하치와레 피규어.',
    rarity: 'Rare',
    imageType: 'hachiware',
    isUnlocked: false
  },
  {
    id: 'fig_usagi_dance',
    name: '공중회전 우사기',
    koreanName: '하이퍼 우사기',
    description: '공중 공중 3회전 점프를 가볍게 돌며 우렁차게 "얏하!"를 소리치고 있는 역동적인 포즈의 피규어.',
    rarity: 'Common',
    imageType: 'usagi',
    isUnlocked: false
  },
  {
    id: 'fig_momonga_cute',
    name: '볼빵빵 모몽가',
    koreanName: '새콤 모몽가',
    description: '남의 치즈케이크를 한입 가득 베물어 먹으며 가장 귀여운 눈을 치켜뜨고 조르는 모습의 피규어.',
    rarity: 'Common',
    imageType: 'momonga',
    isUnlocked: false
  },
  {
    id: 'fig_kurimanju_cup',
    name: '온천차 크리만쥬',
    koreanName: '선배 크리만쥬',
    description: '따끈하고 고소한 현미차 한 모금을 한 뒤 "캬하-"하며 볼을 부르르 떠는 노련한 표정의 실물 피규어.',
    rarity: 'Rare',
    imageType: 'kurimanju',
    isUnlocked: false
  },
  {
    id: 'fig_rakko_crepe',
    name: '초코 딸기 크레페 라코',
    koreanName: '라코 대장님',
    description: '멋진 칼 대신 두 손으로 크림이 흘러내리는 대왕 딸기 크레페를 들고서 발을 동동 구르는 레전드 피규어.',
    rarity: 'Legendary',
    imageType: 'rakko',
    isUnlocked: false
  },
  {
    id: 'fig_shisa_ramen',
    name: '로오우 가마솥 시사',
    koreanName: '열정 알바 시사',
    description: '노란 사자 무늬 앞치마를 질끈 매고 커다란 가마솥 국자를 들고 힘껏 웃음 짓는 시사 피규어.',
    rarity: 'Rare',
    imageType: 'shisa',
    isUnlocked: false
  },
  {
    id: 'fig_kani_flower',
    name: '게모자 헌책방 카니',
    koreanName: '꽃게 카니',
    description: '자신과 완벽히 닮은 귀여운 분홍 게 다리가 달린 모자를 고치며 수줍게 인사하는 희귀 피규어.',
    rarity: 'Common',
    imageType: 'kani',
    isUnlocked: false
  },
  {
    id: 'fig_golden_sasumata',
    name: '황금 전설 사수마타',
    koreanName: '황금 사수마타',
    description: '반짝반짝 황금 아우라가 피어오르는 초특급 레전더리 토벌 장비 무기! 소장가치 1000%!',
    rarity: 'Legendary',
    imageType: 'golden_sasumata',
    isUnlocked: false
  },
  {
    id: 'fig_ramen_lang',
    name: '특제 랑그라 마늘 차슈면',
    koreanName: '대왕 차슈 라멘',
    description: '로오우 식당의 특제 한정 메뉴! 그을린 두툼한 차슈 4장과 통마늘 고명이 침을 고이게 만드는 마스터피스.',
    rarity: 'Legendary',
    imageType: 'ramen',
    isUnlocked: false
  }
];
