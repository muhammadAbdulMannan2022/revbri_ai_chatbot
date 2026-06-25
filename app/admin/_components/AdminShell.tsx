"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  BarChart3,
  Bell,
  Bot,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareWarning,
  Package,
  UserRound,
  Users,
} from "lucide-react";

import logo from "@/assets/main/logo.png";
import { useGetProfileQuery } from "@/lib/authApi";
import { logout } from "@/lib/authSlice";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Promotional", icon: Megaphone, href: "/admin/promotional" },
  { label: "Pricing Plans", icon: CreditCard, href: "/admin/pricing-plans" },
  {
    label: "Message and Alerts",
    icon: MessageSquareWarning,
    href: "/admin/messages",
  },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "AI Controls", icon: Bot, href: "/admin/ai-controls" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {
    data: user,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("token");

    // Clear all localStorage keys that contain auth or token info
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith("persist:") ||
        key.includes("auth") ||
        key.includes("token")
      ) {
        localStorage.removeItem(key);
      }
    });

    // Dispatch logout action to clear Redux state
    dispatch(logout());

    setShowLogoutModal(false);

    // Redirect to login
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <header className="sticky top-0 z-50 h-20 bg-white shadow-[0_3px_12px_rgba(15,23,42,0.16)]">
        <div className="h-1.5 w-full bg-[#FD6E6E]" />

        <div className="flex h-[74px] items-center justify-between border-b border-gray-100 px-6 md:px-12">
          <div className="flex items-center gap-4">
            <Image
              src={logo}
              alt="BMC"
              className="h-8 w-auto md:h-10"
              priority
            />
            <div>
              <h1 className="font-sans text-3xl font-bold text-gray-800">
                Black <span className="text-red-400">Millennial</span>{" "}
                Caf&eacute;
              </h1>
              <span className="block text-[8px] font-normal uppercase tracking-wide text-gray-600">
                Serving all things black, community and emerging generations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#303744] transition hover:bg-[#f4f5f7]"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={1.8} />
              <span className="absolute right-[7px] top-[7px] h-[7px] w-[7px] rounded-full bg-[#ef5b5e] ring-2 ring-white" />
            </button>

            <div className="text-right leading-tight">
              <p className="text-[11px] font-bold text-[#151b26]">
                {(!isProfileLoading &&
                  !isProfileError &&
                  user?.data?.full_name) ??
                  "Admin User"}
              </p>
              <p className="text-[9px] text-[#6d7480]">
                {(!isProfileLoading && !isProfileError && user?.data?.email) ??
                  "admin@platform.com"}
              </p>
            </div>

            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ef5b5e] text-white"
              aria-label="Admin profile"
            >
              <UserRound size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-20 h-[calc(100vh_-_80px)] w-[clamp(210px,15.6vw,274px)] shrink-0 overflow-y-auto border-r border-[#e7ebf0] bg-white px-[14px] py-[clamp(26px,2.3vw,41px)]">
          <nav
            className="space-y-[clamp(13px,1.25vw,22px)]"
            aria-label="Admin navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-[clamp(38px,2.7vw,48px)] w-full items-center gap-[10px] rounded-md px-[14px] text-[11px] font-semibold transition ${
                    active
                      ? "bg-[#ef5b5e] text-white shadow-sm"
                      : "text-[#2f3b4b] hover:bg-[#f5f6f8]"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex h-[clamp(38px,2.7vw,48px)] w-full items-center gap-[10px] rounded-md px-[14px] text-[11px] font-semibold text-[#2f3b4b] transition hover:bg-[#f5f6f8]"
            >
              <LogOut size={14} strokeWidth={1.9} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-[clamp(28px,2vw,35px)] py-[clamp(24px,2.1vw,37px)]">
          <div className="max-w-[1400px]">{children}</div>
        </main>
      </div>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="relative w-full max-w-[380px] rounded-[10px] bg-white px-[30px] pb-[21px] pt-[31px] shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
            <button
              type="button"
              aria-label="Close logout confirmation"
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-[15px] top-[10px] text-[14px] leading-none text-[#5b607a] transition hover:text-[#151b26]"
            >
              x
            </button>

            <h2
              id="logout-title"
              className="text-center text-[18px] font-extrabold leading-tight text-[#565a75]"
            >
              Are You Sure About Logging Out?
            </h2>

            <div className="mt-[28px] grid grid-cols-2 gap-[14px]">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-[37px] rounded-[6px] border border-[#ff5f63] bg-white text-[12px] font-extrabold text-[#ff5f63] transition hover:bg-[#fff5f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="h-[37px] rounded-[6px] bg-[#ff6669] text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(255,102,105,0.32)] transition hover:bg-[#ef5b5e]"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
