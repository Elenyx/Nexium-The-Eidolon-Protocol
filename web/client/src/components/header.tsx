import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ExternalLink } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, login, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use Vite env var for the external Uptime Kuma status page
  // Hardcode as fallback for Railway production builds
  const uptimeUrl = (import.meta as any).env?.VITE_UPTIME_KUMA_URL || "https://status.nexium-rpg.win/status/nexium";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/characters", label: "Eidolons" },
    { href: "/battles", label: "Battles" },
    { href: "/leaderboard", label: "Leaderboard" },
    // Replace internal /status with the external Uptime Kuma status page URL
    { href: uptimeUrl, label: "Status" },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path d="M12 2L8 12L16 12L12 2Z" fill="currentColor"/>
                <path d="M12 22L16 12L8 12L12 22Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nexium
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isExternal = item.href.startsWith("http");
              const className = `transition-colors ${
                location === item.href ? "text-accent" : "text-muted-foreground hover:text-accent"
              }`;

              return isExternal ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {item.label}
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </span>
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={className}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png` : undefined}
                        alt={user.username}
                      />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" data-testid="menu-dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={login}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg flex items-center space-x-2 transition-all glow-effect"
                data-testid="discord-login"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                </svg>
                <span>Login with Discord</span>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => {
                const isExternal = item.href.startsWith("http");
                const mobileClass = `py-2 px-4 rounded transition-colors ${
                  location === item.href ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-accent hover:bg-accent/5"
                }`;

                return isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={mobileClass}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  >
                    <span className="inline-flex items-center justify-between w-full">
                      <span className="inline-flex items-center gap-2">
                        {item.label}
                        <ExternalLink className="w-4 h-4 opacity-80" />
                      </span>
                    </span>
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={mobileClass}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
