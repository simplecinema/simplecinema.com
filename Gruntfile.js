module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: '*',
          port: process.env.PORT || 3000,
          base: [ 'assets', 'public' ]
        }
      }
    },
    clean: {
      public: [ 'public' ]
    },
    less: {
      simpleCinema: {
        files: {
          'public/css/simple-cinema.css': [ 'assets/css/application.less' ]
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: [ 'assets/css/**/*' ],
        tasks: [ 'less' ]
      },
      grunt: {
        files: [ 'Gruntfile.js' ]
      },
      index: {
        files: [ 'index.html' ],
        tasks: [ 'copy-index' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'clean',
    'less',
    'copy-index',
    'connect',
    'watch'
  ]);

  grunt.registerTask('copy-index', 'Copy index page', function() {
    grunt.file.copy('index.html', 'public/index.html');
    grunt.log.ok('Copied index.html to public/index.html.');
  });

};
