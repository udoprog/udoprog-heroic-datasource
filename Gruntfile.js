module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.initConfig({
    clean: ["dist"],

    typescript: {
      dist: ['dist/**/*.ts', "!**/*.d.ts"],
      options: {
        module: 'system',
        target: 'es5',
        rootDir: 'dist/',
        sourceRoot: 'dist/',
        declaration: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        sourceMap: true,
        noImplicitAny: false
      }
    },

    copy: {
      sources: {
        cwd: 'src',
        expand: true,
        src: ['**/*'],
        dest: 'dist/'
      },
      plugin: {
        src: ['plugin.json', 'LICENSE'],
        dest: 'dist/'
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json', 'LICENSE'],
        tasks: ['default'],
        options: {spawn: false}
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'copy:sources',
    'typescript:dist',
    'copy:plugin'
  ]);
};
