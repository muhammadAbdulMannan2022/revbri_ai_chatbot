import React from "react";
import HomeNavbar from "@/components/home/Navbar";
import HomeFooter from "@/components/home/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <HomeNavbar />
        <main>{children}</main>
      </div>
      <HomeFooter />
    </div>
  );
}
