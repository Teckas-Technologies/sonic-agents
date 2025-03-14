"use client";
import { useState } from "react";
import InlineSVG from "react-inlinesvg";
import { BiUpArrowAlt } from "react-icons/bi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
const agents = [
  {
    name: "Delta Trade DCA Helper",
    description: "Agent description here...",
    logo: "images/sonic-logo.png", // Replace with actual logo URL
  },
  {
    name: "PotLock-Assistant",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
  {
    name: "Bitte Distribute Tokens",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
  {
    name: "Bitte WETH Wraptor",
    description: "Agent description here...",
    logo: "images/sonic-logo.png",
  },
];
export default function Dashboard({ onToggle }: { onToggle: () => void }) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(""); // Track input value
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Bar */}
      <div
        className="bg-gray-900 p-4 flex flex-row items-center gap-[20px] m-4"
        style={{ fontFamily: "orbitron" }}
      >
        <button onClick={onToggle} className="focus:outline-none">
          <InlineSVG
            src="icons/Toggle.svg"
            className="w-5 h-5 cursor-pointer"
          />
        </button>
        <div className="text-lg text-gray-400 font-semibold">CHAT</div>
        <MdKeyboardArrowRight className="w-6 h-6" />
        <div className="text-white text-xs ">VEJAS6QK0U1BTPQK</div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-black p-4 m-4 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
          {/* Header + Input (Fixed Size) */}
          <div className="flex-shrink-0">
            <h2
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: "orbitron" }}
            >
              Agents
            </h2>
            <p
              className="text-sm text-gray-400 mb-4"
              style={{ fontFamily: "manrope" }}
            >
              Choose agents to perform specific tasks.
            </p>
            <div className="relative w-full flex items-center">
              <FaSearch className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 pl-10 bg-gray-800 text-white rounded placeholder:font-manrope placeholder:text-base placeholder:text-gray-400 focus:outline-none focus:ring-0"
                style={{ fontFamily: "manrope" }}
              />
            </div>
          </div>

          {/* Scrollable List (Takes Remaining Space) */}
          <div
            className="space-y-4 border border-gray-700 p-4 mt-4 rounded overflow-y-auto h-full"
            style={{ fontFamily: "manrope", maxHeight: "430px" }}
          >
            {agents.map((agent) => (
              <div
                key={agent.name}
                onClick={() => setActiveAgent(agent.name)}
                className={`p-4 rounded cursor-pointer rounded-md border transition-all duration-200 bg-[#0c1a27]
        ${
          activeAgent === agent.name
            ? "border-[#fde68a]" // Active agent gets only the border
            : "border-transparent hover:border-[#fde68a]" // Hover effect for others
        }`}
              >
                {/* Top Row: Logo, Title, Info Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={agent.logo}
                      alt={agent.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <h3 className="font-semibold">{agent.name}</h3>
                  </div>
                  <IoMdInformationCircleOutline className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>

                {/* Description Below */}
                <p className="text-sm text-gray-400 mt-1">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full">
          {/* Execute Transactions with AI Box (Takes 3/4 Height) */}
          <div className="flex-1 flex items-center justify-center bg-gray-950 border border-gray-700 rounded-lg mt-4 mr-4 ml-4 mb-2 p-6">
            <div className="text-center">
              <div className="flex justify-center items-center">
                <img src="images/sonic-logo.png" className="h-[100px]" />
              </div>
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "orbitron" }}
              >
                Execute Transactions with AI
              </h2>
              <button
                className="mt-4 bg-white text-black px-7 py-2 rounded font-semibold"
                style={{ fontFamily: "manrope" }}
              >
                Connect
              </button>
            </div>
          </div>

          {/* BITTE ASSISTANT Input Bar (Stays at Bottom) */}
          {/* BITTE ASSISTANT Input Bar (Stays at Bottom) */}
          <div className="flex p-4 border border-gray-700 rounded-lg m-4">
            {/* Input Container (90%) */}
            <div className="flex-1 bg-gray-900 rounded flex items-center border border-gray-700 px-2 py-2">
              <span
                className="px-3 py-1 bg-[#fbb042] rounded text-black font-bold"
                style={{ fontFamily: "orbitron" }}
              >
                {activeAgent ? activeAgent.toUpperCase() : "SONIC ASSISTANT"}
              </span>
              <input
                type="text"
                placeholder="Message Smart Actions"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 bg-transparent outline-none text-white ml-2 placeholder-gray-400"
                style={{ fontFamily: "manrope" }}
              />
            </div>

            {/* Arrow Container (10%) */}
            <div
              className={`w-16 flex justify-center items-center px-2 py-2 rounded ml-3 transition-all ${
                message.trim() ? "bg-[#0000ff]" : "bg-gray-700"
              }`}
            >
              <BiUpArrowAlt className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
