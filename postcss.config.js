module.exports = {
  from: 'src/css/styles.css',
  to: 'build/styles.css',
  plugins: {
    'postcss-import': {},
    'postcss-url': {
      url: 'copy',
      assetsPath: 'img'
    },
    'postcss-mixins': {},
    'postcss-simple-vars': {},
    'postcss-nested': {},
    'postcss-flexbugs-fixes': {},
    autoprefixer: {},
    cssnano: {}
  }
};
