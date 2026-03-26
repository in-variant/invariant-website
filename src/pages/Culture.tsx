import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import { FocusRail } from "@/components/ui/focus-rail";
import { Sparkles, Trophy, Rocket } from "lucide-react";

const ACTIVITY_IMAGES = [
  {
    id: 1,
    title: "Community Outreach",
    desc: "Bringing medicine to rural hearts.",
    url: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Precision Manufacturing",
    desc: "Quality that saves lives.",
    url: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80",
    span: "md:row-span-1",
  },
  {
    id: 3,
    title: "Expert Logistics",
    desc: "Cool chain delivery nationwide.",
    url: "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=800&q=80",
    span: "md:row-span-1",
  },
  {
    id: 4,
    title: "Lab Innovations",
    desc: "R&D for better outcomes.",
    url: "https://images.unsplash.com/photo-1579154204601-01588f18a715?w=800&q=80",
    span: "md:row-span-2",
  },
  {
    id: 5,
    title: "Healthcare Training",
    desc: "Empowering our professionals.",
    url: "https://images.unsplash.com/photo-1502740479091-635887520276?w=800&q=80",
    span: "md:row-span-1",
  },
  {
    id: 6,
    title: "Wellness Camps",
    desc: "Preventative care initiatives.",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    span: "md:col-span-2 md:row-span-1",
  },
];

const PROJECTS = [
  {
    title: "D Boon MDS Launch",
    description: "Our landmark multi-drug system for comprehensive bone health.",
    year: "2024",
    link: "#",
    image: "https://images.unsplash.com/photo-1512428559083-a400a3b8cd27?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "Rural Health Program",
    description: "Expanded pharmaceutical access to 15+ new districts.",
    year: "2023",
    link: "#",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  },
  {
    title: "Digital Supply Chain",
    description: "AI-driven inventory tracking for mission-critical drugs.",
    year: "2023",
    link: "#",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  },
];

const AWARD_ITEMS = [
  {
    id: 1,
    title: "Best Performers FY23-24",
    description: "Recognizing exceptional sales & marketing leadership across North India.",
    meta: "Award • Excellence",
    imageSrc: "https://images.unsplash.com/photo-1531482615454-94ed0ae6621b?w=1000&q=80",
    href: "#",
  },
  {
    id: 2,
    title: "Sales Excellence FY23-24",
    description: "Honoring the regional teams for outstanding growth and community impact.",
    meta: "Award • Achievement",
    imageSrc: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1000&q=80",
    href: "#",
  },
  {
    id: 3,
    title: "Market Integrity Award",
    description: "Special recognition for maintaining the highest ethical standards in distribution.",
    meta: "Award • Ethics",
    imageSrc: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&q=80",
    href: "#",
  },
];

export function Culture() {
  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen pt-24">
      {/* Hero Section */}
      <div className="w-full px-6 md:px-12 py-16 text-center border-b border-white/5">
        <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4 block flex items-center justify-center gap-2">
           <Sparkles className="w-4 h-4" /> Company Culture & Activities
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          Vibrant <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Excellence</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Celebrating the milestones, field activities, and the exceptional people who drive InVariant's success.
        </p>
      </div>

      {/* Bento Gallery - Activities */}
      <div className="bg-[#0a0a0a]">
        <InteractiveImageBentoGallery 
          imageItems={ACTIVITY_IMAGES}
          title="Field Activities"
          description="A glimpse into our daily commitment to healthcare excellence and community support."
        />
      </div>

      {/* Project Showcase - Specific Launches */}
      <div className="bg-[#0a0a0a] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <Rocket className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Milestones & Launches</h2>
        </div>
        <ProjectShowcase projects={PROJECTS} />
      </div>

      {/* Focus Rail - Awards */}
      <div className="bg-[#0a0a0a] py-24">
         <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Company Accolades</h2>
            <p className="text-gray-400 mt-4">Celebrating the humans behind the health revolution.</p>
        </div>
        <FocusRail 
          items={AWARD_ITEMS} 
          autoPlay={false} 
          loop={true} 
          className="h-[650px]"
        />
      </div>
    </div>
  );
}
