import React from 'react';

export default function TrustInsightSection() {
  const bulletStats = [
    '10+ Years of Research',
    '200+ Reports',
    'Nationwide Data',
    'Real Church Impact',
  ];

  return (
    <section className="w-full bg-[#09090A] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-900/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Main Banner Heading Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-center text-white mb-16 md:mb-24 uppercase max-w-5xl px-2 leading-tight">
          Research. Insight. Authority You Can Trust.
        </h2>

        {/* Asymmetric Content Matrix Grid Container */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Bullet Stat Metrics Column (Spans 3/12 grid spaces on desktop) */}
          <div className="lg:col-span-3 flex flex-col justify-center py-4 lg:pr-4">
            <ul className="space-y-6">
              {bulletStats.map((stat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-300">
                  {/* Styled Coral Bullet Node */}
                  <span className="w-2 h-2 rounded-full bg-[#E56363] flex-shrink-0" />
                  <span>{stat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Recent Intelligence Brief Card (Spans 3/12 spaces on desktop) */}
          <div className="lg:col-span-3 bg-[#18181C] border border-gray-800/40 rounded-[20px] p-8 flex flex-col justify-between shadow-xl min-h-[340px]">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#F97316] uppercase block mb-4">
                Recent Intelligence Brief
              </span>
              <h3 className="text-2xl font-black text-white mb-3 tracking-wide">
                The Silent Exodus
              </h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Why churches are losing people (and what to do about it).
              </p>
            </div>
            
            <div className="pt-6">
              <a 
                href="#" 
                className="inline-flex items-center text-sm font-extrabold tracking-wide text-[#E56363] hover:text-red-400 uppercase transition-colors group"
              >
                Read the Brief 
                <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-1 ml-1.5">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Column 3: Trend Spotlight Card (Spans 3/12 spaces on desktop) */}
          <div className="lg:col-span-3 bg-[#18181C] border border-gray-800/40 rounded-[20px] p-8 flex flex-col justify-between shadow-xl min-h-[340px]">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#E56363] uppercase block mb-4">
                Trend Spotlight
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-wide">
                Engagement is down.<br />Connection is up.
              </h3>
            </div>

            {/* Circular Graphic Metric Ring Callout */}
            <div className="flex items-center gap-4 mt-6">
              <div className="w-16 h-16 rounded-full bg-[#E56363]/10 border border-[#E56363]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-black text-[#E56363]">62%</span>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed flex-1">
                of churchgoers say relationships keep them coming back.
              </p>
            </div>
          </div>

          {/* Column 4: Testimonial/Quote Card (Spans 3/12 spaces on desktop) */}
          <div className="lg:col-span-3 bg-[#18181C] border border-gray-800/40 rounded-[20px] p-8 flex flex-col justify-between shadow-xl min-h-[340px]">
            <div>
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase block mb-4">
                What Leaders Are Saying
              </span>
              
              {/* Minimalist Dual Column Vector Blocks substituting quote graphics */}
              <div className="flex gap-1 mb-5">
                <div className="w-1.5 h-4 bg-[#E56363] rounded-sm opacity-80" />
                <div className="w-1.5 h-4 bg-[#E56363] rounded-sm opacity-80" />
              </div>

              <p className="text-sm text-gray-300 font-light leading-relaxed italic">
                "BCL Inside keeps me informed on what's happening in the Church and helps me lead proactively."
              </p>
            </div>

            <div className="pt-4 text-xs font-bold tracking-wide">
              <span className="text-gray-400">Pastor J. Carter </span>
              <span className="text-[#F97316]">— Atlanta, GA</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}