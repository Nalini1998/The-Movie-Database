const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const use = require('postcss-use');

// REFERENCE: https://www.npmjs.com/package/postcss
// REFERENCE: http://api.postcss.org/postcss.html
// REFERENCE: https://github.com/postcss/postcss-use
module.exports = function () {
  return postcss([
    use({
      options: {
        'postcss-preset-env': {
          stage: 0,
          browsers: 'last 2 versions'
        }
      },
      modules: [
        'autoprefixer',
        'lost',
        'postcss-apply',
        'postcss-color-function',
        'postcss-conditionals',
        'postcss-cssnext',
        'postcss-custom-media',
        'postcss-discard-comments',
        'postcss-extend',
        'postcss-flexbox',
        'postcss-for',
        'postcss-media-minmax',
        'postcss-mixins',
        'postcss-nested',
        'postcss-reverse-media',
        'postcss-simple-vars',
        'postcss-transform-shortcut',
        'postcss-triangle',
        'postcss-utilities',
        'postcss-preset-env',
        'postcss-nested-ancestors'
      ],
      postcssPresetEnv
    })
  ]);
};