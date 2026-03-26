import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type FooterProps = React.ComponentProps<'footer'> & {
	children?: React.ReactNode;
};

export function Footer({ className, children, ...props }: FooterProps) {
	return (
        <section className="relative w-full overflow-hidden">
		<footer
			className={cn(
				'relative border-t border-ink/10 bg-white pt-16 pb-[18rem] px-6 md:px-12 lg:px-24 xl:px-32',
				className,
			)}
			{...props}
		>
			<div className="mx-auto w-full max-w-7xl relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
					<div className="col-span-1 md:col-span-1 flex flex-col justify-between">
                        <div>
                            <Link to="/" className="font-serif text-2xl font-medium tracking-[-0.02em] text-ink">
                                Invariant
                            </Link>
                            <p className="mt-4 font-mono text-sm text-ink/55 pr-4">
                                Engineering certification, at the speed of design.
                            </p>
                        </div>
                        <div className="mt-8 md:mt-0">
                            <a
                                href="mailto:founders@invariant-ai.com"
                                className="font-mono text-sm text-ink/70 hover:text-ink transition-colors underline underline-offset-4 decoration-ink/20 hover:decoration-ink/50"
                            >
                                founders@invariant-ai.com
                            </a>
                        </div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
						<LinksGroup
							title="Company"
							links={[
								{ title: 'About Us', href: '/about' },
								{ title: 'Partnerships', href: '/partners' },
								{ title: 'Careers', href: '#' },
								{ title: 'Contact Us', href: '/contact' },
								{ title: 'Blog', href: '#' },
							]}
						/>
						<LinksGroup
							title="Industries"
							links={[
								{ title: 'Nuclear', href: '/industries/nuclear' },
								{ title: 'Drones', href: '/industries/drones' },
								{ title: 'eVTOLs', href: '/industries/evtols' },
								{ title: 'Defense', href: '/industries/defense' },
								{ title: 'Robotics', href: '/industries/robotics' },
								{ title: 'Automotive', href: '/industries/automotive' },
							]}
						/>
						<div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
                            <h3 className="text-ink/50 mt-2 mb-6 text-xs font-mono font-medium tracking-[0.15em] uppercase">
                                Connect
                            </h3>
                            <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
                                <SocialCard title="LinkedIn" href="#" />
                                <SocialCard title="Twitter / X" href="#" />
                                <SocialCard title="GitHub" href="#" />
                            </div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-7xl mt-32 flex flex-col md:flex-row justify-between items-center border-t border-ink/10 pt-8 relative z-10">
				<p className="font-mono text-xs text-ink/40 tracking-[0.05em]">
					© {new Date().getFullYear()} Invariant. All rights reserved.
				</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link to="/privacy" className="font-mono text-xs text-ink/40 hover:text-ink transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="font-mono text-xs text-ink/40 hover:text-ink transition-colors">Terms of Service</Link>
                </div>
			</div>

            {/* Large background text */}
            <div 
                className="bg-gradient-to-b from-ink/10 via-ink/5 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-0 font-serif font-bold tracking-[-0.02em] pointer-events-none select-none text-center px-4"
                style={{
                    fontSize: 'clamp(5rem, 16vw, 15rem)',
                    maxWidth: '100vw',
                    zIndex: 0
                }}
            >
                INVARIANT
            </div>
		</footer>
        </section>
	);
}

interface LinksGroupProps {
	title: string;
	links: { title: string; href: string }[];
}
function LinksGroup({ title, links }: LinksGroupProps) {
	return (
		<div>
			<h3 className="text-ink/50 mt-2 mb-6 text-xs font-mono font-medium tracking-[0.15em] uppercase">
				{title}
			</h3>
			<ul className="space-y-3">
				{links.map((link) => (
					<li key={link.title}>
						<Link
							to={link.href}
							className="font-mono text-sm text-ink/60 hover:text-ink transition-colors tracking-wide"
						>
							{link.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialCard({ title, href }: { title: string; href: string }) {
	return (
		<a
			href={href}
			className="group flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-ink/5 transition-colors font-mono text-sm text-ink/70 hover:text-ink tracking-wide"
		>
			<span className="">{title}</span>
			<ArrowRight className="h-3 w-3 text-ink/30 group-hover:text-ink transition-colors" />
		</a>
	);
}
