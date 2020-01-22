/*
 * Calculate and set window size to desired (calculated)
 * viewport height.
 * This fixes issues with static and fixed elements by
 * disable the scrolling of checkFullPageScreen().
*/
const alignHeight = (width, height) => {

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

  let desiredViewport = {
    width: width ? width : 1280,
    height: height ? height : Math.max(browser.execute(function() { return document.documentElement.scrollHeight }),
      800
    )
  }
  let windowSize = browser.getWindowSize()

  browser.setWindowSize(
    windowSize.width + (desiredViewport.width - currentViewport.width),
    windowSize.height + (desiredViewport.height - currentViewport.height)
  )
}

module.exports = alignHeight
