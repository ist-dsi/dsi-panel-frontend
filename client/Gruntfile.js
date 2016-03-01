'use strict';

module.exports = function(grunt) {

  var connectConfig = require('./grunt/connect');

  var path = require('path');

  grunt.initConfig({
    srcPath: "src",
    buildPath: "build",
    distPath: "dist",
    bowerrc: grunt.file.readJSON('.bowerrc'),
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      dist: connectConfig('<%= distPath %>', grunt.option('port'), true),
      dev: connectConfig('<%= buildPath %>', grunt.option('port'))
    },
    config: {
      dev: {
        options: {
          variables: {
            'browserifyDebug': true
          }
        }
      }
    },
    watch: {
      vendor: {
        files: 'bower.json',
        tasks: ['bower', 'browserify:vendor']
      },
      scripts: {
        files: '<%= srcPath %>/scripts/**/*.js',
        tasks: ['config:dev', 'browserify:client']
      },
      index: {
        files: '<%= srcPath %>/index.html',
        tasks: ['copy:build']
      },
      templates: {
        files: '<%= srcPath %>/views/**/*.html',
        tasks: ['ngtemplates']
      },
      themeResources: {
        files: ['<%= srcPath %>/theme/**/*', '!<%= srcPath %>/theme/sass/*'],
        tasks: ['copy:build']
      },
      sassFiles: {
        files: ['<%= srcPath %>/theme/sass/*.scss'],
        tasks: ['sass:development']
      }
    },
    sass: {
      development: {
        options: {
          trace: true,
          style: 'expanded'
        },
        files: {
          '<%= buildPath %>/css/style.css': '<%= srcPath %>/theme/sass/style.scss'
        }
      },
      production: {
        options: {
          style: 'compressed'
        },
        files: {
          '<%= distPath %>/css/style.min.css': '<%= srcPath %>/theme/sass/style.scss'
        }
      }
    },
    browserify: {
      vendor: {
        src: ['<%= srcPath %>/scripts/vendors/index.js'],
        dest: '<%= buildPath %>/js/vendor.js',
        options: {
          transform: ['debowerify']
        }
      },
      client: {
        src: ['<%= srcPath %>/scripts/app.module.js'],
        dest: '<%= buildPath %>/js/dsiPanel.js',
        options: {
          browserifyOptions: {
            debug: '<%= grunt.config.get("browserifyDebug") %>'
          }
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n * Copyright 2015-<%= grunt.template.today("yyyy") %> David Martinho */\n'
      }
    },
    bower: {
      build: {
        options: {
          targetDir: '<%= buildPath %>/bower_components'
        }
      }
    },
    copy: {
      build: {
        files: [
          { expand: true, cwd: '<%= srcPath %>', src: ['index.html'], dest: '<%= buildPath %>/'},
          { expand: true, cwd: '<%= srcPath %>/theme', src: ['**', '!sass/**'], dest: '<%= buildPath %>/'}
        ]
      },
      dist: {
        files: [
          { expand: true, cwd: '<%= srcPath %>', src: ['index.html', 'i18n/**'], dest: '<%= distPath %>/', filter: 'isFile' },
          { expand: true, cwd: '<%= srcPath %>/theme', src: ['fonts/**', 'images/**'], dest: '<%= distPath %>/' }
        ]
      }
    },
    filerev: {
      dist: {
         src: [
           '<%= distPath %>/js/{,*/}*.js',
           '<%= distPath %>/css/{,*/}*.css'
         ]
       }
    },
    useminPrepare: {
      html: '<%= distPath %>/index.html',
      options: {
        root: '<%= buildPath %>'
      }
    },
    usemin: {
      html: ['<%= distPath %>/index.html'],
      options: {
        assetsDirs: ['<%= distPath %>', '<%= distPath %>/js'],
        blockReplacements: {
          'sass': function (block) {
            return '<link rel="stylesheet" href="' + block.dest + '">';
          }
        }
      }
    },
    clean: ['<%= distPath %>', '<%= buildPath %>', 'bower_components', '<%= buildPath %>/bower_components', '<%= srcPath %>/theme/bower_components', '.tmp'],
    ngtemplates: {
      app: {
        cwd: '<%= srcPath %>',
        src: ['**/*.html', '!index.html', '!bower_components/**', '!theme/**'],
        dest: '<%= buildPath %>/js/templates.js',
        options: {
          bootstrap: function(module, script) {
            return '(function(angular) {angular.module(\'dsiPanelApp.templates\', []).run([\'$templateCache\', function($templateCache) { '+script+' }])}(angular));';
          },
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true, // Only if we don't use comment directives!
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    },
    prompt: {
      mockUser: {
        options: {
          questions: [{
            config: "connect.options.mockUser.username",
            type: "input",
            default: "johndoe",
            message: "Please insert the username of the user you wish to mock:"
          },{
            config: "connect.options.mockUser.name",
            type: "input",
            default: "John Doe",
            message: "Please insert the name of the user you wish to mock:"
          },{
            config: "connect.options.mockUser.scopes",
            type: "checkbox",
            default: ["user"],
            choices: ["user", "admin"],
            message: "Please select one or more roles of the user you wish to mock:"
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-prompt');

  // Default task.
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['config:dev', 'bower', 'ngtemplates', 'browserify', 'sass:development', 'copy:build', 'prompt:mockUser', 'connect:dev', 'watch']);
  grunt.registerTask('dist', ['bower', 'ngtemplates', 'browserify', 'copy', 'sass:production', 'useminPrepare', 'concat', 'uglify', 'filerev', 'usemin'])
  grunt.registerTask('server', ['connect:dist'])

};
