import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative w-full bg-white md:h-screen md:overflow-hidden">
      {/* Painting, on mobile, a scene-focused banner cropped to the colourful top
          (the white below is supplied by the page, not the image); on desktop it fills
          the screen below the nav, anchored to the top. */}
      <div className="relative md:absolute md:inset-0">
        {/* Mobile: portrait painting, cropped to the scene (its dead white tail is trimmed) */}
        <img
          src="/hero-dawn-mobile.png"
          alt="Dawn above a sea of cloud, a rocket ascending on the right, a nuclear power station with cooling towers on the left, drones in the sky."
          className="block aspect-[5/4] w-full object-cover object-top md:hidden"
        />
        {/* Desktop: wide painting filling the screen below the nav */}
        <img
          src="/hero-dawn.png"
          alt=""
          aria-hidden="true"
          className="hidden h-full w-full object-cover object-top md:block"
        />
        {/* Mobile only: melt the misty base into the white page below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent md:hidden" />
      </div>

      {/* Copy, below the image on mobile; overlaid on the white lower half on desktop. */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 pb-16 pt-3 text-center md:absolute md:inset-0 md:mx-0 md:max-w-none md:flex md:flex-col md:items-center md:justify-end md:pb-[9vh] md:pt-0">
        {/* Backed-by badge, dark Duna-style pill */}
        <motion.a
          href="https://www.joinef.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition hover:opacity-90"
          style={{
            background: 'rgba(28, 25, 23, 0.55)',
            WebkitBackdropFilter: 'blur(8px)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="font-sans text-white/90">
            Backed by <span className="font-medium text-white">Entrepreneurs First</span>
          </span>
          <span aria-hidden="true" className="font-sans text-white/45">›</span>
        </motion.a>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="mt-6 text-balance font-serif text-[2.25rem] font-normal leading-[1.04] tracking-[-0.025em] text-ink sm:text-5xl lg:text-6xl"
        >
          Autonomous AI agents for compliance in mission-critical industries.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mt-4 max-w-[34rem] text-balance font-sans text-base leading-relaxed text-ink/55 md:mt-5 md:text-xl"
        >
          Agents that draft, file, and monitor regulatory compliance for space, aerospace, and nuclear companies. So your engineers stay on the hardware, and your launches don't slip.
        </motion.p>
      </div>
    </section>
  )
}
