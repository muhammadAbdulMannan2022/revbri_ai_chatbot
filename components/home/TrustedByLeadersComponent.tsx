// components/TrustedByLeadersComponent.js
import React from 'react';

const TrustedByLeadersComponent = () => {
  const testimonials = [
    {
      stars: 5,
      quote: "BCL Labs helped us move from busy to effective. Completely transformed how we plan.",
      author: "Pastor Williams",
    },
    {
      stars: 5,
      quote: "The data and insight from Inside helped us make decisions backed by real research.",
      author: "Rev. Thompson",
    },
    {
      stars: 5,
      quote: "BCL AI is like having a strategy partner available 24/7. Game changer.",
      author: "Dr. Sarah M.",
    },
  ];

  const renderStars = (count) => {
    return (
      <div className="flex items-center mb-3">
        {[...Array(count)].map((_, i) => (
          <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.908-7.416 3.908 1.48-8.279-6.064-5.828 8.332-1.151z"/>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-500 text-sm font-semibold uppercase tracking-wider mb-12">TRUSTED BY LEADERS. TRANSFORMING CHURCHES.</p>

        <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-12 space-y-12 lg:space-y-0">
          <div className="flex-shrink-0 text-center lg:text-left">
            <p className="text-5xl sm:text-6xl font-extrabold text-gray-900">500+</p>
            <p className="text-lg text-gray-600 mt-2">Churches Served</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:w-auto flex-grow">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-left hover:shadow-md transition duration-300"
              >
                {renderStars(testimonial.stars)}
                <p className="text-gray-700 text-base mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="text-gray-500 text-sm font-medium">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByLeadersComponent;