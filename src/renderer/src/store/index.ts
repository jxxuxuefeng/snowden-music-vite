import { MusicData, MusicInfo } from '@shared/models';
import { create } from 'zustand';

type Store = {
  /**
   * 音乐列表
   */
  musics: MusicInfo[];
  /**
   * 设置音乐列表
   */
  setMusics: (musics: MusicInfo[]) => void;
  /**
   * 当前播放的音乐
   */
  currentMusic: MusicData | null;
  /**
   * 设置当前播放的音乐
   */
  setCurrentMusic: (currentMusic: MusicData) => void;
  /**
   * 当前播放的音乐索引
   */
  currentIndex: number;
  /**
   * 设置当前播放的音乐索引
   */
  setCurrentIndex: (currentIndex: number) => void;
};

export const useStore = create<Store>()((set) => ({
  musics: [],
  setMusics: (musics) => set({ musics }),
  currentMusic: null,
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
  currentIndex: 0,
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
}));
