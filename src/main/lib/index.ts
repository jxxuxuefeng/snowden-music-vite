import { musicDirectoryName, musicFileExtensions } from '@shared/constants';
import { MusicInfo } from '@shared/models';
import { GetMusics } from '@shared/types';
import { dialog } from 'electron';
import { copyFile, readdir, readFile, stat, unlink } from 'fs-extra';
import { parseFile } from 'music-metadata';
import * as path from 'node:path';
import { homedir } from 'os';
import { generateUUID } from 'roodash';
import { deleteMusicById, getAllMusics, insertMusic } from './db';

/**
 * 获取音乐文件根目录
 * @returns 音乐文件根目录
 */
export function getRootDir() {
  return `${homedir()}/${musicDirectoryName}`;
}

/**
 * 解析音乐文件
 * @param files 文件列表
 * @param rootDir 音乐文件根目录
 */
async function processFiles(files: string[], rootDir: string) {
  const list: MusicInfo[] = [];
  for (const file of files) {
    // 获取目标路径
    const filePath = path.join(rootDir, file);
    // 解析音乐文件元数据
    const metadata = await parseFile(filePath);
    // 生成音乐信息
    const musicInfo = {
      id: generateUUID(),
      title: metadata.common.title || path.parse(file).name,
      artist: metadata.common.artist || '未知艺术家',
      album: metadata.common.album || '未知专辑',
      genre: metadata.format.container || path.extname(file).substring(1),
      duration: metadata.format.duration,
      uploadTime: Date.now(),
      filePath: filePath,
    };
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
 * 检查文件是否已存在
 * @param fileName 文件名
 * @param rootDir 根目录
 */
async function isFileExists(fileName: string, rootDir: string) {
  const files = await readdir(rootDir);
  return files.includes(fileName);
}

/**
 * 导入音乐
 */
export const importMusic = async () => {
  const copiedFiles: string[] = []; // 记录已复制的文件

  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Music Files',
          extensions: musicFileExtensions,
        },
      ],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const rootDir = getRootDir();
      const importedFiles = [];

      // 处理每个选中的文件
      for (const filePath of result.filePaths) {
        const fileName = path.basename(filePath);
        const targetPath = path.join(rootDir, fileName);

        if (await isFileExists(fileName, rootDir)) {
          console.log(`跳过重复音乐: ${fileName}`);
          continue;
        }

        try {
          // 复制文件到音乐目录
          await copyFile(filePath, targetPath);
          copiedFiles.push(targetPath); // 记录已复制的文件路径
          importedFiles.push(fileName);
        } catch (error) {
          console.error(`复制文件失败: ${fileName}`, error);
          continue;
        }
      }

      try {
        // 处理导入的文件
        const musicList = await processFiles(importedFiles, rootDir);
        // 插入数据库
        for (const music of musicList) {
          await insertMusic(music);
        }
        return musicList;
      } catch (error) {
        // 如果数据库操作失败，删除所有已复制的文件
        await Promise.all(copiedFiles.map((file) => unlink(file)));
        throw new Error('导入音乐失败');
      }
    }

    return [];
  } catch (error) {
    // 确保在任何错误情况下都清理已复制的文件
    if (copiedFiles.length > 0) {
      await Promise.all(copiedFiles.map((file) => unlink(file)));
    }
    throw new Error('导入音乐失败');
  }
};

export const deleteMusic = (id: string) => {
  return deleteMusicById(id);
};
