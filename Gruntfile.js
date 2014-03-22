module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: '*',
          port: process.env.PORT || 3000,
          base: [ 'assets', 'site' ]
        }
      }
    },
    clean: {
      site: [ 'site' ]
    },
    less: {
      simpleCinema: {
        files: {
          'site/css/simple-cinema.css': [ 'assets/css/application.less' ]
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: [ 'assets/js/**/*' ]
      },
      css: {
        files: [ 'assets/css/**/*' ],
        tasks: [ 'less' ]
      },
      grunt: {
        files: [ 'Gruntfile.js' ]
      },
      index: {
        files: [ 'layouts/*', 'helpers/*', 'pages/*', 'posts/**/*' ],
        tasks: [ 'assemble' ]
      }
    },
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        plugins: [ 'assemble-permalink', 'helpers/all-pages.js' ],
        helpers: [ 'handlebars-helper-prettify', 'helpers/helpers.js' ],
        layoutdir: 'layouts',
        layout: 'default.hbs',
        production: false,
        prettify: {
          unformatted: [ 'a', 'sub', 'sup', 'b', 'i', 'u', 'textarea', 'pre' ]
        },
        posts: {
          work: grunt.file.readYAML('posts/work.yml'),
          work2: grunt.file.readYAML('posts/work2.yml')
        }
      },
      blog: {
        options: {
          layout: 'blogpost.hbs',
          permalink: '/blog/{{ basename }}/'
        },
        files: {
          'site/': [ 'pages/~blog*.hbs', 'posts/blog/**/*.md' ]
        }
      },
      work: {
        options: {
          layout: 'work.hbs',
          pages: '<%= assemble.options.posts.work %>'
        },
        files: {
          'site/' : []
        }
      },
      work2: {
        options: {
          layout: 'work.hbs',
          pages: '<%= assemble.options.posts.work2 %>'
        },
        files: {
          'site/' : []
        }
      },
      site: {
        files: {
          'site/': [ 'pages/*.hbs', '!pages/~*.hbs' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
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
    'assemble',
    'make-blog-index',
    'connect',
    'watch'
  ]);

  grunt.registerTask('make-blog-index', '', function() {
    var blogposts = grunt.config('assemble.options.all_blog') || [];
    blogposts = blogposts.reverse();
    grunt.file.write('site/blog/index.json', JSON.stringify(blogposts));
    grunt.log.ok('Generated blog index.')
  });

};
