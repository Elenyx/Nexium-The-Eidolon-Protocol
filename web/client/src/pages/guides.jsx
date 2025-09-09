import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Link } from "wouter";
// Mock data for guides - in a real app, this would come from an API
var guidesData = [
    {
        id: "getting-started",
        title: "Getting Started with Nexium RPG",
        description: "Learn the basics of the Discord RPG bot and how to begin your adventure.",
        category: "Basics",
        thumbnail: "/api/placeholder/400/250",
        readTime: "5 min read",
        author: "Nexium Team",
        publishedAt: "2025-01-15",
        content: "# Getting Started with Nexium RPG\n\nWelcome to Nexium RPG! This comprehensive guide will help you get started with our Discord bot.\n\n## What is Nexium RPG?\n\nNexium RPG is an immersive Discord-based role-playing game featuring character collection, battles, and community interactions.\n\n## First Steps\n\n1. **Invite the Bot**: Add Nexium to your Discord server\n2. **Register**: Use the `/register` command to create your account\n3. **Collect Characters**: Start collecting your first characters\n4. **Join Battles**: Participate in PvP or PvE battles\n\n## Basic Commands\n\n- `/profile` - View your profile\n- `/inventory` - Check your characters\n- `/battle` - Start a battle\n- `/shop` - Browse the shop\n\n## Tips for New Players\n\n- Complete daily quests for rewards\n- Join a guild for bonuses\n- Participate in events for exclusive items\n\nHappy adventuring!"
    },
    {
        id: "character-collection",
        title: "Mastering Character Collection",
        description: "Advanced strategies for building the ultimate character collection.",
        category: "Advanced",
        thumbnail: "/api/placeholder/400/250",
        readTime: "8 min read",
        author: "Nexium Team",
        publishedAt: "2025-01-20",
        content: "# Mastering Character Collection\n\nBuild your ultimate team with these advanced collection strategies.\n\n## Rarity System\n\nUnderstanding rarities is crucial for collection success.\n\n### Common (Gray)\n- Easy to obtain\n- Good for beginners\n\n### Rare (Blue)\n- Moderate difficulty\n- Balanced stats\n\n### Epic (Purple)\n- Challenging to get\n- High potential\n\n### Legendary (Gold)\n- Extremely rare\n- Best in game\n\n## Collection Strategies\n\n### 1. Daily Farming\nSet aside time each day for consistent collection.\n\n### 2. Event Participation\nDon't miss seasonal events for exclusive characters.\n\n### 3. Trading System\nUse the marketplace to complete your collection.\n\n## Power Leveling\n\nFocus on leveling your strongest characters first."
    },
    {
        id: "battle-system",
        title: "Battle System Deep Dive",
        description: "Everything you need to know about combat mechanics and strategies.",
        category: "Combat",
        thumbnail: "/api/placeholder/400/250",
        readTime: "10 min read",
        author: "Nexium Team",
        publishedAt: "2025-01-25",
        content: "# Battle System Deep Dive\n\nMaster the art of combat in Nexium RPG.\n\n## Battle Types\n\n### PvP Battles\n- Player vs Player combat\n- Ranked and casual modes\n- Tournament system\n\n### PvE Battles\n- Dungeon crawling\n- Boss fights\n- Story missions\n\n## Combat Mechanics\n\n### Turn-Based System\nEach character takes turns based on speed.\n\n### Elemental Advantages\nFire > Wind > Water > Fire (cyclic)\n\n### Status Effects\n- Burn: Damage over time\n- Freeze: Prevents action\n- Poison: Reduces health\n\n## Strategy Tips\n\n1. **Team Composition**: Balance your elements\n2. **Positioning**: Front line tanks, back line damage\n3. **Timing**: Use abilities at optimal moments"
    },
    {
        id: "guild-management",
        title: "Guild Leadership Guide",
        description: "Learn how to build and manage a successful guild in Nexium RPG.",
        category: "Community",
        thumbnail: "/api/placeholder/400/250",
        readTime: "7 min read",
        author: "Nexium Team",
        publishedAt: "2025-02-01",
        content: "# Guild Leadership Guide\n\nBuild and lead a thriving guild in Nexium RPG.\n\n## Starting a Guild\n\n### Requirements\n- Level 20+ account\n- 10,000 gold\n- Leadership skills\n\n### Naming Your Guild\nChoose a name that reflects your guild's identity.\n\n## Recruitment\n\n### Finding Members\n- Post in forums\n- Use recruitment channels\n- Network with other players\n\n### Member Screening\n- Check activity levels\n- Verify skill compatibility\n- Ensure cultural fit\n\n## Guild Management\n\n### Roles and Permissions\n- Leader: Full control\n- Officers: Moderation powers\n- Members: Basic access\n\n### Guild Events\n- Weekly raids\n- Member meetups\n- Training sessions\n\n## Guild Wars\n\n### Preparation\n- Team coordination\n- Strategy planning\n- Resource allocation\n\n### Battle Tactics\n- Formation selection\n- Ability timing\n- Backup plans"
    }
];
var categories = ["All", "Basics", "Advanced", "Combat", "Community"];
export default function Guides() {
    var _a = useState(""), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = useState("All"), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var filteredGuides = useMemo(function () {
        return guidesData.filter(function (guide) {
            var matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.description.toLowerCase().includes(searchTerm.toLowerCase());
            var matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);
    return (<div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Guides & Tutorials
        </h1>
        <p className="text-lg text-foreground/80">
          Master Nexium RPG with our comprehensive guides and tutorials
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-4 h-4"/>
          <Input placeholder="Search guides..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10"/>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2"/>
            <SelectValue placeholder="Category"/>
          </SelectTrigger>
          <SelectContent>
            {categories.map(function (category) { return (<SelectItem key={category} value={category}>
                {category}
              </SelectItem>); })}
          </SelectContent>
        </Select>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map(function (guide) { return (<Card key={guide.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img src={guide.thumbnail} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2">
                  {guide.category}
                </Badge>
                <span className="text-sm text-foreground/70">{guide.readTime}</span>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={"/guides/".concat(guide.id)} className="hover:underline">
                  {guide.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {guide.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-foreground/70">
                <span>By {guide.author}</span>
                <span>{new Date(guide.publishedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>); })}
      </div>

      {filteredGuides.length === 0 && (<div className="text-center py-12">
          <p className="text-foreground/80 text-lg">No guides found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={function () {
                setSearchTerm("");
                setSelectedCategory("All");
            }}>
            Clear Filters
          </Button>
        </div>)}
    </div>);
}
