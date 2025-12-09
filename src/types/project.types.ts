export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image?: any;
  image_path?: string;
  project_date: string | any;
  github_link: string | null;
  project_link: string | null;
  tech_stack: string;
  role: string | null;
  created_at: string | any;
  updated_at: string | any;
  deleted_at: string | null;
};
