const assert = require("assert")
const options = require("../sharpeye.conf").options

const alignHeight = require("./alignHeight")
const isXPath = require("./isXPath")
const replaceContent = require("./replaceContent")


/**
 * Use webdriver image comparison service.
 * 
 * @see https://github.com/wswebcreation/webdriver-image-comparison
 */
const takeScreenshot = task => {
  let options = {}
  
  if (typeof task === "object") {

    if (task.replace) {
      task.replace.forEach(entry => {
        browser.execute(replaceContent(), entry.$, entry.value, isXPath(entry.$))
      })
    }

    if (task.hide) {
      options.hideElements = task.hide.map(selector => {
        return $$(selector)
      })
    }

    if (task.remove) {
      options.removeElements = task.remove.map(selector => {
        return $$(selector)
      })
    }

    if (task.viewports) {
      task.viewports.forEach(viewport => {
        alignHeight(viewport.width, viewport.height)
        browser.pause(task.pause || 1500)

        if (task.resetMouse) {
          resetMouse()
        }
        assertDiff(browser.checkFullPageScreen(task.tag, options))
      })

    } else if (task.element) {
      assertDiff(browser.checkElement($(task.element), task.tag, options))

    } else if (task.fullPage) {
      // Let things settle a bit before calculating desired height.
      browser.pause(task.pause || 1500)
      alignHeight()
      // Let things settle after resize.
      browser.pause(task.pause || 1500)

      if (task.resetMouse) {
        resetMouse()
      }
      assertDiff(browser.checkFullPageScreen(task.tag, options))

    } else {

      if (task.resetMouse) {
        resetMouse()
      }
      assertDiff(browser.checkScreen(task.tag, options))
    }

  // Deprecated: task should be object not path only.
  } else {
    assertDiff(browser.checkFullPageScreen(task, {}))
  }
}

const assertDiff = (result) => {
  assert.ok(
    result <= options.misMatchTolerance, 
    "Screenshot differs from reference by " + result + "%."
  )
}

const resetMouse = () => {
  browser.performActions([{
    type: "pointer",
    id: "finger1",
    parameters: {
      pointerType: "mouse"
    },
    actions: [
      {
        type: "pointerMove",
        origin: "viewport",
        duration: 100,
        x: 0,
        y: 0
      },
      { "type": "pause", "duration": 500 }
    ]
  }])
}

module.exports = takeScreenshot
