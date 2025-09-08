import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Link } from "wouter";

// Mock data for guides - in a real app, this would come from an API
const guidesData = [
  {
    id: "getting-started",
    title: "Getting Started with Nexium RPG",
    description: "Learn the basics of the Discord RPG bot and how to begin your adventure.",
    category: "Basics",
    thumbnail: "/api/placeholder/400/250",
    readTime: "5 min read",
    author: "Nexium Team",
    publishedAt: "2025-01-15",
    content: `# Getting Started with Nexium RPG

Welcome to Nexium RPG! This comprehensive guide will help you get started with our Discord bot.

## What is Nexium RPG?

Nexium RPG is an immersive Discord-based role-playing game featuring character collection, battles, and community interactions.

## First Steps

1. **Invite the Bot**: Add Nexium to your Discord server
2. **Register**: Use the \`/register\` command to create your account
3. **Collect Characters**: Start collecting your first characters
4. **Join Battles**: Participate in PvP or PvE battles

## Basic Commands

- \`/profile\` - View your profile
- \`/inventory\` - Check your characters
- \`/battle\` - Start a battle
- \`/shop\` - Browse the shop

## Tips for New Players

- Complete daily quests for rewards
- Join a guild for bonuses
- Participate in events for exclusive items

Happy adventuring!`
  },
  {
    id: "character-collection",
    title: "Mastering Character Collection",
    description: "Advanced strategies for building the ultimate character collection.",
    category: "Advanced",
    thumbnail: "/api/placeholder/400/250",
    readTime: "8 min read",
    author: "Expert Player",
    publishedAt: "2025-01-20",
    content: `# Mastering Character Collection

Build your ultimate team with these advanced collection strategies.

## Rarity System

Understanding rarities is crucial for collection success.

### Common (Gray)
- Easy to obtain
- Good for beginners

### Rare (Blue)
- Moderate difficulty
- Balanced stats

### Epic (Purple)
- Challenging to get
- High potential

### Legendary (Gold)
- Extremely rare
- Best in game

## Collection Strategies

### 1. Daily Farming
Set aside time each day for consistent collection.

### 2. Event Participation
Don't miss seasonal events for exclusive characters.

### 3. Trading System
Use the marketplace to complete your collection.

## Power Leveling

Focus on leveling your strongest characters first.`
  },
  {
    id: "battle-system",
    title: "Battle System Deep Dive",
    description: "Everything you need to know about combat mechanics and strategies.",
    category: "Combat",
    thumbnail: "/api/placeholder/400/250",
    readTime: "10 min read",
    author: "Battle Master",
    publishedAt: "2025-01-25",
    content: `# Battle System Deep Dive

Master the art of combat in Nexium RPG.

## Battle Types

### PvP Battles
- Player vs Player combat
- Ranked and casual modes
- Tournament system

### PvE Battles
- Dungeon crawling
- Boss fights
- Story missions

## Combat Mechanics

### Turn-Based System
Each character takes turns based on speed.

### Elemental Advantages
Fire > Wind > Water > Fire (cyclic)

### Status Effects
- Burn: Damage over time
- Freeze: Prevents action
- Poison: Reduces health

## Strategy Tips

1. **Team Composition**: Balance your elements
2. **Positioning**: Front line tanks, back line damage
3. **Timing**: Use abilities at optimal moments`
  },
  {
    id: "guild-management",
    title: "Guild Leadership Guide",
    description: "Learn how to build and manage a successful guild in Nexium RPG.",
    category: "Community",
    thumbnail: "/api/placeholder/400/250",
    readTime: "7 min read",
    author: "Guild Leader",
    publishedAt: "2025-02-01",
    content: `# Guild Leadership Guide

Build and lead a thriving guild in Nexium RPG.

## Starting a Guild

### Requirements
- Level 20+ account
- 10,000 gold
- Leadership skills

### Naming Your Guild
Choose a name that reflects your guild's identity.

## Recruitment

### Finding Members
- Post in forums
- Use recruitment channels
- Network with other players

### Member Screening
- Check activity levels
- Verify skill compatibility
- Ensure cultural fit

## Guild Management

### Roles and Permissions
- Leader: Full control
- Officers: Moderation powers
- Members: Basic access

### Guild Events
- Weekly raids
- Member meetups
- Training sessions

## Guild Wars

### Preparation
- Team coordination
- Strategy planning
- Resource allocation

### Battle Tactics
- Formation selection
- Ability timing
- Backup plans`
  }
];

const categories = ["All", "Basics", "Advanced", "Combat", "Community"];

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGuides = useMemo(() => {
    return guidesData.filter((guide) => {
      const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Guides & Tutorials
        </h1>
        <p className="text-lg text-muted-foreground">
          Master Nexium RPG with our comprehensive guides and tutorials
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img
                src={guide.thumbnail}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2">
                  {guide.category}
                </Badge>
                <span className="text-sm text-muted-foreground">{guide.readTime}</span>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/guides/${guide.id}`} className="hover:underline">
                  {guide.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {guide.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>By {guide.author}</span>
                <span>{new Date(guide.publishedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No guides found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
