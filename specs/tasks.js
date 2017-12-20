const assert = require('assert');
const tasks = require('../sharpeye.tasks')
const options = require('../sharpeye.conf').options

function assertDiff(results) {
  results.forEach((result) => assert.ok(result.isWithinMisMatchTolerance))
}

const baseUrl = options.baseUrl

describe('Task', function() {
  before(function() {
    browser.setViewportSize({
      width: 1280,
      height: 800
    });
  })

  let lastTask, lastTaskForPrep
  tasks.forEach(function(task, index, arr) {
    // Check, if actions, or next page call.
    if (typeof task === 'object') {
        it(task.path + ' -> ' + task.name + ': should look good', function() {
          browser.url(baseUrl + task.path)

          // Go through all actions.
          // TODO: clickpath is deprecated and will be removed
          let actions = task.clickpath ? task.clickpath : []
          actions = task.actions ? task.actions : actions
          actions.forEach(function(entry) {
            processAction(entry)
          })

          // Take a screenshot after actions.
          if (!task.noScreenshot) {
            takeScreenshot(task)
          }
          else {
            this.skip()
          }
        })
    }
    else if (task === 'reload') {
      it(task + ': should reload', function() {
        browser.refresh()
      })
    }
    else {
      lastTaskForPrep = task;
      it(task + ': should look good', function() {
        // Open next page
        browser.url(baseUrl + task)
        setScreenshotPrefix(task)
        assertDiff(browser.checkDocument())
        lastTask = task;
      })
    }
  })
})

function processAction(action) {
  // Click with waiting
  if (typeof action === 'object') {
    if (action.waitBefore !== undefined) {
      browser.pause(action.waitBefore)
    }

    if (action.selector !== undefined || action.$ !== undefined) {
      let selector = action.selector || action.$
      let offset = 0
      if (action.offset !== undefined ) {
        offset = action.offset
      }
      browser.scroll(selector, null, offset)
      if (action.fill !== undefined) {
        browser.setValue(selector, action.fill)
      }
      else if (action.replace) {
        browser.execute(replace(), selector, action.replace, isXPath(selector))
      }
      else {
        browser.click(selector)
      }
    }
    
    if (action.switchToFrame !== undefined) {
      browser.frame(action.switchToFrame)
    }

    if (action.dragAndDrop !== undefined){
      browser.execute(dragAndDrop(), action.dragAndDrop, action.offsetx, action.offsety)
    }

    if (action.wait) {
      browser.waitForVisible(action.wait)
    }
  }
  // Click only.
  else {
    browser.click(action)
  }
}

function takeScreenshot(task) {
  let options = {}

  if(task.hide) {
    options.hide = task.hide
  }

  if (task.remove) {
    options.remove = task.remove
  }

  setScreenshotPrefix(task.path + '--' + task.name)

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
}

function setScreenshotPrefix(name) {
  global.screenshotPrefix = slashToUnderscore(name);
}

function slashToUnderscore(string) {
  string = string.replace(/\//g, '_')
  string = string.substr(1)
  return string
}

function replace() {
  return function(selector, content, isXPath) {
    if (isXPath) {
      document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = content
    }
    else {
      document.querySelector(selector).innerHTML = content
    }
  }
}


function dragAndDrop() {
  return function(elemXpath, offsetX, offsetY) {
    // Drag element in document with defined offset position.
    // We have to fake this since browser.moveTo() is not working for
    // firefox.
    let fireMouseEvent = function (type, element, x, y) {
      let event = document.createEvent('MouseEvents')
      event.initMouseEvent(type, true, (type !== 'mousemove'), window, 0, 0, 0, x, y, false, false, false, false, 0, element)
      element.dispatchEvent(event)
    }

    let dragElement = document.evaluate(elemXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    let pos = dragElement.getBoundingClientRect()
    let centerX = Math.floor((pos.left + pos.right) / 2)
    let centerY = Math.floor((pos.top + pos.bottom) / 2)
    fireMouseEvent('mousedown', dragElement, centerX, centerY)
    fireMouseEvent('mousemove', document, centerX + offsetX, centerY + offsetY)
    fireMouseEvent('mouseup', dragElement, centerX + offsetX, centerY + offsetY)
  }
}

function isXPath(selector) {
  // Check if selector is XPath.
  // @see webdriverio/build/lib/helpers/findElementStrategy.js
  return (selector.indexOf('/') === 0 || selector.indexOf('(') === 0 || selector.indexOf('../') === 0 || selector.indexOf('./') === 0 || selector.indexOf('*/') === 0)
}

