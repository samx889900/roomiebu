import { create } from "zustand";

interface FilterState {
  accommodationType: string;
  gender: string;
  smoking: string;
  drinking: string;
  sleepSchedule: string;
  course: string;
  year: string;
  minBudget: string;
  maxBudget: string;
  location: string;
  currentStatus: string;
  sortBy: string;
  search: string;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  accommodationType: "",
  gender: "",
  smoking: "",
  drinking: "",
  sleepSchedule: "",
  course: "",
  year: "",
  minBudget: "",
  maxBudget: "",
  location: "",
  currentStatus: "",
  sortBy: "newest",
  search: "",
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set(defaultFilters),
}));
