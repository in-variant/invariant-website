import { AboutSection3 } from "@/components/ui/about-section";
import { Testimonial1 } from "@/components/ui/testimonial-1";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const BRAND_VALUES: CarouselItem[] = [
  { id: 1, title: "QUALITY COMMITMENT" },
  { id: 2, title: "HEALTH INNOVATION" },
  { id: 3, title: "ETHICAL INTEGRITY" },
  { id: 4, title: "CUSTOMER CENTRIC" },
  { id: 5, title: "SUSTAINABILITY" },
  { id: 6, title: "COLLABORATIVE EXCELLENCE" },
];

export function AboutUs() {
  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen">
      <AboutSection3 />
      <Testimonial1 />
      <section className="py-24 overflow-hidden relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 mb-4 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Our Core Values</h2>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">The foundational principles that drive our dedication to producing research-driven medicines.</p>
        </div>
        <RulerCarousel originalItems={BRAND_VALUES} />
      </section>
    </div>
  );
}
