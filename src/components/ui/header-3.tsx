'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import type { LucideIcon } from 'lucide-react';
import {
	Users,
	UserPlusIcon,
	FileText,
	Shield,
	Leaf,
	HeartPulse,
	Pill,
	Stethoscope,
	Activity,
	Baby,
	BriefcaseMedical,
	MapPin
} from 'lucide-react';

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
		<div className={cn("fixed z-50 w-full flex justify-center px-4 transition-all duration-300 pointer-events-none", scrolled ? "top-2" : "top-6")}>
		<header
			className={cn('pointer-events-auto w-full max-w-5xl rounded-2xl border border-transparent transition-all duration-300 text-white', {
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg shadow-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<Link to="/" className="hover:bg-accent rounded-md p-2 flex items-center gap-2 font-bold text-xl text-white">
            <Activity className="h-5 w-5 text-white" />
						InVariant
					</Link>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-white hover:bg-accent data-[state=open]:bg-accent data-[active]:bg-accent">Company</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5 border-border">
									<div className="grid w-[400px] grid-cols-2 gap-2">
										<ul className="bg-popover space-y-2 rounded-md border border-border p-2 shadow">
											{companyLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="space-y-2 p-3">
											{companyLinks2.map((item, i) => (
												<li key={i}>
													<Link
														to={item.href}
														className="flex p-2 hover:bg-accent hover:text-white flex-row rounded-md items-center gap-x-2 text-white transition-colors"
													>
														<item.icon className="size-4 text-white" />
														<span className="font-medium text-white">{item.title}</span>
													</Link>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-white hover:bg-accent data-[state=open]:bg-accent data-[active]:bg-accent">Industries</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-background p-1 pr-1.5 border-border">
									<ul className="bg-popover grid w-[450px] grid-cols-2 gap-2 rounded-md border border-border p-2 shadow">
										{industryLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
									<div className="p-2">
										<p className="text-white text-sm">
											Discover how Invariant accelerates operations.{' '}
											<Link to="/industries/nuclear" className="text-white font-bold hover:underline">
												Read Core Use Case
											</Link>
										</p>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuLink className="px-4" asChild>
								<Link to="/contact" className="hover:bg-accent text-white font-medium rounded-md p-2 transition-colors">
									Contact Us
								</Link>
							</NavigationMenuLink>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button variant="outline" className="text-white border-white/20 bg-transparent hover:bg-accent hover:text-white">Sign In</Button>
					<Button className="bg-white text-black hover:bg-gray-200">Enquire Now</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden border-white/20 text-white bg-transparent hover:bg-accent hover:text-white"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5 text-white" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2 mt-2">
						<span className="text-sm font-bold px-2 text-white">Company</span>
						{companyLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						{companyLinks2.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						<div className="h-px bg-border my-2 w-full" />
						<span className="text-sm font-bold px-2 text-white">Industries</span>
						{industryLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2 pb-6">
					<Button variant="outline" className="w-full bg-transparent text-white border-border hover:bg-accent">
						Sign In
					</Button>
					<Button className="w-full bg-white text-black hover:bg-gray-200">Enquire Now</Button>
				</div>
			</MobileMenu>
		</header>
		</div>
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
				'bg-background/95 supports-[backdrop-filter]:bg-background/95 backdrop-blur-xl',
				'fixed top-[72px] right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t border-border md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
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
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white rounded-sm p-2 transition-colors', className)} {...props} asChild>
			<Link to={href}>
				<div className="bg-background/40 flex aspect-square size-10 md:size-12 items-center justify-center rounded-md border border-border shadow-sm shrink-0">
					<Icon className="text-white size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-medium text-white text-sm md:text-base">{title}</span>
					<span className="text-white/80 text-xs hidden sm:block line-clamp-1">{description}</span>
				</div>
			</Link>
		</NavigationMenuLink>
	);
}

const companyLinks: LinkItem[] = [
	{
		title: 'About Us',
		href: '/about-us',
		description: 'Learn more about our vision and story',
		icon: Users,
	},
	{
		title: 'Our Team',
		href: '/our-team',
		description: 'The professionals behind InVariant',
		icon: UserPlusIcon,
	},
	{
		title: 'Our Presence',
		href: '/our-presence',
		icon: MapPin,
		description: 'Global reach and worldwide operations',
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: 'Company Culture',
		href: '/culture',
		icon: HeartPulse,
	},
	{
		title: 'Careers',
		href: '/careers',
		icon: BriefcaseMedical,
	},
	{
		title: 'Our Journey',
		href: '/journey',
		icon: Shield,
	},
	{
		title: 'Announcements',
		href: '/announcements',
		icon: FileText,
	}
];

const industryLinks: LinkItem[] = [
	{
		title: 'Nuclear',
		href: '/industries/nuclear',
		description: 'Licensing for safe energy systems',
		icon: Activity,
	},
	{
		title: 'Drones',
		href: '/industries/drones',
		description: 'Regulatory compliance for autonomous flight',
		icon: Pill,
	},
	{
		title: 'Energy Tech',
		href: '/industries/energy',
		description: 'Certifications for renewable sources',
		icon: Leaf,
	},
	{
		title: 'Industrial',
		href: '/industries/industrial',
		description: 'Optimizing plant operations and safety',
		icon: Baby,
	},
	{
		title: 'Medical Devices',
		href: '/industries/medical',
		description: 'Fast-tracking medical regulatory approvals',
		icon: Stethoscope,
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

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}
