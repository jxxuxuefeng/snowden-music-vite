import { MusicData, MusicInfo } from '@shared/models';
import { create } from 'zustand';

type Store = {
  musics: MusicInfo[];
  setMusics: (musics: MusicInfo[]) => void;
  currentMusic: MusicData | null;
  setCurrentMusic: (currentMusic: MusicData) => void;
};

export const useStore = create<Store>()((set) => ({
  musics: [],
  setMusics: (musics) => set({ musics }),
  currentMusic: null,
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
}));
