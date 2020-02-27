/* eslint-disable no-var */
const dragAndDrop = () => {
  return function(selector, offsetX, offsetY, isXPath) {
    // Drag element in document with defined offset position.
    // We have to fake this since browser.moveTo() is not working for
    // firefox.
    var fireMouseEvent = function(type, element, x, y) {
      var event = document.createEvent("MouseEvents")
      event.initMouseEvent(
        type,
        true,
        type !== "mousemove",
        window,
        0,
        0,
        0,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        element
      )
      element.dispatchEvent(event)
    }
    var centerX
    var centerY
    var dragElement
    var pos

    if (isXPath) {
      dragElement = document.evaluate(
        selector,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue
    } else {
      dragElement = document.querySelector(selector)
    }
    pos = dragElement.getBoundingClientRect()
    centerX = Math.floor((pos.left + pos.right) / 2)
    centerY = Math.floor((pos.top + pos.bottom) / 2)
    fireMouseEvent("mousedown", dragElement, centerX, centerY)
    fireMouseEvent("mousemove", document, centerX + offsetX, centerY + offsetY)
    fireMouseEvent("mouseup", dragElement, centerX + offsetX, centerY + offsetY)
  }
}

module.exports = dragAndDrop
