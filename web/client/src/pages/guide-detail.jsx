import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
// Mock data - in a real app, fetch from API
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
function generateTOC(content) {
    var lines = content.split('\n');
    var toc = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.startsWith('# ')) {
            toc.push({
                level: 1,
                text: line.substring(2),
                id: line.substring(2).toLowerCase().replace(/\s+/g, '-')
            });
        }
        else if (line.startsWith('## ')) {
            toc.push({
                level: 2,
                text: line.substring(3),
                id: line.substring(3).toLowerCase().replace(/\s+/g, '-')
            });
        }
        else if (line.startsWith('### ')) {
            toc.push({
                level: 3,
                text: line.substring(4),
                id: line.substring(4).toLowerCase().replace(/\s+/g, '-')
            });
        }
    }
    return toc;
}
export default function GuideDetail() {
    var id = useParams().id;
    var _a = useState(null), guide = _a[0], setGuide = _a[1];
    useEffect(function () {
        var foundGuide = guidesData.find(function (g) { return g.id === id; });
        setGuide(foundGuide);
    }, [id]);
    if (!guide) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
          <Link href="/guides">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back to Guides
            </Button>
          </Link>
        </div>
      </div>);
    }
    var toc = generateTOC(guide.content);
    return (<div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/guides">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2"/>
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
                <div className="flex items-center text-sm text-foreground/80">
                  <Clock className="w-4 h-4 mr-1"/>
                  {guide.readTime}
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {guide.title}
              </h1>
              <p className="text-xl text-foreground/80 mb-6">
                {guide.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/80">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1"/>
                  {guide.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1"/>
                  {new Date(guide.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Separator className="mb-8"/>

            {/* Content */}
            <div className="bg-card border rounded-lg p-8 shadow-sm">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-p:leading-relaxed prose-headings:mb-4 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-2 prose-li:text-foreground" dangerouslySetInnerHTML={{
            __html: guide.content
                .replace(/^# (.+)$/gm, function (_, heading) {
                var id = heading.toLowerCase().replace(/\s+/g, '-');
                return "<h1 id=\"".concat(id, "\">").concat(heading, "</h1>");
            })
                .replace(/^## (.+)$/gm, function (_, heading) {
                var id = heading.toLowerCase().replace(/\s+/g, '-');
                return "<h2 id=\"".concat(id, "\">").concat(heading, "</h2>");
            })
                .replace(/^### (.+)$/gm, function (_, heading) {
                var id = heading.toLowerCase().replace(/\s+/g, '-');
                return "<h3 id=\"".concat(id, "\">").concat(heading, "</h3>");
            })
                .replace(/\n\n/g, '</p><p>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/<li>.*?<\/li>/g, function (match) { return "<ul>".concat(match, "</ul>"); })
                .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
                .replace(/<li>.*?<\/li>/g, function (match) { return "<ol>".concat(match, "</ol>"); })
        }}/>
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
                {toc.map(function (item, index) { return (<a key={index} href={"#".concat(item.id)} className={"toc-link block text-sm text-foreground hover:text-primary transition-colors duration-200 py-2 px-3 rounded hover:bg-accent/50 ".concat(item.level === 1 ? 'font-semibold' :
                item.level === 2 ? 'ml-4' :
                    item.level === 3 ? 'ml-8' : '')} onClick={function (e) {
                e.preventDefault();
                var element = document.getElementById(item.id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Add active state with a highlight
                    var allLinks = document.querySelectorAll('.toc-link');
                    allLinks.forEach(function (link) { return link.classList.remove('bg-accent/50', 'text-primary'); });
                    e.currentTarget.classList.add('bg-accent/50', 'text-primary');
                }
            }}>
                    {item.text}
                  </a>); })}
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
