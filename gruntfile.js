module.exports = function(grunt){
    // Loading tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

    // Configuring tasks
	grunt.initConfig({
		copy:{
			main:{
				files:[
					{
						expand:true,
						cwd:"./",
						src:['**','!gruntfile.js','!java_code/**'],
						dest:"../production"
					}
				]
			}
		},
        concat:{
            js:{
				options:{
					process:function(src,filepath){
						return "//=================================="+filepath+"===================================//\n"+src;
					}
				},
                files:[
                    {
                        src:['static/**/*.js','!static/assets/**'],
						dest:'../production/static/final.js'
                    }
                ]
            }
        },
		ngAnnotate:{
			build:{
				options:{
					singleQuotes:true
				},
				files:[
					{
						src:['../production/static/final.js'],
						dest:'../production/static/final.safe.js'
					}
				]
			}
		},
		uglify:{
			js:{
				files:[
					{
						src:['../production/static/final.safe.js'],
						dest:'../production/static/final.min.js'
					}
				]
			}
		},
		clean:{
			build:{
				files:[
					{
						src:['../production/static/app','../production/static/final.safe.js','../production/static/final.js']
					}
				]
			}
		}
	});

	// Register tasks
	grunt.registerTask(
    'sqeeze',
    "Copy files in a prod folder, min-safe files, uglify them, remove the orignals from prod folder.",
    ['copy','concat','ngAnnotate','uglify','clean']
  );
};
