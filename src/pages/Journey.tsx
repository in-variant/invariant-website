import { Timeline } from "@/components/ui/timeline";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const MORALS: CarouselItem[] = [
  { id: 1, title: "INTEGRITY" },
  { id: 2, title: "COMPASSION" },
  { id: 3, title: "EXCELLENCE" },
  { id: 4, title: "INNOVATION" },
  { id: 5, title: "PATIENT-FIRST" },
  { id: 6, title: "QUALITY" },
  { id: 7, title: "SUSTAINABILITY" },
  { id: 8, title: "COMPLIANCE" },
  { id: 9, title: "TRANSPARENCY" },
];

export function Journey() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-300 text-xs md:text-sm font-normal mb-8 leading-relaxed">
            Expanding our global footprint with 50+ new distribution partners across Europe and South Asia. 
            Launched our flagship line of neuro-recovery formulations.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1579165466511-70e21ad10b05?w=500&h=500&fit=crop"
              alt="modern laboratory"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-2xl border border-white/5"
            />
            <img
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&h=500&fit=crop"
              alt="pharmaceutical manufacturing"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-2xl border border-white/5"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2022 - 2023",
      content: (
        <div>
          <p className="text-neutral-300 text-xs md:text-sm font-normal mb-8">
            Achieved USFDA and WHO-GMP certifications for our Dehradun facility.
            Introduced patient-centric packaging designed for geriatric care.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=500&h=500&fit=crop"
              alt="quality control"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-2xl border border-white/5"
            />
            <img
              src="https://images.unsplash.com/photo-1583912267550-d44d7a125e7e?w=500&h=500&fit=crop"
              alt="medical research"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-2xl border border-white/5"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Foundation",
      content: (
        <div>
          <p className="text-neutral-300 text-xs md:text-sm font-normal mb-4">
            Started InVariant with a mission to make essential healthcare affordable and accessible. 
            Initially focused on high-quality generics for gastrointestinal care.
          </p>
          <div className="mb-8 space-y-2">
            <div className="flex gap-2 items-center text-emerald-400 text-xs md:text-sm">
              ✔ 200+ Team Strength
            </div>
            <div className="flex gap-2 items-center text-emerald-400 text-xs md:text-sm">
              ✔ ISO 9001:2015 Compliance
            </div>
            <div className="flex gap-2 items-center text-emerald-400 text-xs md:text-sm">
              ✔ First R&D Unit Established
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <img
              src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1000&h=600&fit=crop"
              alt="company entrance"
              className="rounded-lg object-cover h-40 md:h-64 lg:h-80 w-full shadow-2xl border border-white/5"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-12 overflow-x-hidden">
      <Timeline data={data} />
      
      <div className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-neutral-400 max-w-lg">The fundamental principles that guide every decision and innovation at InVariant.</p>
        </div>
        <RulerCarousel originalItems={MORALS} />
      </div>
    </div>
  );
}
