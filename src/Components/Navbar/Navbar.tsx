/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRobot, FaLaptopCode } from "react-icons/fa6";
import { MdLink } from "react-icons/md";
import { HiMiniArrowUpRight } from "react-icons/hi2";

export default function Navbar({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname === "/browse") return "Browse Agents";
    return "Chat"; // Default active tab
  };

  const [active, setActive] = useState(getActiveTab);

  useEffect(() => {
    setActive(getActiveTab()); // Update state when route changes
  }, [pathname]);

  const handleNavigation = (page: string) => {
    setActive(page);
    router.push(page === "Browse Agents" ? "/browse" : "/");
  };

  return (
    <nav
  className={`h-screen bg-black text-white p-4 flex flex-col justify-between border-r border-gray-700 transition-all ${
    isCollapsed ? "w-20" : "w-64"
  }`}
>

      <div>
        {/* Logo */}
        <div className="flex items-center space-x-2 font-semibold">
          <img src="images/sonic-logo.png" className="h-9" />
          {!isCollapsed && (
            <span
              className="text-white text-2xl"
              style={{ fontFamily: "orbitron" }}
            >
              SONIC
            </span>
          )}
        </div>

        {/* Menu Items */}
        <ul className="mt-6 space-y-2" style={{ fontFamily: "manrope" }}>
          <li>
            <button
              className={`flex cursor-pointer items-center w-full gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                active === "Chat" ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
              onClick={() => handleNavigation("Chat")}
            >
              <FaLaptopCode className="w-8 h-8" />
              {!isCollapsed && (
                <span className="text-base font-semibold">Chat</span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`flex cursor-pointer items-center w-full px-3 gap-2 py-2 rounded-lg text-sm transition-colors ${
                active === "Browse Agents" ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
              onClick={() => handleNavigation("Browse Agents")}
            >
              <FaRobot className="w-8 h-8" />
              {!isCollapsed && (
                <span className="text-base font-semibold">Browse Agents</span>
              )}
            </button>
          </li>
        </ul>
        <hr className='mt-5 h-3'></hr>
        <div className="mt-4 space-y-4">
          <Link href="#" className="block text-gray-400 text-lg flex flex-row items-center gap-1 font-semibold hover:bg-gray-800 px-3 py-2 rounded-lg" style={{ fontFamily: "manrope" }}>
            Build Agent <HiMiniArrowUpRight />
          </Link>
          <Link href="#" className="block flex flex-row items-center gap-1 text-gray-400 text-lg font-semibold hover:bg-gray-800 px-3 py-2 rounded-lg" style={{ fontFamily: "manrope" }}>
            Documentation <HiMiniArrowUpRight />
          </Link>
        </div>
      </div>

      {/* Connect Wallet Button */}
      <button
        className="w-full py-2 rounded-lg cursor-pointer flex justify-center items-center gap-2 text-sm bg-white text-black font-bold hover:bg-gray-200 transition"
        style={{ fontFamily: "manrope" }}
      >
        <MdLink className="w-8 h-8" />
        {!isCollapsed && <span>Connect Wallet</span>}
      </button>
    </nav>
  );
}
