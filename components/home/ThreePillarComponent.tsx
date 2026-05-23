import React from 'react';

export default function ThreePillarsSection() {
  const cards = [
    {
      badge: 'BCL INSIDE™',
      title: 'INTELLIGENCE',
      borderColor: 'border-[#E06666]/30', // Custom subtle coral border
      accentColor: 'bg-[#E06666]',
      bulletColor: 'text-[#E06666]',
      buttonText: 'EXPLORE INSIDE',
      features: [
        'Monthly Intelligence Briefs',
        'Trend & Analysis Reports',
        'Research Summaries',
        'Future Forecasts',
      ],
    },
    {
      badge: 'BCL AI™',
      title: 'STRATEGY',
      borderColor: 'border-[#E69138]/30', // Custom subtle orange border
      accentColor: 'bg-[#E69138]',
      bulletColor: 'text-[#E69138]',
      buttonText: 'TRY BCL AI',
      features: [
        'Ask Leadership Questions',
        'Ministry Planning Support',
        'Discipleship Guidance',
        'Programming Ideas',
      ],
    },
    {
      badge: 'BCL LABS™',
      title: 'IMPLEMENTATION',
      borderColor: 'border-[#6AA84F]/30', // Custom subtle green border
      accentColor: 'bg-[#6AA84F]',
      bulletColor: 'text-[#6AA84F]',
      buttonText: 'JOIN LABS',
      features: [
        'Monthly Webinars & Replays',
        'Tools & Templates',
        'CEBA Journey™ Access',
        'Vision Year Lab™ Tools',
      ],
    },
  ];

  return (
    <section className="w-full bg-[#09090A] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-900/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-[#E69138] uppercase">
            Three Pillars. One Purpose.
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal leading-relaxed text-gray-200 px-2">
            Everything you need to lead with clarity,<br className="hidden sm:inline" /> 
            make better decisions, and create lasting impact.
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`bg-[#18181C]/90 border ${card.borderColor} rounded-[20px] p-8 md:p-10 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:translate-y-[-4px] hover:bg-[#1C1C21]`}
            >
              {/* Card Top Content */}
              <div>
                {/* Product Badge */}
                <span className={`text-xs font-black tracking-wider uppercase block mb-2 ${card.bulletColor}`}>
                  {card.badge}
                </span>
                
                {/* Card Main Title */}
                <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-white mb-5 uppercase break-words">
                  {card.title}
                </h3>
                
                {/* Colorful Accent Divider Line */}
                <div className={`w-10 h-1 rounded-full mb-8 ${card.accentColor}`} />

                {/* Features List */}
                <ul className="space-y-4 mb-12">
                  {card.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3 text-sm sm:text-base text-gray-300 font-light">
                      {/* CSS Styled Bullet matching exact colors */}
                      <span className={`inline-block text-lg leading-none select-none mt-0.5 ${card.bulletColor}`}>
                        •
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button at Bottom */}
              <button className="w-full bg-[#E56363] hover:bg-[#DC4F4F] text-white font-extrabold text-xs sm:text-sm tracking-[0.15em] uppercase py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-red-950/20">
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}