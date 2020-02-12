const child_process = require('child_process');
const gulp = require('gulp');
const coder = require('./encoder.js');
const concat = require('gulp-concat')
const cleanCSS  = require('gulp-clean-css');
const terser = require('gulp-terser');
const hash = 'dsadsaDFfdAty536'
const hash_cef = 'SUPERMEGAKEYMECASO'
const Client_ssh = require('gulp-ssh')
const vueify = require('vueify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const del = require('del');
const deployCdn = require('gulp-deploy-azure-cdn');
const CDNManagementClient = require('azure-arm-cdn');
const  msRestAzure = require('ms-rest-azure');
const modifyCssUrls  = require("gulp-modify-css-urls")
let gulpTryCatch = require('gulp-try-catch-wrapper');
const babelTryCatchLoader = require("babel-try-catch-loader")
const envify = require('envify/custom')
var parallelize = require("concurrent-transform");
var rename = require('gulp-rename');
var path = require('path');
var gutil = require('gulp-util');
let config_ssh = require('./configSsh.js');
var htmlreplace = require('gulp-html-replace');

let config = {
	'upload': {
		path: 'build',
		cdn: true,
		cdnName: 'altvmp', 
		cdnKey: 'UfzpXp9mSa/yB5NoEreqXiWBBnTXIQT4CU2KQgzhBbm4k/k5KpRkAHB/4PQ15B4GF9yzzPaz0YDrxOyutudhnA==',
		subscription:"1581b65a-cefc-4639-9d56-25492cdc9d42",
		cdnUrl: 'https://altvmp.com/HTML/'
	}
}

var encoder;
let configTerser = {
	warnings: true,
}

gulp.task('client-side-prodaction',()=>{
	process.env.NODE_ENV = 'production';

	return browserify({
		entries: "client/index.js",
		debug: true
	})
	// .transform(babelify.configure({
	// 	presets: ["es2015"],
	// 	global: true,
	// 	plugins: [
	// 		['babel-plugin-try-catch-wrapper', {
	// 			// MUST name of the function reporting errors
	// 			reportError: 'reportError',
	// 			// OPTIONAL if you use babel-cli, you can ignore filename since it can be grabbed by babel
	// 		}]
	// 	]
	// }))
	.bundle()
	  .on('error', function(err) { console.error(err.toString());this.emit('end');})
	  .pipe(source('client.js'))
	  .pipe(buffer())
	  .pipe(gulp.dest('client_packages'));
})
// Скрипты проект
gulp.task('encoder-client-side',gulp.series( 'client-side-prodaction',function() {
	return gulp.src(
		'client_packages/client.js',)
	.pipe(terser(configTerser))
	.pipe(concat('index.js'))
	.pipe(coder('clientside.js',hash,'exports',true))
	.on('error', function(err) { console.error(err);this.emit('end');})
	.pipe(gulp.dest(config.upload.path+'/client_packages/'));
}));
gulp.task('encoder-cef', function() {
	return gulp.src([
		"packages/server/HTML/plugins/notie.min.js",
		"packages/server/HTML/plugins/jquery-ui.js",
		"packages/server/HTML/plugins/snap.js",
		"packages/server/HTML/js/*.js",
	])
	.pipe(terser(configTerser))
	.pipe(coder('main.js',hash_cef,'var decode_cef',false,';'))
	.on('error', function(err) { console.error(err);this.emit('end');})
	.pipe(gulp.dest(config.upload.path+'/client_packages/HTML'));
});

gulp.task('startserver', function() {
	if(encoder) encoder.kill()
	encoder = child_process.spawn('server.exe',[/*'--inspect'*/]);
	encoder.on('exit', (data,d) => {
	  console.log(`exit: ${data}  ${d}`);
	});
	encoder.on('message', (data) => {
	  console.log(`data: ${data}`);
	});
	encoder.on('error', (data) => {
	  console.log(`err: ${data}`);
	});
	encoder.stderr.on('data', (error) => process.stderr.write(error.toString()));
	encoder.stdout.on('data', function(data) {
		process.stdout.write(data.toString()); 
	});
});

gulp.task('watch', function() {
	browsers.forEach((browser)=>{
		let taskBuild = 'vue-browser-'+browser;
		let build = ()=>{
			gulp.series(taskBuild, 'startserver')()
		}
		gulp.watch([
			`packages/server/HTML/browsers/${browser}/index.js`,
			`packages/server/HTML/browsers/${browser}/**/*.vue`
		],{usePolling: true}).on('all',build)
	});
	let restart = ()=>{
	 	gulp.parallel('startserver')()
	}
	let build = ()=>{
		gulp.series('vue', 'startserver')()
	}
	let buildClient = ()=>{
		gulp.series('client-side', 'startserver')()
	}
	gulp.watch([
		'client_packages/**/*.css',
		'packages/**/*.js',
		'!packages/server/HTML/vue/main.js',
		'!packages/server/HTML/js/bundle.js',
		'!packages/server/HTML/browsers/**/*'
	],{usePolling: true},restart).on('all',restart);
	gulp.watch([
		'client/**/*.js',
	],{usePolling: true},buildClient).on('all',buildClient);
	gulp.watch([
		'packages/server/HTML/**/*.css',
		'!packages/server/HTML/css/bundle.css',
		'packages/server/HTML/vue/**/*.vue',
		'packages/server/HTML/vue/main.js',
		'packages/server/HTML/styles/**/*'
	],{usePolling: true}).on('all',build)
});

gulp.task('client-side',()=>{
	return browserify({
		entries: "client/index.js",
		debug: true
	})
		.bundle()
	  .on('error', function(err) { console.error(err.toString());this.emit('end');})
	  .pipe(source('client.js'))
	  .pipe(buffer())
		// .pipe(terser(configTerser))
	  .pipe(gulp.dest('client_packages'));
})
gulp.task('vue', function() {

	return browserify({
		entries: "packages/server/HTML/vue/main.js",
		debug: true,
	}).plugin('vueify/plugins/extract-css', {out: 'packages/server/HTML/css/bundle.css'})
	.transform(vueify,{
		assetsPublicPath: 'https://altvmp.com/HTML/',
	})
	.transform(babelify.configure({
		presets: ["es2015"]
	}))
	  .bundle()
		.on('error', function(err) { console.error(err.message);this.emit('end');})
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('packages/server/HTML/js'));
});


