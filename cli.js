const program = require('commander')

program
  .version(require('./package.json').version)
  .option('-c, --config [path]', 'Path to conig file')
  .option('-t, --tasks [path]', 'Path to tasks file')
  .option('-b, --single-browser [name]', 'Name for browser that will be used for execution')
  .option('-u, --base-url [url]', 'Base url of website, e.g. http://localhost:8080')
  .option('-p, --selenium-port [port]', 'Selenium server port')
  .option('--login-user [user]', 'User name for login form')
  .option('--login-pass [pass]', 'Password for login form')
  .parse(process.argv)

module.exports = program
