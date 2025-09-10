export interface User {
  id: string;
  username: string;
  created_at: Date;
  last_active: Date;
  nexium: number;
  cred: number;
  level: number;
  experience: number;
  sync_points: number;
  location: string;
  title: string;
  // Discord OAuth fields for web integration
  discord_id?: string;
  avatar?: string | null;
  discriminator?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
}

export interface Eidolon {
  id: number;
  name: string;
  rarity: 'C' | 'UC' | 'R' | 'SR' | 'SSR';
  element: string;
  description: string;
  lore: string;
  base_attack: number;
  base_defense: number;
  base_speed: number;
  skill_name: string;
  skill_description: string;
  created_at: Date;
}

export interface UserEidolon {
  id: number;
  user_id: string;
  eidolon_id: number;
  level: number;
  experience: number;
  sync_ratio: number;
  ascension_level: number;
  acquired_at: Date;
  last_interacted: Date;
  eidolon?: Eidolon;
}

export interface Item {
  id: number;
  name: string;
  type: string;
  subtype?: string;
  rarity: 'Unstable' | 'Stable' | 'Optimized' | 'Flawless';
  description: string;
  base_value: number;
  stats: Record<string, any>;
  created_at: Date;
}

export interface Encounter {
  id: number;
  name: string;
  type: string;
  location: string;
  difficulty: number;
  weakness_pattern: string;
  weakness_hint: string;
  rewards: Record<string, any>;
  created_at: Date;
}

export interface CombatResult {
  success: boolean;
  damage?: number;
  message: string;
  rewards?: Record<string, any>;
}

export interface Battle {
  id: number;
  winner_id: string | null;
  loser_id: string | null;
  battle_type: 'pvp' | 'pve' | 'dungeon';
  exp_gained: number;
  gold_gained: number;
  items_gained: string[];
  created_at: Date;
}

export interface PlayerStats {
  id: number;
  user_id: string;
  total_power: number;
  pvp_wins: number;
  pvp_losses: number;
  pvp_rating: number;
  dungeons_cleared: number;
  gold: number;
  reputation: number;
  created_at: Date;
  updated_at: Date;
}