let browsers = ['hud','inventory','auth','personal','bank', 'carshowroom', 'collector', 'donate', 'elements', 'fractions', 'helpMenu',  'listPlayers', 'mayoralty', 'phone', 'shop', 'spawnMenu', 'testPDD','menu']

browsers.forEach((browser)=>{
	let taskBuild = 'vue-browser-'+browser;

	gulp.task(taskBuild, function() {

		return browserify({
			entries: `packages/server/HTML/browsers/${browser}/index.js`,
			debug: true,
		}).plugin('vueify/plugins/extract-css', {out: `client_packages/HTML/${browser}/main.css`})
		.transform(vueify,{
			assetsPublicPath: 'https://altvmp.com/HTML/',
		})
		.transform(babelify.configure({
			presets: ["es2015"]
		}))
			.bundle()
			.on('error', function(err) { console.error(err.message);this.emit('end');})
			.pipe(source('bundle.js'))
			.pipe(buffer())
			.pipe(gulp.dest( `client_packages/HTML/${browser}/`));
	});
})

browsers.forEach((browser)=>{
	let taskBuild = 'vue-browser-prodaction-'+browser;
	gulp.task(taskBuild, function() {
		process.env.NODE_ENV = 'production';
		gulp.src(`client_packages/HTML/${browser}/index.html`)
		.pipe(gulp.dest( `${config.upload.path}/client_packages/HTML/${browser}/`));

		return browserify({
			entries: `packages/server/HTML/browsers/${browser}/index.js`,
			debug: true
		})
		.transform(
			// Порядок необходим для обработки файлов node_modules
			{ global: true },
			envify({ NODE_ENV: 'production' })
		)
		.plugin('minifyify',{output:  config.upload.path+`/client_packages/HTML/${browser}/bundle.js`})
		.plugin('vueify/plugins/extract-css', {out: config.upload.path+`/client_packages/HTML/${browser}/main.css`})
		.transform(vueify,{
			publicPath: 'https://altvmp.com/HTML/',
			assetsSubDirectory: 'https://altvmp.com/HTML/',
		})
		.transform(babelify.configure({
			presets: ["es2015"]
		}))
			.bundle()
			.pipe(source('bundle.js'))
			.on('error', function(err) { console.error(err);this.emit('end');})
			.pipe(gulp.dest( `${config.upload.path}/client_packages/HTML/${browser}/`));
	});
})

