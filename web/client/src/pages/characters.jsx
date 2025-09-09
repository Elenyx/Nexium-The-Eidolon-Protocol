import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { CharacterCard } from "@/components/character-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
export default function Characters() {
    var _a = useAuth(), user = _a.user, loading = _a.loading;
    var _b = useState(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = useState("all"), rarityFilter = _c[0], setRarityFilter = _c[1];
    var _d = useQuery({
        queryKey: ['/api/characters', user === null || user === void 0 ? void 0 : user.id],
        enabled: !!(user === null || user === void 0 ? void 0 : user.id),
    }), characters = _d.data, charactersLoading = _d.isLoading;
    var filteredCharacters = (characters === null || characters === void 0 ? void 0 : characters.filter(function (character) {
        var matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesRarity = rarityFilter === "all" || character.rarity === rarityFilter;
        return matchesSearch && matchesRarity;
    })) || [];
    var getCharactersByRarity = function (rarity) {
        return (characters === null || characters === void 0 ? void 0 : characters.filter(function (char) { return char.rarity === rarity; })) || [];
    };
    if (loading) {
        return (<div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map(function (_, i) { return (<Skeleton key={i} className="h-64 w-full"/>); })}
        </div>
      </div>);
    }
    if (!user) {
        return (<div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login with Discord to view your characters.
            </p>
          </CardContent>
        </Card>
      </div>);
    }
    return (<div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="characters-title">
          My Character Collection
        </h1>
        <p className="text-muted-foreground">
          Manage and view all your collected characters
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground" data-testid="total-characters">
              {(characters === null || characters === void 0 ? void 0 : characters.length) || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Legendary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-400" data-testid="legendary-characters">
              {getCharactersByRarity('legendary').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Epic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-400" data-testid="epic-characters">
              {getCharactersByRarity('epic').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Rare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-400" data-testid="rare-characters">
              {getCharactersByRarity('rare').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input placeholder="Search characters..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="sm:max-w-xs" data-testid="character-search"/>
        <Select value={rarityFilter} onValueChange={setRarityFilter}>
          <SelectTrigger className="sm:max-w-xs" data-testid="rarity-filter">
            <SelectValue placeholder="Filter by rarity"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Characters Grid */}
      {charactersLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map(function (_, i) { return (<Skeleton key={i} className="h-64 w-full"/>); })}
        </div>) : filteredCharacters.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCharacters.map(function (character) { return (<CharacterCard key={character.id} character={character}/>); })}
        </div>) : characters && characters.length > 0 ? (<div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No characters match your filters</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={function () {
                setSearchTerm("");
                setRarityFilter("all");
            }} data-testid="clear-filters">
            Clear Filters
          </Button>
        </div>) : (<div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Characters Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start your adventure by collecting your first character!
          </p>
          <Button className="bg-primary hover:bg-primary/90" data-testid="collect-first-character">
            <i className="fas fa-dice mr-2"></i>
            Roll for Characters
          </Button>
        </div>)}
    </div>);
}
