import type { RecentBattle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Sword, Clock } from "lucide-react";

interface BattleCardProps {
  battle: RecentBattle;
  usernames?: { [key: string]: string };
}

export function BattleCard({ battle, usernames = {} }: BattleCardProps) {
  const getBattleIcon = (battleType: string) => {
    switch (battleType.toLowerCase()) {
      case 'pvp':
        return <Trophy className="w-4 h-4" />;
      case 'dungeon':
        return <Sword className="w-4 h-4" />;
      default:
        return <Sword className="w-4 h-4" />;
    }
  };

  const getBattleTypeColor = (battleType: string) => {
    switch (battleType.toLowerCase()) {
      case 'pvp':
        return 'bg-accent text-accent-foreground';
      case 'dungeon':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <Card className="battle-card rounded-lg" data-testid={`battle-card-${battle.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBattleTypeColor(battle.battleType)}`}>
              {getBattleIcon(battle.battleType)}
            </div>
            <span className="font-medium text-foreground" data-testid={`battle-winner-${battle.id}`}>
              {usernames[battle.winnerId] || `User ${battle.winnerId.slice(0, 8)}`}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span data-testid={`battle-timestamp-${battle.id}`}>
              {formatTimestamp(battle.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          {battle.battleType === 'pvp' ? (
            <>
              Defeated <span className="text-foreground font-medium" data-testid={`battle-loser-${battle.id}`}>
                {usernames[battle.loserId] || `User ${battle.loserId.slice(0, 8)}`}
              </span> in PvP Arena
            </>
          ) : (
            <>
              Cleared <span className="text-foreground font-medium">
                {battle.battleType}
              </span> Dungeon
            </>
          )}
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-accent" data-testid={`battle-exp-${battle.id}`}>
            +{battle.expGained} EXP
          </span>
          {battle.goldGained > 0 && (
            <span className="text-purple-400" data-testid={`battle-nex-${battle.id}`}>
              +{battle.goldGained} NEX
            </span>
          )}
          {battle.itemsGained.length > 0 && (
            <span className="text-purple-400" data-testid={`battle-items-${battle.id}`}>
              {battle.itemsGained.length} Items
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
