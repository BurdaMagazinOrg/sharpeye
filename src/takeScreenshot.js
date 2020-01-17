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
        assertDiff(browser.checkFullPageScreen(task.tag, options))
      })

    } else if (task.element) {
      assertDiff(browser.checkElement($(task.element), task.tag, options))

    } else {
      alignHeight()
      assertDiff(browser.checkFullPageScreen(task.tag, options))
    }

  } else {
    alignHeight()
    assertDiff(browser.checkFullPageScreen(task, {}))
  }

}

const assertDiff = (result) => {
  assert.ok(
    result <= options.misMatchTolerance, 
    "Screenshot differs from reference by " + result + "%."
  )
}

module.exports = takeScreenshot