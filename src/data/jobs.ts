export type JobTeam = "Engineering" | "Design" | "Product" | "Operations" | "Sales";
export type JobType = "Full-time" | "Contract" | "Internship";

export type Job = {
  slug: string;
  title: string;
  team: JobTeam;
  location: string;
  type: JobType;
  level: string;
  summary: string;
};

export const jobs: Job[] = [
  { slug: "senior-fullstack-engineer", title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote / Jakarta", type: "Full-time", level: "Senior", summary: "Lead the build of customer-facing features across our SaaS suite using TypeScript, React and Node." },
  { slug: "mobile-engineer", title: "Mobile Engineer (React Native)", team: "Engineering", location: "Remote / Jakarta", type: "Full-time", level: "Mid", summary: "Ship beautiful, performant native experiences for our flagship mobile apps used by thousands daily." },
  { slug: "platform-devops-engineer", title: "Platform / DevOps Engineer", team: "Engineering", location: "Remote", type: "Full-time", level: "Senior", summary: "Own our cloud infrastructure on AWS — CI/CD, observability, security and developer experience." },
  { slug: "engineering-intern", title: "Engineering Intern", team: "Engineering", location: "Jakarta", type: "Internship", level: "Junior", summary: "Six months of structured learning, real product work and a clear path to a full-time offer." },
  { slug: "product-designer", title: "Product Designer", team: "Design", location: "Remote / Singapore", type: "Full-time", level: "Mid", summary: "Design end-to-end experiences across our SaaS apps — from research to high-fidelity flows." },
  { slug: "brand-marketing-designer", title: "Brand & Marketing Designer", team: "Design", location: "Remote", type: "Full-time", level: "Mid", summary: "Shape the Zanscode brand across web, ads, social and product launches." },
  { slug: "senior-pm-saas", title: "Senior Product Manager — SaaS", team: "Product", location: "Remote / Jakarta", type: "Full-time", level: "Senior", summary: "Own the roadmap of a flagship SaaS product, from discovery to launch and growth." },
  { slug: "customer-success-manager", title: "Customer Success Manager", team: "Operations", location: "Jakarta", type: "Full-time", level: "Mid", summary: "Drive adoption and retention with our enterprise customers across SEA." },
  { slug: "implementation-consultant", title: "Implementation Consultant", team: "Operations", location: "Remote (APAC)", type: "Contract", level: "Mid", summary: "Lead onboarding and migrations for new customers — discovery, configuration, training, go-live." },
  { slug: "enterprise-ae", title: "Enterprise Account Executive", team: "Sales", location: "Singapore", type: "Full-time", level: "Senior", summary: "Build relationships and close deals with enterprise accounts across APAC." },
];

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}

export const teams: ("All" | JobTeam)[] = ["All", "Engineering", "Design", "Product", "Operations", "Sales"];
