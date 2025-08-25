'use client';

import type { Job } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, IndianRupee, Lightbulb } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SkillExtractorDialog } from './skill-extractor-dialog';
import { ApplyJobDialog } from './apply-job-dialog';

interface JobCardProps {
  job: Job;
}

function getTimeAgo(date: Date) {
  return `${formatDistanceToNow(date)} ago`;
}

export function JobCard({ job }: JobCardProps) {

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
       <CardHeader className="flex-row items-center gap-4 p-5">
        <Image
          src={job.logoUrl}
          alt={`${job.company} logo`}
          width={48}
          height={48}
          className="rounded-lg"
          data-ai-hint="logo"
        />
        <div>
          <CardTitle className="text-lg font-semibold leading-tight text-foreground">{job.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
           <Badge variant="secondary">{job.type}</Badge>
           <Badge variant="secondary">{job.experienceLevel}</Badge>
           <Badge variant="secondary">{job.location}</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>

         <div className="flex flex-col gap-2 text-sm text-muted-foreground">
           <div className="flex items-center gap-1.5">
             <IndianRupee className="w-4 h-4" />
             <span>{`$${(job.salaryMin / 1000)}k - $${(job.salaryMax / 1000)}k`}</span>
           </div>
           <div className="flex items-center gap-1.5">
             <span className="text-xs text-blue-500">
                Posted {getTimeAgo(job.deadline)}
             </span>
           </div>
         </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {job.skills.map((skill, index) => (
             <Badge key={index} variant="outline" className="font-mono text-xs">
              {skill}
            </Badge>
          ))}
        </div>

      </CardContent>
      <CardFooter className="p-4 grid grid-cols-2 gap-2">
        <SkillExtractorDialog jobDescription={job.description}>
          <Button variant="secondary" className="w-full">
            <Lightbulb className="mr-2" />
            Analyze
          </Button>
        </SkillExtractorDialog>
        <ApplyJobDialog job={job}>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Apply Now
            </Button>
        </ApplyJobDialog>
      </CardFooter>
    </Card>
  );
}
