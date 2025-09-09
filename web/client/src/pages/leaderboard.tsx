import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Shield, Users, Flag, Crown, Medal, Award } from "lucide-react";
import type { LeaderboardPlayer } from "@/types";
import type { Guild } from "../../../../shared/types/schema";

export default function Leaderboard() {
  const { data: pvpLeaderboard, isLoading: pvpLoading } = useQuery<LeaderboardPlayer[]>({
    queryKey: ['/api/leaderboard/pvp'],
  });

  const { data: guildLeaderboard, isLoading: guildLoading } = useQuery<Guild[]>({
    queryKey: ['/api/leaderboard/guilds'],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-black";
      case 2:
        return "bg-gray-400 text-black";
      case 3:
        return "bg-orange-500 text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="leaderboard-title">
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See who rules the Nexium multiverse
        </p>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="pvp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pvp" className="flex items-center gap-2" data-testid="tab-pvp-leaderboard">
            <Trophy className="w-4 h-4" />
            PvP Rankings
          </TabsTrigger>
          <TabsTrigger value="guilds" className="flex items-center gap-2" data-testid="tab-guild-leaderboard">
            <Shield className="w-4 h-4" />
            Guild Rankings
          </TabsTrigger>
        </TabsList>

        {/* PvP Leaderboard */}
        <TabsContent value="pvp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                PvP Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pvpLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : pvpLeaderboard && pvpLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {pvpLeaderboard.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <div
                        key={player.userId}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                          rank <= 3 ? 'border border-accent/30 bg-accent/5' : 'bg-muted/20'
                        }`}
                        data-testid={`pvp-rank-${rank}`}
                      >
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${getRankColor(rank)}`}>
                          {getRankIcon(rank)}
                        </div>
                        
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={player.avatar ? `https://cdn.discordapp.com/avatars/${player.userId}/${player.avatar}.png` : undefined}
                            alt={player.username}
                          />
                          <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="font-medium text-foreground" data-testid={`pvp-player-name-${rank}`}>
                            {player.username}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="text-green-400" data-testid={`pvp-player-wins-${rank}`}>
                              {formatNumber(player.pvpWins)} wins
                            </span>
                            {" • "}
                            <span className="text-red-400" data-testid={`pvp-player-losses-${rank}`}>
                              {formatNumber(player.pvpLosses)} losses
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-accent" data-testid={`pvp-player-rating-${rank}`}>
                            {formatNumber(player.pvpRating)}
                          </div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                        
                        {rank <= 3 && (
                          <Badge variant="secondary" className="ml-2">
                            Top {rank}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No PvP Rankings Yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to compete in PvP battles and claim your spot on the leaderboard!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guild Leaderboard */}
        <TabsContent value="guilds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Guild Supremacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guildLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : guildLeaderboard && guildLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {guildLeaderboard.map((guild, index) => {
                    const rank = index + 1;
                    return (
                      <div
                        key={guild.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                          rank <= 3 ? 'border border-primary/30 bg-primary/5' : 'bg-muted/20'
                        }`}
                        data-testid={`guild-rank-${rank}`}
                      >
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${getRankColor(rank)}`}>
                          {getRankIcon(rank)}
                        </div>
                        
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-primary-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-foreground" data-testid={`guild-name-${rank}`}>
                            {guild.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span data-testid={`guild-members-${rank}`}>
                                {formatNumber(guild.memberCount || 0)} members
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Flag className="w-3 h-3" />
                              <span data-testid={`guild-territories-${rank}`}>
                                {formatNumber(guild.territories || 0)} territories
                              </span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary" data-testid={`guild-power-${rank}`}>
                            {formatNumber(guild.totalPower || 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Power</div>
                        </div>
                        
                        {rank <= 3 && (
                          <Badge variant="secondary" className="ml-2">
                            Top {rank}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Guild Rankings Yet</h3>
                  <p className="text-muted-foreground">
                    Create or join a guild to start competing for territorial dominance!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current Season Info */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Season 1: Nexium Awakening</h3>
            <p className="text-muted-foreground mb-4">
              Rankings reset monthly. Compete for exclusive rewards and eternal glory!
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-accent font-bold">30 days</div>
                <div className="text-muted-foreground">Season Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-primary font-bold">
                  {pvpLeaderboard?.length || 0}
                </div>
                <div className="text-muted-foreground">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-secondary font-bold">
                  {guildLeaderboard?.length || 0}
                </div>
                <div className="text-muted-foreground">Competing Guilds</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
