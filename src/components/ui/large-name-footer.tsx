import { Activity, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

function Footer() {
  return (
    <footer className="py-16 px-6 bg-[#0a0a0a] border-t border-white/10 w-full relative z-10 overflow-hidden">
      <div className="container mx-auto max-w-[1400px]">
        {/* Main Grid Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          
          {/* Brand & Vision (Left Side) */}
          <div className="lg:w-1/3 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-400 p-2 rounded-lg inline-flex">
                <Activity className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">InVariant</h2>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
              We at <strong className="text-white">InVariant</strong>, constantly work towards ensuring good health and Providing medicines that are affordable by everyone. We are trusted health care professionals, committed to serve the society.
            </p>

            <a href="mailto:enquiry@pharmola.in">
              <Button variant="outline" className="border-white/20 text-white hover:bg-emerald-400 hover:text-black hover:border-emerald-400 bg-transparent rounded-full px-6 py-5 transition-all w-fit">
                Get in Touch
                <Mail className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Links & Information (Right Side Grid) */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            
            {/* Domestic Offices */}
            <div>
              <h3 className="font-semibold mb-6 flex items-center gap-2 text-white">
                <MapPin className="text-emerald-400 w-4 h-4" />
                Domestic Offices
              </h3>
              <ul className="space-y-4 text-sm text-gray-400 leading-relaxed">
                <li>
                  <strong className="text-white block mb-1">Greater Noida</strong>
                  GF,0867, MU-2, Gautam Buddha Nagar<br/>Uttar Pradesh - 201308
                </li>
                <li>
                  <strong className="text-white block mb-1">Kanpur</strong>
                  H.No. 127/543, W-1 Saket Nagar<br/>Uttar Pradesh
                </li>
              </ul>
            </div>

            {/* Overseas Offices */}
            <div>
              <h3 className="font-semibold mb-6 flex items-center gap-2 text-white">
                <MapPin className="text-blue-400 w-4 h-4" />
                Overseas Offices
              </h3>
              <ul className="space-y-4 text-sm text-gray-400 leading-relaxed">
                <li>
                  <strong className="text-white block mb-1">Scotland</strong>
                  62 Cow Wynd<br/>Falkirk, FK2 2AE
                </li>
                <li>
                  <strong className="text-white block mb-1">United Kingdom</strong>
                  5 Spring St, Chipping Norton<br/>OX7 5NN, Oxford
                </li>
              </ul>
            </div>

            {/* Connect / Badges */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold mb-6 text-white tracking-wide">Connect</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="tel:+917052711525" className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors">
                      <Phone className="w-4 h-4" />
                      +91-7052711525
                    </a>
                  </li>
                  <li>
                    <a href="mailto:enquiry@pharmola.in" className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors break-all">
                      <Mail className="w-4 h-4" />
                      enquiry@pharmola.in
                    </a>
                  </li>
                </ul>
              </div>

              {/* ISO Badge Placeholder */}
              <div className="mt-8">
                <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center bg-[#111111] relative overflow-hidden group hover:border-emerald-400/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent group-hover:opacity-100 opacity-50 transition-opacity"/>
                  <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest text-center mt-1 z-10">ISO<br/>Badge</span>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo.svg" 
                    alt="ISO Certified" 
                    className="absolute inset-4 object-contain brightness-0 invert opacity-20 group-hover:opacity-10 transition-opacity z-0"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Master Large Brand Name */}
        <div className="w-full flex mt-20 pt-10 border-t border-white/5 items-center justify-center relative overflow-hidden">
          <h1 className="text-center text-[15vw] leading-[0.8] font-black pointer-events-none select-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-[#0a0a0a]">
            PHARMOLA
          </h1>
        </div>

        {/* Copyright Line */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 mt-2">
          <p>© {new Date().getFullYear()} InVariant. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Powered by Systoo Technologies</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
