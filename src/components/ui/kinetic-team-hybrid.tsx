'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';

/* ---------- Types ---------- */

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

/* ---------- Data ---------- */

const IMAGES = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&q=80',
];

const TEAM: TeamMember[] = [
  { id: '1', name: 'Aman kesharwani', role: 'Kanpur', image: IMAGES[0] },
  { id: '2', name: 'Aman Shukla', role: 'Kanpur', image: IMAGES[1] },
  { id: '3', name: 'Vikash Sharma', role: 'Kanpur', image: IMAGES[2] },
  { id: '4', name: 'Mohammad Saif', role: 'Prayagraj', image: IMAGES[3] },
  { id: '5', name: 'Dhananjay Dwvedi', role: 'Manjhanpur', image: IMAGES[4] },
  { id: '6', name: 'Sudhanshu Baghel', role: 'Handia', image: IMAGES[0] },
  { id: '7', name: 'Abhijit Pandey', role: 'Kunda', image: IMAGES[1] },
  { id: '8', name: 'Shiv Prakash Mishra', role: 'Prayagraj', image: IMAGES[2] },
  { id: '9', name: 'Digvijay Singh', role: 'Prayagraj', image: IMAGES[3] },
  { id: '10', name: 'Pramod Pandey', role: 'Pratapgarh', image: IMAGES[4] },
  { id: '11', name: 'Abhishek Singh', role: 'Sultanpur', image: IMAGES[0] },
  { id: '12', name: 'Subodh Sinha', role: 'Nawada', image: IMAGES[1] },
  { id: '13', name: 'Vimlesh Kr.Singh', role: 'Gaya', image: IMAGES[2] },
  { id: '14', name: 'Sanjeev Kr.Gupta', role: 'Sahibganj', image: IMAGES[3] },
  { id: '15', name: 'Rahul Kumar', role: 'Gaya', image: IMAGES[4] },
  { id: '16', name: 'Shakti Nandan Shukla', role: 'Gorakhpur', image: IMAGES[0] },
  { id: '17', name: 'Grijesh Singh', role: 'Prayagraj', image: IMAGES[1] },
  { id: '18', name: 'Atul Kumar', role: 'Fatehpur', image: IMAGES[2] },
  { id: '19', name: 'Ajay Tiwari', role: 'Karwi', image: IMAGES[3] },
  { id: '20', name: 'Abhay Singh', role: 'Varanasi', image: IMAGES[4] },
  { id: '21', name: 'Ranjit', role: 'Gorakhpur', image: IMAGES[0] },
  { id: '22', name: 'Abhishek Singh', role: 'Ballia', image: IMAGES[1] },
  { id: '23', name: 'Vishal Singh', role: 'Banda', image: IMAGES[2] },
  { id: '24', name: 'Krishna Kumar', role: 'Kanpur', image: IMAGES[3] },
  { id: '25', name: 'Pushpendra', role: 'Ayodhya', image: IMAGES[4] },
  { id: '26', name: 'Jitendra', role: 'Mahoba', image: IMAGES[0] },
  { id: '27', name: 'Purshottam Kumar', role: 'Gaya', image: IMAGES[1] },
  { id: '28', name: 'Harsh Kumar Pandey', role: 'Varanasi', image: IMAGES[2] },
  { id: '29', name: 'Aryan Gupta', role: 'Unnao', image: IMAGES[3] },
  { id: '30', name: 'Singh Yuvaraj Vishraj', role: 'Jaunpur', image: IMAGES[4] },
  { id: '31', name: 'Amit Kumar Dubey', role: 'Jaunpur', image: IMAGES[0] },
  { id: '32', name: 'Santosh Kumar', role: 'Dehri', image: IMAGES[1] },
  { id: '33', name: 'Bitu Kumar', role: 'Sasaram', image: IMAGES[2] },
  { id: '34', name: 'Vishal Kumar Pandey', role: 'Bhadohi', image: IMAGES[3] },
  { id: '35', name: 'Anoop Singh Yadav', role: 'Banda', image: IMAGES[4] },
  { id: '36', name: 'Chandra Bhushan Jha', role: 'Maharajganj', image: IMAGES[0] },
  { id: '37', name: 'Rohit Dwivedi', role: 'Regional Rep', image: IMAGES[1] },
];

/* ---------- Main Component ---------- */

export function KineticTeamHybrid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position resources (Global for the floating card)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics for the floating card
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Detect mobile for conditional rendering logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    // Offset the cursor card so it doesn't block the text
    mouseX.set(e.clientX + 20); 
    mouseY.set(e.clientY + 20);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full cursor-default bg-[#0a0a0a] px-6 py-24 text-neutral-200 md:px-12 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[#0a0a0a] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl">
              Our <span className="text-emerald-400">Strength</span>
            </h1>
          </div>
          <div className="h-px flex-1 bg-white/10 mx-8 hidden md:block" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            Regional Representatives
          </p>
        </motion.header>

        {/* The List */}
        <div className="flex flex-col">
          {TEAM.map((member, index) => (
            <TeamRow
              key={member.id}
              data={member}
              index={index}
              isActive={activeId === member.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP ONLY: Global Floating Cursor Image */}
      {/* We use Portal-like fixed positioning to ensure it floats above everything smoothly */}
      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative h-64 w-80 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl"
              >
                {/* Find the active image */}
                <img
                  src={TEAM.find((t) => t.id === activeId)?.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                
                {/* Overlay Metadata */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse border border-black" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">InVariant Active Rep</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Row Component ---------- */

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}: {
  data: TeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
}) {
  const isDimmed = isAnyActive && !isActive;

  return (
    <motion.div
      layout // This enables smooth height animation on mobile
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        y: 0,
        backgroundColor: isActive && isMobile ? 'rgba(255,255,255,0.03)' : 'transparent'
      }}
      transition={{ duration: 0.4, delay: index * 0.02 }} // Faster stagger for 37 items
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={() => isMobile && setActiveId(isActive ? null : data.id)}
      className={`group relative border-t border-white/10 transition-colors duration-500 last:border-b ${
        isMobile ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="relative z-10 flex flex-col py-6 md:flex-row md:items-center md:justify-between md:py-8">
        
        {/* Name & Index Section */}
        <div className="flex items-baseline gap-6 md:gap-12 pl-4 md:pl-0 transition-transform duration-500 group-hover:translate-x-4">
          <span className="font-mono text-xs font-bold text-neutral-600">
            {index < 9 ? `0${index + 1}` : index + 1}
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-gray-400 transition-colors duration-300 group-hover:text-emerald-400 md:text-5xl">
            {data.name}
          </h2>
        </div>

        {/* Role & Icon Section */}
        <div className="mt-4 flex items-center justify-between pl-12 pr-4 md:mt-0 md:justify-end md:gap-12 md:pl-0 md:pr-0">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors group-hover:text-emerald-400">
            {data.role}
          </span>
          
          {/* Mobile Toggle Icon */}
          <div className="block md:hidden text-neutral-500">
            {isActive ? <Minus size={18} /> : <Plus size={18} />}
          </div>

          {/* Desktop Arrow */}
          <motion.div
             animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
             className="hidden md:block text-emerald-400"
          >
             <ArrowUpRight size={28} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* MOBILE ONLY: Inline Accordion Image */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-neutral-900/50"
          >
            <div className="p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img 
                  src={data.image} 
                  alt={data.name} 
                  className="h-full w-full object-cover grayscale" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                   <p className="text-xs uppercase tracking-widest font-bold text-emerald-400">{data.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
