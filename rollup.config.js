import { readFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default {
  input: 'src/yet-another-media-player.js',
  output: {
    file: 'yet-another-media-player.js',
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins: [
    resolve({
      browser: true,
      extensions: ['.js', '.mjs'],
    }),
    commonjs({
      include: ['node_modules/js-yaml/**', 'node_modules/sortablejs/**'],
      transformMixedEsModules: true,
    }),
    esbuild({
      target: 'es2021',
      minify: true,
      loaders: {
        '.js': 'js'
      },
      define: {
        __VERSION__: JSON.stringify(pkg.version),
      }
    }),
  ],
};