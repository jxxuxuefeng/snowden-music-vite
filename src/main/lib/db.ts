import { MusicInfo } from '@shared/models';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

// 数据库目录
const dbDir = path.join(homedir(), '.s-music');
// 数据库文件路径
const dbPath = path.join(dbDir, 'music.db');

// 确保数据库目录存在
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// 初始化数据库表，仅当表不存在时创建
db.exec(`
  CREATE TABLE IF NOT EXISTS musics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT,
    album TEXT,
    genre TEXT,
    duration INTEGER,
    uploadTime INTEGER NOT NULL,
    filePath TEXT NOT NULL
  )
`);

export const insertMusic = (music: MusicInfo) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO musics (id, title, artist, album, genre, duration, uploadTime, filePath)
    VALUES (@id, @title, @artist, @album, @genre, @duration, CAST(@uploadTime AS INTEGER), @filePath)
  `);
  return stmt.run(music);
};

export const getAllMusics = (): MusicInfo[] => {
  return db.prepare('SELECT * FROM musics').all() as MusicInfo[];
};

export const getMusicById = (id: string) => {
  return db.prepare('SELECT * FROM musics WHERE id = ?').get(id);
};

export const deleteMusicById = (id: string) => {
  const stmt = db.prepare('DELETE FROM musics WHERE id = ?');
  return stmt.run(id);
};

export default db;
