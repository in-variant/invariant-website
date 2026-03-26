import { motion } from "framer-motion";
import { Plus, User, Mail, MessageSquare } from "lucide-react";
import { StoryViewer } from "@/components/ui/story-viewer";
import { HighlightGroup, HighlighterItem, Particles } from "@/components/ui/highlighter";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";
import { Button } from "@/components/ui/button";
import { CleanTestimonial } from "@/components/ui/clean-testimonial";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { cn } from "@/lib/utils";

function AddStoryButton() {
  return (
    <button
      className={cn(
        "relative flex flex-col items-center gap-2 group cursor-pointer"
      )}
      aria-label="Add your story"
    >
      <div className="relative">
        <div className="w-[72px] h-[72px] rounded-full p-1">
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center",
              "border-2 border-dashed border-emerald-500/30",
              "bg-emerald-500/5 transition-all duration-200",
              "group-hover:border-emerald-500/60 group-hover:bg-emerald-500/10"
            )}
          >
            <User className="w-7 h-7 text-emerald-500/50" />
          </div>
        </div>
        <motion.div
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
        </motion.div>
      </div>
      <span className="text-xs text-neutral-500 truncate max-w-[80px]">
        Share News
      </span>
    </button>
  );
}

const newsStories = [
  {
    username: "New Launch",
    avatar: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    stories: [
      { id: "news-1", type: "image" as const, src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=1200&fit=crop" },
      { id: "news-2", type: "image" as const, src: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&h=1200&fit=crop" },
    ],
  },
  {
    username: "CSR Event",
    avatar: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&h=150&fit=crop",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "csr-1", type: "image" as const, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=1200&fit=crop" },
    ],
  },
  {
    username: "Global Summit",
    avatar: "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=150&h=150&fit=crop",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "summit-1", type: "image" as const, src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1200&fit=crop" },
    ],
  },
];

export function Announcements() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full border-b border-white/5 bg-[#0a0a0a]">
        <CleanTestimonial />
      </section>

      {/* Stories Section */}
      <div className="max-w-7xl mx-auto px-4 mt-20 mb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">InVariant Stories</h2>
          <p className="text-neutral-500 max-w-xl">Get real-time updates on our latest breakthroughs and community impacts.</p>
        </div>
        
        <div className="flex justify-center">
            <div className="flex gap-6 overflow-x-auto py-4 px-6 bg-white/5 rounded-3xl border border-white/5 scrollbar-hide">
                <AddStoryButton />
                {newsStories.map((user) => (
                <StoryViewer
                    key={user.username}
                    stories={user.stories}
                    username={user.username}
                    avatar={user.avatar}
                    timestamp={user.timestamp}
                />
                ))}
            </div>
        </div>
      </div>

      {/* Tilted Marquee Separator */}
      <div className="relative py-12 flex items-center justify-center z-20 pointer-events-none overflow-hidden my-10">
        <div className="-rotate-2 w-[110%] absolute">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-2}
            className="bg-emerald-500 text-black py-4 border-y border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] tracking-[0.2em] text-3xl font-black italic"
          >
            LATEST UPDATES • NEW FORMULATIONS • GLOBAL PARTNERSHIPS • CSR INITIATIVES • PHARMOLA NEWS • 
          </MarqueeAnimation>
        </div>
      </div>

      {/* Stagger Testimonial Section (The "Announcement" Section) */}
      <section className="py-32 relative flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Patient Voices</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Discover the impact of our medications through the stories of those we serve.</p>
        </div>
        <div className="w-full flex justify-center">
          <StaggerTestimonials />
        </div>
      </section>

      {/* Interactive News Highlight Section */}
      <div className="max-w-5xl mx-auto px-4 mt-40">
        <HighlightGroup className="group h-full">
            <HighlighterItem className="rounded-3xl p-6">
                <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a]">
                <Particles
                    className="absolute inset-0 -z-10 opacity-30 transition-opacity duration-1000 ease-in-out group-hover:opacity-100"
                    quantity={150}
                    color={"#10b981"}
                    vy={-0.1}
                />
                <div className="flex flex-col md:flex-row items-center gap-10 p-8 md:p-12">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            Important Notice
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Have Questions About Our Research?
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed">
                            Our team is dedicated to transparency. Reach out to learn more about our manufacturing processes and safety standards.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 px-8 rounded-full">
                                Contact Press Office
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 hover:bg-white/5">
                                    <Mail className="h-5 w-5 text-emerald-400" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 hover:bg-white/5">
                                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative w-full md:w-[350px] aspect-square flex items-center justify-center">
                        {/* Interactive UI Mockup */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-3xl opacity-20 animate-pulse" />
                        <motion.div 
                            className="relative z-10 w-64 h-64 border border-white/10 bg-white/5 rounded-3xl backdrop-blur-md p-6"
                            whileHover={{ y: -5, rotate: 2 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-emerald-500" />
                                <div className="space-y-1">
                                    <div className="h-2 w-20 bg-white/20 rounded" />
                                    <div className="h-1.5 w-12 bg-white/10 rounded" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 w-full bg-white/10 rounded" />
                                <div className="h-3 w-4/5 bg-white/10 rounded" />
                                <div className="h-3 w-full bg-white/10 rounded" />
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
                                <div className="h-8 w-24 bg-emerald-500/20 rounded-lg" />
                                <div className="h-8 w-8 bg-white/10 rounded-lg" />
                            </div>
                        </motion.div>
                    </div>
                </div>
                </div>
            </HighlighterItem>
        </HighlightGroup>
      </div>
    </div>
  );
}
