'use strict';

import gulp from 'gulp';
import chalk from 'chalk';
import nodemon from 'gulp-nodemon';
import forever from 'forever';
import livereload from 'gulp-livereload';
import lodash from 'lodash';
import * as build from './build';

var nodemonInstance;

function start(done) {
  nodemonInstance = nodemon({
    script: './modules/modern-mean-core-material/dist/server/app/server.js',
    watch: ['noop'],
    nodeArgs: ['--debug']
  });
  return done();
}
start.displayName = 'Nodemon Start Server';

function restart(done) {
  nodemonInstance.restart();
  return nodemonInstance.on('start', function () {
    return done();
  });
}
restart.displayName = 'Nodemon Restart Server';

function watchClient(done) {
  let watchFiles = ['./modules/*/dist/client/**/*.*'];
  livereload.listen();
  gulp.watch(watchFiles, gulp.series(terminalClear, build.modules, build.inject, restart, livereloadChanged));
  return done();
}
watchClient.displayName = 'Serve::Watch::Client';

function watchServer(done) {
  let watchFiles = ['./modules/*/dist/server/**/*.*'];
  gulp.watch(watchFiles, gulp.series(terminalClear, build.modules, build.inject, restart, livereloadChanged));
  return done();
}
watchServer.displayName = 'Serve::Watch::Server';

function livereloadChanged(done) {
  setTimeout(function () {
    livereload.changed('Restart Client');
  }, 1000);
  return done();
}
livereloadChanged.displayName = 'Serve::LiveReload::Changed';

function terminalClear(done) {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
  if (done) {
    return done();
  }
}
/*
function startForever(done) {
  let config = mergeEnvironment();

  forever.startDaemon('./build/core/server/app/server.js', config.serve.forever);
  console.log(chalk.yellow.bold('ModernMean Production server running as Forever Daemon'));
  console.log(chalk.yellow.bold('You can now use any forever command line options'));
  console.log(chalk.yellow.bold('https://github.com/foreverjs/forever'));
  return done();


}
*/

let watch = {
  all: gulp.parallel(watchClient, watchServer),
  client: watchClient,
  server: watchServer
}

export {
  start,
  restart,
  watch,
  terminalClear as clear
  //startForever as forever
};
