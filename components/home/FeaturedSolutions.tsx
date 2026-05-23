import React from 'react';

export default function FeaturedSolutions() {
  const solutions = [
    {
      category: 'Discipleship',
      title: 'CEBA Journey',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#A855F7]', // Purple
      borderColor: 'border-[#A855F7]',
      accentBg: 'bg-[#A855F7]',
    },
    {
      category: 'Planning',
      title: 'Vision Year Lab',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#F97316]', // Orange
      borderColor: 'border-[#F97316]',
      accentBg: 'bg-[#F97316]',
    },
    {
      category: 'Strategy',
      title: 'BCL AI',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#38BDF8]', // Sky Blue
      borderColor: 'border-[#38BDF8]',
      accentBg: 'bg-[#38BDF8]',
    },
    {
      category: 'Training',
      title: 'Replay Vault',
      description: 'Build and equip your congregation with proven tools and frameworks.',
      textColor: 'text-[#4ADE80]', // Light Green
      borderColor: 'border-[#4ADE80]',
      accentBg: 'bg-[#4ADE80]',
    },
  ];

  return (
    <section className="w-full bg-[#F8F9FA] py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs md:text-sm font-extrabold tracking-[0.2em] text-[#E56363] uppercase block">
            Featured Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight text-[#111827]">
            Built for Real Ministry Challenges
          </h2>
        </div>

        {/* Solutions Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {solutions.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Highlight Top Bar Style Accent */}
              <div className={`absolute top-0 left-0 right-0 h-[5px] ${item.accentBg}`} />

              {/* Card Content Wrapper */}
              <div className="p-8 flex flex-col justify-between h-full flex-1 pt-9">
                <div>
                  {/* Category Small Tag */}
                  <span className={`text-xs font-bold tracking-wide uppercase block mb-3 ${item.textColor}`}>
                    {item.category}
                  </span>
                  
                  {/* Card Main Header Title */}
                  <h3 className="text-xl font-black text-[#111827] mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  
                  {/* Small Structural Underline Divider Accent */}
                  <div className={`w-8 h-[2px] mb-6 ${item.accentBg}`} />

                  {/* Description text */}
                  <p className="text-sm text-gray-500 leading-relaxed font-normal mb-8">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Action Link Footer */}
                <div className="pt-2">
                  <a 
                    href="#" 
                    className="inline-flex items-center text-xs font-extrabold tracking-[0.15em] text-[#E56363] hover:text-red-600 transition-colors uppercase group"
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