import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import MetricSimulator from './services/metric-simulator.ts';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/metrics/stream' });

const simulator = new MetricSimulator(5);

app.use(express.json());

app.get('/config', (req: any, res: any) => {
  res.json({ serviceCount: simulator.serviceCount });
});

app.post('/config', (req: any, res: any) => {
  const { serviceCount } = req.body;
  if (typeof serviceCount === 'number' && serviceCount > 0) {
    simulator.updateServiceCount(serviceCount);
    res.json({ serviceCount: simulator.serviceCount });
  } else {
    res
      .status(400)
      .json({ error: 'Invalid service count. It should be a number between 1 and 20.' });
  }
});

wss.on('connection', (ws: any) => {
  console.log('Client connected to WebSocket');

  const sendMetrics = () => {
    if (ws.readyState === ws.OPEN) {
      const metrics = simulator.generateMetrics();
      ws.send(JSON.stringify(metrics));
    }
  };

  const intervalId = setInterval(sendMetrics, 1000);

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
    clearInterval(intervalId);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
