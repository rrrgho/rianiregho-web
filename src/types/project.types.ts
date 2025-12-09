export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url: string;
  project_date: string | null;
  github_link: string | null;
  project_link: string | null;
  tech_stack: string;
  role: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
