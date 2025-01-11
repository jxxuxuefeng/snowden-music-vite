import { GetMusics, PlayMusic } from '@shared/types';

declare global {
  interface Window {
    context: {
      getMusics: GetMusics;
      playMusic: PlayMusic;
      importMusic: () => Promise<void>;
      deleteMusic: (id: string) => Promise<void>;
    };
  }
}
