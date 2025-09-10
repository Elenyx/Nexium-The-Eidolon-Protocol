import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { CharacterCard } from "@/components/character-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Character } from "@shared/schema";

export default function Characters() {
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");

  const { data: characters, isLoading: charactersLoading } = useQuery<Character[]>({
    queryKey: ['/api/characters', user?.id],
    enabled: !!user?.id,
  });

  const filteredCharacters = characters?.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === "all" || character.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  }) || [];

  const getCharactersByRarity = (rarity: string) => {
    return characters?.filter(char => char.rarity === rarity) || [];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
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
              Please login with Discord to view your Eidolons.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="characters-title">
          My Eidolon Collection
        </h1>
        <p className="text-muted-foreground">
          Manage and view all your collected Eidolons
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Eidolons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground" data-testid="total-characters">
              {characters?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">SSR Rarity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-400" data-testid="legendary-characters">
              {getCharactersByRarity('SSR').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">SR Rarity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-400" data-testid="epic-characters">
              {getCharactersByRarity('SR').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">R Rarity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-400" data-testid="rare-characters">
              {getCharactersByRarity('R').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Search Eidolons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
          data-testid="character-search"
        />
        <Select value={rarityFilter} onValueChange={setRarityFilter}>
          <SelectTrigger className="sm:max-w-xs" data-testid="rarity-filter">
            <SelectValue placeholder="Filter by rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="C">C (Common)</SelectItem>
            <SelectItem value="UC">UC (Uncommon)</SelectItem>
            <SelectItem value="R">R (Rare)</SelectItem>
            <SelectItem value="SR">SR (Super Rare)</SelectItem>
            <SelectItem value="SSR">SSR (Super Super Rare)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Eidolons Grid */}
      {charactersLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) : characters && characters.length > 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Eidolons match your filters</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setRarityFilter("all");
            }}
            data-testid="clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Eidolons Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start your journey as a Weaver by attuning with your first Eidolon!
          </p>
          <Button className="bg-primary hover:bg-primary/90" data-testid="collect-first-character">
            <i className="fas fa-sync mr-2"></i>
            Attune First Eidolon
          </Button>
        </div>
      )}
    </div>
  );
}
