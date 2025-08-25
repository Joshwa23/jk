'use server';

import { extractSkills } from '@/ai/flows/skill-extractor';
import { findTalent } from '@/ai/flows/talent-matcher';

export async function handleExtractSkills(jobDescription: string) {
  try {
    const result = await extractSkills({ jobDescription });
    return { skills: result.skills };
  } catch (error) {
    console.error('Error extracting skills:', error);
    throw new Error('Failed to analyze skills. Please try again later.');
  }
}

export async function handleFindTalent(jobDescription: string) {
    try {
        const result = await findTalent({ jobDescription });
        return { candidate: result.candidate };
    } catch (error) {
        console.error('Error finding talent:', error);
        throw new Error('Failed to find a matching candidate. Please try again later.');
    }
}
