import { getSystemStatus } from "./status";

class UptimeMonitor {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;

  start(intervalMs: number = 60000) { // Default: check every minute
    if (this.isRunning) {
      console.log("Uptime monitor is already running");
      return;
    }

    console.log(`Starting uptime monitor with ${intervalMs}ms interval`);
    this.isRunning = true;

    // Run initial check
    this.performHealthCheck();

    // Set up recurring checks
    this.interval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log("Uptime monitor stopped");
  }

  private async performHealthCheck() {
    try {
      console.log("Performing health check...");
      
      // Create mock request and response objects for the status check
      const mockReq = {} as any;
      const mockRes = {
        json: (data: any) => {
          console.log("Health check completed:", {
            overall: data.overall,
            services: data.services.map((s: any) => ({
              name: s.name,
              status: s.status,
              responseTime: s.responseTime
            }))
          });
        },
        status: () => mockRes
      } as any;

      await getSystemStatus(mockReq, mockRes);
    } catch (error) {
      console.error("Health check failed:", error);
    }
  }

  isMonitorRunning(): boolean {
    return this.isRunning;
  }
}

export const uptimeMonitor = new UptimeMonitor();
