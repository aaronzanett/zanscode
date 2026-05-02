// Public-facing job data — now derived from the central store so HR's
// internal recruitment hub is the single source of truth for /careers
// and the public apply pages.

import { getStoreSnapshot, type JobPosting, type JobTeam, type JobType } from "@/lib/store";

export type { JobTeam, JobType };

export type Job = {
  slug: string;
  title: string;
  team: JobTeam;
  location: string;
  type: JobType;
  level: string;
  summary: string;
};

function toPublic(j: JobPosting): Job {
  return {
    slug: j.slug,
    title: j.title,
    team: j.team,
    location: j.location,
    type: j.type,
    level: j.level,
    summary: j.summary,
  };
}

/** All published job postings, in newest-first order. */
export function getPublishedJobs(): Job[] {
  return getStoreSnapshot()
    .jobs.filter((j) => j.status === "published")
    .sort((a, b) => b.postedAt - a.postedAt)
    .map(toPublic);
}

export function getJobBySlug(slug: string): Job | undefined {
  const j = getStoreSnapshot().jobs.find((j) => j.slug === slug && j.status === "published");
  return j ? toPublic(j) : undefined;
}

export const teams: ("All" | JobTeam)[] = ["All", "Engineering", "Design", "Product", "Operations", "Sales", "HR", "Finance"];
