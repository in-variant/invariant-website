"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number | string;
  title: string;
}

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items: any[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-white/20"; // Changed to InVariant dark theme

    if (isCenter) {
      height = "h-8";
      color = "bg-emerald-400"; // Center primary highlight
    } else if (isFifth) {
      height = "h-4";
      color = "bg-white/40"; // Semi-highlight
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass} transition-colors`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
}: {
  originalItems: CarouselItem[];
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  // Start with the middle set, item 4
  const [activeIndex, setActiveIndex] = useState(itemsPerSet + 4);
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(itemsPerSet + 4);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    // Find the original item index
    const targetOriginalIndex = newIndex % itemsPerSet;

    // Find all instances of this item across the 3 copies
    const possibleIndices = [
      targetOriginalIndex, // First copy
      targetOriginalIndex + itemsPerSet, // Second copy
      targetOriginalIndex + itemsPerSet * 2, // Third copy
    ];

    // Find the closest index to current position
    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  // Handle infinite scrolling
  useEffect(() => {
    if (isResetting) return;

    // If we're in the first set, jump to the equivalent position in the middle set
    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
    // If we're in the last set, jump to the equivalent position in the middle set
    else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  // Calculate target position - center the active item
  const centerPosition = 5; // We want item 5 (index 4) to be centered initially
  const targetX = -500 + (centerPosition - (activeIndex % itemsPerSet)) * 500;

  // Get current page info
  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="w-full flex py-16 flex-col items-center justify-center bg-transparent z-10 relative">
      <div className="mb-8 flex flex-col items-center">
          <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Values</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Morals & Ethics</h2>
      </div>
      
      <div className="w-[100vw] h-[200px] flex flex-col justify-center relative overflow-hidden">
        <div className="flex items-center justify-center max-w-6xl mx-auto w-full">
          <RulerLines top />
        </div>
        
        {/* The dragging container masking lines */}
        <div className="flex items-center justify-center w-full h-full relative">
          <motion.div
            className="flex items-center gap-[100px]"
            animate={{
              x: isResetting ? targetX : targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 1,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(index)}
                  className={`text-4xl md:text-6xl font-black whitespace-nowrap cursor-pointer flex items-center justify-center outline-none ${
                    isActive
                      ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                      : "text-white/20 hover:text-white/60"
                  }`}
                  animate={{
                    scale: isActive ? 1.1 : 0.75,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: "400px",
                  }}
                >
                  {item.title}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center max-w-6xl mx-auto w-full">
          <RulerLines top={false} />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-12 bg-[#111111]/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer hover:text-white text-gray-400 transition"
          aria-label="Previous item"
        >
          <Rewind className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 px-4">
          <span className="text-sm font-mono text-white">
            {String(currentPage).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-600">
            /
          </span>
          <span className="text-sm font-mono text-gray-500">
            {String(totalPages).padStart(2, '0')}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer hover:text-white text-gray-400 transition"
          aria-label="Next item"
        >
          <FastForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
