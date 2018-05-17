const program = require('commander')

program
  .version(require('./package.json').version)
  .option('-c, --config [path]', 'Path to conig file')
  .option('-t, --tasks [path', 'Path to tasks file')
  .option('-b, --single-browser [name]', 'Name for browser that will be used for execution')
  .parse(process.argv)

module.exports = program
