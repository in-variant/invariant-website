"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the type for a single review
type Review = {
  id: string | number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
};

// Define the props for the slider component
interface TestimonialSliderProps {
  reviews: Review[];
  /** Optional class name for the container */
  className?: string;
}

/**
 * A reusable, animated testimonial slider component.
 * It uses framer-motion for animations and is styled with
 * shadcn/ui theme variables.
 */
export const TestimonialSlider = ({
  reviews,
  className,
}: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 'direction' helps framer-motion understand slide direction (next vs. prev)
  const [direction, setDirection] = useState<"left" | "right">("right");

  const activeReview = reviews[currentIndex];

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleThumbnailClick = (index: number) => {
    // Determine direction for animation
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Get the next 3 reviews for the thumbnails, excluding the current one
  const thumbnailReviews = reviews
    .filter((_, i) => i !== currentIndex)
    .slice(0, 3);

  // Animation variants for the main image
  const imageVariants = {
    enter: (direction: "left" | "right") => ({
      y: direction === "right" ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
    center: { y: 0, opacity: 1, scale: 1 },
    exit: (direction: "left" | "right") => ({
      y: direction === "right" ? "-100%" : "100%",
      opacity: 0,
      scale: 0.9,
    }),
  };

  // Animation variants for the text content
  const textVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full min-h-[650px] md:min-h-[600px] overflow-hidden bg-transparent text-white p-4 py-24 md:p-12 md:py-32 z-10",
        className
      )}
    >
      <div className="max-w-7xl mx-auto h-full">
        {/* Section Heading Header */}
        <div className="flex flex-col mb-16 max-w-2xl text-center md:text-left">
          <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Let's Hear What They Say About Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 h-full items-center">
          {/* === Left Column: Meta and Thumbnails === */}
          <div className="md:col-span-3 flex flex-col justify-between order-2 md:order-1 h-full py-4">
            <div className="flex flex-row md:flex-col justify-between md:justify-start space-x-4 md:space-x-0 md:space-y-6">
              {/* Pagination */}
              <span className="text-sm font-mono tracking-widest text-emerald-400 font-bold">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(reviews.length).padStart(2, "0")}
              </span>
              {/* Vertical "Reviews" Text */}
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase [writing-mode:vertical-rl] md:rotate-180 hidden md:block text-gray-500">
                Client Reviews
              </h2>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex space-x-3 mt-8 md:mt-auto">
              {thumbnailReviews.map((review) => {
                // Find the original index to navigate to
                const originalIndex = reviews.findIndex(
                  (r) => r.id === review.id
                );
                return (
                  <button
                    key={review.id}
                    onClick={() => handleThumbnailClick(originalIndex)}
                    className="overflow-hidden rounded-xl w-16 h-20 md:w-20 md:h-24 opacity-50 hover:opacity-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#111111] border border-white/10"
                    aria-label={`View review from ${review.name}`}
                  >
                    <img
                      src={review.thumbnailSrc}
                      alt={review.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* === Center Column: Main Image === */}
          <div className="md:col-span-4 relative h-[400px] md:h-[550px] order-1 md:order-2 rounded-2xl overflow-hidden border-2 border-[#1a1a1a] shadow-2xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex}
                src={activeReview.imageSrc}
                alt={activeReview.name}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} // Cubic bezier for smooth ease
                className="absolute inset-0 w-full h-full object-cover shadow-2xl"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* === Right Column: Text and Navigation === */}
          <div className="md:col-span-5 flex flex-col justify-center order-3 md:order-3 h-full md:pl-6 bg-[#111111] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5" />
            
            {/* Text Content */}
            <div className="relative overflow-hidden min-h-[280px] flex flex-col justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-gray-200 italic">
                    "{activeReview.quote}"
                  </blockquote>
                  <div className="mt-8 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400">
                      <img src={activeReview.thumbnailSrc} alt={activeReview.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {activeReview.name}
                      </h3>
                      <p className="text-sm font-medium text-emerald-400">
                        {activeReview.affiliation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-3 mt-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all"
                onClick={handlePrev}
                aria-label="Previous review"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full w-12 h-12 bg-white text-black hover:bg-emerald-400 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                onClick={handleNext}
                aria-label="Next review"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
