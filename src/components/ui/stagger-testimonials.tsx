"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "InVariant's new neuro-recovery line has seen incredible results in our primary care trials.",
    by: "Dr. Alex, Clinical Researcher",
    imgSrc: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop"
  },
  {
    tempId: 1,
    testimonial: "The distribution efficiency since the expansion has improved our supply chain by 40%.",
    by: "Dan, Logistics Partner",
    imgSrc: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop"
  },
  {
    tempId: 2,
    testimonial: "Quality assurance standards at InVariant are the benchmark for the industry.",
    by: "Stephanie, Auditor",
    imgSrc: "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=150&h=150&fit=crop"
  },
  {
    tempId: 3,
    testimonial: "Innovative formulations that actually prioritize patient affordability.",
    by: "Marie, Health Policy Analyst",
    imgSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop"
  },
  {
    tempId: 4,
    testimonial: "The most reliable partnership we've had in a decade of pharma retail.",
    by: "Andre, Pharmacy Owner",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-emerald-500 text-black border-emerald-400" 
          : "z-0 bg-[#0a0a0a] text-white border-white/5 hover:border-emerald-500/30"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `translate(calc(-50% + ${(cardSize / 1.5) * position}px), calc(-50% + ${isCenter ? -65 : position % 2 ? 15 : -15}px)) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(16,185,129,0.2)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-emerald-600/20"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-zinc-800 object-cover object-top rounded-sm"
        style={{
          boxShadow: "3px 3px 0px black"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-bold leading-tight",
        isCenter ? "text-black" : "text-white"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm font-medium italic",
        isCenter ? "text-black/70" : "text-neutral-500"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-transparent"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = index - Math.floor(testimonialsList.length / 2);
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-zinc-900 border-2 border-white/10 text-white hover:bg-emerald-500 hover:text-black",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-zinc-900 border-2 border-white/10 text-white hover:bg-emerald-500 hover:text-black",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
