"use client";

import { useState } from "react";
import Dashboard from "@/Components/Dashboard/Dashboard";
import Navbar from "@/Components/Navbar/Navbar";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Sidebar Navbar */}
      <Navbar 
        isCollapsed={isCollapsed} 
        isMobileNavVisible={isMobileNavVisible} 
        onMobileNavToggle={() => setIsMobileNavVisible(!isMobileNavVisible)}
      />

      {/* Main Dashboard */}
      <div className="flex-1 h-screen overflow-auto">
        <Dashboard 
          onToggle={() => setIsCollapsed((prev) => !prev)} 
          onMobileNavToggle={() => setIsMobileNavVisible(!isMobileNavVisible)}
        />
      </div>
    </div>
  );
}