import { TeamSection } from "@/components/ui/our-team-1";
import { KineticTeamHybrid } from "@/components/ui/kinetic-team-hybrid";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";

export function OurTeam() {
  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen overflow-x-hidden">
      <TeamSection />
      
      {/* Tilted Marquee Separator */}
      <div className="relative py-8 flex items-center justify-center z-20 pointer-events-none overflow-hidden">
        <div className="-rotate-2 w-full max-w-[100vw]">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-2}
            className="bg-emerald-400 text-black py-4 border-y border-emerald-200 shadow-[0_0_40px_rgba(52,211,153,0.3)] tracking-widest text-4xl"
          >
            PHARMOLA HEALTH VISION • ETHICAL EXCELLENCE • GLOBAL REACH • QUALITY DRIVEN •
          </MarqueeAnimation>
        </div>
      </div>

      <KineticTeamHybrid />
    </div>
  );
}
