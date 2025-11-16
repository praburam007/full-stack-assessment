import React, { useEffect, useState } from 'react';
import useMetricsStore from '../store/use-metrics-store';
import ServiceCard from './service-card';

const Dashboard: React.FC = () => {
  const {services, connect, addService, removeService} = useMetricsStore();

  useEffect(() => {
   connect();
  }, [connect]);

  return (
    <div className='dashboard-container'>
      <h1>Live Metrics Dashboard</h1>
      <div className='dashboard-content'>
        {services.map((service) => (
            <ServiceCard key={service.serviceName} service={service} />
        ))}
      </div>
      <div className='dashboard-footer'>
        <button onClick={() => addService()}>Add Service</button>
        <button className='m-l-2' onClick={() => removeService()}>Remove Service</button>
      </div>
    </div>
  );
}

export default React.memo(Dashboard);