let vueProdactions = browsers.map((browser)=>{
	return 'vue-browser-prodaction-'+browser;
})

gulp.task('vue-prodaction-browsers',gulp.parallel(...vueProdactions))


let vueBrowsers = browsers.map((browser)=>{
	return 'vue-browser-'+browser;
})

gulp.task('vue-browsers',gulp.parallel(...vueBrowsers))

gulp.task('default',gulp.series( 'vue-browsers',gulp.parallel('startserver','watch')));


gulp.task('deploy_server_del',()=>{
	let ssh = new Client_ssh(config_ssh);
	return ssh.exec(['rm -R -f /home/rage/server/packages'])
})
gulp.task('deploy_server',(done)=>{
	let ssh = new Client_ssh(config_ssh);
	let srcs = [
		config.upload.path+'/packages/**/*',
	]
	if(config.upload.cdn){
		srcs.push(
			'!'+config.upload.path+'/packages/server/HTML/**/*',
			'!'+config.upload.path+'/packages/server/HTML/'
		)
	}
	return	gulp.src(srcs)
		.pipe(ssh.dest('/home/rage/server/packages'))
})
gulp.task('cdn_clear_cash',(done)=>{
	msRestAzure.interactiveLogin(function(err, credentials) {
		let client = new CDNManagementClient(credentials, config.upload.subscription);
		let purgeContentPaths = [
			'/HTML/**/*',
		]
		client.endpoints.purgeContent(config.upload.cdnName, config.upload.cdnName, "west", purgeContentPaths, function(err, result, request, response) {
			if (err) {
					console.log(err);
			}
		});
	})
})
gulp.task('deploy_html_cdn',gulp.series(
	()=>{
	return gulp.src([
		config.upload.path+'/packages/server/HTML/**/*',
			'!'+config.upload.path+'/packages/server/HTML/index.js',
		])
			.pipe(deployCdn({
				containerName: 'altvmp', // container name in blob
				serviceOptions: [config.upload.cdnName,config.upload.cdnKey],
				folder: 'HTML', // path within container
				zip: true, // gzip files if they become smaller after zipping, content-encoding header will change if file is zipped
				deleteExistingBlobs: false, // true means recursively deleting anything under folder
				concurrentUploadThreads: 3, // number of concurrent uploads, choose best for your network condition
		})).on('error', gutil.log)
		// .pipe(rename(function(filePath) {
		// 	filePath.dirname = path.join('HTML', filePath.dirname);
		// }))
		
	},
	// 'cdn_clear_cash'
))

gulp.task('deploy_client_del',(done)=>{
	let ssh = new Client_ssh(config_ssh);
	return ssh.exec(['rm -R -f /home/rage/server/client_packages'])
})
gulp.task('deploy_client',(done)=>{
	let ssh = new Client_ssh(config_ssh);
	return gulp.src( config.upload.path+'/client_packages/**/*')
	.pipe(ssh.dest('/home/rage/server/client_packages'))
})
gulp.task('deploy_notificate',(done)=>{
	let ssh = new Client_ssh(config_ssh);
	return ssh
    .shell(['pm2 send 0 restart_notification'])
})
gulp.task('restartServer',(done)=>{
	let ssh = new Client_ssh(config_ssh);
	return ssh
    .shell(['pm2 restart 0'])
})

