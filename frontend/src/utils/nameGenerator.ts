// Random name generator for guest users
const adjectives = [
  'Swift', 'Bold', 'Clever', 'Brave', 'Mighty', 'Wise', 'Fierce', 'Noble',
  'Quick', 'Sharp', 'Strong', 'Bright', 'Cool', 'Epic', 'Fast', 'Great',
  'Dark', 'Golden', 'Silver', 'Royal', 'Elite', 'Master', 'Grand', 'Alpha',
  'Stealth', 'Thunder', 'Lightning', 'Storm', 'Fire', 'Ice', 'Shadow', 'Mystic'
];

const nouns = [
  'Knight', 'Rook', 'Bishop', 'Queen', 'King', 'Pawn', 'Warrior', 'Champion',
  'Hunter', 'Wizard', 'Dragon', 'Phoenix', 'Eagle', 'Wolf', 'Lion', 'Tiger',
  'Falcon', 'Hawk', 'Panther', 'Viper', 'Cobra', 'Shark', 'Bear', 'Lynx',
  'Strategist', 'Tactician', 'Guardian', 'Defender', 'Attacker', 'Player', 'Gamer', 'Master'
];

export const generateRandomName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
};

export const getDisplayName = (username: string, isGuest: boolean = false): string => {
  // If it's a logged-in user with a proper display name, use it
  if (!isGuest && username && !username.startsWith('Player') && !username.startsWith('demo-user')) {
    return username;
  }
  
  // Generate or use cached random name for guests
  const storageKey = `guestName_${username}`;
  let cachedName = localStorage.getItem(storageKey);
  
  if (!cachedName) {
    cachedName = generateRandomName();
    localStorage.setItem(storageKey, cachedName);
  }
  
  return cachedName;
};