import { MusicData, MusicInfo } from '@shared/models';

/**
 * 获取音乐列表
 */
export type GetMusics = () => Promise<MusicInfo[]>;

/**
 * 播放音乐
 */
export type PlayMusic = (filePath: string) => Promise<MusicData>;

/**
 * 导入音乐
 */
export type ImportMusic = () => Promise<MusicInfo[]>;

/**
 * 删除音乐
 */
export type DeleteMusic = (filePath: string) => Promise<void>;
