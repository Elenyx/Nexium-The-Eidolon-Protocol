import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

const guides: Guide[] = [
  {
    id: "getting-started",
    title: "Getting Started with Nexium RPG",
    description: "Learn the basics of playing Nexium RPG, from creating your first character to your first battle.",
    category: "Basics",
    readTime: "5 min read"
  },
  {
    id: "character-building",
    title: "Advanced Character Building",
    description: "Master the art of character creation with tips on stats, skills, and equipment optimization.",
    category: "Characters",
    readTime: "10 min read"
  },
  {
    id: "battle-strategies",
    title: "Battle Strategies and Tactics",
    description: "Discover winning strategies for different battle types and how to counter various playstyles.",
    category: "Combat",
    readTime: "8 min read"
  },
  {
    id: "community-engagement",
    title: "Engaging with the Community",
    description: "Make the most of forums, Discord, and social features to connect with other players.",
    category: "Community",
    readTime: "6 min read"
  }
];

const categories = ["All", "Basics", "Characters", "Combat", "Community"];

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Guides & Tutorials
          </h1>
          <p className="text-lg text-muted-foreground">
            Master Nexium RPG with our comprehensive guides and tutorials
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map(guide => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{guide.category}</Badge>
                  <span className="text-sm text-muted-foreground">{guide.readTime}</span>
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {guide.description}
                </CardDescription>
                <Button asChild className="w-full">
                  <Link href={`/guides/${guide.id}`}>
                    Read More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No guides found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
