export interface BotPersonality {
  type: 'mentor' | 'tactical' | 'positional' | 'aggressive' | 'defensive' | 'endgame' | 'opening' | 'creative' | 'analytical' | 'champion';
  name: string;
  avatar: string;
  description: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  messages: {
    greeting: string;
    goodMove: string;
    mistake: string;
    victory: string;
    defeat: string;
    hint: string;
  };
}

export interface LevelConfig {
  levelId: number;
  name: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  parMoves: number;
  engineLevel: number; // 1-30 for our commercial engine
  thinkingTime: number;
  boss: boolean;
  allowAids: boolean;
  bossStarCapWithAids: number;
  personality: BotPersonality;
  analysis: {
    depth: number;
    cpThresholds: { I: number, M: number, B: number };
  };
}

// Bot personalities for all 30 levels
export const BOT_PERSONALITIES: Record<number, BotPersonality> = {
  // BEGINNER LEVELS (1-10)
  1: {
    type: 'mentor',
    name: 'Rookie',
    avatar: '🌱',
    description: 'Learning the basics, makes simple mistakes',
    themeColors: { primary: '#22c55e', secondary: '#16a34a', accent: '#dcfce7' },
    messages: {
      greeting: "Hi! Let's learn chess together! 🌱",
      goodMove: "Great move! You're getting the hang of this!",
      mistake: "Oops! But that's how we learn. Try again!",
      victory: "Well played! You're improving fast!",
      defeat: "Good try! Every game teaches us something new.",
      hint: "Look for a safe move that develops your pieces!"
    }
  },
  2: {
    type: 'mentor',
    name: 'Student',
    avatar: '📚',
    description: 'Eager to learn, focuses on piece development',
    themeColors: { primary: '#3b82f6', secondary: '#2563eb', accent: '#dbeafe' },
    messages: {
      greeting: "Ready to study some chess patterns? 📚",
      goodMove: "Excellent! That follows chess principles perfectly!",
      mistake: "Remember: develop pieces before attacking!",
      victory: "Your understanding of chess is growing!",
      defeat: "Let's review what we learned from this game.",
      hint: "Try to control the center with your pawns!"
    }
  },
  3: {
    type: 'tactical',
    name: 'Scout',
    avatar: '🔍',
    description: 'Always looking for simple tactical shots',
    themeColors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fef3c7' },
    messages: {
      greeting: "Let me scout for some tactics! 🔍",
      goodMove: "Sharp eye! You spotted that tactic!",
      mistake: "Watch out for my sneaky moves!",
      victory: "Your tactical vision is sharpening!",
      defeat: "I found a clever tactic there!",
      hint: "Look for pieces that can be attacked!"
    }
  },
  4: {
    type: 'positional',
    name: 'Builder',
    avatar: '🏗️',
    description: 'Likes to build solid pawn structures',
    themeColors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#ede9fe' },
    messages: {
      greeting: "Time to build a strong position! 🏗️",
      goodMove: "Solid building! That improves your position!",
      mistake: "Careful! That weakens your structure!",
      victory: "You built a winning position beautifully!",
      defeat: "My foundation was stronger this time!",
      hint: "Look for moves that improve your pawn structure!"
    }
  },
  5: {
    type: 'aggressive',
    name: 'Warrior',
    avatar: '⚔️',
    description: 'Likes to attack but sometimes overextends',
    themeColors: { primary: '#ef4444', secondary: '#dc2626', accent: '#fee2e2' },
    messages: {
      greeting: "Let's battle! May the best warrior win! ⚔️",
      goodMove: "Fierce attack! You fight with courage!",
      mistake: "Your defense has gaps! I shall strike!",
      victory: "You fought valiantly and earned this victory!",
      defeat: "My assault was too strong this time!",
      hint: "Look for attacking chances on the enemy king!"
    }
  },
  6: {
    type: 'defensive',
    name: 'Guardian',
    avatar: '🛡️',
    description: 'Solid defender, hard to break down',
    themeColors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#cffafe' },
    messages: {
      greeting: "I shall guard my position well! 🛡️",
      goodMove: "Strong defense! Your position is secure!",
      mistake: "You left a weakness I must exploit!",
      victory: "Your fortress was impenetrable today!",
      defeat: "My defenses held strong this game!",
      hint: "Strengthen your weakest point first!"
    }
  },
  7: {
    type: 'opening',
    name: 'Scholar',
    avatar: '📖',
    description: 'Knows opening principles well',
    themeColors: { primary: '#7c2d12', secondary: '#92400e', accent: '#fed7aa' },
    messages: {
      greeting: "Let's see what opening theory teaches us! 📖",
      goodMove: "Textbook move! You know your openings!",
      mistake: "That goes against opening principles!",
      victory: "Your opening knowledge served you well!",
      defeat: "Theory triumphed over practice this time!",
      hint: "Remember: knights before bishops!"
    }
  },
  8: {
    type: 'creative',
    name: 'Artist',
    avatar: '🎨',
    description: 'Plays imaginative, unconventional moves',
    themeColors: { primary: '#ec4899', secondary: '#db2777', accent: '#fce7f3' },
    messages: {
      greeting: "Let's paint a masterpiece on the board! 🎨",
      goodMove: "Beautiful creativity! That's artistic chess!",
      mistake: "Sometimes art requires sacrifice!",
      victory: "Your creative vision was inspiring!",
      defeat: "My artistic expression was stronger today!",
      hint: "Think outside the box - be creative!"
    }
  },
  9: {
    type: 'analytical',
    name: 'Calculator',
    avatar: '🧮',
    description: 'Calculates variations precisely',
    themeColors: { primary: '#374151', secondary: '#4b5563', accent: '#f3f4f6' },
    messages: {
      greeting: "Time to calculate some variations! 🧮",
      goodMove: "Precisely calculated! Your math is correct!",
      mistake: "Your calculation had an error!",
      victory: "Your precise calculation paid off!",
      defeat: "My calculations were more accurate!",
      hint: "Calculate one move deeper!"
    }
  },
  10: {
    type: 'tactical',
    name: 'Trapper',
    avatar: '🕸️',
    description: 'Sets clever traps and combinations',
    themeColors: { primary: '#7c2d12', secondary: '#991b1b', accent: '#fecaca' },
    messages: {
      greeting: "I've prepared some traps for you! 🕸️",
      goodMove: "You avoided my trap nicely!",
      mistake: "You walked right into my web!",
      victory: "You saw through all my traps!",
      defeat: "My trap worked perfectly!",
      hint: "Be careful - there might be a trap lurking!"
    }
  },

  // INTERMEDIATE LEVELS (11-20)
  11: {
    type: 'positional',
    name: 'Architect',
    avatar: '🏛️',
    description: 'Masters of pawn structure and piece coordination',
    themeColors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' },
    messages: {
      greeting: "Let's build a positional masterpiece! 🏛️",
      goodMove: "Excellent architecture! Your pieces harmonize perfectly!",
      mistake: "That disrupts your beautiful structure!",
      victory: "Your positional understanding is remarkable!",
      defeat: "My architectural plan was superior!",
      hint: "Improve your worst-placed piece!"
    }
  },
  12: {
    type: 'tactical',
    name: 'Assassin',
    avatar: '🗡️',
    description: 'Deadly tactical striker, finds hidden combinations',
    themeColors: { primary: '#7c2d12', secondary: '#451a03', accent: '#fed7aa' },
    messages: {
      greeting: "Prepare for tactical precision! 🗡️",
      goodMove: "Sharp blade! That cut deep!",
      mistake: "You exposed yourself to my strike!",
      victory: "Your tactical blade was sharper today!",
      defeat: "My assassination was swift and clean!",
      hint: "Look for tactical shots - they're everywhere!"
    }
  },
  13: {
    type: 'endgame',
    name: 'Finisher',
    avatar: '🏁',
    description: 'Endgame specialist, converts small advantages',
    themeColors: { primary: '#0f172a', secondary: '#1e293b', accent: '#e2e8f0' },
    messages: {
      greeting: "In the endgame, technique is everything! 🏁",
      goodMove: "Perfect technique! That's how you finish!",
      mistake: "Endgame precision is crucial!",
      victory: "Your endgame technique was flawless!",
      defeat: "Experience won the endgame!",
      hint: "Activate your king in the endgame!"
    }
  },
  14: {
    type: 'aggressive',
    name: 'Berserker',
    avatar: '🔥',
    description: 'All-out attacker, sacrifices for initiative',
    themeColors: { primary: '#dc2626', secondary: '#991b1b', accent: '#fee2e2' },
    messages: {
      greeting: "ATTACK! Let the pieces fly! 🔥",
      goodMove: "CRUSHING! Your attack burns bright!",
      mistake: "Your defenses crumble before my fury!",
      victory: "Your berserker rage was unstoppable!",
      defeat: "My fire burned everything in its path!",
      hint: "Sacrifice for the attack - material is nothing!"
    }
  },
  15: {
    type: 'champion',
    name: 'Gladiator',
    avatar: '🏆',
    description: 'Arena champion, balanced and dangerous',
    themeColors: { primary: '#d97706', secondary: '#b45309', accent: '#fef3c7' },
    messages: {
      greeting: "Welcome to the arena, warrior! 🏆",
      goodMove: "Gladiator-worthy! The crowd cheers!",
      mistake: "The arena demands perfection!",
      victory: "You've earned the champion's crown!",
      defeat: "The arena crowd roars for the victor!",
      hint: "Fight with both courage and wisdom!"
    }
  },
  16: {
    type: 'positional',
    name: 'Strategist',
    avatar: '🎯',
    description: 'Long-term planner, sees the big picture',
    themeColors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#ede9fe' },
    messages: {
      greeting: "Every move serves the grand strategy! 🎯",
      goodMove: "Perfect strategy! You see the complete picture!",
      mistake: "That doesn't fit the strategic plan!",
      victory: "Your strategic vision was superior!",
      defeat: "My long-term plan came to fruition!",
      hint: "Think strategically - what's your plan?"
    }
  },
  17: {
    type: 'analytical',
    name: 'Scientist',
    avatar: '🔬',
    description: 'Studies every position deeply, finds the truth',
    themeColors: { primary: '#0891b2', secondary: '#0e7490', accent: '#cffafe' },
    messages: {
      greeting: "Let's analyze this position scientifically! 🔬",
      goodMove: "Hypothesis confirmed! That's the objective best!",
      mistake: "The analysis shows that's suboptimal!",
      victory: "Your scientific approach was methodical!",
      defeat: "Science proves my superiority here!",
      hint: "Analyze deeply - what does the position demand?"
    }
  },
  18: {
    type: 'creative',
    name: 'Magician',
    avatar: '🎩',
    description: 'Creates magic from impossible positions',
    themeColors: { primary: '#7c2d12', secondary: '#450a0a', accent: '#fed7aa' },
    messages: {
      greeting: "Prepare to witness chess magic! 🎩",
      goodMove: "Magical! You pulled a rabbit from the hat!",
      mistake: "My magic is stronger than your logic!",
      victory: "Your magic was more powerful today!",
      defeat: "Abracadabra! My magic worked perfectly!",
      hint: "Sometimes magic requires bold sacrifices!"
    }
  },
  19: {
    type: 'tactical',
    name: 'Sniper',
    avatar: '🎯',
    description: 'Precise tactical striker, never misses the target',
    themeColors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' },
    messages: {
      greeting: "Target acquired. Preparing to strike! 🎯",
      goodMove: "Bullseye! Perfect precision!",
      mistake: "You're in my crosshairs now!",
      victory: "Your aim was true and deadly!",
      defeat: "One shot, one kill. Mission complete!",
      hint: "Aim for the critical weakness!"
    }
  },
  20: {
    type: 'champion',
    name: 'Legend',
    avatar: '⭐',
    description: 'Legendary player, makes few mistakes',
    themeColors: { primary: '#d97706', secondary: '#b45309', accent: '#fef3c7' },
    messages: {
      greeting: "Legends are made in battles like this! ⭐",
      goodMove: "Legendary! That move will be remembered!",
      mistake: "Even legends must face the truth!",
      victory: "You've achieved legendary status!",
      defeat: "The legend continues to grow!",
      hint: "Play like the legend you're destined to become!"
    }
  },

  // ADVANCED LEVELS (21-30)
  21: {
    type: 'analytical',
    name: 'Grandmaster',
    avatar: '👑',
    description: 'True grandmaster strength, rarely makes errors',
    themeColors: { primary: '#7c2d12', secondary: '#451a03', accent: '#fed7aa' },
    messages: {
      greeting: "Welcome to grandmaster-level chess! 👑",
      goodMove: "Grandmaster quality! That's world-class!",
      mistake: "At this level, every move matters!",
      victory: "You've proven yourself worthy of the title!",
      defeat: "Grandmaster technique prevailed!",
      hint: "Play with grandmaster precision!"
    }
  },
  22: {
    type: 'positional',
    name: 'Immortal',
    avatar: '♾️',
    description: 'Timeless positional understanding',
    themeColors: { primary: '#1e293b', secondary: '#0f172a', accent: '#e2e8f0' },
    messages: {
      greeting: "Witness immortal chess artistry! ♾️",
      goodMove: "Immortal beauty! That move transcends time!",
      mistake: "Mortal error against immortal wisdom!",
      victory: "You've achieved chess immortality!",
      defeat: "Immortal technique cannot be defeated!",
      hint: "Seek the immortal move that defines the position!"
    }
  },
  23: {
    type: 'tactical',
    name: 'Storm',
    avatar: '⚡',
    description: 'Lightning-fast tactical computation',
    themeColors: { primary: '#6366f1', secondary: '#4f46e5', accent: '#e0e7ff' },
    messages: {
      greeting: "Feel the power of the storm! ⚡",
      goodMove: "Lightning strike! Brilliant tactics!",
      mistake: "You can't outrun the storm!",
      victory: "Your lightning was faster than mine!",
      defeat: "The storm's fury was unstoppable!",
      hint: "Strike like lightning when you see the chance!"
    }
  },
  24: {
    type: 'endgame',
    name: 'Virtuoso',
    avatar: '🎼',
    description: 'Perfect endgame technique, plays like music',
    themeColors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#ede9fe' },
    messages: {
      greeting: "Let's compose an endgame symphony! 🎼",
      goodMove: "Virtuoso performance! Pure harmony!",
      mistake: "That note doesn't belong in this symphony!",
      victory: "Your endgame symphony was breathtaking!",
      defeat: "My composition reached its crescendo!",
      hint: "Play the endgame like a musical masterpiece!"
    }
  },
  25: {
    type: 'champion',
    name: 'Titan',
    avatar: '🗿',
    description: 'Colossal strength, immovable and powerful',
    themeColors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' },
    messages: {
      greeting: "Face the might of a chess titan! 🗿",
      goodMove: "Titanic strength! That shook the board!",
      mistake: "You cannot move a mountain!",
      victory: "You toppled a titan today!",
      defeat: "Titanic force cannot be stopped!",
      hint: "Channel the strength of the titans!"
    }
  },
  26: {
    type: 'creative',
    name: 'Phoenix',
    avatar: '🔥',
    description: 'Rises from hopeless positions, reborn stronger',
    themeColors: { primary: '#dc2626', secondary: '#991b1b', accent: '#fee2e2' },
    messages: {
      greeting: "From ashes, the phoenix rises! 🔥",
      goodMove: "Phoenix fire! You rise from the ashes!",
      mistake: "I shall rise stronger from this setback!",
      victory: "Your phoenix soared highest today!",
      defeat: "The phoenix is reborn in victory!",
      hint: "Even from despair, find the path to rebirth!"
    }
  },
  27: {
    type: 'analytical',
    name: 'Oracle',
    avatar: '🔮',
    description: 'Sees the future, predicts all possibilities',
    themeColors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#ede9fe' },
    messages: {
      greeting: "The future reveals itself to me! 🔮",
      goodMove: "The oracle foresaw this brilliance!",
      mistake: "The future shows your defeat!",
      victory: "The oracle did not foresee this outcome!",
      defeat: "The prophecy is fulfilled!",
      hint: "Look deeper into the future - what do you see?"
    }
  },
  28: {
    type: 'champion',
    name: 'Emperor',
    avatar: '👑',
    description: 'Rules the board with absolute authority',
    themeColors: { primary: '#d97706', secondary: '#b45309', accent: '#fef3c7' },
    messages: {
      greeting: "Bow before the chess emperor! 👑",
      goodMove: "Imperial decree: that move shows nobility!",
      mistake: "You dare challenge the emperor?",
      victory: "You have dethroned the emperor!",
      defeat: "The emperor's reign continues!",
      hint: "Rule the board like the emperor you are!"
    }
  },
  29: {
    type: 'champion',
    name: 'Apex',
    avatar: '🌟',
    description: 'Peak of chess evolution, near perfection',
    themeColors: { primary: '#059669', secondary: '#047857', accent: '#d1fae5' },
    messages: {
      greeting: "You face the apex of chess evolution! 🌟",
      goodMove: "Apex performance! Evolution in action!",
      mistake: "Only perfection survives at the apex!",
      victory: "You've surpassed the apex itself!",
      defeat: "The apex remains supreme!",
      hint: "Evolve your play to reach the apex!"
    }
  },
  30: {
    type: 'champion',
    name: 'Infinity',
    avatar: '∞',
    description: 'Limitless chess understanding, beyond comprehension',
    themeColors: { primary: '#1e293b', secondary: '#0f172a', accent: '#e2e8f0' },
    messages: {
      greeting: "Face the infinite depths of chess! ∞",
      goodMove: "Infinite brilliance! You touch the eternal!",
      mistake: "Infinity encompasses all possibilities!",
      victory: "You've conquered the infinite!",
      defeat: "Infinity cannot be defeated, only understood!",
      hint: "Think beyond limits - embrace the infinite possibilities!"
    }
  }
};

