"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { CreateJobDialog } from "@/components/create-job-dialog";
import type { Job } from "@/lib/types";
import { useState } from "react";
import { handleExtractSkills } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/find-talents", label: "Find Talents" },
  { href: "/about-us", label: "About us" },
  { href: "/testimonials", label: "Testimonials" },
];

export function Header() {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  // This state and handler would ideally be lifted to a parent component managing job state.
  // For simplicity, it's kept here to demonstrate dialog functionality.
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleAddJob = async (newJobData: Omit<Job, 'id' | 'deadline' | 'applyUrl' | 'logoUrl' | 'skills'>): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { skills } = await handleExtractSkills(newJobData.description);
      const newJob: Job = {
        ...newJobData,
        id: (jobs.length + 1).toString(),
        deadline: new Date(),
        applyUrl: '#',
        logoUrl: `https://placehold.co/100x100.png?text=${newJobData.company.charAt(0)}`,
        skills: skills,
      };
      // In a real app, this would update a shared state (e.g., via Context or Zustand)
      console.log('New job created:', newJob);
      setJobs(prevJobs => [newJob, ...prevJobs]);
      toast({
        title: 'Job Posted Successfully!',
        description: `The job opening for ${newJob.title} has been created.`,
      });
      return true;
    } catch (error) {
      console.error('Failed to create job', error);
      toast({
        variant: 'destructive',
        title: 'Error Creating Job',
        description: 'There was an issue analyzing the job description. Please try again.',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent py-4">
      <div className="container mx-auto flex h-16 items-center justify-between rounded-full bg-card px-6 shadow-lg">
        <Link href="/" className="flex items-center gap-2 mr-6">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
            >
                <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00AEEF" />
                        <stop offset="100%" stopColor="#90CAF9" />
                    </linearGradient>
                </defs>
                <path
                    d="M16 2.66699L28 9.33366V22.667L16 29.3337L4 22.667V9.33366L16 2.66699Z"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M28 9.33366L16 16.0003L4 9.33366"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 29.3337V16.0003"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
          <span className="hidden font-bold sm:inline-block text-foreground">JobSearch</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <NavLinks />
        </div>

        <div className="flex items-center gap-4">
          <CreateJobDialog onAddJob={handleAddJob} isSubmitting={isSubmitting}>
             <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                Create Jobs
            </Button>
          </CreateJobDialog>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <NavLinks className="flex-col items-start space-y-4 pt-6" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
