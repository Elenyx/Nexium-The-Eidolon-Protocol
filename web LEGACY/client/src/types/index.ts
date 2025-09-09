export interface DashboardStats {
  totalPlayers: number;
  activeBattles: number;
  charactersCollected: number;
  territoriesClaimed: number;
}

export interface AuthUser {
  id: string;
  discordId: string;
  username: string;
  avatar?: string;
  discriminator?: string;
}

export interface LeaderboardPlayer {
  userId: string;
  username: string;
  avatar?: string;
  pvpRating: number;
  pvpWins: number;
  pvpLosses: number;
}

export interface RecentBattle {
  id: string;
  winnerId: string;
  loserId: string;
  battleType: string;
  expGained: number;
  goldGained: number;
  itemsGained: string[];
  createdAt: string;
}
