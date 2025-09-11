import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, Clock, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  responseTime: number;
  lastChecked: string;
  uptime: number;
  certExpiry?: number;
  url?: string;
}

interface SystemStatus {
  overall: "operational" | "degraded" | "down";
  services: ServiceStatus[];
  lastUpdated: string;
}

interface UptimeStats {
  stats: Array<{
    service: string;
    uptime: number;
    averageResponseTime: number;
    totalChecks: number;
  }>;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "degraded":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "down":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    operational: "default",
    degraded: "secondary", 
    down: "destructive"
  } as const;

  const colors = {
    operational: "bg-green-100 text-green-800 border-green-200",
    degraded: "bg-yellow-100 text-yellow-800 border-yellow-200",
    down: "bg-red-100 text-red-800 border-red-200"
  } as const;

  return (
    <Badge 
      variant={variants[status as keyof typeof variants] || "outline"}
      className={colors[status as keyof typeof colors]}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function ServiceCard({ service }: { service: ServiceStatus }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <StatusIcon status={service.status} />
          {service.name}
        </CardTitle>
        <StatusBadge status={service.status} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {service.url && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Endpoint</span>
              <span className="font-mono text-xs truncate max-w-[200px]" title={service.url}>
                {service.url}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-medium">{service.uptime.toFixed(2)}%</span>
          </div>
          <Progress value={service.uptime} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Response Time</span>
            <span className="font-medium">{service.responseTime}ms</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Checked</span>
            <span className="font-medium">
              {new Date(service.lastChecked).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverallStatusCard({ status, lastUpdated }: { status: string; lastUpdated: string }) {
  const statusConfig = {
    operational: {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "All Systems Operational",
      description: "All services are running smoothly",
      bgColor: "bg-green-50 border-green-200"
    },
    degraded: {
      icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
      title: "Partial System Outage",
      description: "Some services are experiencing issues",
      bgColor: "bg-yellow-50 border-yellow-200"
    },
    down: {
      icon: <XCircle className="h-8 w-8 text-red-500" />,
      title: "System Outage",
      description: "Major service disruption detected",
      bgColor: "bg-red-50 border-red-200"
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.operational;

  return (
    <Card className={`${config.bgColor} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {config.icon}
          <div>
            <div className="text-xl">{config.title}</div>
            <CardDescription className="text-base mt-1">
              {config.description}
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Status() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: systemStatus, isLoading: statusLoading, error: statusError } = useQuery<SystemStatus>({
    queryKey: ["systemStatus"],
    queryFn: async () => {
      const response = await fetch("/api/status");
      if (!response.ok) {
        throw new Error("Failed to fetch system status");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: uptimeStats, isLoading: statsLoading } = useQuery<UptimeStats>({
    queryKey: ["uptimeStats"],
    queryFn: async () => {
      const response = await fetch("/api/status/uptime");
      if (!response.ok) {
        throw new Error("Failed to fetch uptime stats");
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (statusLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading system status...</p>
        </div>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-800">Failed to load system status</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">
          <a href="https://status.nexium-rpg.win/status/nexium" target="_blank" rel="noopener noreferrer" className="hover:underline text-inherit">
            Nexium RPG System Status
          </a>
        </h1>
        <p className="text-muted-foreground">
          Real-time status and uptime monitoring for nexium-rpg.win services
        </p>
        <p className="text-sm text-muted-foreground">
          Current time: {currentTime.toLocaleString()}
        </p>
      </div>

      {/* Overall Status */}
      {systemStatus && (
        <OverallStatusCard 
          status={systemStatus.overall} 
          lastUpdated={systemStatus.lastUpdated}
        />
      )}

      {/* Service Status Grid */}
      {systemStatus && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.services.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Uptime Statistics */}
      {uptimeStats && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Uptime Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uptimeStats.stats.map((stat) => (
              <Card key={stat.service}>
                <CardHeader>
                  <CardTitle className="text-sm">{stat.service} - Last 24h</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="font-medium">{stat.uptime}%</span>
                  </div>
                  <Progress value={stat.uptime} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Response</span>
                    <span className="font-medium">{stat.averageResponseTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Checks</span>
                    <span className="font-medium">{stat.totalChecks}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          <p>Status page updates every 30 seconds • Powered by Nexium RPG Monitoring</p>
          <p className="mt-1">
            Visit{" "}
            <a href="https://nexium-rpg.win" className="text-blue-600 hover:underline">
              nexium-rpg.win
            </a>
            {" "}• For support, check our{" "}
            <a href="https://github.com/Elenyx/Nexium-The-Eidolon-Protocol" className="text-blue-600 hover:underline">
              GitHub repository
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
