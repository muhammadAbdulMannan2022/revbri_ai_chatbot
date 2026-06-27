import React from "react";
import PlanPageClient from "./PlanPageClient";

// Metadata for the plan page (good for SEO/SSR)
export const metadata = {
  title: "Membership Plans | Black Millennial Café Dashboard",
  description: "View and manage your membership plan tiers. Black Millennial Café offers Silver, Gold, and Platinum premium access tiers.",
};

export default function PlanPage() {
  return <PlanPageClient />;
}
