/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Dashboard from "@/Components/Dashboard/Dashboard";
import Navbar from "@/Components/Navbar/Navbar";
import Agents from "@/Components/BrowseAgents/Agents";

const Page = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Sidebar Navbar */}
      <Navbar isCollapsed={isCollapsed} />
      <div className="flex-1 h-full">
       <Agents onToggle={() => setIsCollapsed((prev) => !prev)}/>
      </div>
    </div>
  );
};

export default Page;
