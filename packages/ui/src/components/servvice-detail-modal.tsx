import React from "react";
import useMetricsStore from "../store/use-metrics-store";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from "recharts";

const ServiceDetailModal: React.FC<{serviceName: string; onClose: () => void}> = ({serviceName, onClose}) => {
  const {history} = useMetricsStore();
  const chartData = history[serviceName] || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{serviceName} - Metric Last 30s</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
            <YAxis domain={[0, 100]} />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
            <Line type="monotone" dataKey="cpu" stroke="var(--color-red)" name="CPU Usage (%)" />
            <Line type="monotone" dataKey="memory" stroke="var(--color-yellow)" name="Memory Usage (MB)" />
            <Line type="monotone" dataKey="errorRate" stroke="var(--color-green)" name="Error Rate (%)" />
          </LineChart>
        </ResponsiveContainer>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default React.memo(ServiceDetailModal);