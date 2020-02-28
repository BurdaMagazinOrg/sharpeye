// Options for sharpeye
exports.options = {
  // The base URL of the website.
  baseUrl: "http://localhost:8888",
  // Specify the mismatch tolerance of the comparison.
  misMatchTolerance: 0
}

// Webdriver.io config overwrites.
exports.config = {
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // https://sites.google.com/a/chromium.org/chromedriver/capabilities
  // https://github.com/mozilla/geckodriver/blob/master/README.md#webdriver-capabilities
  //
  port: 9515,
  deprecationWarnings: false,
  logLevel: "silent",
  capabilities: [] // Will be overriden when using --single-browser option
}

// Additional capabilities for certain browsers when using --single-browser option.
exports.capabilities = {
  firefox: {
    browserName: "firefox",
    "moz:firefoxOptions": {
      args: ["--sync"],
      prefs: {
        "dom.ipc.processCount": 8
      }
    }
  },
  chrome: {
    browserName: "chrome",
    "goog:chromeOptions": {
      w3c: true
    }
  }
}
