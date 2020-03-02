const WDIOReporter = require("@wdio/reporter").default

class customReporter extends WDIOReporter {
  // eslint-disable-next-line class-methods-use-this
  onTestEnd(test) {
    console.log(`${test.state.toUpperCase()}: ${test.fullTitle}`)
  }
}

module.exports = customReporter
