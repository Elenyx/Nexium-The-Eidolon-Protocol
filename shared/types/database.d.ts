export interface User {
    id: string;
    username: string;
    created_at: string;
    last_active: string;
    nexium: number;
    cred: number;
    level: number;
    experience: number;
    sync_points: number;
    location: string;
    title: string;
}
export interface Eidolon {
    id: number;
    name: string;
    rarity: 'C' | 'UC' | 'R' | 'SR' | 'SSR';
    element: string;
    description: string | null;
    lore: string | null;
    base_attack: number;
    base_defense: number;
    base_speed: number;
    skill_name: string | null;
    skill_description: string | null;
    created_at: string;
}
export interface UserEidolon {
    id: number;
    user_id: string;
    eidolon_id: number;
    level: number;
    experience: number;
    sync_ratio: number;
    ascension_level: number;
    acquired_at: string;
    last_interacted: string;
}
export interface Item {
    id: number;
    name: string;
    type: string;
    subtype: string | null;
    rarity: 'Unstable' | 'Stable' | 'Optimized' | 'Flawless';
    description: string | null;
    base_value: number;
    stats: Record<string, number>;
    created_at: string;
}
export interface UserItem {
    id: number;
    user_id: string;
    item_id: number;
    quantity: number;
    quality: string;
    custom_stats: Record<string, number> | null;
    acquired_at: string;
}
export interface Syndicate {
    id: number;
    name: string;
    description: string | null;
    leader_id: string;
    level: number;
    resources: number;
    controlled_ward: string | null;
    created_at: string;
}
export interface SyndicateMember {
    id: number;
    syndicate_id: number;
    user_id: string;
    rank: string;
    joined_at: string;
    contribution_points: number;
}
