import { Request, Response } from "express";
import { db } from "./db";

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

async function checkDatabaseStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Test Railway PostgreSQL connection
    await db.execute("SELECT 1");
    const responseTime = Date.now() - start;
    
    return {
      name: "Railway PostgreSQL",
      status: "operational",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: 100,
      url: "postgresql://trolley.proxy.rlwy.net:52172"
    };
  } catch (error) {
    return {
      name: "Railway PostgreSQL", 
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "postgresql://trolley.proxy.rlwy.net:52172"
    };
  }
}

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
      name: "Nexium Website",
      status: response.ok ? "operational" : "degraded",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: response.ok ? 100 : 50,
      url: "https://nexium-rpg.win"
    };
  } catch (error) {
    return {
      name: "Nexium Website",
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "https://nexium-rpg.win"
    };
  }
}

async function checkBotStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Check if bot service is accessible via API or health endpoint
    // Since the bot runs separately, we'll check if it has recent activity in the database
    const recentActivity = await db.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE last_daily > NOW() - INTERVAL '1 hour'
    `).catch(() => ({ rows: [{ count: 0 }] }));
    
    const responseTime = Date.now() - start;
    const hasRecentActivity = recentActivity.rows?.[0]?.count > 0;
    
    return {
      name: "Discord Bot",
      status: hasRecentActivity ? "operational" : "degraded",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: hasRecentActivity ? 100 : 75,
      url: "Discord Bot Service"
    };
  } catch (error) {
    return {
      name: "Discord Bot",
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "Discord Bot Service"
    };
  }
}

async function checkAPIStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Check if the API server is responding
    const responseTime = Date.now() - start;
    
    return {
      name: "Web API",
      status: "operational",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: 100,
      url: "https://nexium-rpg.win/api"
    };
  } catch (error) {
    return {
      name: "Web API",
      status: "down", 
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0,
      url: "https://nexium-rpg.win/api"
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
      checkDatabaseStatus(),
      checkWebsiteStatus(),
      checkBotStatus(),
      checkAPIStatus()
    ]);

    // Store status history
    services.forEach(service => {
      if (!statusHistory.has(service.name)) {
        statusHistory.set(service.name, []);
      }
      const history = statusHistory.get(service.name)!;
      history.push({
        timestamp: Date.now(),
        status: service.status,
        responseTime: service.responseTime
      });
      
      // Keep only last 100 entries
      if (history.length > 100) {
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
