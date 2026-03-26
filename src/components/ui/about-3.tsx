import { Button } from "@/components/ui/button";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-1.svg",
    alt: "Arc",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-2.svg",
    alt: "Descript",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-3.svg",
    alt: "Mercury",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-4.svg",
    alt: "Ramp",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-5.svg",
    alt: "Retool",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-6.svg",
    alt: "Watershed",
  },
];

const defaultAchievements = [
  { label: "Companies Supported", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
];

export const About3 = ({
  title = "About Us",
  description = "Shadcnblocks is a passionate team dedicated to creating innovative solutions that empower businesses to thrive in the digital age.",
  mainImage = {
    src: "https://shadcnblocks.com/images/block/placeholder-1.svg",
    alt: "placeholder",
  },
  secondaryImage = {
    src: "https://shadcnblocks.com/images/block/placeholder-2.svg",
    alt: "placeholder",
  },
  breakout = {
    src: "https://shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
    title: "Hundreds of blocks at Shadcnblocks.com",
    description:
      "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
    buttonText: "Discover more",
    buttonUrl: "https://shadcnblocks.com",
  },
  companiesTitle = "Valued by clients worldwide",
  companies = defaultCompanies,
  achievementsTitle = "Our Achievements in Numbers",
  achievementsDescription = "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <section className="py-32 w-full bg-background text-foreground z-10 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="text-gray-400 text-lg">{description}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2 border border-white/10"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-[#111111] p-7 md:w-1/2 lg:w-auto border border-white/10">
              {breakout.src && (
  <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
</svg>
              )}
              <div>
                <p className="mb-2 text-xl font-bold text-white tracking-tight">{breakout.title}</p>
                <p className="text-gray-400 leading-relaxed">{breakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto border-white/20 text-white hover:bg-white hover:text-black transition-all" asChild>
                <a href={breakout.buttonUrl} target="_blank">
                  {breakout.buttonText}
                </a>
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto border border-white/10"
            />
          </div>
        </div>
        <div className="py-24">
          <p className="text-center text-gray-400 font-medium tracking-widest uppercase text-sm mb-12">{companiesTitle} </p>
          <div className="mt-8 flex flex-wrap justify-center gap-12 opacity-70">
            {companies.map((company, idx) => (
              <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300" key={company.src + idx}>
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-8 w-auto md:h-12 brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/10 p-10 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left relative z-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{achievementsTitle}</h2>
            <p className="max-w-screen-md text-gray-400 text-lg leading-relaxed">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-between gap-10 text-center relative z-20">
            {achievements.map((item, idx) => (
              <div className="flex flex-col gap-3 items-center md:items-start" key={item.label + idx}>
                <p className="text-gray-400 font-medium">{item.label}</p>
                <span className="text-5xl font-bold text-white tracking-tighter">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-100 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};
