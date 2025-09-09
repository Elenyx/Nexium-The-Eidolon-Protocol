import type { RecentBattle } from "@/types";
interface BattleCardProps {
    battle: RecentBattle;
    usernames?: {
        [key: string]: string;
    };
}
export declare function BattleCard({ battle, usernames }: BattleCardProps): import("react").JSX.Element;
export {};
