export type Project = {
  uid?: string;
  name: string;
  description: string;
  project_link: string;
  tech_stack: string;
  role: string;
  github_link: string;
  image: string | File | null;
  project_date: string;
  created_at?: string;
  updated_at?: string;
};
