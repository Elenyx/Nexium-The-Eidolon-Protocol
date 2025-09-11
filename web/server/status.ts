import { Request, Response } from "express";

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

// Uptime Kuma API interfaces
interface UptimeKumaMonitor {
  id: number;
  name: string;
  url?: string;
  type: string;
}

interface UptimeKumaGroup {
  name: string;
  monitorList: UptimeKumaMonitor[];
}

interface UptimeKumaStatusPageData {
  config: {
    title: string;
    description?: string;
  };
  publicGroupList: UptimeKumaGroup[];
}

interface UptimeKumaHeartbeat {
  status: number; // 0=DOWN, 1=UP, 2=PENDING, 3=MAINTENANCE
  time: string;
  ping?: number;
}

interface UptimeKumaHeartbeatData {
  heartbeatList: { [monitorId: number]: UptimeKumaHeartbeat[] };
  uptimeList: { [key: string]: number };
}

// Store status history in memory (in production, you'd use a database)
const statusHistory: Map<string, { timestamp: number; status: string; responseTime: number }[]> = new Map();

// Uptime Kuma configuration
const UPTIME_KUMA_BASE_URL = process.env.UPTIME_KUMA_URL || "http://localhost:3001";
const UPTIME_KUMA_STATUS_PAGE_SLUG = process.env.UPTIME_KUMA_SLUG || "nexium";

// Status mapping from Uptime Kuma to our format
const mapUptimeKumaStatus = (status: number): "operational" | "degraded" | "down" => {
  switch (status) {
    case 1: return "operational"; // UP
    case 0: return "down"; // DOWN
    case 2: return "degraded"; // PENDING
    case 3: return "degraded"; // MAINTENANCE
    default: return "down";
  }
};

