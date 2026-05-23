import React from 'react';
// Make sure to run: npm i lucide-react
import { 
  AlertCircle, 
  HelpCircle, 
  Clock, 
  Zap, 
  Calendar, 
  Layers, 
  TrendingDown, 
  UserMinus 
} from 'lucide-react';

export default function FrameworkSection() {
  const leftColumnItems = [
    {
      title: 'Overwhelmed',
      description: 'Too much to do. Not enough time.',
      icon: <Clock className="w-4 h-4 text-[#E06666]" />
    },
    {
      title: 'Reactive',
      description: "You're always responding, never leading.",
      icon: <Zap className="w-4 h-4 text-[#E06666]" />
    },
    {
      title: 'Over-Programmed',
      description: 'Busy calendars, but limited impact.',
      icon: <Calendar className="w-4 h-4 text-[#E06666]" />
    },
    {
      title: 'Unclear on What\'s Working',
      description: 'You lack the data and insight to make confident decisions.',
      icon: <HelpCircle className="w-4 h-4 text-[#E06666]" />
    },
  ];

  const rightColumnItems = [
    {
      title: 'Solution 1',
      description: 'Calendars become crowded, but Kingdom impact stays flat.',
      icon: <Layers className="w-4 h-4 text-[#E06666]" />
    },
    {
      title: 'Solution 2',
      description: 'Discipleship becomes inconsistent and attrition increases.',
      icon: <UserMinus className="w-4 h-4 text-[#E06666]" />
    },
    {
      title: 'Solution 3',
      description: 'Teams burn out and engagement declines.',
      icon: <TrendingDown className="w-4 h-4 text-[#E06666]" />
    },
    {
      title: 'Solution 4',
      description: 'Strategy becomes reactive, not proactive.',
      icon: <AlertCircle className="w-4 h-4 text-[#E06666]" />
    },
  ];

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-100 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-stretch">
        
        {/* Left Column: The Problem */}
        <div className="flex flex-col gap-6 justify-between">
          {/* Header Card */}
          <div className="bg-[#F8F9FA] border border-gray-100 rounded-xl p-5 text-left lg:text-right shadow-sm">
            <span className="text-[11px] font-bold tracking-wider text-[#E06666] uppercase block mb-1">
              The Problem
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#111827]">
              Why Leaders Feel Stuck
            </h3>
          </div>

          {/* List Items */}
          <div className="flex flex-col gap-6 my-auto">
            {leftColumnItems.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start lg:items-center justify-start lg:justify-end gap-4"
              >
                {/* Content */}
                <div className="text-left lg:text-right order-2 lg:order-1 flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-[#111827] mb-0.5">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
                {/* Lucide Icon Container */}
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] flex items-center justify-center flex-shrink-0 order-1 lg:order-2 mt-0.5 lg:mt-0">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Core Promise Card */}
        <div className="flex flex-col justify-center">
          <div className="bg-[#030303] text-white rounded-[28px] p-6 sm:p-10 lg:p-8 xl:p-8 text-center shadow-xl flex flex-col justify-between h-full py-12 lg:py-16">
            <span className="text-xs md:text-sm font-medium text-gray-400 tracking-wide block mb-6">
              BCL gives leaders
            </span>
            
            {/* Using modern fluid text sizing and text-wrap to prevent any overflow breakdown */}
            <div className="flex flex-col gap-2 sm:gap-4 my-auto py-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold  uppercase break-words px-2">
                Insight
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl  font-bold  uppercase break-words px-2">
                Strategy
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl  font-bold  uppercase break-words px-2">
                Implementation
              </h2>
            </div>

            <div className="text-xs md:text-sm text-gray-400 leading-relaxed font-light mt-6 space-y-1">
              <p>Clarity to lead. Confidence to grow.</p>
              <p>Impact that lasts.</p>
            </div>
          </div>
        </div>

        {/* Right Column: The Consequence */}
        <div className="flex flex-col gap-6 justify-between">
          {/* Header Card */}
          <div className="bg-[#F8F9FA] border border-gray-100 rounded-xl p-5 text-left shadow-sm">
            <span className="text-[11px] font-bold tracking-wider text-[#E06666] uppercase block mb-1">
              The Consequence
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#111827]">
              What Happens Without Clarity
            </h3>
          </div>

          {/* List Items */}
          <div className="flex flex-col gap-6 my-auto">
            {rightColumnItems.map((item, idx) => (
              <div key={idx} className="flex items-start lg:items-center justify-start gap-4">
                {/* Lucide Icon Container */}
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] flex items-center justify-center flex-shrink-0 mt-0.5 lg:mt-0">
                  {item.icon}
                </div>
                {/* Content */}
                <div className="text-left flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-[#111827] mb-0.5">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}