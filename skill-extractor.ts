'use server';

/**
 * @fileOverview Skill Extractor AI agent.
 *
 * - extractSkills - A function that handles the skill extraction process.
 * - SkillExtractorInput - The input type for the extractSkills function.
 * - SkillExtractorOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillExtractorInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job.'),
});
export type SkillExtractorInput = z.infer<typeof SkillExtractorInputSchema>;

const SkillExtractorOutputSchema = z.object({
  skills: z.array(z.string()).length(3).describe('The top 3 skills to highlight in the resume.'),
});
export type SkillExtractorOutput = z.infer<typeof SkillExtractorOutputSchema>;

export async function extractSkills(input: SkillExtractorInput): Promise<SkillExtractorOutput> {
  return skillExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillExtractorPrompt',
  input: {schema: SkillExtractorInputSchema},
  output: {schema: SkillExtractorOutputSchema},
  prompt: `You are an expert career coach specializing in resume writing.

You will analyze the job description and extract the top 3 skills that the applicant should highlight in their resume to increase their chances of getting an interview. Return the skills as a numbered list.

Job Description: {{{jobDescription}}}`,
});

const skillExtractorFlow = ai.defineFlow(
  {
    name: 'skillExtractorFlow',
    inputSchema: SkillExtractorInputSchema,
    outputSchema: SkillExtractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
