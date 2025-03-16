/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/Components/Dashboard/Dashboard";
import Navbar from "@/Components/Navbar/Navbar";
import Agents from "@/Components/BrowseAgents/Agents";

const Page = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("isCollapsed") || "false");
  });

  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="h-screen flex">
      {/* Sidebar Navbar */}
      <Navbar
        isCollapsed={isCollapsed}
        isMobileNavVisible={isMobileNavVisible}
        onMobileNavToggle={() => setIsMobileNavVisible(!isMobileNavVisible)}
      />
      <div className="flex-1 h-full">
        <Agents
          onToggle={() => setIsCollapsed((prev) => !prev)}
          onMobileNavToggle={() => setIsMobileNavVisible(!isMobileNavVisible)}
          isMobileNavVisible={isMobileNavVisible}
        />
      </div>
    </div>
  );
};

export default Page;
