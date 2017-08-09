var path = require('path')
var Launcher = require('webdriverio').Launcher;

const opts = {
  configFile: path.resolve(__dirname, 'wdio.conf.js')
}

var wdio = new Launcher(opts.configFile, opts);
wdio.run().then(function (code) {
  process.exit(code);
}, function (error) {
  console.error('Launcher failed to start the test', error.stacktrace);
  process.exit(1);
});

