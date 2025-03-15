/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Dashboard from "@/Components/Dashboard/Dashboard";
import Navbar from "@/Components/Navbar/Navbar";
import Agents from "@/Components/BrowseAgents/Agents";

const Page = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

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
