const assert = require('assert')
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
    })
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
      lastTaskForPrep = task
      it(task + ': should look good', function() {
        // Open next page
        browser.url(baseUrl + task)
        setScreenshotPrefix(task)
        assertDiff(browser.checkDocument())
        lastTask = task
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

      if (action.replace !== undefined) {
        browser.execute(replace(), selector, action.replace, isXPath(selector))
      }
      else if (action.fill !== undefined) {
        browser.scroll(selector, null, offset)
        browser.setValue(selector, action.fill)
      }
      else {
        browser.scroll(selector, null, offset)
        browser.click(selector)
      }
    }

    if (action.moveToObject !== undefined) {
      browser.moveToObject(action.moveToObject, action.offsetx, action.offsety)
    }

    if (action.switchToFrame !== undefined) {
      browser.frame(action.switchToFrame)
    }

    if (action.dragAndDrop !== undefined){
      browser.execute(dragAndDrop(), action.dragAndDrop, action.offsetx, action.offsety, isXPath(action.dragAndDrop))
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

/**
 * @see http://webdriver.io/guide/services/visual-regression.html
 */
function takeScreenshot(task) {
  let options = {}

  if(task.hide) {
    options.hide = task.hide
  }

  if (task.remove) {
    options.remove = task.remove
  }

  if (task.viewports) {
    options.viewports = task.viewports
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
  global.screenshotPrefix = slashToUnderscore(name)
}

function slashToUnderscore(string) {
  string = string.replace(/\//g, '_')
  string = string.substr(1)
  return string
}

function replace() {
  return function(selector, content, isXPath) {
    if (isXPath) {
      var xPathRes = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null)
      var nodes = []
      var node = xPathRes.iterateNext()

      while (node) {
        nodes.push(node)
        node = xPathRes.iterateNext()
      }
      if (nodes.length) {
        nodes.forEach(function(node) {
          if (node.childNodes.length) {
            node.innerHTML = content
          }
          else {
            node.nodeValue = content
          }
        })
      }
    }
    else {
      document.querySelectorAll(selector).forEach(function(elem){
        elem.innerHTML= content
      })
    }
  }
}

function dragAndDrop() {
  return function(selector, offsetX, offsetY, isXPath) {
    // Drag element in document with defined offset position.
    // We have to fake this since browser.moveTo() is not working for
    // firefox.
    let fireMouseEvent = function (type, element, x, y) {
      let event = document.createEvent('MouseEvents')
      event.initMouseEvent(type, true, (type !== 'mousemove'), window, 0, 0, 0, x, y, false, false, false, false, 0, element)
      element.dispatchEvent(event)
    }
    let dragElement

    if (isXPath) {
      dragElement = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    else {
      dragElement = document.querySelector(selector)
    }
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

