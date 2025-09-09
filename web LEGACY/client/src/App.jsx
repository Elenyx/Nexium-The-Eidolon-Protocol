import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import Guides from "@/pages/guides";
import GuideDetail from "@/pages/guide-detail";
import Dashboard from "@/pages/dashboard";
import Characters from "@/pages/characters";
import Battles from "@/pages/battles";
import Forums from "@/pages/forums";
import Leaderboard from "@/pages/leaderboard";
import NotFound from "@/pages/not-found";
function Router() {
    return (<Switch>
      <Route path="/" component={Home}/>
      <Route path="/guides" component={Guides}/>
      <Route path="/guides/:id" component={GuideDetail}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/characters" component={Characters}/>
      <Route path="/battles" component={Battles}/>
      <Route path="/forums" component={Forums}/>
      <Route path="/leaderboard" component={Leaderboard}/>
      <Route component={NotFound}/>
    </Switch>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <Router />
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
