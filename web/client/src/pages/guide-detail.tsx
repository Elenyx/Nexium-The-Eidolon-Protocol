import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  content: string;
}

const guides: Guide[] = [
  {
    id: "getting-started",
    title: "Getting Started with Nexium RPG",
    description: "Learn the basics of playing Nexium RPG, from creating your first character to your first battle.",
    category: "Basics",
    readTime: "5 min read",
    content: `
# Getting Started with Nexium RPG

Welcome to Nexium RPG! This guide will walk you through everything you need to know to start your adventure.

## Creating Your Account

1. Click the "Login with Discord" button in the top right corner
2. Authorize the application with your Discord account
3. You'll be redirected back to the site with your account created

## Your First Character

Once logged in, head to the Characters page to create your first character:

1. Click "Create New Character"
2. Choose your character's name and appearance
3. Select your starting class (Warrior, Mage, Rogue, etc.)
4. Distribute your initial stat points
5. Equip your starting gear

## Exploring the World

- Use the Dashboard to see your current status
- Visit the Battles page to find opponents
- Check the Leaderboard to see top players
- Join discussions in the Forums

## Your First Battle

1. Go to the Battles page
2. Select an opponent or join a matchmaking queue
3. Choose your actions during combat
4. Win rewards and experience points!

Remember, practice makes perfect. Don't be afraid to experiment with different strategies and builds.
    `
  },
  {
    id: "character-building",
    title: "Advanced Character Building",
    description: "Master the art of character creation with tips on stats, skills, and equipment optimization.",
    category: "Characters",
    readTime: "10 min read",
    content: `
# Advanced Character Building

Building a powerful character requires careful planning and understanding of the game's mechanics.

## Understanding Stats

- **Strength**: Increases physical damage and health
- **Intelligence**: Boosts magical damage and mana
- **Dexterity**: Improves accuracy and critical hit chance
- **Vitality**: Provides additional health and defense

## Skill Trees

Each class has unique skill trees that branch out as you level up. Focus on skills that complement your playstyle:

### Warrior Skills
- Heavy Strike: High damage, slow attack
- Shield Wall: Temporary defense boost
- Battle Cry: Area damage and debuff

### Mage Skills
- Fireball: Single target magic damage
- Ice Shield: Defensive spell
- Chain Lightning: Multi-target damage

## Equipment Optimization

1. **Weapons**: Choose based on your primary stat
2. **Armor**: Balance defense with mobility
3. **Accessories**: Look for set bonuses
4. **Enchantments**: Upgrade gear as you progress

## Build Strategies

### Glass Cannon
- Max damage stats
- Minimal defense investment
- High risk, high reward

### Tank Build
- Focus on health and defense
- Support abilities
- Protects allies in group combat

### Hybrid Build
- Balanced stats
- Versatile abilities
- Good for solo and team play
    `
  },
  {
    id: "battle-strategies",
    title: "Battle Strategies and Tactics",
    description: "Discover winning strategies for different battle types and how to counter various playstyles.",
    category: "Combat",
    readTime: "8 min read",
    content: `
# Battle Strategies and Tactics

Mastering combat in Nexium RPG requires strategy, timing, and adaptability.

## Basic Combat Principles

1. **Know Your Enemy**: Study opponent patterns before engaging
2. **Resource Management**: Monitor health, mana, and cooldowns
3. **Positioning**: Use terrain and positioning to your advantage
4. **Timing**: Perfect timing can turn the tide of battle

## Battle Types

### PvP Battles
- Fast-paced, high-stakes combat
- Requires quick decision-making
- Counter-play is crucial

### PvE Battles
- Strategic encounters with monsters
- Focus on party coordination
- Environmental hazards to consider

## Advanced Tactics

### Crowd Control
- Stun and interrupt enemy actions
- Create openings for devastating combos
- Coordinate with teammates

### Burst Damage
- Build up powerful abilities
- Time your burst windows perfectly
- Overwhelm opponents before they react

### Sustain Strategies
- Maintain pressure over time
- Wear down opponents gradually
- Excellent for prolonged engagements

## Counter Strategies

### Against Aggressive Players
- Use defensive abilities
- Create distance
- Wait for cooldowns to reset

### Against Defensive Players
- Apply pressure consistently
- Force mistakes
- Exploit weaknesses

### Against Hybrid Players
- Adapt your strategy mid-battle
- Mix up your attack patterns
- Stay unpredictable

Remember, the key to victory is adaptability. No single strategy works against every opponent.
    `
  },
  {
    id: "community-engagement",
    title: "Engaging with the Community",
    description: "Make the most of forums, Discord, and social features to connect with other players.",
    category: "Community",
    readTime: "6 min read",
    content: `
# Engaging with the Community

Nexium RPG thrives on its vibrant community. Here's how to get involved and make the most of your experience.

## Forums

### Getting Started
- Introduce yourself in the Welcome section
- Read the rules and guidelines
- Participate in discussions respectfully

### Useful Sections
- **General Discussion**: Share your thoughts and ideas
- **Help & Support**: Get assistance with game issues
- **Strategy Guides**: Learn from experienced players
- **Fan Art & Media**: Share your creations

## Discord Server

### Channels to Join
- **#general**: Main chat for all topics
- **#game-discussion**: Talk about gameplay and strategies
- **#looking-for-group**: Find teammates for battles
- **#off-topic**: Casual conversation

### Server Rules
- Be respectful to all members
- No spam or excessive caps
- Keep discussions appropriate
- Use appropriate channels for topics

## Social Features

### Friend System
- Add friends to keep track of their progress
- Send private messages
- Join private battles together

### Guilds and Teams
- Join or create a guild
- Participate in guild events
- Compete in team battles

## Community Events

### Regular Events
- Weekly tournaments
- Community challenges
- Special in-game events

### Contributing to the Community
- Share your strategies and tips
- Help new players
- Report bugs and suggest improvements
- Create content for others to enjoy

## Best Practices

1. **Be Positive**: Encourage and support fellow players
2. **Stay Safe**: Don't share personal information
3. **Learn from Others**: Everyone has something to teach
4. **Give Back**: Help others as you've been helped

The Nexium community is what makes the game special. Get involved and help build something amazing together!
    `
  }
];

export default function GuideDetail() {
  const { id } = useParams();

  const guide = guides.find(g => g.id === id);

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-6">The guide you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/guides">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guides
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/guides">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Guides
            </Link>
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{guide.category}</Badge>
            <span className="text-sm text-muted-foreground">{guide.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
          <p className="text-lg text-muted-foreground">{guide.description}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              {guide.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mb-4 mt-8 first:mt-0">{line.slice(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mb-3 mt-6">{line.slice(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-medium mb-2 mt-4">{line.slice(4)}</h3>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4">{line.slice(2)}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else if (line.match(/^\d+\./)) {
                  return <li key={index} className="ml-4 list-decimal">{line}</li>;
                } else {
                  return <p key={index} className="mb-4">{line}</p>;
                }
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
