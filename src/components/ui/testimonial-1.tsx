"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ArrowUp } from "lucide-react";

export function Testimonial1() {
  interface StatItem {
    percentage: string;
    logo: string;
    label: string;
    isIncrease: boolean;
  }

  const stats: StatItem[] = [
    {
      percentage: "50+",
      label: "global partners",
      isIncrease: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo.svg",
    },
    {
      percentage: "10k+",
      label: "healthcare providers",
      isIncrease: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/World_Health_Organization_Logo.svg",
    },
    {
      percentage: "100+",
      label: "safe formulations",
      isIncrease: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FDA_logo.svg/1024px-FDA_logo.svg.png",
    },
    {
      percentage: "10+",
      label: "years of excellence",
      isIncrease: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo.svg",
    },
  ];
  return (
    <div className="bg-[#0a0a0a] min-h-[60vh] w-full grid place-content-center py-16 px-4 md:px-8 lg:px-16 relative">
      <div className="max-w-6xl mx-auto">
        {/* Community Badge */}
        <div className="flex justify-center mb-12">
          <div className="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold">
            Our Global Community
          </div>
        </div>

        {/* Main Heading with Images */}
        <div className="text-center max-w-screen-xl mx-auto relative text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
            We make it simple for <br className="sm:hidden" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-3 align-middle relative">
                    <div className="relative overflow-hidden sm:w-16 w-12 h-12 md:h-16 origin-center transition-all duration-300 md:hover:w-36 hover:-24 rounded-full border-2 border-emerald-400/50 hover:border-emerald-400 shadow-lg">
                      <img
                        src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80`}
                        alt="Dr. Ramesh Verma"
                        className="object-cover w-full h-full"
                        style={{ objectPosition: "center top" }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={15}
                  className="max-w-xs bg-[#111111] border border-white/10 text-white p-4 rounded-xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                  <p className="mb-3 text-sm text-gray-300 leading-relaxed italic">
                    "InVariant has consistently provided high-quality pharmaceutical products that meet critical global health standards. Their commitment is unmatched."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <p className="font-bold text-sm text-emerald-400">Dr. Ramesh Verma</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            hospitals and
          </h1>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mt-1">
            their
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-3 align-middle">
                    <div className="relative overflow-hidden sm:w-16 w-14 h-14 md:h-16 origin-center transition-all duration-300 lg:hover:w-36 md:hover:w-24 hover:-20 rounded-full border-2 border-emerald-400/50 hover:border-emerald-400 shadow-lg">
                      <img
                        src={`https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=800&q=80`}
                        alt="Dr. Anjali Desai"
                        className="object-cover w-full h-full"
                        style={{ objectPosition: "center top" }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={15}
                  className="max-w-xs bg-[#111111] border border-white/10 text-white p-4 rounded-xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                  <p className="mb-3 text-sm text-gray-300 leading-relaxed italic">
                    "The reliability of InVariant's surgical formulations allows us to perform at our best every single day. We rely on their precision."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <p className="font-bold text-sm text-emerald-400">Dr. Anjali Desai</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            professionals to access and
          </h1>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 leading-tight tracking-tight mt-1">
            prescribe life-saving formulations.
          </h1>
        </div>
        
        {/* Statistics Blocks */}
        <div className="sm:flex grid grid-cols-2 gap-8 bg-[#111111] mt-16 w-full mx-auto px-8 py-8 border rounded-2xl border-white/10 shadow-2xl">
          {stats.map((stat, index) => (
            <div
              key={stat?.label}
              className="flex-1 flex gap-4 pl-10 relative"
            >
              {index !== 0 && (
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent absolute left-0 top-1/2 -translate-y-1/2 hidden sm:block" />
              )}
              <div className="w-full h-full group">
                <img
                  src={stat?.logo}
                  alt={stat?.label}
                  className="w-[85%] h-12 object-contain brightness-0 invert opacity-40 mx-auto translate-y-2 group-hover:-translate-y-12 opacity-100 group-hover:opacity-0 transition-all duration-500 ease-out"
                />
                <div className="absolute left-0 top-8 opacity-0 flex flex-col items-center justify-center w-full group-hover:top-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="flex items-center justify-center gap-2 relative mb-1">
                    <ArrowUp className="md:w-6 md:h-6 w-5 h-5 text-emerald-400" />
                    <span className="md:text-4xl text-3xl font-black text-white tracking-tighter">
                      {stat.percentage}
                    </span>
                  </div>
                  <p className="text-emerald-400 md:text-sm text-xs text-center font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
