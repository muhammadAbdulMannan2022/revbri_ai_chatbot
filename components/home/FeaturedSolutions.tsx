import React from 'react';

export default function FeaturedSolutions() {
  const solutions = [
    {
      category: 'Discipleship',
      title: 'CEBA Journey',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#9E7ADD]', // Purple
      borderColor: 'border-[#9E7ADD]',
      accentBg: 'bg-[#9E7ADD]',
    },
    {
      category: 'Planning',
      title: 'Vision Year Lab',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#FAA333]', // Orange
      borderColor: 'border-[#FAA333]',
      accentBg: 'bg-[#FAA333]',
    },
    {
      category: 'Strategy',
      title: 'BCL AI',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#4DC7FA]', // Sky Blue
      borderColor: 'border-[#4DC7FA]',
      accentBg: 'bg-[#4DC7FA]',
    },
    {
      category: 'Training',
      title: 'Replay Vault',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#99E099]', // Light Green
      borderColor: 'border-[#99E099]',
      accentBg: 'bg-[#99E099]',
    },
  ];

  return (
    <section className="w-full bg-[#09090A] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-900/40 border-t border-gray-800/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs md:text-base font-bold text-[#E86161] font-inter uppercase block tracking-widest">
            Featured Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold text-white">
            Built for Real Ministry Challenges
          </h2>
        </div>

        {/* Solutions Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {solutions.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#18181C] rounded-2xl shadow-xl border border-gray-800/60 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 relative group hover:border-gray-700"
            >
              {/* Highlight Top Bar Style Accent */}
              <div className={`absolute top-0 left-0 right-0 h-[5px] ${item.accentBg}`} />

              {/* Card Content Wrapper */}
              <div className="p-8 flex flex-col justify-between h-full flex-1 pt-9">
                <div>
                  {/* Category Small Tag */}
                  <span className={`text-xs font-bold font-inter uppercase block mb-3 ${item.textColor}`}>
                    {item.category}
                  </span>
                  
                  {/* Card Main Header Title */}
                  <h3 className="text-[24px] font-inter font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  
                  {/* Small Structural Underline Divider Accent */}
                  <div className={`w-8 h-[2px] mb-6 ${item.accentBg}`} />

                  {/* Description text */}
                  <p className="text-sm text-gray-400 font-normal mb-8 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Action Link Footer */}
                <div className="pt-2">
                  <a 
                    href="#" 
                    className="inline-flex items-center text-xs font-bold text-[#E86161] hover:text-red-400 transition-colors uppercase group"
                  >
                    Explore 
                    <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-1 ml-1 text-sm leading-none">
                      →
                    </span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}