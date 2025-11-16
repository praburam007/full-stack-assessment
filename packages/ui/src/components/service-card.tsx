import React, {useState, useCallback} from "react";
import { ServiceMetric } from "../store/use-metrics-store";
import ServiceDetailModal from "./servvice-detail-modal";

const getAlertColor = (cpu: number, errorRate: number): string => {
  if (cpu > 80 || errorRate >5) return 'var(--color-red)';
  if (cpu > 60) return 'var(--color-yellow)';
  return 'var(--color-green)';
}

const ServiceCard: React.FC<{service: ServiceMetric}> = ({service}) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(prev => !prev);
  }, []);


  return (
    <div className="service-card" style={{
        border: `2px solid ${getAlertColor(service.cpu, service.errorRate)}`,
        }} onClick={handleOpen}>
      <h2>{service.serviceName}</h2>
      <div>CPU Usage: {service.cpu}%</div>
      <div>Memory Usage: {service.memory}MB</div>
      <div>Error Rate: {service.errorRate}%</div>
      <div className="service-text" style={{color: getAlertColor(service.cpu, service.errorRate)}}>
        {service.cpu > 80 || service.errorRate > 5 ? 'ALERT' : service.cpu > 60 ? 'WARNING' : 'OK'}
      </div>
      {open && <ServiceDetailModal serviceName={service.serviceName} onClose={handleClose}></ServiceDetailModal>}
    </div>
  );
}

export default React.memo(ServiceCard);