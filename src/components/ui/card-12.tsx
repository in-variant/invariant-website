import * as React from 'react';
import { Mail, CalendarDays, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define the types for the props for strong typing and reusability
interface UserProfile {
  name: string;
  avatarUrl: string;
  company: string;
  location: string;
}

export interface OpportunityCardProps {
  status: string;
  postedBy: UserProfile;
  salaryRange: {
    min: number;
    max: number;
  };
  deadline: string;
  matchPercentage: number;
  rating: number;
  tags: string[];
  description: string;
  recruiter: UserProfile;
  onAccept: () => void;
  onDecline: () => void;
  className?: string;
}

const OpportunityCard = React.forwardRef<HTMLDivElement, OpportunityCardProps>(
  (
    {
      status,
      postedBy,
      salaryRange,
      deadline,
      matchPercentage,
      rating,
      tags,
      description,
      recruiter,
      onAccept,
      onDecline,
      className,
    },
    ref
  ) => {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
    
    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } as any },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-card-foreground shadow-sm font-sans',
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold text-lg text-white">New Opportunity</h2>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">{status}</Badge>
        </div>

        <hr className="my-4 border-white/5" />

        {/* Main Job Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={postedBy.avatarUrl} alt={postedBy.name} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-medium text-white">{postedBy.name}</p>
              <p className="text-sm text-gray-500">
                {postedBy.company} &bull; {postedBy.location}
              </p>
            </div>
          </div>

          <h3 className="text-3xl font-bold tracking-tight text-white">
            {formatCurrency(salaryRange.min)} - {formatCurrency(salaryRange.max)}
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-emerald-500">{matchPercentage}% Match</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-current" />
              {rating}
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-zinc-800 text-gray-300 hover:bg-zinc-700">{tag}</Badge>
            ))}
             <Badge variant="secondary" className="bg-emerald-950 text-emerald-400 border border-emerald-500/20">
              Responsive
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-gray-400">{description}</p>
        </div>

        {/* Recruiter Info */}
        <div className="mt-6 flex items-center gap-3">
          <img src={recruiter.avatarUrl} alt={recruiter.name} className="h-8 w-8 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-white">{recruiter.name}</p>
            <p className="text-xs text-gray-500">
              {recruiter.company} &bull; {recruiter.location}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button onClick={onAccept} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" size="lg">Accept Project</Button>
          <Button onClick={onDecline} variant="outline" className="w-full border-white/10 text-gray-300" size="lg">Decline Offer</Button>
        </div>
      </motion.div>
    );
  }
);

OpportunityCard.displayName = 'OpportunityCard';

export { OpportunityCard };
