import React from "react";
import Dashboard from "./components/dashboard";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Dashboard />
    </div>
  );
}

export default React.memo(App);