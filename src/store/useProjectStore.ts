import { create } from "zustand";

type State = {
  name: string;
};

type Action = {
  updateProjectName: (name: State["name"]) => void;
};

export const useProjectStore = create<State & Action>((set) => ({
  name: "",
  updateProjectName: (name) => set(() => ({ name: name })),
}));
