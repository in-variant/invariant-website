"use client";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

export function AboutSection3() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true, margin: "-10%" });

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const // Typescript tuple fix
      },
    }),
    hidden: {
      filter: "blur(4px)",
      y: 15,
      opacity: 0,
    },
  };

  const scaleVariants = {
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const // Typescript tuple fix
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      scale: 0.95,
    },
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a]" ref={heroRef}>
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Header with identity */}
          <div className="flex justify-between items-center mb-8 w-[85%] absolute lg:top-4 md:top-0 sm:-top-2 -top-3 z-10">
            <div className="flex items-center gap-2 text-xl">
              <span className="text-emerald-400 animate-pulse">✱</span>
              <motion.span
                custom={0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={revealVariants}
                className="text-sm tracking-widest uppercase font-bold text-gray-400"
              >
                COMPANY OVERVIEW
              </motion.span>
            </div>
            {/* Omitted social media links to match InVariant's corporate aesthetic */}
          </div>

          <motion.figure
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={scaleVariants}
            className="relative group w-full pt-12 md:pt-0 overflow-hidden rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl"
          >
            {/* InVariant Hero Banner */}
            <div className="w-full h-[40vh] md:h-[60vh] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent z-10" />
              <img
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out opacity-80"
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=80"
                alt="InVariant Advanced Laboratories"
              />
            </div>
          </motion.figure>

          {/* Core Values Badge Area */}
          <div className="flex flex-wrap lg:justify-start justify-between items-center py-6 text-sm">
            <motion.div
              custom={2}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={revealVariants}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
                <span className="text-emerald-400 font-bold">100%</span>
                <span className="text-gray-400">Compliance & Ethics</span>
                <span className="text-white/20">|</span>
              </div>
              <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
                <span className="text-emerald-400 font-bold">Global</span>
                <span className="text-gray-400">Distribution Scale</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 md:mt-24">
          <div className="md:col-span-2">
            <h1 className="sm:text-4xl md:text-5xl text-3xl !leading-[1.1] font-semibold text-white mb-10 tracking-tight">
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.05}
                staggerFrom="first"
                reverse={true}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 30,
                  delay: 0.2, // Faster initial delay
                }}
              >
                Safe and Effective Pharmaceutical Solutions Reach The Market.
              </VerticalCutReveal>
            </h1>

            <motion.div
              custom={4}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={revealVariants}
              className="grid md:grid-cols-2 gap-10 text-gray-400"
            >
              <div className="sm:text-base text-sm">
                <p className="leading-relaxed text-left">
                  InVariant is a leading pharmaceutical company dedicated to producing high-quality, research-driven medicines. We collaborate with distributors, wholesalers, and healthcare institutions worldwide to ensure safe and effective pharmaceutical solutions reach the market.
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 border border-[#0a0a0a]" />
                    <p className="text-sm font-medium text-gray-300">We are NOT a retailer or direct seller of medicines.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 border border-[#0a0a0a]" />
                    <p className="text-sm font-medium text-gray-300">We supply ONLY to authorized partners and distributors.</p>
                  </div>
                </div>
              </div>
              <div className="sm:text-base text-sm">
                <p className="leading-relaxed text-left">
                  Our mission is to support healthcare providers with top-notch formulations while maintaining strict compliance with industry regulations. Every batch produced is a testament to our unwavering commitment to patient safety and global healthcare standards.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-1 mt-12 md:mt-0">
            <div className="text-left md:text-right">
              <motion.div
                custom={5}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={revealVariants}
                className="text-emerald-400 text-2xl font-black mb-1 opacity-80 tracking-tighter"
              >
                VISION
              </motion.div>
              <motion.div
                custom={6}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={revealVariants}
                className="text-gray-500 text-sm mb-12 font-medium tracking-wide uppercase"
              >
                Holistic & Economical Healthcare
              </motion.div>

              <motion.div
                custom={7}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={revealVariants}
                className="mb-8"
              >
                <p className="text-gray-300 font-medium mb-4 text-lg">
                  Ready to partner with a leader in formulation excellence?
                </p>
              </motion.div>

              <motion.div
                custom={8}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={revealVariants}
                className="md:justify-end flex"
              >
                <Link to="/contact">
                  <button className="bg-white hover:bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.1)] flex w-fit gap-3 hover:gap-5 transition-all duration-300 ease-in-out text-[#0a0a0a] px-6 py-4 rounded-full cursor-pointer font-bold text-sm tracking-wide">
                    GET IN TOUCH <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
