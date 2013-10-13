module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['app/lib/jquery.js', 'app/lib/bootstrap.min.js', 'app/js/*.js'],
				dest: 'static/js/mobile.js'
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed' // compressed, expanded
				},
				files: {
					'static/css/styles.css': 'app/sass/main.scss' // 'destination': 'source'
				}
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, src: ['app/font/**'], dest: 'static/font'},
					{expand: true, src: ['app/img/**'], dest: 'static/img'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', [
		'concat',
		'sass',
		'copy'
	]);
};