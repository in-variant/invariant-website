"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    quote: "Our commitment to pharmacological excellence is a promise of health to every patient we serve.",
    author: "Dr. Ramesh Verma",
    role: "Medical Director",
    company: "InVariant",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
  },
  {
    quote: "Innovation at InVariant is driven by the need for affordable and accessible healthcare for all.",
    author: "Elena Frost",
    role: "Head of Research",
    company: "InVariant R&D",
    avatar: "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=150&h=150&fit=crop",
  },
  {
    quote: "Scaling our manufacturing to global standards while maintaining strict quality control.",
    author: "Marcus Webb",
    role: "Operations Lead",
    company: "InVariant Manufacturing",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop",
  },
]

function usePreloadImages(images: string[]) {
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [images])
}

function SplitText({ text }: { text: string }) {
  const words = text.split(" ")

  return (
    <span className="inline">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export function CleanTestimonial() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  usePreloadImages(testimonials.map((t) => t.avatar))

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const currentTestimonial = testimonials[activeIndex]

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto py-32 px-8"
      style={{ cursor: "none" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNext}
    >
      {/* Custom magnetic cursor */}
      <motion.div
        className="pointer-events-none absolute z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white flex items-center justify-center"
          animate={{
            width: isHovered ? 80 : 0,
            height: isHovered ? 80 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <motion.span
            className="text-black text-[10px] font-bold tracking-wider uppercase"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
          >
            Next
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Floating index indicator */}
      <motion.div
        className="absolute top-8 right-8 flex items-baseline gap-1 font-mono text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          className="text-2xl font-light text-emerald-400"
          key={activeIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(activeIndex + 1).padStart(2, "0")}
        </motion.span>
        <span className="text-white/20">/</span>
        <span className="text-white/20">{String(testimonials.length).padStart(2, "0")}</span>
      </motion.div>

      {/* Stacked avatar previews */}
      <motion.div
        className="absolute top-8 left-8 flex -space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className={`w-7 h-7 rounded-full border-2 border-[#0a0a0a] overflow-hidden transition-all duration-300 ${
              i === activeIndex ? "ring-2 ring-emerald-500 scale-110" : "grayscale opacity-30"
            }`}
          >
            <img src={t.avatar || "/placeholder.svg"} alt={t.author} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-white mb-12"
          >
            <SplitText text={currentTestimonial.quote} />
          </motion.blockquote>
        </AnimatePresence>

        {/* Author */}
        <motion.div className="mt-12 relative" layout>
          <div className="flex items-center gap-5">
            <div className="relative w-14 h-14">
              <motion.div
                className="absolute -inset-1.5 rounded-full border border-emerald-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {testimonials.map((t, i) => (
                <motion.img
                  key={t.avatar}
                  src={t.avatar}
                  alt={t.author}
                  className="absolute inset-0 w-14 h-14 rounded-full object-cover border-2 border-white/5"
                  animate={{
                    opacity: i === activeIndex ? 1 : 0,
                    zIndex: i === activeIndex ? 1 : 0,
                    scale: i === activeIndex ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="relative pl-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originY: 0 }}
                />
                <span className="block text-lg font-bold text-white tracking-wide leading-none">
                  {currentTestimonial.author}
                </span>
                <span className="block text-[10px] text-emerald-500 mt-1.5 font-mono uppercase tracking-[0.2em]">
                  {currentTestimonial.role} — {currentTestimonial.company}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mt-16 h-px bg-white/5 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.4 : 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Click to explore</span>
      </motion.div>
    </div>
  )
}
