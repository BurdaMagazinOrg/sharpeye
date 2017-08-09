const assert = require('assert');
const tasks = require('../../tasks')

function assertDiff(results) {
  results.forEach((result) => assert.ok(result.isWithinMisMatchTolerance))
}

/*suite('thunder page', function() {
    test('should load and make screenshot', function () {
        browser.url('http://thunder.dd:8083');
        this.test.taskName = "Whaddup?"
        global.taskName = "HELLO";
        const report = browser.checkDocument();
        assertDiff(report)
    });
});*/



var baseUrl = /*casper.cli.get('url') || */'http://thunder.dd:8083'
var user = /*casper.cli.get('user') || */'admin'
var pass = /*casper.cli.get('pass') || */'1234'

suite('All URLs and clickpaths', function() {
  setup(function() {
    browser.url( baseUrl + '/user/login' )
    browser.setValue('form#user-login-form [name="name"]', user)
    browser.setValue('form#user-login-form [name="pass"]', pass)
    browser.submitForm('form#user-login-form')
    browser.waitForExist('#toolbar-administration')
  })

  test('should look good', function() {
    let lastTask
    tasks.forEach(function(task, index, arr) {
      // Check, if click path, or next page.
      if (Array.isArray(task)) {
        // Go through the whole click path.
        task.forEach(function(selector) {
            // Click with waiting
            if (typeof selector == 'object') {
              browser.click(selector.selector)
              browser.waitForVisible(selector.wait)
            }
            // Click only.
            else {
              browser.click(selector)
            }
        })
        // Take a screenshot after click path.
        setScreenshotPrefix(lastTask + '_click')
        assertDiff(browser.checkDocument())
      }
      else if (task === 'reload') {
        // casper.reload()
        browser.refresh()
      }
      else {
        // Open next page
        browser.url(baseUrl + task)
        setScreenshotPrefix(task)
        assertDiff(browser.checkDocument())
        lastTask = task;
      }
    })
  })
})

function setScreenshotPrefix(name) {
  global.screenshotPrefix = slashToUnderscore(name);
}

function slashToUnderscore(string) {
  string = string.replace(/\//g, '_')
  string = string.substr(1)
  return string
}
