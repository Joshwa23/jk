'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


const formSchema = z
  .object({
    title: z.string().min(2, { message: 'Job title must be at least 2 characters.' }),
    company: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
    location: z.string().min(2, { message: 'Location is required.' }),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
    salaryRange: z.string().min(2, { message: 'Salary range is required.' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  });

type FormValues = Omit<z.infer<typeof formSchema>, 'salaryRange'> & { salaryMin: number; salaryMax: number };

interface CreateJobFormProps {
    onJobCreated: (newJob: any) => Promise<void>;
    isSubmitting: boolean;
}

export function CreateJobForm({ onJobCreated, isSubmitting }: CreateJobFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salaryRange: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // A real implementation would have a more robust way to parse salary.
    const salaryParts = values.salaryRange.replace(/[^0-9-]/g, '').split('-').map(s => parseInt(s, 10) * 1000);
    const salaryMin = salaryParts[0] || 0;
    const salaryMax = salaryParts[1] || salaryMin;
    
    const newJobData = {
        ...values,
        salaryMin,
        salaryMax,
        experienceLevel: 'Mid-level' // Defaulting as it's not in the new form
    };

    await onJobCreated(newJobData);
    toast({
      title: 'Job Posted Successfully!',
      description: `The job opening for ${values.title} has been created.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Full Stack Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amazon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chennai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="salaryRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 12 - 15 LPA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please share a description for the candidate to view..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" disabled={isSubmitting}>
                Save Draft
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
