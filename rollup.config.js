import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/yet-another-media-player.js',
  output: {
    file: 'yet-another-media-player.js',
    format: 'es',
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
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.mjs'],
      include: [
        'src/**/*',
        'node_modules/lit-html/**/*',
        'node_modules/lit-element/**/*',
        'node_modules/lit/**/*',
        'node_modules/@lit/**/*',
        'node_modules/js-yaml/**/*',
        'node_modules/sortablejs/**/*'
      ],
      exclude: [],
    }),
  ],
};