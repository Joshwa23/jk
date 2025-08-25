'use client';

import { useState } from 'react';
import { handleExtractSkills } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface SkillExtractorDialogProps {
  jobDescription: string;
  children: React.ReactNode;
}

export function SkillExtractorDialog({ jobDescription, children }: SkillExtractorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onExtractClick = async () => {
    setIsLoading(true);
    setError(null);
    setSkills([]);
    try {
      const result = await handleExtractSkills(jobDescription);
      if (result.skills) {
        setSkills(result.skills);
      } else {
        throw new Error('Failed to extract skills.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state on close
      setIsLoading(false);
      setSkills([]);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI Skill Analyzer</DialogTitle>
          <DialogDescription>
            Analyze the job description to discover the top 3 skills to highlight on your resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Job Description</h4>
            <ScrollArea className="h-48 rounded-md border p-4">
              <p className="text-sm text-muted-foreground">{jobDescription}</p>
            </ScrollArea>
          </div>

          {skills.length > 0 && (
            <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-semibold text-primary flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Top 3 Skills to Highlight
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-base px-3 py-1 bg-accent text-accent-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onExtractClick} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Extract Top 3 Skills'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
