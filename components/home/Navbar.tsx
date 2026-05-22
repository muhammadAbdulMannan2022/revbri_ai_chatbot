import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import logo from "@/assets/main/logo.png";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTelephoneFill } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

export default function HomeNavbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white border-b border-slate-200 text-slate-700">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 md:text-sm">
          <div className="flex items-center gap-3">
            <div>
              <BsTelephoneFill size={16} />
            </div>
            <span className="font-medium">(972) 532-3207</span>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-[#E86160] px-4 py-2 text-white shadow-sm transition hover:bg-[#E86160]/90"
            >
              Schedule a Discovery Call
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="https://facebook.com"
              className="text-slate-700 transition hover:text-slate-900"
            >
              <FaFacebook size={16} />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-slate-700 transition hover:text-slate-900"
            >
              <FaXTwitter size={16} />
            </Link>
            <Link
              href="https://instagram.com"
              className="text-slate-700 transition hover:text-slate-900"
            >
              <BsInstagram size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#1F1F1F] text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-auto items-center justify-center ">
              <Image
                src={logo}
                alt="BMC"
                width={90}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                Black Millennial Café
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full bg-[#E86160] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E86160]/90"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
