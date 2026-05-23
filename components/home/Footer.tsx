import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/main/logo.png";
import { 
  FaFacebookF, 
  FaXTwitter, 
  FaLinkedinIn, 
  FaInstagram, 
  FaYoutube, 
  FaEnvelope 
} from "react-icons/fa6";

export default function HomeFooter() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Review",
      links: [
        { label: "Home", href: "/" },
        { label: "Data", href: "/data" },
        { label: "Consulting", href: "/consulting" },
        { label: "Programming", href: "/programming" },
      ],
    },
    {
      title: "Browse",
      links: [
        { label: "Media", href: "/media" },
        { label: "Blog", href: "/blog" },
        { label: "The Shop", href: "/shop" },
        { label: "Webinar", href: "/webinar" },
        { label: "Employment Opportunities", href: "/careers" },
      ],
    },
    {
      title: "Engage",
      links: [
        { label: "Research Opportunities", href: "/research" },
        { label: "Online Courses", href: "/courses" },
        { label: "Training", href: "/training" },
        { label: "Our Non-Profit", href: "/non-profit" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF size={16} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaXTwitter size={16} />, href: "https://twitter.com", label: "X (Twitter)" },
    { icon: <FaLinkedinIn size={16} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaInstagram size={16} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaYoutube size={16} />, href: "https://youtube.com", label: "YouTube" },
    { icon: <FaEnvelope size={16} />, href: "mailto:Admin@iRunBMC.com", label: "Email" },
  ];

  return (
    <footer className="bg-[#212121] text-gray-300 font-sans pt-16 pb-12 px-4 sm:px-6 md:px-12 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Logo & Contact details */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
            <div className="flex h-12 w-auto items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="BCL Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              {/* Fixed the text-[10] error to text-[10px] */}
              <p className="text-[10px] font-normal uppercase tracking-wider text-[#99A1AF]">
                Black Church Leader
              </p>
            </div>
          </div>
            
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <p className="font-semibold text-gray-300">(972) 532-3207</p>
              <p>Dallas, Texas</p>
              <p className="hover:text-white transition-colors duration-200">
                <a href="mailto:Admin@iRunBMC.com">Admin@iRunBMC.com</a>
              </p>
            </div>

            <div className="mt-2">
              <Link 
                href="/privacy-policy" 
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span>&gt;</span> Privacy Policy
              </Link>
            </div>
          </div>

          {/* Section columns */}
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="text-base font-bold text-white tracking-wider border-b border-gray-700/60 pb-2.5 max-w-[200px]">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all duration-200"
                    >
                      <span className="text-xs text-gray-500 font-bold">&gt;</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar Divider */}
        <div className="border-t border-gray-800/80 my-2" />

        {/* Bottom Bar Container */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <p>© {currentYear} by Black Millennial Cafe. All Rights Reserved.</p>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors duration-250 p-2 bg-transparent hover:bg-white/5 rounded-full"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
