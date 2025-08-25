'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { ApplyJobForm } from '@/components/apply-job-form';
import type { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ApplyJobDialogProps {
  job: Job;
  children: React.ReactNode;
}

export function ApplyJobDialog({ job, children }: ApplyJobDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleApplicationSubmit = async (values: { name: string; email: string }) => {
    console.log('Application submitted for:', job.title, 'by', values);
    toast({
      title: 'Application Sent!',
      description: `Your application for the ${job.title} position has been submitted.`,
    });
    setIsOpen(false);
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Submit your application to {job.company}. We'll send your information directly to the hiring team.
          </DialogDescription>
        </DialogHeader>
        <ApplyJobForm onSubmit={handleApplicationSubmit} />
      </DialogContent>
    </Dialog>
  );
}
