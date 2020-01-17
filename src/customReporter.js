const WDIOReporter = require("@wdio/reporter").default

class customReporter extends WDIOReporter {
  constructor(options) {
    /*
     * make reporter to write to the output stream by default
     */
    options = Object.assign(options, { stdout: true })
    super(options)
  }

  onTestEnd(test) {
    console.log(test.state.toUpperCase() + ": " + test.fullTitle)
  }
}

module.exports = customReporter