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
    browser.setViewportSize({
      width: 1280,
      height: 800
    });
    browser.url( baseUrl + '/user/login' )
    browser.setValue('form#user-login-form [name="name"]', user)
    browser.setValue('form#user-login-form [name="pass"]', pass)
    browser.submitForm('form#user-login-form')
    browser.waitForExist('#toolbar-administration')
  })

  let lastTask, lastTaskForPrep
  tasks.forEach(function(task, index, arr) {
    // Check, if actions, or next page call.
    if (typeof task === 'object') {
        it(task.path + ' -> ' + task.name + ' should look good', function() {
          browser.url(baseUrl + task.path)

          // Go through all actions.
          // TODO: clickpath is deprecated and will be removed
          let actions = task.clickpath ? task.clickpath : []
          actions = task.actions ? task.actions : actions
          actions.forEach(function(entry) {
            // Click with waiting
            if (typeof entry === 'object') {
              if (entry.waitBefore !== undefined) {
                browser.pause(entry.waitBefore)
              }
              if (entry.selector !== undefined || entry.$ !== undefined) {
                let selector = entry.selector || entry.$
                let offset = 0
                if (entry.offset !== undefined ) {
                  offset = entry.offset
                }
                browser.scroll(selector, null, offset)
                if (entry.fill !== undefined) {
                  browser.setValue(selector, entry.fill)
                }
                else {
                  browser.click(selector)
                }
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

          // Take a screenshot after actions.
          let options = {}

          if(task.hide) {
            options.hide = task.hide
          }
          if (task.remove) {
            options.remove = task.remove
          }

          setScreenshotPrefix(task.path + '->' + task.name)
          let report
          if (task.viewport) {
            report = browser.checkViewport(options)
          }
          else if (task.element) {
            report = browser.checkElement(task.element, options)
          }
          else {
            report = browser.checkDocument(options)
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
