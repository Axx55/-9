import React from "react";
import { useApp } from "../context/AppContext";
import { InstitutionDashboard } from "./InstitutionDashboard";
import { Trips } from "./Trips";

export function Home() {
  const { user } = useApp();
  
  if (user?.accountType === "institution") {
    return <InstitutionDashboard />;
  }
  
  return <Trips />;
}
