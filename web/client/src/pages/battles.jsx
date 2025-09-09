import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { BattleCard } from "@/components/battle-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function Battles() {
    var _a = useAuth(), user = _a.user, loading = _a.loading;
    var _b = useQuery({
        queryKey: ['/api/battles/user', user === null || user === void 0 ? void 0 : user.id],
        enabled: !!(user === null || user === void 0 ? void 0 : user.id),
    }), userBattles = _b.data, userBattlesLoading = _b.isLoading;
    var _c = useQuery({
        queryKey: ['/api/battles/recent'],
    }), recentBattles = _c.data, recentBattlesLoading = _c.isLoading;
    if (loading) {
        return (<div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8"/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map(function (_, i) { return (<Skeleton key={i} className="h-32 w-full"/>); })}
        </div>
      </div>);
    }
    if (!user) {
        return (<div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login with Discord to view battle history.
            </p>
          </CardContent>
        </Card>
      </div>);
    }
    var pvpBattles = (userBattles === null || userBattles === void 0 ? void 0 : userBattles.filter(function (battle) { return battle.battleType === 'pvp'; })) || [];
    var dungeonBattles = (userBattles === null || userBattles === void 0 ? void 0 : userBattles.filter(function (battle) { return battle.battleType === 'dungeon'; })) || [];
    return (<div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="battles-title">
          Battle Arena
        </h1>
        <p className="text-muted-foreground">
          View your battle history and global battle activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Battles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground" data-testid="total-battles">
              {(userBattles === null || userBattles === void 0 ? void 0 : userBattles.length) || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PvP Victories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent" data-testid="pvp-victories">
              {pvpBattles.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Dungeons Cleared</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary" data-testid="dungeons-cleared">
              {dungeonBattles.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Battle Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button className="bg-primary hover:bg-primary/90" data-testid="start-pvp-battle">
          <i className="fas fa-sword mr-2"></i>
          Start PvP Battle
        </Button>
        <Button variant="outline" data-testid="enter-dungeon">
          <i className="fas fa-dungeon mr-2"></i>
          Enter Dungeon
        </Button>
        <Button variant="outline" data-testid="join-faction-war">
          <i className="fas fa-flag mr-2"></i>
          Join Faction War
        </Button>
      </div>

      {/* Battle Tabs */}
      <Tabs defaultValue="my-battles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-battles" data-testid="tab-my-battles">My Battles</TabsTrigger>
          <TabsTrigger value="global-battles" data-testid="tab-global-battles">Global Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="my-battles" className="space-y-6">
          {userBattlesLoading ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map(function (_, i) { return (<Skeleton key={i} className="h-32 w-full"/>); })}
            </div>) : userBattles && userBattles.length > 0 ? (<div className="space-y-6">
              {/* PvP Battles */}
              {pvpBattles.length > 0 && (<div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold">PvP Battles</h3>
                    <Badge variant="secondary">{pvpBattles.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pvpBattles.map(function (battle) { return (<BattleCard key={battle.id} battle={battle}/>); })}
                  </div>
                </div>)}

              {/* Dungeon Battles */}
              {dungeonBattles.length > 0 && (<div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-semibold">Dungeon Runs</h3>
                    <Badge variant="secondary">{dungeonBattles.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {dungeonBattles.map(function (battle) { return (<BattleCard key={battle.id} battle={battle}/>); })}
                  </div>
                </div>)}
            </div>) : (<div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Battles Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first battle to see your history here!
              </p>
              <Button className="bg-primary hover:bg-primary/90" data-testid="start-first-battle-empty">
                <i className="fas fa-sword mr-2"></i>
                Start Your First Battle
              </Button>
            </div>)}
        </TabsContent>

        <TabsContent value="global-battles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Global Activity</h3>
            <Button variant="outline" size="sm" data-testid="refresh-global-battles">
              <i className="fas fa-refresh mr-2"></i>
              Refresh
            </Button>
          </div>

          {recentBattlesLoading ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map(function (_, i) { return (<Skeleton key={i} className="h-32 w-full"/>); })}
            </div>) : recentBattles && recentBattles.length > 0 ? (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentBattles.map(function (battle) { return (<BattleCard key={battle.id} battle={battle}/>); })}
            </div>) : (<div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Global Activity</h3>
              <p className="text-muted-foreground">
                No recent battles to display
              </p>
            </div>)}
        </TabsContent>
      </Tabs>
    </div>);
}
