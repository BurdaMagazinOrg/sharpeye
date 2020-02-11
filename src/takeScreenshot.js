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
  let screenshotOptions = Object.create(options || {})

  if (typeof task === "object") {

    if (task.tolerance) {
      screenshotOptions.misMatchTolerance = task.tolerance
    }

    if (task.replace) {
      task.replace.forEach(entry => {
        browser.execute(replaceContent(), entry.$, entry.value, isXPath(entry.$))
      })
    }

    if (task.hide) {
      screenshotOptions.hideElements = task.hide.map(selector => {
        return $$(selector)
      })
    }

    if (task.remove) {
      screenshotOptions.removeElements = task.remove.map(selector => {
        return $$(selector)
      })
    }

    if (task.viewports) {
      task.viewports.forEach(viewport => {
        alignHeight(viewport.width, viewport.height)
        browser.pause(task.pause || 0)
        assertDiff(browser.checkFullPageScreen(task.tag, screenshotOptions))
      })

    } else if (task.element) {
      assertDiff(browser.checkElement($(task.element), task.tag, screenshotOptions))

    } else if (task.fullPage) {
      // Let things settle a bit before calculating desired height.
      browser.pause(task.pause || 0)
      alignHeight()
      // Let things settle after resize.
      browser.pause(task.pause || 0)
      assertDiff(browser.checkFullPageScreen(task.tag, screenshotOptions))

    } else {
      browser.pause(task.pause || 0)
      assertDiff(browser.checkScreen(task.tag, screenshotOptions))
    }

  // Deprecated: task should be object not path only.
  } else {
    assertDiff(browser.checkFullPageScreen(task, screenshotOptions))
  }
}

const assertDiff = (result) => {
  assert.ok(
    result <= options.misMatchTolerance, 
    "Screenshot differs from reference by " + result + "%."
  )
}

module.exports = takeScreenshot
