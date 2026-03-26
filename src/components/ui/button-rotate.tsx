"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ButtonRotate = () => {
  // Spaced perfectly to complete the circle
  const text = "CONTACT US ON WHATSAPP "; 
  const whatsappUrl = "https://wa.me/917052711525";

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <div className="border hover:border-emerald-400/50 transition-colors p-1 rounded-full border-dotted border-white/20 bg-[#0a0a0a]/50 backdrop-blur-sm shadow-[0_0_20px_rgba(52,211,153,0.1)]">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button
            className="group relative w-[100px] h-[100px] rounded-full overflow-hidden p-0 grid place-content-center bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-lg"
          >
            <p
              className="absolute inset-0"
              style={{
                animation: "text-rotation 12s linear infinite",
                position: "absolute",
                inset: 0,
              }}
            >
              {Array.from(text).map((char, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold tracking-widest text-[#0a0a0a]"
                  style={{
                    position: "absolute",
                    inset: "6px",
                    transform: `rotate(${15.6 * i}deg)`, // 360 / 23 characters = ~15.6
                    transformOrigin: "50% 50%",
                    userSelect: "none",
                    display: "inline-block",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>

            <div className="relative w-[50px] h-[50px] rounded-full text-emerald-500 bg-[#0a0a0a] flex items-center justify-center overflow-hidden z-10 shadow-inner group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 absolute transition-transform duration-300 ease-in-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
              <MessageCircle className="w-6 h-6 absolute transition-transform duration-300 ease-in-out -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0 text-emerald-400" />
            </div>

            <style>{`
              @keyframes text-rotation {
                to {
                  rotate: 360deg;
                }
              }
              button:hover p {
                  animation-duration: 4s; /* Speed up on hover */
              }
            `}</style>
          </Button>
        </a>
      </div>
    </div>
  );
};
