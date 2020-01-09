const assert = require('assert')
const tasks = require('../sharpeye.tasks')
const options = require('../sharpeye.conf').options

function assertDiff(result) {
  assert.ok(result <= options.misMatchTolerance, "Screenshot differs from reference by " + result + "%."
  )
}

const baseUrl = options.baseUrl

describe('Task', function() {
  before(function() {
    browser.setWindowSize(1280, 800)
  })

  let lastTask, lastTaskForPrep
  tasks.forEach(function(task, index, arr) {
    // Check, if actions, or next page call.
    if (typeof task === 'object') {
        it(task.path + " -> " + task.name + ": should look good", () => {
          browser.url(baseUrl + task.path)
          task.tag = sanitize(task.path + "-" + task.name)
          task.misMatchTolerance = options.misMatchTolerance
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
        })
    }
    else if (task === 'reload') {
      it(task + ": should reload", () => {
        browser.refresh()
      })
    }
    else {
      lastTaskForPrep = task
      it (sanitize(task) + ": should look good", () => {
        // Open next page
        browser.url(baseUrl + task)
        assertDiff(browser.checkFullPageScreen(sanitize(task), {}))
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

    if (action.fill) {
      action.fill.forEach(entry => {
        $(entry.$).setValue(entry.value)
      })
    }

    if (action.selector !== undefined || action.$ !== undefined) {
      const selector = action.selector || action.$
      const element = $(selector)
      element.waitForDisplayed()
      element.scrollIntoView({block: 'center'})
      element.click()
    }

    // if (action.moveToObject !== undefined) {
    //   browser.moveTo(action.moveToObject, action.offsetx, action.offsety)
    // }

    if (action.switchToFrame !== undefined) {
      // Value `null` is used to switch back to `main` frame.
      if (action.switchToFrame === null) {
        browser.frame(action.switchToFrame)
      }
      else {
        // Using `element` to find an iframe and providing it to `frame` method.
        $(action.switchToFrame).waitForExist()
        browser.frame(browser.element(action.switchToFrame).value)
      }
    }

    if (action.dragAndDrop !== undefined){
      browser.execute(dragAndDrop(), action.dragAndDrop, action.offsetx, action.offsety, isXPath(action.dragAndDrop))
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
    task.replace.forEach(entry => {
      browser.execute(replace(), entry.$, entry.value, isXPath(entry.$))
    })
  }

  if (task.hide) {
    options.hideElements = task.hide.map(selector => { 
      return $(selector)
    })
  }

  if (task.remove) {
    options.removeElements = task.remove.map(selector => {
      return $(selector)
    })
  }

  if (task.viewports) {
    task.viewports.each((viewport) => {
      browser.setWindowSize(viewport.width, viewport.height)
      assertDiff(browser.checkFullPageScreen(task.tag, options))
    })
  }
  else if (task.element) {
    assertDiff(browser.checkElement(task.element, task.tag, options))
  }
  else {
    // options.hideAfterFirstScroll = [
    //   "#toolbar-administration",
    //   ".content-form__actions"
    // ]
    //   .map(selector => {
    //     return $(selector)
    //   })
    //   .filter(elem => {
    //     return !elem.error
    //   })
    // browser.execute("return Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight )")

    // Fix scrolling in checkFullPageScreen()
    browser.setWindowSize(
      1280,
      //        ,---.
      //     ,.'-.   \
      //    ( ( ,'"""""-.
      //    `,X          `.
      //    /` `           `._
      //   (            ,   ,_\
      //   |          ,---.,'o `.
      //   |         / o   \     )
      //    \ ,.    (      .____,
      //     \| \    \____,'     \
      //   '`'\  \        _,____,'
      //   \  ,--      ,-'     \
      //     ( C     ,'         \
      //      `--'  .'           |
      //        |   |         .O |
      //      __|    \        ,-'_
      //     / `L     `._  _,'  ' `.
      //    /    `--.._  `',.   _\  `
      //    `-.       /\  | `. ( ,\  \
      //   _/  `-._  /  \ |--'  (     \
      //  '  `-.   `'    \/\`.   `.    )
      //        \  150px?   \ `.  |    |
      browser.execute("return document.body.scrollHeight") + 150
    )
    assertDiff(browser.checkFullPageScreen(task.tag, options))
  }
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
