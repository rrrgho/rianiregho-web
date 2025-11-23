import { Project } from "@/types/project.types";
import { create } from "zustand";

type Action = {
  updateProject: (data: Partial<Project>) => void;
  resetProject: () => void;
};

const initialState: Project = {
  name: "",
  description: "",
  project_link: "",
  tech_stack: "",
  role: "",
  github_link: "",
  image: null,
  project_date: "",
};

export const useProjectStore = create<Project & Action>((set) => ({
  ...initialState,
  updateProject: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  resetProject: () => set(initialState),
}));
