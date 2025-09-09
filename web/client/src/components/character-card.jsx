import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
export function CharacterCard(_a) {
    var character = _a.character;
    var getRarityColor = function (rarity) {
        switch (rarity.toLowerCase()) {
            case 'legendary':
                return 'rarity-legendary';
            case 'epic':
                return 'rarity-epic';
            case 'rare':
                return 'rarity-rare';
            default:
                return 'rarity-common';
        }
    };
    var getRarityBadgeColor = function (rarity) {
        switch (rarity.toLowerCase()) {
            case 'legendary':
                return 'bg-yellow-500 text-black';
            case 'epic':
                return 'bg-purple-500 text-white';
            case 'rare':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    var experiencePercentage = character.level < 100 ?
        (character.experience % 1000) / 10 : 100;
    return (<Card className={"character-card ".concat(getRarityColor(character.rarity), " rounded-lg")} data-testid={"character-card-".concat(character.id)}>
      <CardContent className="p-4">
        {character.image && (<img src={character.image} alt={character.name} className="w-full h-48 object-cover rounded-lg mb-4" data-testid={"character-image-".concat(character.id)}/>)}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground" data-testid={"character-name-".concat(character.id)}>
              {character.name}
            </h4>
            <Badge className={"text-xs font-bold ".concat(getRarityBadgeColor(character.rarity))} data-testid={"character-rarity-".concat(character.id)}>
              {character.rarity.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Power: <span className="text-accent font-medium" data-testid={"character-power-".concat(character.id)}>
                {character.power.toLocaleString()}
              </span>
            </span>
            <span>
              Level: <span className="text-accent font-medium" data-testid={"character-level-".concat(character.id)}>
                {character.level}
              </span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Experience</span>
              <span>{experiencePercentage.toFixed(0)}%</span>
            </div>
            <Progress value={experiencePercentage} className="h-2" data-testid={"character-exp-".concat(character.id)}/>
          </div>
        </div>
      </CardContent>
    </Card>);
}
