
var sourceDir = "src/";
var buildDir = "build/";

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					sourceDir + 'app/lib/jquery.js',
					sourceDir + 'app/lib/bootstrap.min.js',
					sourceDir + 'app/js/*.js'
				],
				dest: buildDir + 'static/js/mobile.js'
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed' // compressed, expanded
				},
				files: [{
					src: [sourceDir + 'app/sass/main.scss'],
					dest: buildDir + 'static/css/styles.css'
				}]
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: sourceDir + 'app/', src: ['font/**'], dest: buildDir + 'static'},
					{expand: true, cwd: sourceDir + 'app/', src: ['img/**'], dest: buildDir + 'static'},
					{expand: true, cwd: sourceDir, src: ['*'], dest: buildDir, filter: 'isFile'}
				]
			}
		},
		watch: {
			scripts: {
				files: [ sourceDir + '**/*'], // all files in src dir
				tasks: ['build'],
				options: {
					livereload: true,
					debounceDelay: 250
				}
			}
		},
		open: {
			server: {
				path: 'http://test.local/'
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');

	grunt.registerTask('build', [
		'concat',
		'sass',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
		'open'
	]);
};