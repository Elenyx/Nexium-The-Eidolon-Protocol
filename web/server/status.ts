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

// Store status history in memory (in production, you'd use a database)
const statusHistory: Map<string, { timestamp: number; status: string; responseTime: number }[]> = new Map();

async function checkWebsiteStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Check nexium-rpg.win website with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
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
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
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
    // For Discord bot, we'll assume it's operational since it's harder to check externally
    // In a real implementation, you could add a health endpoint to your bot
    const responseTime = Date.now() - start;
    
    return {
      name: "Discord Bot",
      status: "operational",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: 100,
      url: "Discord Service"
    };
  } catch (error) {
    return {
      name: "Discord Bot",
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "Discord Service"
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
    const services = await Promise.all([
      checkWebsiteStatus(),
      checkAPIStatus(),
      checkDiscordBotStatus()
    ]);

    // Store status history
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
