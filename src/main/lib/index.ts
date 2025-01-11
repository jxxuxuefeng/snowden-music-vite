import { musicDirectoryName, musicFileExtensions } from '@shared/constants';
import { MusicInfo } from '@shared/models';
import { GetMusics } from '@shared/types';
import { formatTime } from '@shared/utils';
import dayjs from 'dayjs';
import { dialog } from 'electron';
import { copyFile, readdir, readFile, stat } from 'fs-extra';
import { parseFile } from 'music-metadata';
import * as path from 'node:path';
import { homedir } from 'os';
import { generateUUID, getFileExtension } from 'roodash';
import { deleteMusicById, getAllMusics, insertMusic } from './db';

// 获取音乐文件根目录
export function getRootDir() {
  return `${homedir()}/${musicDirectoryName}`;
}

/**
 * 解析音乐文件
 * @param filteredFiles 过滤后的文件列表
 * @param rootDir 音乐文件根目录
 */
async function processFiles(filteredFiles: string[], rootDir: string) {
  const list = [];
  for (const file of filteredFiles) {
    const filePath = path.join(rootDir, file);
    const metadata = await parseFile(filePath);
    const stats = await stat(filePath);

    const musicInfo = {
      id: generateUUID(),
      title: metadata.common.title || path.parse(file).name,
      artist: metadata.common.artist || '未知艺术家',
      album: metadata.common.album || '未知专辑',
      genre: metadata.format.container || path.extname(file).substring(1),
      duration: formatTime(metadata.format.duration),
      uploadTime: dayjs(stats.ctime).format('YYYY-MM-DD'),
      filePath: filePath,
    };

    // 插入数据库
    insertMusic(musicInfo);
    list.push(musicInfo);
  }
  return list;
}

/**
 * 获取音乐列表
 * @returns 音乐列表
 */
export const getMusics: GetMusics = async () => {
  // 从数据库获取所有音乐
  return Promise.resolve(getAllMusics());
};

/**
 * 播放音乐
 * @param filePath
 */
export const playMusic = async (filePath: string) => {
  const fileBuffer = await readFile(filePath);
  const metadata = await parseFile(filePath);
  return {
    musicData: fileBuffer.toString('base64'),
    metadata,
    ext: path.extname(filePath).substring(1),
    fileBuffer: fileBuffer,
  };
};

/**
 * 导入音乐
 */
export const importMusic = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: '音频文件', extensions: musicFileExtensions }],
  });

  if (!result.canceled) {
    const selectedFiles = result.filePaths;
    const rootDir = getRootDir();

    for (const file of selectedFiles) {
      const fileName = path.basename(file);
      const targetPath = path.join(rootDir, fileName);
      await copyFile(file, targetPath);
    }

    // 处理新导入的文件
    return processFiles(
      selectedFiles.map((f) => path.basename(f)),
      rootDir,
    );
  }
  return [];
};

export const deleteMusic = (id: string) => {
  return deleteMusicById(id);
};
