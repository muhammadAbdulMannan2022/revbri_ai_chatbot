"use client";

import { ArrowLeft, ArrowRight, Home, LogOut, User } from "lucide-react";
import { useState } from "react";

import { useRouter, usePathname } from "next/navigation";
import { RiExchangeDollarLine } from "react-icons/ri";
import SidebarChatList from "./SidebarChat";

const agentsData = [
  {
    id: 1,
    name: "Finn",
    title: "HR Agent",
    avatar: "/bot1.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    name: "Nall",
    title: "Talent Acquisition",
    avatar: "/bot2.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const [activeAgentId, setActiveAgentId] = useState<number>(1);
  const activeAgent = agentsData.find((agent) => agent.id === activeAgentId);

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (to: string) => {
    if (to !== "logout") {
      router.push(to);
    } else {
      console.log("log out");
    }
  };

  return (
    <aside
      className={`bg-white absolute md:relative top-20 h-[calc(100vh-5rem)] left-0
      ${pathname === "/dashboard" && "w-[90%] sm:w-[80%] md:w-[20%] md:min-w-100"}
      transform transition-transform duration-300 z-10
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0`}
    >
      {/* toggle btn */}
      <button
        className="md:hidden absolute top-0 w-8 h-8 -right-8 bg-white text-gray-500 mt-4 rounded-e-full flex items-center justify-center shadow hover:cursor-pointer"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <ArrowLeft className="text-title-2nd" size={18} />
        ) : (
          <ArrowRight className="text-title-2nd" size={18} />
        )}
      </button>

      <div className="w-full h-full flex ">
        {/* left icons */}
        <div
          className={`${pathname === "/dashboard" ? "w-[23%]" : "w-full"} flex flex-col items-center gap-3 py-4 px-4 border-r border-gray-200`}
        >
          {[
            {
              name: "Plan",
              Icon: RiExchangeDollarLine,
              id: 1,
              action: "/dashboard/plan",
            },
            {
              name: "Profile",
              Icon: User,
              id: 2,
              action: "/dashboard/profile",
            },

            { name: "Logout", Icon: LogOut, id: 3, action: "logout" },
          ].map((Icon, i) => (
            <div
              onClick={() => handleNavigate(Icon.action)}
              key={i}
              className={`flex flex-col text-[#6A7282] items-center justify-center w-full aspect-square rounded-xl text-[10px] sm:text-xs cursor-pointer ${pathname === "/dashboard" ? "" : "p-2.5"}`}
            >
              <Icon.Icon size={18} />
              <p>{Icon.name}</p>
            </div>
          ))}
        </div>

        {/* right content */}
        {pathname === "/dashboard" && (
          <div className="w-[80%]  relative flex flex-col">
            {/* chat section */}
            <div className="flex-1 overflow-y-auto hide-scrollbar relative mt-3 px-4">
              <SidebarChatList />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
