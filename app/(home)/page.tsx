import React from "react";
import HomeHero from "@/components/home/Hero";
import SolutionFlow from "@/components/home/SolutionFlow";
import BlackFridaySale from "@/components/home/BlackFridaySale";
import ThreePillarComponent from "@/components/home/ThreePillarComponent";
import FiveStepProcessComponent from "@/components/home/FiveStepProcessComponent";
import FeaturedSolutions from "@/components/home/FeaturedSolutions";
import TestimonialsComponent from "@/components/home/TestimonialsComponent";
import TrustedByLeadersComponent from "@/components/home/TrustedByLeadersComponent";
import PricingPlansPage from "@/components/home/PricingPlansPage";

export default function LandingPage() {
  return (
    <div className="w-full">
      <HomeHero />
      <SolutionFlow />
      <BlackFridaySale />
      <ThreePillarComponent />
      <PricingPlansPage/>
      <FiveStepProcessComponent />
      <FeaturedSolutions />
      <TestimonialsComponent />
      <TrustedByLeadersComponent />
    </div>
  );
}