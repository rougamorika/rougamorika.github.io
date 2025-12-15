import { create } from 'zustand';

interface UIStore {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isSettingsPanelOpen: boolean;
  currentBanner: string | null;

  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSettingsPanel: () => void;
  setLeftSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;
  setCurrentBanner: (banner: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  isMobileMenuOpen: false,
  isSettingsPanelOpen: false,
  currentBanner: null,

  toggleLeftSidebar: () => set((state) => ({
    isLeftSidebarOpen: !state.isLeftSidebarOpen
  })),

  toggleRightSidebar: () => set((state) => ({
    isRightSidebarOpen: !state.isRightSidebarOpen
  })),

  toggleMobileMenu: () => set((state) => ({
    isMobileMenuOpen: !state.isMobileMenuOpen
  })),

  toggleSettingsPanel: () => set((state) => ({
    isSettingsPanelOpen: !state.isSettingsPanelOpen
  })),

  setLeftSidebarOpen: (open) => set({ isLeftSidebarOpen: open }),
  setRightSidebarOpen: (open) => set({ isRightSidebarOpen: open }),
  setCurrentBanner: (banner) => set({ currentBanner: banner }),
}));
