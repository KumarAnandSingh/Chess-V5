/**
 * ELO Rating System Implementation for Chess
 * Based on the standard FIDE ELO rating system
 */

// K-factor determines how much ratings change per game
const K_FACTORS = {
  // Provisional players (< 30 games) get higher K-factor for faster adjustment
  PROVISIONAL: 40,
  
  // Regular players by rating range
  BELOW_2100: 40,      // Players below 2100 rating
  BETWEEN_2100_2400: 20, // Players between 2100-2400  
  ABOVE_2400: 10       // Masters above 2400 rating
};

/**
 * Calculates the K-factor based on player rating and games played
 * @param rating - Current player rating
 * @param gamesPlayed - Number of games the player has played
 * @returns K-factor to use for rating calculation
 */
function getKFactor(rating: number, gamesPlayed: number = 30): number {
  // Provisional players (less than 30 games) get higher K-factor
  if (gamesPlayed < 30) {
    return K_FACTORS.PROVISIONAL;
  }
  
  // Experienced players get K-factor based on rating
  if (rating >= 2400) {
    return K_FACTORS.ABOVE_2400;
  } else if (rating >= 2100) {
    return K_FACTORS.BETWEEN_2100_2400;
  } else {
    return K_FACTORS.BELOW_2100;
  }
}

/**
 * Calculates the expected score for a player against an opponent
 * @param playerRating - The player's current rating
 * @param opponentRating - The opponent's current rating
 * @returns Expected score (between 0 and 1)
 */
function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  const ratingDifference = opponentRating - playerRating;
  return 1 / (1 + Math.pow(10, ratingDifference / 400));
}

/**
 * Calculates the new ELO rating after a game
 * @param playerRating - Current player rating
 * @param opponentRating - Opponent's current rating  
 * @param actualScore - Actual game result (1 = win, 0.5 = draw, 0 = loss)
 * @param playerGamesPlayed - Number of games the player has played (optional)
 * @returns New rating for the player
 */
export function calculateEloRating(
  playerRating: number,
  opponentRating: number,
  actualScore: number,
  playerGamesPlayed?: number
): number {
  // Calculate expected score
  const expectedScore = calculateExpectedScore(playerRating, opponentRating);
  
  // Get appropriate K-factor
  const kFactor = getKFactor(playerRating, playerGamesPlayed);
  
  // Calculate rating change
  const ratingChange = kFactor * (actualScore - expectedScore);
  
  // Calculate new rating (rounded to nearest integer)
  const newRating = Math.round(playerRating + ratingChange);
  
  // Ensure rating doesn't go below minimum (typically 100)
  return Math.max(newRating, 100);
}

/**
 * Calculates rating changes for both players in a game
 * @param whiteRating - White player's current rating
 * @param blackRating - Black player's current rating
 * @param gameResult - Game result ('white' = white wins, 'black' = black wins, 'draw' = draw)
 * @param whiteGamesPlayed - White player's games played (optional)
 * @param blackGamesPlayed - Black player's games played (optional)
 * @returns Object with new ratings for both players
 */
export function calculateBothPlayersRating(
  whiteRating: number,
  blackRating: number,
  gameResult: 'white' | 'black' | 'draw',
  whiteGamesPlayed?: number,
  blackGamesPlayed?: number
): {
  whiteNewRating: number;
  blackNewRating: number;
  whiteRatingChange: number;
  blackRatingChange: number;
} {
  // Convert game result to scores
  let whiteScore: number;
  let blackScore: number;
  
  switch (gameResult) {
    case 'white':
      whiteScore = 1;
      blackScore = 0;
      break;
    case 'black':
      whiteScore = 0;
      blackScore = 1;
      break;
    case 'draw':
      whiteScore = 0.5;
      blackScore = 0.5;
      break;
    default:
      throw new Error(`Invalid game result: ${gameResult}`);
  }
  
  // Calculate new ratings
  const whiteNewRating = calculateEloRating(whiteRating, blackRating, whiteScore, whiteGamesPlayed);
  const blackNewRating = calculateEloRating(blackRating, whiteRating, blackScore, blackGamesPlayed);
  
  return {
    whiteNewRating,
    blackNewRating,
    whiteRatingChange: whiteNewRating - whiteRating,
    blackRatingChange: blackNewRating - blackRating
  };
}

