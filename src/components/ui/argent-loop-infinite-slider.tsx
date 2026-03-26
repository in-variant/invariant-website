import * as React from "react";

interface ProjectData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
}

const PROJECT_DATA: ProjectData[] = [
  {
    title: "Gliclazide XR 60",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200",
    category: "Metabolic Care",
    year: "2024",
    description: "Advanced extended-release glycemic control",
  },
  {
    title: "Pharmo-Insulin R",
    image: "https://images.unsplash.com/photo-1579165466541-74e214905527?w=1200",
    category: "Hormone Therapy",
    year: "2023",
    description: "Bio-engineered human insulin recombinant",
  },
  {
    title: "Glucoguard Monitor",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=1200",
    category: "Medical Devices",
    year: "2025",
    description: "Non-invasive glucose monitoring system",
  },
  {
    title: "Metformin Gold",
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1200",
    category: "First-line Therapy",
    year: "2024",
    description: "Pure-grade metformin for long-term usage",
  },
  {
    title: "Pancreas Regenerative",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200",
    category: "Futuristic Clinicals",
    year: "2026",
    description: "Exploration into beta-cell regeneration",
  },
];

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

// Utility functions
const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const getProjectData = (index: number) => {
  const i =
    ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) %
    PROJECT_DATA.length;
  return PROJECT_DATA[i];
};

const getProjectNumber = (index: number) => {
  return (
    ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) %
      PROJECT_DATA.length +
    1
  )
    .toString()
    .padStart(2, "0");
};

export function ArgentLoopSlider() {
  const [visibleRange, setVisibleRange] = React.useState({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0,
    minimapHeight: 250,
  });

  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number | undefined>(undefined);

  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;
    
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }
    
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);
    
    if (Math.abs(current - target) > 0.01) {
        img.style.transform = `translateY(${current}px) scale(1.5)`;
        img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY =
      s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
          updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animate = () => {
    const s = state.current;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };
  
  const renderedRange = React.useRef({ min: -CONFIG.BUFFER_SIZE, max: CONFIG.BUFFER_SIZE });

  const animationLoop = React.useCallback(() => {
     animate();
     
     const s = state.current;
     const currentIndex = Math.round(-s.targetY / s.projectHeight);
     const min = currentIndex - CONFIG.BUFFER_SIZE;
     const max = currentIndex + CONFIG.BUFFER_SIZE;

     if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
         renderedRange.current = { min, max };
         setVisibleRange({ min, max });
     }

     requestRef.current = requestAnimationFrame(animationLoop);
  }, []);

  React.useEffect(() => {
    state.current.projectHeight = window.innerHeight;
    
    const onWheel = (e: WheelEvent) => {
      const s = state.current;
      
      // Check if we are hovering over the actual project cards
      // Check if we are hovering over the actual project cards
      const target = e.target as HTMLElement;
      const isOverContent = target.closest('.project-inner') || target.closest('.minimap');
      
      if (isOverContent) {
        // Only prevent default if we are over the interactive content
        e.preventDefault();
        s.isSnapping = false;
        s.lastScrollTime = Date.now();
        const delta = Math.max(
          Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
          -CONFIG.MAX_VELOCITY
        );
        s.targetY -= delta;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
        const s = state.current;
        s.isDragging = true;
        s.isSnapping = false;
        s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
        s.lastScrollTime = Date.now();
    }

    const onTouchMove = (e: TouchEvent) => {
        const s = state.current;
        if (!s.isDragging) return;
        s.targetY =
            s.dragStart.scrollY +
            (e.touches[0].clientY - s.dragStart.y) * 1.5;
        s.lastScrollTime = Date.now();
    }

    const onTouchEnd = () => {
        state.current.isDragging = false;
    }

    const onResize = () => {
        state.current.projectHeight = window.innerHeight;
    }

    const container = document.querySelector('.parallax-container');
    if (container) {
      container.addEventListener("wheel", onWheel as any, { passive: false });
    }
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);
    
    onResize();
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      if (container) {
        container.removeEventListener("wheel", onWheel as any);
      }
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animationLoop]);

  const indices = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) {
    indices.push(i);
  }

  return (
    <div className="parallax-container w-full h-screen overflow-hidden bg-[#0a0a0a] relative cursor-ns-resize select-none">
      <ul className="project-list absolute top-0 left-0 w-full h-full pointer-events-none p-0 m-0">
        {indices.map((i) => {
          const data = getProjectData(i);
          return (
            <div
              key={i}
              className="project absolute top-0 left-0 w-full h-full flex items-center justify-center will-change-transform"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              <div className="project-inner w-[85vw] h-[80vh] overflow-hidden rounded-sm relative shadow-2xl">
                <img 
                    src={data.image} 
                    alt={data.title} 
                    className="absolute top-0 left-0 w-full h-full object-cover will-change-transform grayscale hover:grayscale-0 transition-[filter] duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute bottom-12 left-12 text-white z-10">
                    <span className="text-emerald-500 font-mono text-sm tracking-widest uppercase mb-2 block">{data.category}</span>
                    <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase">{data.title}</h2>
                </div>
              </div>
            </div>
          );
        })}
      </ul>

      <div className="minimap absolute bottom-12 right-12 w-[320px] h-[250px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl pointer-events-none z-50">
        <div className="minimap-wrapper relative w-full h-full flex gap-4 p-5">
          <div className="minimap-img-preview relative w-1/3 h-full overflow-hidden rounded-lg bg-zinc-900 border border-white/5">
            {indices.map((i) => {
              const data = getProjectData(i);
              return (
                <div
                  key={i}
                  className="minimap-img-item absolute top-0 left-0 w-full h-full will-change-transform"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  <img src={data.image} alt={data.title} className="absolute top-0 left-0 w-full h-full object-cover scale-150 grayscale" />
                </div>
              );
            })}
          </div>
          <div className="minimap-info-list relative w-2/3 h-full overflow-hidden">
            {indices.map((i) => {
              const data = getProjectData(i);
              const num = getProjectNumber(i);
              return (
                <div
                  key={i}
                  className="minimap-item-info absolute top-0 left-0 w-full h-full flex flex-col justify-center gap-2 will-change-transform"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-mono text-[10px]">{num}</span>
                    <h3 className="text-white font-bold text-sm uppercase tracking-tight truncate">{data.title}</h3>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono flex justify-between uppercase">
                    <span>{data.category}</span>
                    <span>{data.year}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 italic leading-relaxed">{data.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 flex flex-col items-center gap-4 z-50 overflow-hidden pointer-events-none">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-pulse" />
        <span className="text-white/20 font-mono text-[10px] [writing-mode:vertical-lr] uppercase tracking-[0.5em] py-4 italic">Scroll to navigate</span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
