"use client";
import { useState } from "react";

import { Header } from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

// Main layout component with Outlet (for routing, e.g., different views in main area)
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col overflow-hidden font-sans bg-black text-white ">
      {/* Header */}
      <Header onMenuClick={() => toggleSidebar()} />

      {/* Content area: flex row for sidebar + main */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Left sidebar - hidden on mobile, toggled via button */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main area with Outlet - shares space with sidebar */}
        <main className="overflow-y-auto flex-1 h-[calc(100vh-5rem)] mt-20 bg-linear-to-br from-[#DDDCE9] to-[#F8FAFC] ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
