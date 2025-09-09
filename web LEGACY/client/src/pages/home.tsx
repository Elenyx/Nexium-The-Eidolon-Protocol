import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CharacterCard } from "@/components/character-card";
import { BattleCard } from "@/components/battle-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { DashboardStats, RecentBattle } from "@/types";
import type { Character } from "../../../../shared/types/schema";
import { Users, Sword, Gem, Flag } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/stats'],
  });

  const { data: recentBattles, isLoading: battlesLoading } = useQuery<RecentBattle[]>({
    queryKey: ['/api/battles/recent'],
  });

  // Mock featured characters for display (in a real app, this would come from an API)
  const featuredCharacters: Character[] = [
    {
      id: '1',
      name: 'Akira Senpai',
      rarity: 'legendary',
      power: 9847,
      level: 85,
      experience: 92000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      abilities: ['Dragon Strike', 'Mystic Aura'],
      userId: null,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Shadow Ninja',
      rarity: 'epic',
      power: 7234,
      level: 72,
      experience: 68000,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      abilities: ['Shadow Clone', 'Stealth'],
      userId: null,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Ice Maiden',
      rarity: 'rare',
      power: 5891,
      level: 58,
      experience: 45000,
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      abilities: ['Frost Bolt', 'Ice Shield'],
      userId: null,
      createdAt: new Date(),
    },
    {
      id: '4',
      name: 'Village Guard',
      rarity: 'common',
      power: 2145,
      level: 23,
      experience: 7800,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      abilities: ['Basic Strike'],
      userId: null,
      createdAt: new Date(),
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12">
        <div className="relative bg-gradient-to-br from-secondary via-primary to-accent rounded-2xl p-12 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-primary-foreground mb-6" data-testid="hero-title">
              Enter the <span className="text-accent">Nexium</span> Multiverse
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
              Collect legendary anime characters, engage in epic battles, and conquer territories in the ultimate Discord RPG experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
                data-testid="hero-start-journey"
              >
                <Link href="/dashboard">Start Your Journey</Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-accent px-8 py-3 text-lg"
                data-testid="hero-join-discord"
              >
                Join Our Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Players</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-players">
                    {stats?.totalPlayers.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="text-primary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Battles</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-active-battles">
                    {stats?.activeBattles.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Sword className="text-accent text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Characters Collected</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-characters-collected">
                    {stats?.charactersCollected.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Gem className="text-secondary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Territories Claimed</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-territories-claimed">
                    {stats?.territoriesClaimed.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                <Flag className="text-destructive text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Characters */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-foreground" data-testid="featured-characters-title">
            Featured Characters
          </h3>
          <Button variant="link" asChild className="text-accent hover:text-accent/80" data-testid="view-all-characters">
            <Link href="/characters">
              View All Characters <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>

      {/* Recent Battles */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-foreground" data-testid="recent-battles-title">
            Recent Battles
          </h3>
          <Button variant="link" asChild className="text-accent hover:text-accent/80" data-testid="view-all-battles">
            <Link href="/battles">
              View All Battles <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {battlesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="battle-card">
                <CardContent className="p-4">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : recentBattles && recentBattles.length > 0 ? (
            recentBattles.slice(0, 4).map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No recent battles to display
            </div>
          )}
        </div>
      </section>

      {/* Bot Features */}
      <section className="mb-12">
        <h3 className="text-3xl font-bold text-foreground mb-8" data-testid="bot-features-title">
          Bot Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-dice text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Gacha System</h4>
              <p className="text-primary-foreground/90">
                Collect characters from multiple rarity tiers with exciting drop rates and guarantee systems.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-dungeon text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">PvE Dungeons</h4>
              <p className="text-primary-foreground/90">
                Challenge yourself in procedurally generated dungeons with unique bosses and rewards.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-secondary text-primary-foreground">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-hammer text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Crafting System</h4>
              <p className="text-primary-foreground/90">
                Create powerful weapons and equipment using materials gathered from your adventures.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
