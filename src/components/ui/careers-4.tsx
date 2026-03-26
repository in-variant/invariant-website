import { Button } from "@/components/ui/button";

interface JobOpening {
  title: string;
  location: string;
  url: string;
}

interface JobCategory {
  category: string;
  openings: JobOpening[];
}

interface Careers4Props {
  heading?: string;
  jobs?: JobCategory[];
}

export const Careers4 = ({
  heading = "Job Openings",
  jobs = [
    {
      category: "Engineering",
      openings: [
        {
          title: "Senior Frontend Developer",
          location: "Remote",
          url: "#",
        },
        {
          title: "UI/UX Designer",
          location: "San Francisco",
          url: "#",
        },
        {
          title: "React Developer",
          location: "Remote",
          url: "#",
        },
        {
          title: "Technical Lead",
          location: "London",
          url: "#",
        },
      ],
    },
    {
      category: "Design",
      openings: [
        {
          title: "Product Designer",
          location: "Remote",
          url: "#",
        },
        {
          title: "Visual Designer",
          location: "Berlin",
          url: "#",
        },
      ],
    },
  ],
}: Careers4Props) => {
  return (
    <div className="w-full">
      <div className="text-center md:text-left mb-12">
        <h2 className="text-3xl font-bold md:text-4xl text-white">
          {heading}
        </h2>
        <p className="text-gray-400 mt-4">
          Join a team that's building the future of pharmaceutical logistics and healthcare solutions.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {jobs.map((jobCategory) => (
          <div key={jobCategory.category} className="grid">
            <h3 className="border-b border-white/10 pb-4 text-xl font-bold text-emerald-400">
              {jobCategory.category}
            </h3>
            {jobCategory.openings.map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between border-b border-white/5 py-4 group hover:bg-white/5 px-4 transition-colors rounded-lg"
              >
                <a href={job.url} className="text-base font-semibold text-white hover:text-emerald-400 transition-colors">
                  {job.title}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className="pointer-events-none rounded-full border-white/10 text-gray-400 text-xs"
                >
                  {job.location}
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
