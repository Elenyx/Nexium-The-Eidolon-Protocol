import type { Character } from "../../../../shared/types/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const getRarityColor = (rarity: string) => {
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

  const getRarityBadgeColor = (rarity: string) => {
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

  const experiencePercentage = character.level < 100 ? 
    (character.experience % 1000) / 10 : 100;

  return (
    <Card className={`character-card ${getRarityColor(character.rarity)} rounded-lg`} data-testid={`character-card-${character.id}`}>
      <CardContent className="p-4">
        {character.image && (
          <img 
            src={character.image} 
            alt={character.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
            data-testid={`character-image-${character.id}`}
          />
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground" data-testid={`character-name-${character.id}`}>
              {character.name}
            </h4>
            <Badge 
              className={`text-xs font-bold ${getRarityBadgeColor(character.rarity)}`}
              data-testid={`character-rarity-${character.id}`}
            >
              {character.rarity.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Power: <span className="text-accent font-medium" data-testid={`character-power-${character.id}`}>
                {character.power.toLocaleString()}
              </span>
            </span>
            <span>
              Level: <span className="text-accent font-medium" data-testid={`character-level-${character.id}`}>
                {character.level}
              </span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Experience</span>
              <span>{experiencePercentage.toFixed(0)}%</span>
            </div>
            <Progress 
              value={experiencePercentage} 
              className="h-2"
              data-testid={`character-exp-${character.id}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
