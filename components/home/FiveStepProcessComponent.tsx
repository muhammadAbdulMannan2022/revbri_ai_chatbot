import React from "react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Take Assessment",
      description:
        "Get personalized insight about your church and leadership challenges.",
    },
    {
      number: "02",
      title: "Get AI Guidance",
      description: "Ask questions. Get strategy and practical recommendations.",
    },
    {
      number: "03",
      title: "Explore Inside",
      description:
        "Read the latest intelligence and understand what's changing.",
    },
    {
      number: "04",
      title: "Implement in Labs",
      description:
        "Access tools, training, and systems to put your plan into action.",
    },
    {
      number: "05",
      title: "See Real Results",
      description:
        "Build stronger teams, grow your ministry, and increase your impact.",
    },
  ];

  return (
    <section className="w-full bg-[#09090A] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-900/40 overflow-hidden border-t border-gray-800/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-xs md:text-[16px] font-bold text-[#E86161] uppercase tracking-widest">
            How BCL Works For You™
          </span>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full flex flex-col lg:flex-row gap-12 lg:gap-6 items-start justify-between">
          {/* Connecting Line - Horizontal on Desktop, Vertical on Mobile */}
          <div className="absolute top-5.5 left-5.75 bottom-10 w-0.5 bg-gray-800 lg:top-5.5 lg:left-6 lg:right-6 lg:w-auto lg:h-0.5 lg:bottom-auto z-0" />

          {/* Process Steps */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center flex-1 group gap-4 lg:gap-0"
            >
              {/* Step Number Circle */}
              <div className="w-12 h-12 rounded-2xl bg-primary font-inter font-bold text-white flex items-center justify-center text-base md:text-lg shadow-lg shadow-[#E56363]/30 flex-shrink-0 lg:mb-6 transition-transform duration-300 group-hover:scale-110">
                {step.number}
              </div>

              {/* Text Content */}
              <div className="flex flex-col pt-1 lg:pt-0 lg:px-2">
                <h3 className="text-[18px] font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400 font-normal max-w-sm lg:max-w-none leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
