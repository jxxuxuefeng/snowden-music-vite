import { MusicInfo } from '@shared/models';

export type GetMusics = () => Promise<MusicInfo[]>;

export type PlayMusic = (title: string) => Promise<MusicInfo>;
