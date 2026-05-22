import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import logo from "@/assets/main/logo.png";

export default function DashboardSuccessPage() {
  return (
    <div className="min-h-full bg-zinc-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <span className="inline-block rotate-180">➜</span>
            Back to dashboard
          </Link>
        </div>

        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={42} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">
              Payment Successful
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-24">
                <Image src={logo} alt="BMC" className="object-contain" />
              </div>
            </div>
          </div>

          <div className="max-w-xl text-slate-600 space-y-4">
            <p className="text-lg">
              The receipt and order confirmation have been sent to your email.
            </p>
            <p className="text-sm text-slate-500">
              Please contact us for any query at{" "}
              <span className="font-medium text-slate-900">
                Hello@Irunbmc.com
              </span>
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
