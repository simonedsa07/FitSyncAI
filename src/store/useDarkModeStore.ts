import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeState {
  dark: boolean;
  toggle: () => void;
  setDark: (val: boolean) => void;
}

function applyDarkClass(dark: boolean) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', dark);
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark;
        applyDarkClass(next);
        set({ dark: next });
      },
      setDark: (val) => {
        applyDarkClass(val);
        set({ dark: val });
      },
    }),
    {
      name: 'fitsync-dark-mode',
      onRehydrateStorage: () => (state) => {
        if (state) applyDarkClass(state.dark);
      },
    }
  )
);