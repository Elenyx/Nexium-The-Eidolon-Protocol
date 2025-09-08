import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data - in a real app, fetch from API
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
    author: "Nexium Team",
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
    author: "Nexium Team",
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
    author: "Nexium Team",
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

function generateTOC(content: string) {
  const lines = content.split('\n');
  const toc = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      toc.push({ level: 1, text: line.substring(2), id: line.substring(2).toLowerCase().replace(/\s+/g, '-') });
    } else if (line.startsWith('## ')) {
      toc.push({ level: 2, text: line.substring(3), id: line.substring(3).toLowerCase().replace(/\s+/g, '-') });
    } else if (line.startsWith('### ')) {
      toc.push({ level: 3, text: line.substring(4), id: line.substring(4).toLowerCase().replace(/\s+/g, '-') });
    }
  }

  return toc;
}

export default function GuideDetail() {
  const { id } = useParams();
  const [guide, setGuide] = useState<any>(null);

  useEffect(() => {
    const foundGuide = guidesData.find(g => g.id === id);
    setGuide(foundGuide);
  }, [id]);

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
          <Link href="/guides">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guides
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const toc = generateTOC(guide.content);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/guides">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {/* Header */}
            <div className="bg-card border rounded-lg p-8 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{guide.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {guide.readTime}
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {guide.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {guide.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {guide.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(guide.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Content */}
            <div className="bg-card border rounded-lg p-8 shadow-sm">
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-p:leading-relaxed prose-headings:mb-4 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-2"
                dangerouslySetInnerHTML={{
                  __html: guide.content
                    .replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/`(.+?)`/g, '<code>$1</code>')
                    .replace(/^- (.+)$/gm, '<li>$1</li>')
                    .replace(/<li>.*?<\/li>/g, (match: string) => `<ul>${match}</ul>`)
                    .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
                    .replace(/<li>.*?<\/li>/g, (match: string) => `<ol>${match}</ol>`)
                }}
              />
            </div>
          </article>
        </div>

        {/* Table of Contents Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {toc.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className={`block text-sm hover:text-primary transition-colors duration-200 py-1 px-2 rounded hover:bg-accent/50 ${
                      item.level === 1 ? 'font-semibold' :
                      item.level === 2 ? 'ml-4' :
                      item.level === 3 ? 'ml-8' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
