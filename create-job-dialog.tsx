'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateJobForm } from '@/components/create-job-form';
import type { Job } from '@/lib/types';


interface CreateJobDialogProps {
    onAddJob: (newJob: Omit<Job, 'id' | 'deadline' | 'applyUrl' | 'logoUrl' | 'skills'>) => Promise<boolean>;
    isSubmitting: boolean;
    children: React.ReactNode;
}

export function CreateJobDialog({ onAddJob, isSubmitting, children }: CreateJobDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleJobCreated = async (newJob: Omit<Job, 'id' | 'deadline' | 'applyUrl' | 'logoUrl' | 'skills'>) => {
    const success = await onAddJob(newJob);
    if (success) {
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">Create Job Opening</DialogTitle>
        </DialogHeader>
        <div className="py-4">
            <CreateJobForm onJobCreated={handleJobCreated} isSubmitting={isSubmitting}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
