export type ServiceMetric = {
  serviceName: string;
  cpu: number;
  memory: number;
  errorRate: number;
};

export default class MetricSimulator {
  private services: string[] = [];
  public serviceCount: number;

  constructor(serviceCount: number) {
    this.serviceCount = serviceCount;
    this.services = this.generateServiceNames(serviceCount);
  }

  updateServiceCount(newCount: number) {
    this.serviceCount = newCount;
    this.services = this.generateServiceNames(newCount);
  }

  generateServiceNames(count: number): string[] {
    const names: string[] = [];
    for (let i = 1; i <= count; i++) {
      names.push(`service-${i}`);
    }
    return names;
  }

  generateMetrics(): ServiceMetric[] {
    return this.services.map((serviceName: string) => ({
      serviceName,
      cpu: parseFloat((Math.random() * 100).toFixed(2)),
      memory: parseFloat((Math.random() * 100).toFixed(2)),
      errorRate: parseFloat((Math.random() * 10).toFixed(2)),
    }));
  }
}
