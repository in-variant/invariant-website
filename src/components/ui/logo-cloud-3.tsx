import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string; // Added custom class for specific tuning if needed
};

// Removed ComponentProps<"div"> from React type for standard Vite/React usage
type LogoCloudProps = React.HTMLAttributes<HTMLDivElement> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        // Override for dark mode transparency mask
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#0a0a0a,transparent)] w-full",
        className
      )}
    >
      <InfiniteSlider gap={60} reverse duration={40} durationOnHover={15}>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            // By default, inverted to support dark theme against #0a0a0a
            className={cn(
              "pointer-events-none h-8 select-none md:h-12 brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300",
              logo.className
            )}
            height={logo.height || "auto"}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width || "auto"}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}
