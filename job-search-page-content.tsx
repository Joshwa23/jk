'use client';

import type { Job } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobCard } from '@/components/job-card';
import { Search, MapPin, Briefcase, Wallet } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { handleExtractSkills } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


interface JobSearchPageContentProps {
  initialJobs: Job[];
}

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

export function JobSearchPageContent({ initialJobs }: JobSearchPageContentProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [salaryRange, setSalaryRange] = useState([0, 250000]);


  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = location === '' || job.location.toLowerCase().includes(location.toLowerCase());
      const matchesJobType = jobType === 'All' || job.type === jobType;
      const matchesSalary = job.salaryMin >= salaryRange[0] && job.salaryMax <= salaryRange[1];
      return matchesSearchTerm && matchesLocation && matchesJobType && matchesSalary;
    });
  }, [jobs, searchTerm, location, jobType, salaryRange]);

  return (
    <>
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by Job title, Role"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Preferred location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
             <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <Button className="w-full lg:col-span-1" variant="outline">Search</Button>
          </div>
           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <span className="pl-10 text-sm font-medium text-muted-foreground">Salary Per Month</span>
              </div>
              <div className="flex items-center gap-4">
                  <Slider
                      value={[salaryRange[0]]}
                      max={250000}
                      step={1000}
                      onValueChange={(value) => setSalaryRange([value[0], salaryRange[1]])}
                  />
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      ${(salaryRange[0]/1000)}k - ${(salaryRange[1]/1000)}k
                  </span>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="col-span-full py-24 text-center text-muted-foreground">
              No jobs found. Try adjusting your search filters.
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
