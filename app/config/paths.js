module.exports = {
    src: {
      js: './assets/js/**/*.js',
      scss: './assets/scss/sass/**/*.scss',
      html: './views/**/*.html'        
    },
    dest: {
      js: './public/js/',
      scss: './public/css/',
      html: './public/'
    },
    removeWildcards: function (path) {
      return path.replace(/\*.*?$/, '');
    }
};
