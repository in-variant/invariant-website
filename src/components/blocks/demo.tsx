import { PulseFitHero } from "@/components/ui/pulse-fit-hero";
import { GalleryHoverCarousel } from "@/components/ui/gallery-hover-carousel";
import { About3 } from "@/components/ui/about-3";
import { Testimonial1 } from "@/components/ui/testimonial-1";
import { Features } from "@/components/ui/features-8";
import { TestimonialSlider } from "@/components/ui/testimonial-slider-1";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const MORALS: CarouselItem[] = [
  { id: 1, title: "PRECISION" },
  { id: 2, title: "TRACEABILITY" },
  { id: 3, title: "COMPLIANCE" },
  { id: 4, title: "ACCURACY" },
  { id: 5, title: "AUTHORSHIP" },
  { id: 6, title: "FLUENCY" },
  { id: 7, title: "INTEGRITY" },
  { id: 8, title: "READINESS" },
  { id: 9, title: "REASONING" },
];

const CERTIFICATIONS = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/World_Health_Organization_Logo.svg",
    alt: "WHO GMP Logo",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FDA_logo.svg/1024px-FDA_logo.svg.png",
    alt: "USFDA Logo",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo.svg",
    alt: "ISO Certified Logo",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/World_Health_Organization_Logo.svg",
    alt: "WHO GMP Logo 2",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FDA_logo.svg/1024px-FDA_logo.svg.png",
    alt: "USFDA Logo 2",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo.svg",
    alt: "ISO Certified Logo 2",
  },
];

const PARTNERS: FocusRailItem[] = [
  {
    id: 1,
    title: "Authorship at Depth",
    description: "Generating substantive technical content grounded in the actual design, not hallucinated boilerplate.",
    meta: "Core Capability",
    imageSrc: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1000&q=80",
    href: "#",
  },
  {
    id: 2,
    title: "Citation Integrity",
    description: "Every claim traces back to a source; the daisy-chain of references is verified, not assumed.",
    meta: "Core Capability",
    imageSrc: "https://images.unsplash.com/photo-1532187643603-eb1104e6063d?w=1000&q=80",
    href: "#",
  },
  {
    id: 3,
    title: "Regulatory Fluency",
    description: "The model understands the acceptance criteria it is writing toward, not just the words in the standard.",
    meta: "Core Capability",
    imageSrc: "https://images.unsplash.com/photo-1550572017-edb79a0aa249?w=1000&q=80",
    href: "#",
  },
  {
    id: 4,
    title: "Review-Readiness",
    description: "Output is structured to survive rigorous regulatory scrutiny, not just pass a human read.",
    meta: "Core Capability",
    imageSrc: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1000&q=80",
    href: "#",
  },
  {
    id: 5,
    title: "Domain Specificity",
    description: "Purpose-built intelligence to handle massive complexity across multiple engineering disciplines.",
    meta: "Core Capability",
    imageSrc: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1000&q=80",
    href: "#",
  },
];

// 1. Define the Invariant review data
const reviews = [
  {
    id: 1,
    name: "Dr. Robert Matthews",
    affiliation: "Senior Control Engineer",
    quote: "Invariant accelerates our documentation lifecycle by months. The depth of architectural understanding combined with absolute citation integrity is phenomenal.",
    imageSrc: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80",
  },
  {
    id: 2,
    name: "Dr. Anjali Desai",
    affiliation: "Lead Licensing Consultant",
    quote: "Unlike general AI, Invariant writes with the exact regulatory fluency we require. It understands the acceptance criteria and directly addresses them.",
    imageSrc: "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=800&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=150&q=80",
  },
  {
    id: 3,
    name: "Priya Sharma",
    affiliation: "Compliance Director",
    quote: "The ability to generate review-ready first drafts changes the entire game for certifying new engineered technologies at scale.",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
  },
  {
    id: 4,
    name: "David Chen",
    affiliation: "Energy Systems Architect",
    quote: "It authors substantive technical content directly grounded in our system designs—no hallucinated boilerplate, just pure, verified engineering facts.",
    imageSrc: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80",
  },
  {
    id: 5,
    name: "Sarah Jenkins",
    affiliation: "Systems Evaluator",
    quote: "We no longer spend thousands of hours manually tracing requirements. Invariant produces structured outputs that survive the strictest regulatory scrutiny.",
    imageSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80",
  },
];

