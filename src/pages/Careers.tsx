import { CareersHero } from "@/components/ui/careers-hero";
import { OpportunityCard, type OpportunityCardProps } from "@/components/ui/card-12";
import { Careers4 } from "@/components/ui/careers-4";
import { CareersForm } from "@/components/ui/careers-form";
import { TestimonialSlider } from "@/components/ui/testimonial-slider-1";

const featuredOpportunities: OpportunityCardProps[] = [
  {
    status: 'High Priority',
    postedBy: {
      name: 'Aditi Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      company: 'InVariant Global',
      location: 'Dehradun, IN',
    },
    salaryRange: {
      min: 15000,
      max: 25000,
    },
    deadline: '15 Mar - 2026',
    matchPercentage: 94,
    rating: 4.8,
    tags: ['Clinical Research'],
    description: 'Lead clinical trials for our new cardiovascular formulations. Requires USFDA compliance expertise.',
    recruiter: {
      name: 'Vikram Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      company: 'HR Dept',
      location: 'Corporate HQ',
    },
    onAccept: () => console.log('Accepted Scientist role'),
    onDecline: () => console.log('Declined'),
  },
  {
    status: 'Flexible',
    postedBy: {
      name: 'Dr. Sarah Woods',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      company: 'PharmaTech Solutions',
      location: 'Remote',
    },
    salaryRange: {
      min: 12000,
      max: 18000,
    },
    deadline: '02 Apr - 2026',
    matchPercentage: 88,
    rating: 4.9,
    tags: ['Quality Control'],
    description: 'Oversee quality assurance for sterile injectable production facilities. WHO-GMP experience preferred.',
    recruiter: {
      name: 'James L.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      company: 'External Talent',
      location: 'London',
    },
    onAccept: () => console.log('Accepted QA role'),
    onDecline: () => console.log('Declined'),
  }
];

const jobsData = [
    {
      category: "Medical Representatives",
      openings: [
        {
          title: "Senior Medical Representative (Ortho)",
          location: "Delhi NCR",
          url: "#",
        },
        {
          title: "Medical Representative (Gynecology)",
          location: "Mumbai",
          url: "#",
        },
        {
          title: "Zonal Sales Manager",
          location: "Bangalore",
          url: "#",
        },
      ],
    },
    {
      category: "Operations & Logistics",
      openings: [
        {
          title: "Supply Chain Coordinator",
          location: "Dehradun",
          url: "#",
        },
        {
          title: "Warehouse Manager",
          location: "Ahmedabad",
          url: "#",
        },
      ],
    },
    {
        category: "Corporate",
        openings: [
          {
            title: "HR Generalist",
            location: "Dehradun",
            url: "#",
          },
          {
            title: "Financial Analyst",
            location: "Remote",
            url: "#",
          },
        ],
      },
  ];

const staffReviews = [
    {
      id: 1,
      name: "Rahul Verma",
      affiliation: "Senior Analyst",
      quote: "The growth opportunities at InVariant are immense. I joined as a junior and within two years, I was leading my own regional team.",
      imageSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      thumbnailSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80",
    },
    {
      id: 2,
      name: "Sneha Kapoor",
      affiliation: "Product Manager",
      quote: "Working on life-saving medications gives my work a sense of purpose that I never found in pure tech. The culture here is truly patient-first.",
      imageSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
      thumbnailSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80",
    }
  ];

export function Careers() {
  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen">
      {/* Hero Section */}
      <CareersHero />

      {/* Featured Roles Check */}
      <section className="py-12 bg-transparent relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-12">
                <span className="h-px w-8 bg-emerald-500" />
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">Pinned Opportunities</h2>
            </div>
            
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                {featuredOpportunities.map((op, idx) => (
                    <OpportunityCard key={idx} {...op} />
                ))}
            </div>
        </div>
      </section>

      {/* Main Careers Content: Grid Layout */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left: Job Openings */}
            <div className="w-full lg:w-1/2">
              <Careers4 heading="Explore All Vacancies" jobs={jobsData} />
            </div>

            {/* Right: Application Form */}
            <div className="w-full lg:w-1/2">
              <CareersForm />
            </div>
          </div>
        </div>
      </section>

      {/* Staff Testimonials */}
      <div className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-12">
            <h2 className="text-3xl font-bold text-white">Life at InVariant</h2>
            <p className="text-gray-500 mt-2">Hear it from the people who make it happen.</p>
        </div>
        <TestimonialSlider reviews={staffReviews} />
      </div>

      {/* Decorative footer spacer */}
      <div className="h-24 bg-gradient-to-t from-[#0a0a0a] to-black" />
    </div>
  );
}
