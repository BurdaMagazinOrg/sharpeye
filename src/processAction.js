const dragAndDrop = require("./dragAndDrop")
const isXPath = require("./isXPath")

/* 
 * Main task processor.
 *
 * @see https://webdriver.io/docs/api.html
 */
const processAction = (action) => {
  // Click with waiting
  if (typeof action === "object") {
    if (action.waitBefore !== undefined) {
      browser.pause(action.waitBefore)
    }

    if (action.fill) {
      action.fill.forEach(entry => {
        const element = $(entry.$)
        element.waitForDisplayed()
        element.setValue(entry.value)
      })
    }

    if (action.selector !== undefined || action.$ !== undefined) {
      const selector = action.selector || action.$
      const element = $(selector)
      element.waitForDisplayed()
      element.scrollIntoView({ block: "center" })
      element.click()
    }

    if (action.switchToFrame !== undefined) {
      // Value `null` is used to switch back to `main` frame.
      if (action.switchToFrame === null) {
        browser.switchToFrame(action.switchToFrame)
      } else {
        // Using `element` to find an iframe and providing it to `frame` method.
        $(action.switchToFrame).waitForExist()
        browser.switchToFrame($(action.switchToFrame))
      }
    }

    if (action.dragAndDrop !== undefined) {
      browser.execute(
        dragAndDrop(),
        action.dragAndDrop,
        action.offsetx,
        action.offsety,
        isXPath(action.dragAndDrop)
      )
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

module.exports = processAction
