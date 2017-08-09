const assert = require('assert');
const tasks = require('../../sharpeye.tasks')
const options = require('../../sharpeye.conf').options

function assertDiff(results) {
  results.forEach((result) => assert.ok(result.isWithinMisMatchTolerance))
}

const baseUrl = options.baseUrl
const user = options.user
const pass = options.pass

describe('Task', function() {
  before(function() {
    browser.url( baseUrl + '/user/login' )
    browser.setValue('form#user-login-form [name="name"]', user)
    browser.setValue('form#user-login-form [name="pass"]', pass)
    browser.submitForm('form#user-login-form')
    browser.waitForExist('#toolbar-administration')
  })

  let lastTask, lastTaskForPrep
  tasks.forEach(function(task, index, arr) {
    // Check, if click path, or next page.
    if (typeof task === 'object') {
        it(task.path + ' -> ' + task.name + ' should look good', function() {
          browser.url(baseUrl + task.path)
          // Go through the whole click path.
          task.clickpath.forEach(function(entry) {
            // Click with waiting
            if (typeof entry === 'object') {
              if (entry.waitBefore !== undefined) {
                browser.pause(entry.waitBefore)
              }
              if (entry.selector !== undefined) {
                let offset = 0
                if (entry.offset !== undefined ) {
                  offset = entry.offset
                }
                browser.scroll(entry.selector, null, offset)
                browser.click(entry.selector)
              }
              if (entry.switchToFrame !== undefined) {
                browser.frame(entry.switchToFrame)
              }

              if(entry.wait) {
                browser.waitForVisible(entry.wait)
              }
            }
            // Click only.
            else {
              browser.click(entry)
            }
          })
          // Take a screenshot after click path.
          setScreenshotPrefix(task.path + '->' + task.name)
          let report
          if (task.viewport) {
            report = browser.checkViewport()
          }
          else if (task.element) {
            report = browser.checkElement(task.element)
          }
          else {
            report = browser.checkDocument()
          }

          assertDiff(report)
        })
    }
    else if (task === 'reload') {
      it(task + ' should reload', function() {
        browser.refresh()
      })
    }
    else {
      lastTaskForPrep = task;
      it(task + ' should look good', function() {
        // Open next page
        browser.url(baseUrl + task)
        setScreenshotPrefix(task)
        assertDiff(browser.checkDocument())
        lastTask = task;
      })
    }
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
