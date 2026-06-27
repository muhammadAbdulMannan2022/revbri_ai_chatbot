"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "@/assets/main/logo.png";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="bg-[#000000F2] text-white border-b border-white/5 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-auto items-center justify-center">
              <Image
                src={logo}
                alt="BCL Logo"
                width={108}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          {/* Desktop Authentication Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="rounded-full bg-[#433939] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#433939]/80"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-[#E86160] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#E86160]/90"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none transition"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[80px] z-40 w-full bg-black/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="mobile-menu"
      >
        <div className="flex flex-col space-y-4 px-6 py-8 h-full justify-start items-center">
          {/* Mobile Actions Stack */}
          <Link
            onClick={() => setIsOpen(false)}
            href="/auth/login"
            className="w-full text-center rounded-full bg-[#433939] py-3.5 text-sm font-bold uppercase tracking-wider text-white transition active:scale-[0.98]"
          >
            Log In
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            href="/auth/register"
            className="w-full text-center rounded-full bg-[#E86160] py-3.5 text-sm font-bold uppercase tracking-wider text-white transition active:scale-[0.98] shadow-lg shadow-[#E86160]/20"
          >
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}
