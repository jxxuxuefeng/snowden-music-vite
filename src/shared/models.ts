import { IAudioMetadata } from 'music-metadata';

/**
 * 音乐信息
 */
export type MusicInfo = {
  /**
   * 唯一标识
   */
  id: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 歌手
   */
  artist: string;
  /**
   * 专辑
   */
  album: string;
  /**
   * 格式
   */
  genre: string;
  /**
   * 大小
   */
  duration: number;
  /**
   * 上传时间
   */
  uploadTime: number;
  /**
   * 文件路径
   */
  filePath: string;
};

/**
 * 音乐数据
 */
export type MusicData = {
  /**
   * 元数据
   */
  metadata: IAudioMetadata;
  /**
   * 文件扩展名
   */
  ext: string;
  /**
   * 文件缓冲区
   */
  fileBuffer: Buffer;
};
