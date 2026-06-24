"use client";
import React, { useEffect, useRef, useState } from "react";
import { Globe, ChevronRight, Lock, User } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/main/logo.png";
import { IoDiamondOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useGetProfileQuery, useGetUsersQuery } from "@/lib/authApi";

interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
  userAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName: propName,
  userAvatar: propAvatar,
}) => {
  // 1. Fetch live user data via RTK Query
  const { data: userResponse, isLoading } = useGetProfileQuery();
  const navigate = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Fallback to API values if the props aren't provided or empty
  const apiName = userResponse?.data?.full_name;
  const apiAvatar = userResponse?.data?.profile_image;

  const finalName = propName || apiName || "Guest User";
  const finalAvatar =
    propAvatar ||
    apiAvatar ||
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100";

  // Debugging log safely placed directly inside execution cycle instead of a manual refetch loop
  useEffect(() => {
    if (!isLoading && userResponse) {
      console.log("User data retrieved successfully:", userResponse);
    }
  }, [userResponse, isLoading]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white h-20">
      <div className="h-1.5 bg-[#FF6F6F] w-full" />

      <div className="h-18.5 border-b border-gray-100 flex items-center justify-between px-6 md:px-12">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Fixed aspect-ratio height auto warning by supplying style tags */}
          <Image
            src={logo}
            className="h-8 md:h-10 w-auto"
            style={{ height: "auto" }}
            alt="BMC"
          />
          <div>
            <h1 className="text-lg md:text-3xl font-sans text-gray-800 font-bold">
              Black <span className="text-red-400">Millennial</span> Café
            </h1>
            <span className="block text-[7px] md:text-[8px] font-normal text-gray-600 tracking-wide uppercase">
              Serving all things black, community and emerging generations
            </span>
          </div>
        </div>

        {/* Right */}
        <div
          className="flex items-center gap-4 md:gap-8 relative"
          ref={dropdownRef}
        >
          {/* Desktop Upgrade */}
          <button className="hidden sm:flex items-center gap-2 bg-[#FD6E6E] px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 text-white hover:cursor-pointer">
            <IoDiamondOutline color="#FFD389" size={18} />
            Upgrade Plan
          </button>

          {/* Profile */}
          <div
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FD6E6E] bg-gray-100 flex items-center justify-center">
              {isLoading && !propAvatar ? (
                <div className="w-full h-full animate-pulse bg-gray-200" />
              ) : (
                <img
                  src={finalAvatar}
                  alt={finalName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 text-gray-700">
              {isLoading && !propName ? (
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
              ) : (
                <span className="font-bold text-sm">{finalName}</span>
              )}
            </div>
            <ChevronRight
              size={16}
              className={`transition hidden md:block text-gray-600 ${open ? "rotate-90" : ""}`}
            />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in text-gray-700">
              <button
                onClick={() => navigate.push("/dashboard/plan")}
                className="w-full md:hidden flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium hover:cursor-pointer"
              >
                <Globe size={18} />
                Upgrade Plan
              </button>
              <button
                onClick={() => navigate.push("/dashboard/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium hover:cursor-pointer"
              >
                <User size={18} />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium hover:cursor-pointer">
                <Lock size={18} />
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
