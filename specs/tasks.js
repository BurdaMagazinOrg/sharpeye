const assert = require('assert')
const tasks = require('../sharpeye.tasks')
const options = require('../sharpeye.conf').options

function assertDiff(result) {
  assert.ok(result <= options.misMatchTolerance, 'Screenshot differs from reference by ' + result + '%.')
}

const baseUrl = options.baseUrl

describe('Task', function() {
  beforeEach(function() {
    browser.setWindowSize(1280, 800)
  })

  tasks.forEach(function(task, index, arr) {
    // Check, if actions, or next page call.
    if (typeof task === 'object') {
      it(task.path + ' -> ' + task.name + ': should look good', function() {
        if (task.viewports) {
          alignHeight(task.viewports[0].width, task.viewports[0].height)
        }
        browser.url(baseUrl + task.path)
        task.tag = sanitize(task.path + '-' + task.name)
        task.misMatchTolerance = options.misMatchTolerance
        // Go through all actions.
        let actions = task.actions ? task.actions : []
        actions.forEach(function(entry) {
          processAction(entry)
        })

        // Take a screenshot after actions.
        if (!task.noScreenshot) {
          takeScreenshot(task)
        }
      })
    }
    else if (task === 'reload') {
      it(task + ': should reload', function() {
        browser.refresh()
      })
    }
    else {
      it (sanitize(task) + ': should look good', function() {
        // Open next page
        browser.url(baseUrl + task)
        alignHeight()
        assertDiff(browser.checkFullPageScreen(sanitize(task), {}))
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

    if (action.fill) {
      action.fill.forEach(function(entry) {
        const element = $(entry.$)
        element.waitForDisplayed()
        element.setValue(entry.value)
      })
    }

    if (action.selector !== undefined || action.$ !== undefined) {
      const selector = action.selector || action.$
      const element = $(selector)
      element.waitForDisplayed()
      element.scrollIntoView({block: 'center'})
      element.click()
    }

    if (action.switchToFrame !== undefined) {
      // Value `null` is used to switch back to `main` frame.
      if (action.switchToFrame === null) {
        browser.switchToFrame(action.switchToFrame)
      }
      else {
        // Using `element` to find an iframe and providing it to `frame` method.
        $(action.switchToFrame).waitForExist()
        browser.switchToFrame($(action.switchToFrame))
      }
    }

    if (action.dragAndDrop !== undefined){
      browser.execute(dragAndDrop(), action.dragAndDrop, action.offsetx, action.offsety, isXPath(action.dragAndDrop))
    }

    if (action.moveto) {
      $(action.moveto.$).moveTo(action.moveto.xoffset, action.moveto.yoffset)
    }

    if (action.wait) {
      $(action.wait).waitForDisplayed()
    }
  }
  // Click only.
  else {
    element.click(action)
  }
}

/**
 * @see http://webdriver.io/guide/services/visual-regression.html
 */
function takeScreenshot(task) {
  let options = {}


  if (task.replace) {
    task.replace.forEach(function(entry) {
      browser.execute(replace(), entry.$, entry.value, isXPath(entry.$))
    })
  }

  if (task.hide) {
    options.hideElements = task.hide.map(function(selector) { 
      return $$(selector)
    })
  }

  if (task.remove) {
    options.removeElements = task.remove.map(function(selector) {
      return $$(selector)
    })
  }

  if (task.viewports) {
    task.viewports.forEach(function(viewport) {
      alignHeight(viewport.width, viewport.height)
      assertDiff(browser.checkFullPageScreen(task.tag, options))
    })
  }
  else if (task.element) {
    
    assertDiff(browser.checkElement($(task.element), task.tag, options))
  }
  else {
    alignHeight()
    assertDiff(browser.checkFullPageScreen(task.tag, options))
  }
}

// Calculate and set window size to desired (calculated)
// viewport height.
// This fixes issues with static and fixed elements by 
// disable the scrolling of checkFullPageScreen(). 
function alignHeight(width, height) {
  let currentViewport = browser.execute(function() {
    return {
      width: Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      ),
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    }
  })
  // Let things settle a bit before getting scrollHeight.
  browser.pause(1000)

  let desiredViewport = {
    width: width ? width : 1280,
    height: height ? height : Math.max(
      browser.execute(function() { return document.documentElement.scrollHeight }),
      800
    )
  }
  let windowSize = browser.getWindowSize()

  browser.setWindowSize(
    windowSize.width +
      (desiredViewport.width - currentViewport.width),
    windowSize.height +
      (desiredViewport.height - currentViewport.height)
  )
  // Let things settle after resize.
  browser.pause(1000)
}

function sanitize(string) {
  return string.replace(/[^a-z0-9_\-]/gi, '_').replace(/^_/, '').toLowerCase()
}

function replace() {
  return function(selector, content, isXPath) {
    if (isXPath) {
      var xPathRes = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      )
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
          } else {
            node.nodeValue = content
          }
        })
      }
    } else {
      document.querySelectorAll(selector).forEach(function(elem) {
        elem.innerHTML = content
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