// Level configurations for all 30 levels
export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  // BEGINNER LEVELS (1-10)
  1: {
    levelId: 1, name: 'Rookie', category: 'beginner', parMoves: 60, engineLevel: 1, thinkingTime: 500,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[1],
    analysis: { depth: 8, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  2: {
    levelId: 2, name: 'Student', category: 'beginner', parMoves: 58, engineLevel: 2, thinkingTime: 750,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[2],
    analysis: { depth: 8, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  3: {
    levelId: 3, name: 'Scout', category: 'beginner', parMoves: 56, engineLevel: 3, thinkingTime: 1000,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[3],
    analysis: { depth: 8, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  4: {
    levelId: 4, name: 'Builder', category: 'beginner', parMoves: 54, engineLevel: 4, thinkingTime: 1250,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[4],
    analysis: { depth: 9, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  5: {
    levelId: 5, name: 'Warrior', category: 'beginner', parMoves: 52, engineLevel: 5, thinkingTime: 1500,
    boss: true, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[5],
    analysis: { depth: 9, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  6: {
    levelId: 6, name: 'Guardian', category: 'beginner', parMoves: 50, engineLevel: 6, thinkingTime: 1750,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[6],
    analysis: { depth: 9, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  7: {
    levelId: 7, name: 'Scholar', category: 'beginner', parMoves: 48, engineLevel: 7, thinkingTime: 2000,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[7],
    analysis: { depth: 10, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  8: {
    levelId: 8, name: 'Artist', category: 'beginner', parMoves: 46, engineLevel: 8, thinkingTime: 2250,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[8],
    analysis: { depth: 10, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  9: {
    levelId: 9, name: 'Calculator', category: 'beginner', parMoves: 44, engineLevel: 9, thinkingTime: 2500,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[9],
    analysis: { depth: 10, cpThresholds: { I: 40, M: 80, B: 150 } }
  },
  10: {
    levelId: 10, name: 'Trapper', category: 'beginner', parMoves: 42, engineLevel: 10, thinkingTime: 2750,
    boss: true, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[10],
    analysis: { depth: 10, cpThresholds: { I: 40, M: 80, B: 150 } }
  },

  // INTERMEDIATE LEVELS (11-20)
  11: {
    levelId: 11, name: 'Architect', category: 'intermediate', parMoves: 40, engineLevel: 11, thinkingTime: 3000,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[11],
    analysis: { depth: 11, cpThresholds: { I: 35, M: 70, B: 130 } }
  },
  12: {
    levelId: 12, name: 'Assassin', category: 'intermediate', parMoves: 38, engineLevel: 12, thinkingTime: 3250,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[12],
    analysis: { depth: 11, cpThresholds: { I: 35, M: 70, B: 130 } }
  },
  13: {
    levelId: 13, name: 'Finisher', category: 'intermediate', parMoves: 36, engineLevel: 13, thinkingTime: 3500,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[13],
    analysis: { depth: 12, cpThresholds: { I: 35, M: 70, B: 130 } }
  },
  14: {
    levelId: 14, name: 'Berserker', category: 'intermediate', parMoves: 34, engineLevel: 14, thinkingTime: 3750,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[14],
    analysis: { depth: 12, cpThresholds: { I: 35, M: 70, B: 130 } }
  },
  15: {
    levelId: 15, name: 'Gladiator', category: 'intermediate', parMoves: 32, engineLevel: 15, thinkingTime: 4000,
    boss: true, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[15],
    analysis: { depth: 12, cpThresholds: { I: 35, M: 70, B: 130 } }
  },
  16: {
    levelId: 16, name: 'Strategist', category: 'intermediate', parMoves: 30, engineLevel: 16, thinkingTime: 4250,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[16],
    analysis: { depth: 12, cpThresholds: { I: 30, M: 60, B: 120 } }
  },
  17: {
    levelId: 17, name: 'Scientist', category: 'intermediate', parMoves: 28, engineLevel: 17, thinkingTime: 4500,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[17],
    analysis: { depth: 13, cpThresholds: { I: 30, M: 60, B: 120 } }
  },
  18: {
    levelId: 18, name: 'Magician', category: 'intermediate', parMoves: 26, engineLevel: 18, thinkingTime: 4750,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[18],
    analysis: { depth: 13, cpThresholds: { I: 30, M: 60, B: 120 } }
  },
  19: {
    levelId: 19, name: 'Sniper', category: 'intermediate', parMoves: 24, engineLevel: 19, thinkingTime: 5000,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[19],
    analysis: { depth: 13, cpThresholds: { I: 30, M: 60, B: 120 } }
  },
  20: {
    levelId: 20, name: 'Legend', category: 'intermediate', parMoves: 22, engineLevel: 20, thinkingTime: 5250,
    boss: true, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[20],
    analysis: { depth: 14, cpThresholds: { I: 30, M: 60, B: 120 } }
  },

  // ADVANCED LEVELS (21-30)
  21: {
    levelId: 21, name: 'Grandmaster', category: 'advanced', parMoves: 20, engineLevel: 21, thinkingTime: 5500,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[21],
    analysis: { depth: 14, cpThresholds: { I: 25, M: 50, B: 100 } }
  },
  22: {
    levelId: 22, name: 'Immortal', category: 'advanced', parMoves: 18, engineLevel: 22, thinkingTime: 5750,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[22],
    analysis: { depth: 14, cpThresholds: { I: 25, M: 50, B: 100 } }
  },
  23: {
    levelId: 23, name: 'Storm', category: 'advanced', parMoves: 16, engineLevel: 23, thinkingTime: 6000,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[23],
    analysis: { depth: 15, cpThresholds: { I: 25, M: 50, B: 100 } }
  },
  24: {
    levelId: 24, name: 'Virtuoso', category: 'advanced', parMoves: 14, engineLevel: 24, thinkingTime: 6250,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[24],
    analysis: { depth: 15, cpThresholds: { I: 25, M: 50, B: 100 } }
  },
  25: {
    levelId: 25, name: 'Titan', category: 'advanced', parMoves: 12, engineLevel: 25, thinkingTime: 6500,
    boss: true, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[25],
    analysis: { depth: 15, cpThresholds: { I: 20, M: 40, B: 80 } }
  },
  26: {
    levelId: 26, name: 'Phoenix', category: 'advanced', parMoves: 10, engineLevel: 26, thinkingTime: 6750,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[26],
    analysis: { depth: 16, cpThresholds: { I: 20, M: 40, B: 80 } }
  },
  27: {
    levelId: 27, name: 'Oracle', category: 'advanced', parMoves: 8, engineLevel: 27, thinkingTime: 7000,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[27],
    analysis: { depth: 16, cpThresholds: { I: 20, M: 40, B: 80 } }
  },
  28: {
    levelId: 28, name: 'Emperor', category: 'advanced', parMoves: 6, engineLevel: 28, thinkingTime: 7250,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[28],
    analysis: { depth: 16, cpThresholds: { I: 15, M: 30, B: 60 } }
  },
  29: {
    levelId: 29, name: 'Apex', category: 'advanced', parMoves: 4, engineLevel: 29, thinkingTime: 7500,
    boss: false, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[29],
    analysis: { depth: 17, cpThresholds: { I: 15, M: 30, B: 60 } }
  },
  30: {
    levelId: 30, name: 'Infinity', category: 'advanced', parMoves: 2, engineLevel: 30, thinkingTime: 8000,
    boss: true, allowAids: true, bossStarCapWithAids: 1, personality: BOT_PERSONALITIES[30],
    analysis: { depth: 18, cpThresholds: { I: 10, M: 20, B: 40 } }
  }
};

// Default level configuration
export const DEFAULT_LEVEL_CONFIG: Omit<LevelConfig, 'levelId' | 'name' | 'parMoves' | 'engineLevel' | 'thinkingTime' | 'personality'> = {
  category: 'beginner',
  boss: false,
  allowAids: true,
  bossStarCapWithAids: 1,
  analysis: {
    depth: 12,
    cpThresholds: { I: 40, M: 80, B: 150 }
  }
};

/**
 * Get level configuration for a given level ID
 * Falls back to default configuration if level not found
 */
export const getLevelConfig = (levelId: number): LevelConfig => {
  return LEVEL_CONFIGS[levelId] || {
    levelId,
    name: `Level ${levelId}`,
    parMoves: 40,
    engineLevel: levelId,
    thinkingTime: 3000,
    personality: BOT_PERSONALITIES[1], // Fallback to Rookie
    ...DEFAULT_LEVEL_CONFIG
  };
};

/**
 * Check if a level is a boss level
 */
export const isBossLevel = (levelId: number): boolean => {
  const config = getLevelConfig(levelId);
  return config.boss;
};

/**
 * Get analysis configuration for a level
 */
export const getAnalysisConfig = (levelId: number) => {
  const config = getLevelConfig(levelId);
  return config.analysis;
};

/**
 * Get all levels in a category
 */
export const getLevelsByCategory = (category: 'beginner' | 'intermediate' | 'advanced'): LevelConfig[] => {
  return Object.values(LEVEL_CONFIGS).filter(config => config.category === category);
};

/**
 * Get boss levels
 */
export const getBossLevels = (): LevelConfig[] => {
  return Object.values(LEVEL_CONFIGS).filter(config => config.boss);
};

/**
 * Get next level ID
 */
export const getNextLevel = (currentLevel: number): number | null => {
  return currentLevel < 30 ? currentLevel + 1 : null;
};

/**
 * Get previous level ID
 */
export const getPreviousLevel = (currentLevel: number): number | null => {
  return currentLevel > 1 ? currentLevel - 1 : null;
};