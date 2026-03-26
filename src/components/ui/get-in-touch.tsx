"use client"

import { useState, useEffect } from 'react';
import { Linkedin, Github, Twitter, Instagram, Disc, Youtube, ArrowRight } from 'lucide-react';

export const ProfessionalConnect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialPlatforms = [
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-7 h-7" />,
      gradient: 'from-blue-600 to-blue-400',
      shadowColor: 'rgba(59, 130, 246, 0.5)',
      link: '#',
      description: 'Professional Network'
    },
    {
      name: 'GitHub',
      icon: <Github className="w-7 h-7" />,
      gradient: 'from-gray-700 to-gray-500',
      shadowColor: 'rgba(75, 85, 99, 0.5)',
      link: '#',
      description: 'Code Repository'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-7 h-7" />,
      gradient: 'from-slate-800 to-slate-600',
      shadowColor: 'rgba(51, 65, 85, 0.5)',
      link: '#',
      description: 'Social Updates'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-7 h-7" />,
      gradient: 'from-purple-600 via-pink-600 to-orange-500',
      shadowColor: 'rgba(219, 39, 119, 0.5)',
      link: '#',
      description: 'Visual Stories'
    },
    {
      name: 'Discord',
      icon: <Disc className="w-7 h-7" />,
      gradient: 'from-indigo-600 to-purple-600',
      shadowColor: 'rgba(99, 102, 241, 0.5)',
      link: '#',
      description: 'Community Chat'
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-7 h-7" />,
      gradient: 'from-red-600 to-red-400',
      shadowColor: 'rgba(239, 68, 68, 0.5)',
      link: '#',
      description: 'Video Content'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative w-full pt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-zinc-600/10 rounded-full blur-[128px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-zinc-400 bg-clip-text text-transparent">
              Connect & Collaborate
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Get In Touch
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Join our vibrant community across multiple platforms and stay connected with the latest updates from InVariant.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {socialPlatforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.link}
              className={`group relative transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-[#0f0f0f] backdrop-blur-xl rounded-2xl p-8 border border-white/5 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-emerald-500/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`mb-4 inline-flex p-3 rounded-xl bg-zinc-900 border border-white/5 text-white transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-emerald-500/30`}>
                    {platform.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1 transition-colors duration-300">
                    {platform.name}
                  </h3>
                  <p className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-gray-400">
                    {platform.description}
                  </p>
                  <div className="mt-4 flex items-center text-gray-600 group-hover:text-emerald-400 transition-all duration-300">
                    <span className="text-sm font-medium">
                      Connect
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
            </a>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-emerald-500/30">
            <span className="relative z-10">Explore All Platforms</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </button>
        </div>
      </div>

      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-10 blur-[100px] transition-all duration-200 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)',
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
        }}
      />
    </div>
  );
};