gulp.task('vue_prodaction', function() {
	process.env.NODE_ENV = 'production';
	return browserify({
		entries: "packages/server/HTML/vue/main.js",
		debug: true
	})
	
	.plugin('minifyify',{output: 'packages/server/HTML/js/bundle.js'})
	.plugin('vueify/plugins/extract-css', {out: 'packages/server/HTML/css/bundle.css'})
	.transform(vueify,{
		publicPath: 'https://altvmp.com/HTML/',
		assetsSubDirectory: 'https://altvmp.com/HTML/',
	})
	.transform(
    // Порядок необходим для обработки файлов node_modules
    { global: true },
    envify({ NODE_ENV: 'production' })
  )
	.transform(babelify.configure({
		presets: ["es2015"]
	}))
		.bundle()
		.pipe(source('bundle.js'))
		.on('error', function(err) { console.error(err);this.emit('end');})
		.pipe(gulp.dest('packages/server/HTML/js'));
});
gulp.task('removeupload',()=>{
	return del([config.upload.path+'/client_packages',config.upload.path+'/packages'],{force:true})
})
gulp.task('build', gulp.series(/*'removeupload',*/gulp.parallel('vue-prodaction-browsers','vue_prodaction'),gulp.parallel('encoder-client-side','encoder-cef'), function() {
	process.env.NODE_ENV = 'production';
	gulp.src([
		'packages/**/*',
		'!packages/server/a/debag.js',
		'!packages/server/a/copydebag.js',
		'!packages/server/HTML/**',
	]).pipe(gulp.dest(config.upload.path+'/packages'));


	gulp.src([
		'conf.json',
		'package.json',
		'package-lock.json',
	])
	.pipe(gulp.dest(config.upload.path+''));

	gulp.src('client_packages/clientside.js')
	.pipe(concat('index.js'))
	.pipe(gulp.dest(config.upload.path+'/client_packages'));

	gulp.src('client_packages/dlcpacks/**/*')
	.pipe(gulp.dest(config.upload.path+'/client_packages/dlcpacks'));

	// gulp.src([
	// 	'!client_packages/HTML/**/*.html',
	// 	'!client_packages/HTML/**/*.css',
	// 	'!client_packages/HTML/**/*.js',
	// ])
	// .pipe(gulp.dest(config.upload.path+'/client_packages/HTML'));

	gulp.src([
		'client_packages/HTML/**/*.html',
		'!client_packages/HTML/index.html',
	])
		.pipe(htmlreplace({
			'css': '../main.css',
		}))
		.pipe(gulp.dest(config.upload.path+'/client_packages/HTML'));

	gulp.src('packages/server/a/copydebag.js')
	.pipe(concat('debag.js'))
	.pipe(gulp.dest(config.upload.path+'/packages/server/a'));


	gulp.src([
		"client_packages/HTML/**/*.css",
	])
	.pipe(modifyCssUrls({
		modify(url, filePath) {
			return `${url.replace(/..\//,'')}`;
		},
		prepend: config.upload.cdnUrl,
	}))
	.pipe(cleanCSS())
	.pipe(gulp.dest(config.upload.path+'/client_packages/HTML/'));
	
	gulp.src([
		"packages/server/HTML/css/**.css",
	])
	.pipe(modifyCssUrls({
		modify(url, filePath) {
			return `${url.replace(/..\//,'')}`;
		},
		prepend: config.upload.cdnUrl,
	}))
	.pipe(cleanCSS())
	.pipe(concat('main.css'))
	.pipe(gulp.dest(config.upload.path+'/client_packages/HTML/'));

	gulp.src('packages/server/HTML/index_duplicate.html')
	.pipe(concat('index.html'))
	.pipe(gulp.dest(config.upload.path+'/client_packages/HTML'));

	return gulp.src([
		'packages/server/HTML/**/*',
		'!packages/server/HTML/index.html',
		'!packages/server/HTML/index_duplicate.html',
		"!packages/server/HTML/js/**/*.js",
		"!packages/server/HTML/css/**/*.css",
		"!packages/server/HTML/plugins/**/*",
		"!packages/server/HTML/plugins",
		"!packages/server/HTML/vue/**/*",
		"!packages/server/HTML/vue",
		"!packages/server/HTML/styles/**/*",
		"!packages/server/HTML/styles",
		'packages/server/HTML/chat/**/*',
	]).pipe(gulp.dest(config.upload.path+'/packages/server/HTML'));
}));

gulp.task( 'deploy', gulp.series(
	'build',
	'deploy_notificate',
	gulp.parallel(
		// 'deploy_html_cdn',
		gulp.series('deploy_server_del','deploy_server'),
		gulp.series('deploy_client_del','deploy_client')),
	'restartServer')

);
