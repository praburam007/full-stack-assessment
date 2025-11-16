import { create } from 'zustand';

export type ServiceMetric = {
  serviceName: string;
  cpu: number;
  memory: number;
  errorRate: number;
};

export type MetricHistory = {
  [serviceName: string]: Array<ServiceMetric & { timestamp: number }>;
};

interface MetricsState {
  services: ServiceMetric[];
  history: MetricHistory;
  connect: () => void;
  addService: () => void;
  removeService: () => void;
}

const useMetricsStore = create<MetricsState>((set, get) => ({
  services: [],
  history: {},
  isLoading: false,
  ws: undefined as WebSocket | undefined,
  connect: () => {
    if (get().ws) return; // Already connected
    const wsUrl: string =
      window.location.protocol === 'https:'
        ? 'wss://localhost:4000/metrics/stream'
        : 'ws://localhost:4000/metrics/stream';
    const ws: WebSocket = new WebSocket(wsUrl);

    ws.onmessage = (event: any) => {
      const metrics: ServiceMetric[] = JSON.parse(event.data);
      set((state: MetricsState) => {
        const updatedHistory = { ...state.history };
        const now = Date.now();
        metrics.forEach((message: any) => {
          if (!updatedHistory[message.serviceName]) {
            updatedHistory[message.serviceName] = [];
          }
          updatedHistory[message.serviceName].push({ ...message, timestamp: now });
          if (updatedHistory[message.serviceName].length > 30) {
            updatedHistory[message.serviceName].shift();
          }
        });
        return { services: metrics, history: updatedHistory };
      });
    };

    ws.onclose = () => {
      set({ ws: undefined });
    };

    set({ ws });
  },
  addService: async () => {
    const res: any = await fetch('/config', {
      method: 'GET',
    });
    const { serviceCount } = await res.json();
    await fetch('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceCount: serviceCount + 1 }),
    });
  },
  removeService: async () => {
    const res: any = await fetch('/config', {
      method: 'GET',
    });
    const { serviceCount } = await res.json();
    await fetch('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceCount: serviceCount - 1 }),
    });
  },
}));

export default useMetricsStore;
