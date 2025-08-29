import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

// Determine output filename based on branch
const isBetaBranch = process.env.BRANCH === 'beta' || process.env.GITHUB_REF === 'refs/heads/beta';
const outputFilename = isBetaBranch ? 'yet-another-media-player-beta.js' : 'yet-another-media-player.js';

export default {
  input: 'src/yet-another-media-player.js',
  output: {
    file: outputFilename,
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
    // Custom plugin to handle conditional custom element registration
    {
      name: 'conditional-custom-elements',
      transform(code, id) {
        if (isBetaBranch) {
          // Replace yamp-sortable custom element registration
          if (id.includes('yamp-sortable.js')) {
            code = code.replace(
              'customElements.define("yamp-sortable", YampSortable);',
              'customElements.define("yamp-sortable-beta", YampSortable);'
            );
          }
          // Replace yamp-sortable usage in HTML templates
          if (id.includes('yamp-editor.js')) {
            code = code.replace(/<yamp-sortable/g, '<yamp-sortable-beta');
            code = code.replace(/<\/yamp-sortable>/g, '</yamp-sortable-beta>');
          }
        }
        return code;
      }
    }
  ],
};