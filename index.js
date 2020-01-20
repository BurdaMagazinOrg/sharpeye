#!/usr/bin/env node

const path = require("path")
const Launcher = require("@wdio/cli").default

// This will give the user information about available options
// This will give the user information about available options
require("./cli").default


const opts = {
  configFile: path.resolve(__dirname, "sharpeye.conf.js"),
}

const wdio = new Launcher(opts.configFile, opts)
wdio.run().then(function (code) {
  process.exit(code)
}, function (error) {
  console.error("Launcher failed to start the test", error.stacktrace)
  process.exit(1)
})