async function fetchUptimeKumaStatus(): Promise<UptimeKumaStatusPageData | null> {
  try {
    console.log(`Fetching from: ${UPTIME_KUMA_BASE_URL}/api/status-page/${UPTIME_KUMA_STATUS_PAGE_SLUG}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${UPTIME_KUMA_BASE_URL}/api/status-page/${UPTIME_KUMA_STATUS_PAGE_SLUG}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Nexium-Status-Sync/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Failed to fetch Uptime Kuma status: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log("Uptime Kuma status data received, groups:", data.publicGroupList?.length || 0);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Uptime Kuma request timed out");
    } else {
      console.error("Error fetching Uptime Kuma status:", error);
    }
    return null;
  }
}

async function fetchUptimeKumaHeartbeats(): Promise<UptimeKumaHeartbeatData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${UPTIME_KUMA_BASE_URL}/api/status-page/heartbeat/${UPTIME_KUMA_STATUS_PAGE_SLUG}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Failed to fetch Uptime Kuma heartbeats: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Uptime Kuma heartbeats:", error);
    return null;
  }
}

async function getServicesFromUptimeKuma(): Promise<ServiceStatus[]> {
  console.log("Fetching status from Uptime Kuma...");
  
  try {
    const statusData = await fetchUptimeKumaStatus();
    const heartbeatData = await fetchUptimeKumaHeartbeats();

    if (!statusData || !heartbeatData) {
      console.log("Uptime Kuma unavailable, falling back to direct checks");
      return await getServicesFromDirectChecks();
    }

    console.log("Successfully fetched Uptime Kuma data");
    const services: ServiceStatus[] = [];

    // Process each monitor group
    for (const group of statusData.publicGroupList) {
      for (const monitor of group.monitorList) {
        const heartbeats = heartbeatData.heartbeatList[monitor.id] || [];
        const latestHeartbeat = heartbeats[heartbeats.length - 1];

        if (latestHeartbeat) {
          const uptime24h = heartbeatData.uptimeList[`${monitor.id}_24`] || 0;

          services.push({
            name: monitor.name,
            status: mapUptimeKumaStatus(latestHeartbeat.status),
            responseTime: latestHeartbeat.ping || 0,
            lastChecked: latestHeartbeat.time,
            uptime: uptime24h * 100, // Convert to percentage
            url: monitor.url
          });
        }
      }
    }

    // If no services found from Uptime Kuma, fall back to direct checks
    if (services.length === 0) {
      console.log("No monitors found in Uptime Kuma, falling back to direct checks");
      return await getServicesFromDirectChecks();
    }

    return services;
  } catch (error) {
    console.error("Error fetching from Uptime Kuma:", error);
    console.log("Falling back to direct checks");
    return await getServicesFromDirectChecks();
  }
}

// Fallback function for direct checks (original implementation)
async function getServicesFromDirectChecks(): Promise<ServiceStatus[]> {
  const services = await Promise.all([
    checkWebsiteStatus(),
    checkAPIStatus(),
    checkDiscordBotStatus()
  ]);
  return services;
}

async function checkWebsiteStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Check nexium-rpg.win website with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout
    
    const response = await fetch("https://nexium-rpg.win", { 
      method: "HEAD",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;
    
    return {
      name: "Website",
      status: response.ok ? "operational" : "degraded",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: response.ok ? 100 : 50,
      url: "https://nexium-rpg.win"
    };
  } catch (error) {
    return {
      name: "Website",
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "https://nexium-rpg.win"
    };
  }
}

async function checkAPIStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Check API health by testing a simple endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout
    
    const response = await fetch("https://nexium-rpg.win/api/status", { 
      method: "HEAD",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;
    
    return {
      name: "API",
      status: response.ok ? "operational" : "degraded",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: response.ok ? 100 : 50,
      url: "https://nexium-rpg.win/api"
    };
  } catch (error) {
    return {
      name: "API",
      status: "down", 
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "https://nexium-rpg.win/api"
    };
  }
}

async function checkDiscordBotStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Check Discord bot health endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout
    
    const response = await fetch("http://bot-production-c52c.up.railway.app/health", { 
      method: "HEAD",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;
    
    return {
      name: "Discord Bot",
      status: response.ok ? "operational" : "degraded",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: response.ok ? 100 : 50,
      url: "http://bot-production-c52c.up.railway.app/health"
    };
  } catch (error) {
    return {
      name: "Discord Bot",
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "http://bot-production-c52c.up.railway.app/health"
    };
  }
}

function calculateOverallStatus(services: ServiceStatus[]): "operational" | "degraded" | "down" {
  const downServices = services.filter(s => s.status === "down").length;
  const degradedServices = services.filter(s => s.status === "degraded").length;
  
  if (downServices > 0) {
    return downServices === services.length ? "down" : "degraded";
  }
  
  if (degradedServices > 0) {
    return "degraded";
  }
  
  return "operational";
}

export async function getSystemStatus(req: Request, res: Response) {
  try {
    // Try to get data from Uptime Kuma first
    const services = await getServicesFromUptimeKuma();

    // Store status history for all services
    services.forEach((service: ServiceStatus) => {
      if (!statusHistory.has(service.name)) {
        statusHistory.set(service.name, []);
      }
      const history = statusHistory.get(service.name)!;
      history.push({
        timestamp: Date.now(),
        status: service.status,
        responseTime: service.responseTime
      });
      
      // Keep only last N entries (configurable via environment variable)
      const historyLimit = parseInt(process.env.UPTIME_HISTORY_LIMIT || '100', 10);
      if (history.length > historyLimit) {
        history.shift();
      }
    });

    const overall = calculateOverallStatus(services);
    
    const systemStatus: SystemStatus = {
      overall,
      services,
      lastUpdated: new Date().toISOString()
    };

    res.json(systemStatus);
  } catch (error) {
    console.error("Error checking system status:", error);
    res.status(500).json({ error: "Failed to check system status" });
  }
}

export async function getStatusHistory(req: Request, res: Response) {
  try {
    const serviceName = req.params.service;
    const history = statusHistory.get(serviceName) || [];
    
    res.json({
      service: serviceName,
      history: history.slice(-50) // Return last 50 entries
    });
  } catch (error) {
    console.error("Error getting status history:", error);
    res.status(500).json({ error: "Failed to get status history" });
  }
}

export async function getUptimeStats(req: Request, res: Response) {
  try {
    const stats = Array.from(statusHistory.entries()).map(([serviceName, history]) => {
      const totalChecks = history.length;
      const operationalChecks = history.filter(h => h.status === "operational").length;
      const uptime = totalChecks > 0 ? (operationalChecks / totalChecks) * 100 : 100;
      
      const avgResponseTime = totalChecks > 0 
        ? history.reduce((sum, h) => sum + h.responseTime, 0) / totalChecks 
        : 0;

      return {
        service: serviceName,
        uptime: Number(uptime.toFixed(2)),
        averageResponseTime: Number(avgResponseTime.toFixed(2)),
        totalChecks
      };
    });

    res.json({ stats });
  } catch (error) {
    console.error("Error getting uptime stats:", error);
    res.status(500).json({ error: "Failed to get uptime stats" });
  }
}
