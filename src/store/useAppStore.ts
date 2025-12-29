import { create } from "zustand";
import { persist } from "zustand/middleware";

import { guData } from "@/data/gudata";
import { Recommendation } from "@/types/recommandation";


interface AppState {
  selectedGu: (typeof guData)[number] | null;
  hoveredGu: string | null;
  search: string;
  isSidebarOpen: boolean;
  selectedItem: Recommendation | null;

  setSelectedGu: (gu: (typeof guData)[number] | null) => void;
  setHoveredGu: (gu: string | null) => void;
  setSearch: (value: string) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setSelectedItem: (item: Recommendation | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedGu: null,
      hoveredGu: null,
      search: "",
      isSidebarOpen: false,
      selectedItem: null,

      setSelectedGu: (gu) => set({ selectedGu: gu }),
      setHoveredGu: (gu) => set({ hoveredGu: gu }),
      setSearch: (value) => set({ search: value }),
      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSelectedItem: (item) => set({ selectedItem: item }),
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        selectedGu: state.selectedGu,
        selectedItem: state.selectedItem,
      }),
    }
  )
);
