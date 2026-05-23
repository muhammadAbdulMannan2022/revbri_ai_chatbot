import React from 'react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Take Assessment',
      description: 'Get personalized insight about your church and leadership challenges.',
    },
    {
      number: '02',
      title: 'Get AI Guidance',
      description: 'Ask questions. Get strategy and practical recommendations.',
    },
    {
      number: '03',
      title: 'Explore Inside',
      description: "Read the latest intelligence and understand what's changing.",
    },
    {
      number: '04',
      title: 'Implement in Labs',
      description: 'Access tools, training, and systems to put your plan into action.',
    },
    {
      number: '05',
      title: 'See Real Results',
      description: 'Build stronger teams, grow your ministry, and increase your impact.',
    },
  ];

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-100 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-xs sm:text-sm font-black tracking-[0.2em] text-[#E56363] uppercase">
            How BCL Works For You™
          </span>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full flex flex-col lg:flex-row gap-12 lg:gap-6 items-start justify-between">
          
          {/* Connecting Line - Horizontal on Desktop, Vertical on Mobile */}
          <div className="absolute top-[22px] left-[23px] bottom-10 w-[2px] bg-[#F1D4D4] lg:top-[22px] lg:left-6 lg:right-6 lg:w-auto lg:h-[2px] lg:bottom-auto z-0" />

          {/* Process Steps */}
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative z-10 flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center flex-1 group gap-4 lg:gap-0"
            >
              {/* Step Number Circle */}
              <div className="w-12 h-12 rounded-2xl bg-[#E56363] text-white flex items-center justify-center font-bold text-base md:text-lg shadow-lg shadow-[#E56363]/30 flex-shrink-0 lg:mb-6 transition-transform duration-300 group-hover:scale-110">
                {step.number}
              </div>

              {/* Text Content */}
              <div className="flex flex-col pt-1 lg:pt-0 lg:px-2">
                <h3 className="text-[12px] font-bold text-[#111827] mb-2 tracking-wide">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal max-w-sm lg:max-w-none">
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