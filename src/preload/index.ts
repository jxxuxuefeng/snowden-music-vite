// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { GetMusics, PlayMusic } from '@shared/types';

contextBridge.exposeInMainWorld('context', {
  // selectMusicFile: () => ipcRenderer.invoke('select-music-file')
  getMusics: (...args: Parameters<GetMusics>) => ipcRenderer.invoke('getMusics', ...args),
  playMusic: (...args: Parameters<PlayMusic>) => ipcRenderer.invoke('playMusic', ...args),
  importMusic: () => ipcRenderer.invoke('importMusic')
});
