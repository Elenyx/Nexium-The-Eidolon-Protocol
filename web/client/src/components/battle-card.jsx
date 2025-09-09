import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Sword, Clock } from "lucide-react";
export function BattleCard(_a) {
    var battle = _a.battle, _b = _a.usernames, usernames = _b === void 0 ? {} : _b;
    var getBattleIcon = function (battleType) {
        switch (battleType.toLowerCase()) {
            case 'pvp':
                return <Trophy className="w-4 h-4"/>;
            case 'dungeon':
                return <Sword className="w-4 h-4"/>;
            default:
                return <Sword className="w-4 h-4"/>;
        }
    };
    var getBattleTypeColor = function (battleType) {
        switch (battleType.toLowerCase()) {
            case 'pvp':
                return 'bg-accent text-accent-foreground';
            case 'dungeon':
                return 'bg-primary text-primary-foreground';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };
    var formatTimestamp = function (timestamp) {
        var date = new Date(timestamp);
        var now = new Date();
        var diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return 'Just now';
        if (diffInHours < 24)
            return "".concat(diffInHours, " hours ago");
        return "".concat(Math.floor(diffInHours / 24), " days ago");
    };
    return (<Card className="battle-card rounded-lg" data-testid={"battle-card-".concat(battle.id)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center ".concat(getBattleTypeColor(battle.battleType))}>
              {getBattleIcon(battle.battleType)}
            </div>
            <span className="font-medium text-foreground" data-testid={"battle-winner-".concat(battle.id)}>
              {usernames[battle.winnerId] || "User ".concat(battle.winnerId.slice(0, 8))}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3"/>
            <span data-testid={"battle-timestamp-".concat(battle.id)}>
              {formatTimestamp(battle.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          {battle.battleType === 'pvp' ? (<>
              Defeated <span className="text-foreground font-medium" data-testid={"battle-loser-".concat(battle.id)}>
                {usernames[battle.loserId] || "User ".concat(battle.loserId.slice(0, 8))}
              </span> in PvP Arena
            </>) : (<>
              Cleared <span className="text-foreground font-medium">
                {battle.battleType}
              </span> Dungeon
            </>)}
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-accent" data-testid={"battle-exp-".concat(battle.id)}>
            +{battle.expGained} EXP
          </span>
          {battle.goldGained > 0 && (<span className="text-yellow-400" data-testid={"battle-gold-".concat(battle.id)}>
              +{battle.goldGained} Gold
            </span>)}
          {battle.itemsGained.length > 0 && (<span className="text-purple-400" data-testid={"battle-items-".concat(battle.id)}>
              {battle.itemsGained.length} Items
            </span>)}
        </div>
      </CardContent>
    </Card>);
}
