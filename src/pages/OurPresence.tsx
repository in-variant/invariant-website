import { WorldMap } from "@/components/ui/map";
import { ContainerAnimated, ContainerScroll, ContainerStagger, ContainerSticky, GalleryCol, GalleryContainer } from "@/components/ui/animated-gallery";
import { Globe, Building2 } from "lucide-react";

const LAB_IMAGES = [
  "https://images.unsplash.com/photo-1579154204601-01588f18a715?w=800&q=80",
  "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
];

const PACKAGING_IMAGES = [
  "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1618331835717-817f766e4085?w=800&q=80",
  "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&q=80",
];

const RESEARCH_IMAGES = [
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
  "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
];

export function OurPresence() {
  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen pt-24">
      {/* Global Map Section */}
      <div className="w-full px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4 block">Expanding Nationwide</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Our <span className="text-emerald-400 border-b-2 border-emerald-400">Presence</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We are currently active in Central UP, Eastern UP, Bihar, and Jharkhand. Expanding our reach, bringing quality healthcare to more regions every year.
          </p>
        </div>

        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden">
          <WorldMap
            lineColor="#34d399"
            dots={[
              {
                start: { lat: 28.6139, lng: 77.209, label: "Greater Noida (HQ)" },
                end: { lat: 19.0760, lng: 72.8777, label: "Pan-India Reach" }
              }
            ]}
          />
        </div>
      </div>

      {/* Animated Facilities Gallery */}
      <div className="relative bg-[#0a0a0a] border-t border-white/10 mt-12 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]">
        <ContainerStagger className="relative z-20 place-self-center px-6 pt-24 pb-12 text-center max-w-4xl mx-auto">
          <ContainerAnimated>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              State-of-the-Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">Facilities</span>
            </h2>
          </ContainerAnimated>

          <ContainerAnimated className="my-6">
            <p className="text-xl text-gray-400">
              Zero tolerance for error. Our WHO-GMP compliant facilities leverage fully automated 
              instrumentation down to the molecular level.
            </p>
          </ContainerAnimated>

          <ContainerAnimated className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#111111] text-white font-bold text-sm">
              <Building2 className="w-4 h-4 text-emerald-400" />
              1.2M+ Sq. Ft. Manufacturing Space
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#111111] text-emerald-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
              100% Export Ready
            </div>
          </ContainerAnimated>
        </ContainerStagger>

        {/* Ambient Blur */}
        <div className="pointer-events-none absolute z-10 h-[50vh] w-full"
          style={{
            background: "linear-gradient(to right, transparent, rgba(52,211,153,0.1), transparent)",
            filter: "blur(100px)",
          }}
        />

        <ContainerScroll className="relative h-[120vh] xl:h-[150vh] mt-[-10vh] mb-[-20vh]">
          <ContainerSticky className="h-screen w-full px-4 md:px-12 flex items-center mb-10 pb-20 pt-10">
            <GalleryContainer className="max-w-7xl mx-auto border border-white/5 bg-[#111111]/50 p-4 md:p-8 rounded-[2rem] shadow-[-20px_-20px_100px_rgba(255,255,255,0.02)] backdrop-blur-md">
              <GalleryCol yRange={["-10%", "5%"]} className="-mt-12">
                {LAB_IMAGES.map((imageUrl, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-white/10 group">
                    <img
                      className="aspect-[4/5] block h-auto w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      src={imageUrl}
                      alt="Laboratory Setup"
                    />
                  </div>
                ))}
              </GalleryCol>
              
              <GalleryCol className="mt-[-25%]" yRange={["10%", "0%"]}>
                {RESEARCH_IMAGES.map((imageUrl, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-emerald-400/20 shadow-[0_0_30px_rgba(52,211,153,0.1)] group">
                    <img
                      className="aspect-[4/5] block h-auto w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      src={imageUrl}
                      alt="Research Facility"
                    />
                  </div>
                ))}
              </GalleryCol>
              
              <GalleryCol yRange={["-10%", "5%"]} className="-mt-12">
                {PACKAGING_IMAGES.map((imageUrl, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-white/10 group">
                    <img
                      className="aspect-[4/5] block h-auto w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      src={imageUrl}
                      alt="Automated Packaging"
                    />
                  </div>
                ))}
              </GalleryCol>
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      </div>
    </div>
  );
}
