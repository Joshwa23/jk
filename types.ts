export type Job = {
  id: string;
  title: string;
  company: string;
  logoUrl: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid-level' | 'Senior';
  salaryMin: number;
  salaryMax: number;
  description: string;
  applyUrl: string;
  deadline: Date;
  skills: string[];
};

export type Candidate = {
    id: string;
    name: string;
    title: string;
    imageUrl: string;
    skills: string[];
    summary: string;
};
