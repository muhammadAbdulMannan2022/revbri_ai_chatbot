"use client";

import React, { useState } from 'react';
import { Check, Edit3 } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  queryLimit: string;
  isPopular?: boolean;
  isActive: boolean;
  features: string[];
}

export default function PricingPlansPage() {
  // Local state to manage toggle positions independently for each card
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      id: 'free',
      name: 'Free',
      price: '0',
      queryLimit: '100',
      isActive: true,
      features: ['Basic support', 'Community access', 'Email updates'],
    },
    {
      id: 'premium-popular',
      name: 'Premium',
      price: '99',
      queryLimit: '100',
      isPopular: true,
      isActive: true,
      features: [
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: '99',
      queryLimit: '1000',
      isActive: true,
      features: [
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '99',
      queryLimit: '1000',
      isActive: true,
      features: [
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
        'Dummy feature here',
      ],
    },
  ]);

  const handleToggleActive = (id: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === id ? { ...plan, isActive: !plan.isActive } : plan
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-red-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Header Dashboard Title Section */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B] mb-2">
            Pricing Plans
          </h1>
          <p className="text-sm text-[#64748B] font-medium">
            Manage and edit your subscription plans
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm ${
                plan.isPopular 
                  ? 'border-[#E56363] ring-1 ring-[#E56363]/20 pt-0' 
                  : 'border-slate-100 pt-6'
              }`}
            >
              {/* Most Popular Banner Header decoration */}
              {plan.isPopular && (
                <div className="w-full bg-[#E56363] text-white text-xs font-bold text-center py-2.5 uppercase tracking-wider mb-6">
                  Most Popular
                </div>
              )}

              {/* Upper Main Card Info Wrapper */}
              <div className={`px-6 flex-1 flex flex-col ${plan.isPopular ? 'pt-0' : 'pt-2'}`}>
                
                {/* Title and Active Status Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-[#1E293B]">
                    {plan.name}
                  </h3>
                  
                  {/* Interactive Status Switch Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#64748B] tracking-wide">
                      Active
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(plan.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out outline-none ${
                        plan.isActive ? 'bg-[#E56363]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out my-auto ml-0.5 ${
                          plan.isActive ? 'translate-x-4' : 'translate-x-0'
                        } self-center`}
                      />
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-[#1E293B] tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B] ml-1">
                    /monthly
                  </span>
                </div>

                {/* AI Query Limit Box Node */}
                <div className="bg-[#F8FAFC] border border-slate-50 rounded-xl p-4 mb-6 text-left">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                    AI Query Limit
                  </span>
                  <div className="text-sm font-medium text-[#475569]">
                    <span className="text-xl font-bold text-[#E56363] mr-0.5">
                      {plan.queryLimit}
                    </span>{" "}
                    / month
                  </div>
                </div>

                {/* Feature Bullet Checklist */}
                <ul className="space-y-3.5 mb-8 text-left flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#475569] font-medium">
                      <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" strokeWidth={3} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Edit Plan Button Footer Section */}
              <div className="px-6 pb-6 pt-2">
                <button className="w-full bg-[#E56363] hover:bg-[#DC4F4F] text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-150 active:scale-[0.99] shadow-sm">
                  <Edit3 className="w-4 h-4" />
                  Edit Plan
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}