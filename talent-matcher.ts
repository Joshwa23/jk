'use server';

/**
 * @fileOverview Talent Matching AI agent.
 *
 * - findTalent - A function that finds the best candidate for a job description.
 * - TalentMatcherInput - The input type for the findTalent function.
 * - TalentMatcherOutput - The return type for the findTalent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { candidates } from '@/lib/data';
import type { Candidate } from '@/lib/types';

const TalentMatcherInputSchema = z.object({
  jobDescription: z.string().describe('The job description to match against.'),
});
export type TalentMatcherInput = z.infer<typeof TalentMatcherInputSchema>;


const CandidateSchema = z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    imageUrl: z.string(),
    skills: z.array(z.string()),
    summary: z.string(),
});

const TalentMatcherOutputSchema = z.object({
  candidate: CandidateSchema.describe('The best matching candidate.'),
});
export type TalentMatcherOutput = z.infer<typeof TalentMatcherOutputSchema>;


// This tool allows the AI to get the list of available candidates.
const getAvailableCandidatesTool = ai.defineTool(
    {
        name: 'getAvailableCandidates',
        description: 'Get the list of all available candidates to choose from.',
        inputSchema: z.object({}),
        outputSchema: z.object({ candidates: z.array(CandidateSchema) }),
    },
    async () => {
        return { candidates };
    }
);


export async function findTalent(input: TalentMatcherInput): Promise<TalentMatcherOutput> {
  return talentMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'talentMatcherPrompt',
  input: { schema: TalentMatcherInputSchema },
  output: { schema: TalentMatcherOutputSchema },
  tools: [getAvailableCandidatesTool],
  prompt: `You are an expert recruiter. Your task is to find the best candidate for a given job description.

You have access to a list of available candidates. You must use the 'getAvailableCandidates' tool to see the available candidates.

Analyze the provided job description and select the single best candidate from the list whose skills and experience are the most relevant to the role.

Return the full profile of the matched candidate.

Job Description: {{{jobDescription}}}`,
});

const talentMatcherFlow = ai.defineFlow(
  {
    name: 'talentMatcherFlow',
    inputSchema: TalentMatcherInputSchema,
    outputSchema: TalentMatcherOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
