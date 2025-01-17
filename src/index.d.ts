import { DeleteMusic, GetMusics, ImportMusic, PlayMusic } from '@shared/types';

declare global {
  interface Window {
    context: {
      getMusics: GetMusics;
      playMusic: PlayMusic;
      importMusic: ImportMusic;
      deleteMusic: DeleteMusic;
    };
  }
}
