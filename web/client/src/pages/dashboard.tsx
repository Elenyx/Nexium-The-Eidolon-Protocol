import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterCard } from "@/components/character-card";
import { BattleCard } from "@/components/battle-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Character, Battle, PlayerStats } from "@shared/schema";
import type { RecentBattle } from "@/types";

export default function Dashboard() {
  const { user, loading } = useAuth();

  const { data: characters, isLoading: charactersLoading } = useQuery<Character[]>({
    queryKey: ['/api/characters', user?.id],
    enabled: !!user?.id,
  });

  const { data: battles, isLoading: battlesLoading } = useQuery<RecentBattle[]>({
    queryKey: ['/api/battles/user', user?.id],
    enabled: !!user?.id,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<PlayerStats>({
    queryKey: ['/api/player/stats', user?.id],
    enabled: !!user?.id,
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 col-span-3" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login with Discord to view your dashboard.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90" data-testid="login-required-button">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="dashboard-welcome">
          Welcome back, {user.username}!
        </h1>
        <p className="text-muted-foreground">
          Here's your Nexium adventure overview
        </p>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Power</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-primary" data-testid="stat-total-power">
                {stats?.totalPower?.toLocaleString() || '0'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PvP Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-accent" data-testid="stat-pvp-rating">
                {stats?.pvpRating || '1000'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Wins / Losses</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-foreground" data-testid="stat-win-loss">
                {stats?.pvpWins || 0} / {stats?.pvpLosses || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">NEX (Nexium)</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-purple-400" data-testid="stat-nexium">
                {stats?.nexium?.toLocaleString() || '100'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">CRD (Cred)</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold text-green-400" data-testid="stat-cred">
                {stats?.cred?.toLocaleString() || '50'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eidolons Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="my-characters-title">My Eidolons</CardTitle>
              <Button variant="link" asChild data-testid="view-all-my-characters">
                <Link href="/characters">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {charactersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : characters && characters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {characters.slice(0, 4).map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No Eidolons attuned yet</p>
                <Button variant="outline" className="mt-4" data-testid="get-first-character">
                  Attune Your First Eidolon
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Battles Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="recent-battles-title">Recent Battles</CardTitle>
              <Button variant="link" asChild data-testid="view-all-my-battles">
                <Link href="/battles">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {battlesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : battles && battles.length > 0 ? (
              <div className="space-y-4">
                {battles.slice(0, 3).map((battle) => (
                  <BattleCard key={battle.id} battle={battle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No battles yet</p>
                <Button variant="outline" className="mt-4" data-testid="start-first-battle">
                  Start Your First Battle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
