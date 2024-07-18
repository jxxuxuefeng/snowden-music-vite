import { create } from 'zustand';
import { MusicInfo } from '@shared/models';

type Store = {
  musics: MusicInfo[];
  setMusics: (musics: MusicInfo[]) => void;
  currentMusic: MusicInfo | null;
  setCurrentMusic: (currentMusic: MusicInfo) => void;
};

export const useStore = create<Store>()((set) => ({
  musics: [],
  setMusics: (musics) => set({ musics }),
  currentMusic: null,
  setCurrentMusic: (currentMusic) => set({ currentMusic })
}));
