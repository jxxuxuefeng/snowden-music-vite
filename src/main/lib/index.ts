import { musicDirectoryName, musicFileExtensions } from '@shared/constants';
import { GetMusics } from '@shared/types';
import { formatTime } from '@shared/utils';
import dayjs from 'dayjs';
import { dialog } from 'electron';
import { copyFile, readdir, readFile, stat } from 'fs-extra';
import { parseFile } from 'music-metadata';
import * as path from 'node:path';
import { homedir } from 'os';
import { generateUUID, getFileExtension } from 'roodash';

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
    list.push({
      title: metadata.common.title || path.parse(file).name, // 如果没有标题则使用文件名
      artist: metadata.common.artist || '未知艺术家',
      album: metadata.common.album || '未知专辑',
      genre: metadata.format.container || path.extname(file).substring(1), // 使用文件扩展名作为备选
      duration: formatTime(metadata.format.duration),
      uploadTime: dayjs(stats.ctime).format('YYYY-MM-DD'),
      filePath: filePath,
      id: generateUUID(),
    });
  }
  return list;
}

/**
 * 获取音乐列表
 * @returns 音乐列表 Promise
 */
export const getMusics: GetMusics = async () => {
  // const { dialog } = require('electron');
  // const result = await dialog.showOpenDialog({
  //   properties: ['openFile', 'multiSelections'],
  //   filters: [{ name: '音频文件', extensions: musicFileExtensions }],
  // });

  // if (!result.canceled) {
  //   // 处理选中的文件
  //   const selectedFiles = result.filePaths;
  //   // TODO: 将文件复制到音乐目录
  //   return processFiles(
  //     selectedFiles.map((file) => path.basename(file)),
  //     path.dirname(selectedFiles[-2]),
  //   );
  // }

  // return [];
  // 获取音乐文件根目录
  const rootDir = getRootDir();
  // 读取根目录下的所有文件
  const files = await readdir(rootDir);
  // 过滤出歌曲文件（假设歌曲文件扩展名为musicFileExtensions）
  const filteredFiles = files.filter((file: string) => {
    return musicFileExtensions.includes(getFileExtension(file));
  });
  // 解析文件
  return processFiles(filteredFiles, rootDir).then((res) => {
    return res;
  });
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
    // 处理选中的文件
    const selectedFiles = result.filePaths;
    const rootDir = getRootDir();

    // 将选中的文件复制到音乐目录
    for (const file of selectedFiles) {
      const fileName = path.basename(file);
      const targetPath = path.join(rootDir, fileName);
      await copyFile(file, targetPath);
    }

    // 导入完成后返回更新的音乐列表
    // return getMusics();
  }

  // 如果用户取消了导入，返回空数组
  // return [];
};
