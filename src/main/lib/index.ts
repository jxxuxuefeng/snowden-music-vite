import { homedir } from 'os';
import { databaseName, musicDirectoryName, musicFileExtensions } from '@shared/constants';
import { readdir, readFile, copyFile } from 'fs-extra';
import { GetMusics } from '@shared/types';
import { parseBuffer, parseFile } from 'music-metadata';
import * as path from 'node:path';
import { getFileExtension } from 'roodash';
import { dialog } from 'electron';
import * as fs from 'node:fs';
const databasePath = `${homedir()}/${databaseName}`;

export function getRootDir() {
  console.log(homedir(), 'homedir');
  return `${homedir()}/${musicDirectoryName}`;
}

export const getMusics: GetMusics = async () => {
  const rootDir = getRootDir();
  console.log(rootDir, 'rootDir');
  const files = await readFile(databasePath);
  if (!files) return [];
  const jsonString = files.toString('utf-8');
  const jsonObject = JSON.parse(jsonString);
  return jsonObject;
  // const musics = files.filter((file) => {
  //   // 后缀名符合 musicFileExtensions 都算是音乐文件
  //   const ext = getFileExtension(file);
  //   return musicFileExtensions.includes(ext);
  // });
  // console.log(musics, 'musics');
  //
  // return Promise.all(
  //   musics.map(async (music) => {
  //     return {
  //       title: music.replace(/\.mp3$/, '')
  //     };
  //   })
  // );
};

export const playMusic = async (filePath: string) => {
  // const rootDir = getRootDir();
  // const musicPath = `${rootDir}/${title}.mp3`;
  const fileBuffer = await readFile(filePath);
  const metadata = await parseFile(filePath);
  return {
    musicData: fileBuffer.toString('base64'),
    metadata,
    ext: path.extname(filePath).substring(1),
    fileBuffer: fileBuffer
  };
};

// 复制文件到目标目录
async function copyFileToDirectory(filePath, targetDir) {
  const fileName = path.basename(filePath);
  const targetPath = path.join(targetDir, fileName);
  await copyFile(filePath, targetPath);
  return targetPath;
}

// 读取JSON数据库
function readSongs() {
  if (!fs.existsSync(databasePath)) {
    return [];
  }
  const data = fs.readFileSync(databasePath);
  return JSON.parse(data);
}
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
// 写入JSON数据库
function writeSongs(songs) {
  ensureDirectoryExistence(databasePath);
  fs.writeFileSync(databasePath, JSON.stringify(songs, null, 2));
}

// 添加歌曲到数据库
function addSongToDatabase(song) {
  const songs = readSongs();
  song.id = songs.length ? songs[songs.length - 1].id + 1 : 1;
  songs.push(song);
  writeSongs(songs);
}

export const importMusic = async () => {
  // 打开系统窗口选择音乐文件导入
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Audio Files', extensions: musicFileExtensions }]
  });

  if (!result.canceled) {
    const selectedFiles = result.filePaths;
    const rootDir = getRootDir();
    for (const filePath of selectedFiles) {
      const targetPath = await copyFileToDirectory(filePath, rootDir);
      // const fileBuffer = await readFile(filePath);
      const metadata = await parseFile(filePath);
      console.log(metadata, 'metadata');
      const artist = metadata?.common?.artist || 'Unknown Artist';
      const album = metadata?.common?.album || 'Unknown Album';
      const genre = metadata?.format?.codec || 'Unknown Genre';
      const duration = metadata?.format?.duration || 0;
      const pic = metadata?.common?.picture?.[0]?.data;

      const song = {
        title: path.basename(filePath, path.extname(filePath)),
        artist,
        album,
        genre,
        duration,
        pic,
        filePath: targetPath,
        uploadTime: '2024-7-17'
      };
      addSongToDatabase(song);
    }
  }
};
