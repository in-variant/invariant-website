'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	CodeIcon,
	LayersIcon,
	Users,
	FileText,
	Shield,
	Handshake,
	Leaf,
	HelpCircle,
	Zap,
	Plane,
	Focus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-ink/10 transition-all', {
				'shadow-sm': scrolled,
			})}
		>
			<nav className="mx-auto flex h-[60px] w-full items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32">
				<div className="flex items-center gap-8">
                    <Link to="/" className="font-serif text-lg font-medium tracking-[-0.02em] text-ink hover:text-ink/80 transition-colors">
                        Invariant
                    </Link>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent">Industries</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-white p-2 border border-ink/10 shadow-lg rounded-md">
									<ul className="grid w-[400px] md:w-[500px] grid-cols-2 gap-2">
										{industryLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
									<div className="p-2 mt-2 border-t border-ink/10">
										<p className="font-mono text-xs uppercase tracking-[0.1em] text-ink/50">
											Interested?{' '}
											<Link to="/contact" className="text-ink font-medium hover:underline">
												Schedule a demo
											</Link>
										</p>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent">Company</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-white p-2 border border-ink/10 shadow-lg rounded-md">
									<div className="grid w-[400px] md:w-[500px] grid-cols-2 gap-4">
										<ul className="space-y-2">
											{companyLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="space-y-1 p-2 bg-ink/5 rounded-md border border-ink/10">
											{companyLinks2.map((item, i) => (
												<li key={i}>
													<NavigationMenuLink
														asChild
														className="flex p-2 hover:bg-white/50 flex-row rounded-md items-center gap-x-2 transition-colors"
													>
                                                        <Link to={item.href}>
														    <item.icon className="text-ink size-4" />
														    <span className="font-mono text-xs uppercase tracking-[0.1em] text-ink">{item.title}</span>
                                                        </Link>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuLink className="px-4 font-mono text-sm tracking-[0.15em] uppercase text-ink/50 hover:text-ink transition-colors" asChild>
								<Link to="/pricing" className="p-2">
									Pricing
								</Link>
							</NavigationMenuLink>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-4 md:flex">
					<Button variant="ghost" className="font-mono text-xs tracking-[0.15em] text-ink/70 hover:text-ink">Sign In</Button>
					<Button className="bg-ink text-white hover:bg-ink/90 font-mono text-xs tracking-[0.15em]">Get Started</Button>
				</div>
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-4 overflow-y-auto bg-white pt-6">
				<NavigationMenu className="max-w-full w-full block">
					<div className="flex w-full flex-col gap-y-4">
						<span className="font-mono text-xs tracking-[0.2em] uppercase text-ink/50 border-b border-ink/10 pb-2">Industries</span>
						<div className="grid gap-2">
                            {industryLinks.map((link) => (
                                <ListItem key={link.title} {...link} />
                            ))}
                        </div>
						<span className="font-mono text-xs tracking-[0.2em] uppercase text-ink/50 border-b border-ink/10 pb-2 mt-4">Company</span>
						<div className="grid gap-2">
                            {companyLinks.map((link) => (
                                <ListItem key={link.title} {...link} />
                            ))}
                            {companyLinks2.map((link) => (
                                <ListItem key={link.title} {...link} />
                            ))}
                        </div>
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2 mt-8 pb-8 px-4">
					<Button variant="outline" className="w-full bg-transparent border border-ink/20 text-ink hover:bg-ink/5">
						Sign In
					</Button>
					<Button className="w-full bg-ink text-white hover:bg-ink/90">Get Started</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-white/95 backdrop-blur-lg',
				'fixed top-[60px] right-0 bottom-0 left-0 z-40 flex flex-col border-y border-ink/10 md:hidden overflow-hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:fade-in-0 ease-out',
					'size-full p-6',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-3 hover:bg-ink/5 focus:bg-ink/5 rounded-md p-2 transition-colors', className)} {...props} asChild>
			<Link to={href}>
				<div className="bg-ink/5 flex aspect-square size-10 items-center justify-center rounded-md border border-ink/10">
					<Icon className="text-ink size-4" />
				</div>
				<div className="flex flex-col items-start justify-center gap-1 text-left">
					<span className="font-mono text-sm uppercase tracking-[0.1em] text-ink leading-none">{title}</span>
					{description && <span className="font-mono text-xs text-ink/50 leading-snug">{description}</span>}
				</div>
			</Link>
		</NavigationMenuLink>
	);
}

const industryLinks: LinkItem[] = [
	{
		title: 'Nuclear',
		href: '/industries/nuclear',
		description: 'Compliance for nuclear reactors',
		icon: Zap,
	},
	{
		title: 'Drones',
		href: '/industries/drones',
		description: 'Regulations for autonomous flight',
		icon: Focus,
	},
	{
		title: 'eVTOLs',
		href: '/industries/evtols',
		description: 'Aviation certification standards',
		icon: Plane,
	},
	{
		title: 'Defense',
		href: '/industries/defense',
		description: 'Mil-spec compliance and security',
		icon: Shield,
	},
	{
		title: 'Robotics',
		href: '/industries/robotics',
		description: 'Industrial robotics safety',
		icon: LayersIcon,
	},
	{
		title: 'Automotive',
		href: '/industries/automotive',
		description: 'Self-driving safety protocols',
		icon: CodeIcon,
	},
];

const companyLinks: LinkItem[] = [
	{
		title: 'About Us',
		href: '/about',
		description: 'Learn more about our story',
		icon: Users,
	},
	{
		title: 'Partnerships',
		href: '/partners',
		icon: Handshake,
		description: 'Collaborate with us',
	},
	{
		title: 'Contact',
		href: '/contact',
		description: 'Get in touch with sales',
		icon: HelpCircle,
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: 'Terms of Service',
		href: '#',
		icon: FileText,
	},
	{
		title: 'Privacy Policy',
		href: '#',
		icon: Shield,
	},
	{
		title: 'Blog',
		href: '#',
		icon: Leaf,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	// also check on first load
	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}
