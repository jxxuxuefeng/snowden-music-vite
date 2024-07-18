import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import path, { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root: path.resolve(root, 'src/renderer'),
    mode,
    base: './',
    build: {
      outDir: path.resolve(root, `.vite/build/renderer/${name}`)
    },
    plugins: [pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    clearScreen: false
  } as UserConfig;
});