export function Demo() {
  return (
    <div className="w-full relative overflow-x-hidden">
      <PulseFitHero
        title="Licensing Language Models."
        subtitle="AI that reads, reasons over, and authors the complex technical documentation required to certify engineered systems for regulatory approval."
        primaryAction={{
          label: "Request Demo",
          onClick: () => console.log("Request Demo"),
        }}
        secondaryAction={{
          label: "View Frameworks",
          onClick: () => console.log("View Frameworks"),
        }}
        disclaimer="*Trust & Quality Assured via verified citation chains."
        socialProof={{
          avatars: [
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop",
            "https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=150&h=150&fit=crop",
          ],
          text: "Trusted by top industry professionals globally.",
        }}
        programs={[
          {
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=500&fit=crop",
            category: "INDUSTRY",
            title: "Nuclear Energy",
            onClick: () => window.location.assign("/industries/nuclear"),
          },
          {
            image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=500&fit=crop",
            category: "INDUSTRY",
            title: "Autonomous Drones",
            onClick: () => window.location.assign("/industries/drones"),
          },
          {
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=500&fit=crop",
            category: "INDUSTRY",
            title: "Energy Tech",
            onClick: () => window.location.assign("/industries/energy"),
          },
          {
            image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=500&fit=crop",
            category: "INDUSTRY",
            title: "Industrial Plants",
            onClick: () => window.location.assign("/industries/industrial"),
          },
          {
            image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&h=500&fit=crop",
            category: "INDUSTRY",
            title: "Medical Devices",
            onClick: () => window.location.assign("/industries/medical"),
          },
        ]}
      />
      
      <About3
        title="The Engineering Bottleneck"
        description="Regulatory licensing is one of the most document-intensive, high-stakes processes in engineering. Certifying a new system requires producing thousands of pages of technical documentation that must satisfy regulators."
        mainImage={{
          src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
          alt: "Pharmaceutical Laboratory Innovation",
        }}
        secondaryImage={{
          src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80",
          alt: "Healthcare Professionals Collaborating",
        }}
        breakout={{
          src: "icon",
          alt: "logo",
          title: "Purpose-Built AI",
          description: "Not a general assistant. Not a chatbot. A system that understands the structure of regulatory frameworks.",
          buttonText: "Learn More",
          buttonUrl: "#",
        }}
        companiesTitle="Frameworks We Navigate"
        companies={[
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/1200px-WHO_logo.svg.png",
            alt: "WHO-GMP",
          },
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/9/91/FDA_logo.svg",
            alt: "USFDA",
          },
          {
            src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&q=80",
            alt: "Innovia Manufacturing",
          },
          {
            src: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&q=80",
            alt: "Windlas Nutrition",
          }
        ]}
        achievementsTitle="Our Mission & Impact"
        achievementsDescription="Invariant is building the first AI purpose-built for this work. Accelerating engineered innovation reaching the world."
        achievements={[
          { label: "Engineering Disciplines", value: "10+" },
          { label: "Consultant Hours Saved", value: "10k+" },
          { label: "Automated Frameworks", value: "50+" },
          { label: "Certifications Managed", value: "100+" },
        ]}
      />

      <RulerCarousel originalItems={MORALS} />

      <Testimonial1 />
      
      <Features />

      <TestimonialSlider reviews={reviews} />

      <GalleryHoverCarousel />

      {/* Focus Rail Manufacturing Partners section */}
      <section className="py-24 bg-transparent relative z-10">
        <div className="mb-16 text-center px-4">
          <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Technical Approach</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Core Problems <br className="md:hidden" /> Invariant Solves</h2>
        </div>
        <FocusRail 
          items={PARTNERS} 
          autoPlay={true}
          interval={5000}
          loop={true} 
        />
      </section>

      {/* Certifications Cloud -> Absolute Bottom */}
      <section className="relative mx-auto mt-12 pb-24 w-full">
        <h2 className="mb-8 text-center font-medium text-white text-xl tracking-tight md:text-3xl">
          <span className="text-gray-400">Adopted by the best.</span>
          <br />
          <span className="font-semibold text-emerald-400">Compliant with global standards.</span>
        </h2>
        
        <div className="mx-auto my-5 h-px w-full max-w-4xl bg-white/10 [mask-image:linear-gradient(to_right,transparent,#111111,transparent)]" />
        <LogoCloud logos={CERTIFICATIONS} />
        <div className="mx-auto mt-5 h-px w-full max-w-4xl bg-white/10 [mask-image:linear-gradient(to_right,transparent,#111111,transparent)]" />
      </section>

    </div>
  );
}