/**
 * Estimates the win probability for a player against an opponent
 * @param playerRating - The player's rating
 * @param opponentRating - The opponent's rating
 * @returns Win probability as percentage (0-100)
 */
export function calculateWinProbability(playerRating: number, opponentRating: number): number {
  const expectedScore = calculateExpectedScore(playerRating, opponentRating);
  return Math.round(expectedScore * 100);
}

/**
 * Gets the rating category/title based on rating
 * @param rating - Player's current rating
 * @returns Rating category string
 */
export function getRatingCategory(rating: number): string {
  if (rating >= 2700) return 'Super Grandmaster';
  if (rating >= 2500) return 'Grandmaster';
  if (rating >= 2400) return 'International Master';
  if (rating >= 2300) return 'FIDE Master';
  if (rating >= 2200) return 'Candidate Master';
  if (rating >= 2000) return 'Expert';
  if (rating >= 1800) return 'Class A';
  if (rating >= 1600) return 'Class B';
  if (rating >= 1400) return 'Class C';
  if (rating >= 1200) return 'Class D';
  if (rating >= 1000) return 'Class E';
  return 'Beginner';
}

/**
 * Validates if a rating change is reasonable (prevents manipulation)
 * @param oldRating - Previous rating
 * @param newRating - Calculated new rating
 * @param maxChange - Maximum allowed change per game (default 50)
 * @returns Validated new rating
 */
export function validateRatingChange(
  oldRating: number, 
  newRating: number, 
  maxChange: number = 50
): number {
  const change = newRating - oldRating;
  
  if (Math.abs(change) > maxChange) {
    // Cap the change to maximum allowed
    return oldRating + (change > 0 ? maxChange : -maxChange);
  }
  
  return newRating;
}

/**
 * Calculates rating performance for a tournament/series of games
 * @param games - Array of game results with opponent ratings
 * @returns Performance rating
 */
export function calculatePerformanceRating(
  games: Array<{ opponentRating: number; result: number }>
): number {
  if (games.length === 0) return 0;
  
  const totalScore = games.reduce((sum, game) => sum + game.result, 0);
  const scorePercentage = totalScore / games.length;
  
  // Average opponent rating
  const averageOpponentRating = games.reduce((sum, game) => sum + game.opponentRating, 0) / games.length;
  
  // Performance rating calculation
  // This is a simplified version - actual FIDE calculation is more complex
  let performanceRating: number;
  
  if (scorePercentage === 1) {
    // Perfect score
    performanceRating = averageOpponentRating + 800;
  } else if (scorePercentage === 0) {
    // Zero score
    performanceRating = averageOpponentRating - 800;
  } else {
    // Use inverse of expected score formula
    const performanceDifference = -400 * Math.log10(1 / scorePercentage - 1);
    performanceRating = averageOpponentRating + performanceDifference;
  }
  
  return Math.round(performanceRating);
}

/**
 * Gets suggested time controls based on rating level
 * @param rating - Player's current rating
 * @returns Recommended time controls
 */
export function getSuggestedTimeControls(rating: number): Array<{ name: string; initial: number; increment: number }> {
  if (rating < 1200) {
    // Beginners - longer time controls
    return [
      { name: 'Classical', initial: 1800, increment: 30 }, // 30+30
      { name: 'Rapid', initial: 900, increment: 10 },      // 15+10
      { name: 'Blitz', initial: 300, increment: 5 }        // 5+5
    ];
  } else if (rating < 1800) {
    // Intermediate - standard time controls
    return [
      { name: 'Classical', initial: 1800, increment: 0 },  // 30+0
      { name: 'Rapid', initial: 600, increment: 0 },       // 10+0
      { name: 'Blitz', initial: 180, increment: 2 }        // 3+2
    ];
  } else {
    // Advanced - faster time controls
    return [
      { name: 'Classical', initial: 1800, increment: 0 },  // 30+0
      { name: 'Rapid', initial: 600, increment: 0 },       // 10+0
      { name: 'Blitz', initial: 180, increment: 0 },       // 3+0
      { name: 'Bullet', initial: 60, increment: 1 }        // 1+1
    ];
  }
}