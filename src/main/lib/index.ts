import { musicDirectoryName, musicFileExtensions } from '@shared/constants';
import { GetMusics } from '@shared/types';
import { formatTime } from '@shared/utils';
import dayjs from 'dayjs';
import { readdir, readFile, stat } from 'fs-extra';
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
    const filePath = path.join(rootDir, file); // 获取文件的完整路径
    const metadata = await parseFile(filePath); // 异步解析文件
    const stats = await stat(filePath);
    list.push({
      title: metadata.common.title, // 歌曲名
      artist: metadata.common.artist, // 歌手
      album: metadata.common.album, //  专辑
      genre: metadata.format.container, // 格式
      duration: formatTime(metadata.format.duration), // 大小
      uploadTime: dayjs(stats.ctime).format('YYYY-MM-DD'), // 创建时间
      filePath: filePath, // 文件路径
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
  // 获取音乐文件根目录
  const rootDir = getRootDir();
  // 读取根目录下的所有文件
  const files = await readdir(rootDir);
  // 过滤出歌曲文件（假设歌曲文件扩展名为musicFileExtensions）
  const filteredFiles = files.filter((file) => {
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
