module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          hostname: '*',
          port: process.env.PORT || 3000,
          base: [ 'site' ]
        }
      }
    },
    copy: {
      images: {
        files: {
          'site/': [ 'images/**' ]
        }
      },
      js: {
        expand: true,
        cwd: 'assets/js/vendor/',
        src: 'html5shiv.js',
        dest: 'site/js/'
      },
      statics: {
        expand: true,
        cwd: 'static/',
        src: '**',
        dest: 'site/',
        dot: true
      }
    },
    clean: {
      site: [ 'site' ],
      tmp: [ 'assets/js/tmp' ]
    },
    less: {
      options: {
        cleancss: true,
        stripBanners: true,
        banner: '/*! Generated on <%= grunt.template.today("dddd, mmmm dS, ' +
          'yyyy, h:MM:ss TT") %> */\n'
      },
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
        files: [ 'assets/js/**/*' ],
        tasks: [ 'uglify', 'concat' ]
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
    uglify: {
      javascripts: {
        files: [{
          expand: true,
          cwd: 'assets/js',
          src: [ '*.js', 'vendor/*.js', '!vendor/*.min.js', '!vendor/html5shiv.js' ],
          dest: 'assets/js/tmp/'
        }]
      }
    },
    concat: {
      options: {
        banner: '/*! Generated on <%= grunt.template.today("dddd, mmmm dS, ' +
          'yyyy, h:MM:ss TT") %> */\n'
      },
      js: {
        files: {
          'site/js/application.js': [
            'assets/js/tmp/vendor/fastclick.js',
            'assets/js/vendor/jquery-*.min.js',
            'assets/js/vendor/*.min.js',
            'assets/js/tmp/**/*.js'
          ]
        }
      }
    },
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        plugins: [ 'assemble-permalink', 'helpers/all-pages.js', 'helpers/trim.js' ],
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
        },
        makePermalinks: function(pages) {
          var p = '';
          for (var i = 0; i < pages; i++) {
            p += '\n/blog/' + (i === 0 ? '' : 'page/' + (i + 1) + '/');
          }
          return p.trim();
        },
        blog: {
          postsPerPage: 10,
          count: function(what) {
            var c = 0;
            what.forEach(function(w) {
              if (w.src.indexOf('posts/blog') === 0) c += 1;
            });
            return c;
          }
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
      },
      sitemap: {
        files: {
          'site/': [ 'pages/~sitemap.hbs' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('common', [
    'clean',
    'less',
    'uglify',
    'concat',
    'copy',
    'clean:tmp'
  ]);

  grunt.registerTask('default', [
    'common',
    'assemble',
    'make-blog-index',
    'connect',
    'watch'
  ]);

  grunt.registerTask('make', [
    'common',
    'hash',
    'assemble_in_production',
    'assemble',
    'make-blog-index'
  ]);

  grunt.registerTask('assemble_in_production', 'Enter production mode.',
    function() {
    grunt.config('assemble.options.production', true);
    grunt.log.ok('Entered production mode.');
  });

  grunt.registerTask('make-blog-index', '', function() {
    var blogposts = grunt.config('assemble.options.all_blog') || [];
    blogposts = blogposts.reverse();
    grunt.file.write('site/blog/index.json', JSON.stringify(blogposts));
    grunt.log.ok('Generated blog index.')
  });

  grunt.registerTask('hash', 'Generate asset hash filenames', function() {
    var path = require('path');
    var crypto = require('crypto');
    var fs = require('fs');
    var sitedir = 'site';
    var assets = grunt.file.expand({
      cwd: sitedir
    }, 'js/*.js', 'css/*.css');
    var compiled_assets = grunt.config('assemble.options.compiled_assets') || {};
    for (var i = 0; i < assets.length; i++) {
      var old_filename = path.join(sitedir, assets[i]);
      var js = fs.readFileSync(old_filename);
      shasum = crypto.createHash('sha1');
      shasum.update(js);
      var hash = shasum.digest('hex');
      var dot = old_filename.lastIndexOf('.');
      if (dot === -1) dot = undefined;
      var new_filename = old_filename.slice(0, dot);
      new_filename += '-' + hash + old_filename.slice(dot);
      fs.renameSync(old_filename, new_filename);
      grunt.log.ok('File ' + old_filename + ' renamed to ' + new_filename);
      var site = sitedir.length;
      compiled_assets[old_filename.slice(site)] = new_filename.slice(site);
    }
    grunt.config('assemble.options.compiled_assets', compiled_assets);
  });

  grunt.registerTask('push', 'Update website.', function(where) {
    if (!where) grunt.fail.fatal('Where? grunt push:example.com');
    var finish = this.async();
    var spawn = require('child_process').spawn;
    var ssh = spawn('ssh', [where, (function script_to_update() {
      /*!
        cd /srv/simplecinema.com
        git fetch --all
        git reset --hard origin/master
        npm i
        grunt make
      */
      return arguments.callee.toString().match(/\/\*!?([\S\s]*?)\*\//)[1]
        .replace(/^\s{2,}/gm, '').trim();
    })()]);
    ssh.stdout.pipe(process.stdout);
    ssh.stderr.pipe(process.stderr);
    ssh.on('close', finish);
  });

};
