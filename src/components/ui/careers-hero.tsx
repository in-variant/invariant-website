"use client"

import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export function CareersHero() {
  return (
    <div className="relative pt-32 pb-16 bg-[#0a0a0a] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-emerald-400">Career</span>
        </nav>

        {/* Content */}
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent mb-8">
            Join Our Team
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Passionate about making a difference in healthcare? Explore exciting career opportunities with us! 
            Whether you're a seasoned professional or just starting out, we welcome driven individuals who are 
            ready to grow, innovate, and contribute. Have questions about current openings or want to know 
            more about working with us? We’re here to help!
          </p>
        </div>
      </div>
    </div>
  );
}
