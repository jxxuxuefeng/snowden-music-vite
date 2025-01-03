import { GetMusics, PlayMusic } from '@shared/types';
import { contextBridge, ipcRenderer } from 'electron';

// 如果不是在 BrowserWindow 中启用 contextIsolation，则抛出错误
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow');
}

try {
  // 将 API 暴露给渲染进程 window 对象 (window.context)
  contextBridge.exposeInMainWorld('context', {
    /**
     * 获取音乐列表
     * @param args
     */
    getMusics: (...args: Parameters<GetMusics>) =>
      ipcRenderer.invoke('getMusics', ...args),
    /**
     * 播放音乐
     * @param args
     */
    playMusic: (...args: Parameters<PlayMusic>) =>
      ipcRenderer.invoke('playMusic', ...args),
    /**
     * 导入音乐
     */
    importMusic: () => ipcRenderer.invoke('importMusic'),
  });
} catch (error) {
  console.error(error);
}
