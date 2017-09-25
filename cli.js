const program = require('commander')

program
  .version('1.1.0')
  .option('-c, --config [path]', 'Path to conig file')
  .option('-t, --tasks [path', 'Path to tasks file')
  .parse(process.argv)

module.exports = program