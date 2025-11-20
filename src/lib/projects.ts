import PostImage1 from "@/assets/images/post1.jpg";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  role: string;
  image: any;
  github?: string;
  liveUrl?: string;
}

// Project data - replace with API call
const projectsData: Record<string, Project> = {
  telkomsel: {
    id: "telkomsel",
    title: "Telkomsel Mobile App",
    description: "A comprehensive mobile application for Telkomsel customers",
    longDescription:
      "This project involved building a complete mobile application for Telkomsel, one of Indonesia's largest telecommunications companies. The app provides customers with easy access to their billing information, data usage tracking, and package management.",
    technologies: ["React Native", "TypeScript", "Redux", "Firebase"],
    startDate: "January 2022",
    endDate: "June 2022",
    role: "Senior Frontend Developer",
    image: PostImage1,
    github: "https://github.com/example/telkomsel",
    liveUrl: "https://telkomsel.example.com",
  },
  detikcom: {
    id: "detikcom",
    title: "Detikcom News Portal",
    description: "Modern news portal with real-time updates",
    longDescription:
      "Redesigned and rebuilt the Detikcom news portal with modern technologies and improved user experience. The platform handles millions of daily visitors with high performance and reliability.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "GraphQL"],
    startDate: "July 2022",
    endDate: "December 2022",
    role: "Full Stack Developer",
    image: PostImage1,
    github: "https://github.com/example/detikcom",
    liveUrl: "https://detikcom.example.com",
  },
};

/**
 * Fetch a single project by ID
 * Replace this with your actual API call in the future
 */
export async function getProject(id: string): Promise<Project | null> {
  // Simulate server-side delay
  // In production, replace this with: const response = await fetch(`${process.env.API_URL}/projects/${id}`);
  console.log("ID: ", id);
  return projectsData[id] || null;
}

/**
 * Fetch all projects
 * Replace this with your actual API call in the future
 */
export async function getAllProjects(): Promise<Project[]> {
  // In production, replace this with: const response = await fetch(`${process.env.API_URL}/projects`);

  return Object.values(projectsData);
}
