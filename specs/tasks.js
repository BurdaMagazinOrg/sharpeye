const tasks = require("../sharpeye.tasks")
const options = require("../sharpeye.conf").options
const baseUrl = options.baseUrl

const alignHeight = require("../src/alignHeight")
const processAction = require("../src/processAction")
const sanitizeTag = require("../src/sanitizeTag")
const takeScreenshot = require("../src/takeScreenshot")

describe("Task", function() {
  this.retries(5)
  beforeEach(function() {
    alignHeight(1280, 800)
  })

  tasks.forEach(function(task, index, arr) {
    // Check, if actions, or next page call.
    if (typeof task === "object") {
      it(task.path + (task.name ? " -> " + task.name : "") + ": should look good", () => {
        if (task.viewports) {
          alignHeight(task.viewports[0].width, task.viewports[0].height)
        }
        browser.url(baseUrl + task.path)
        task.tag = sanitizeTag(task.path + (task.name ? "-" + task.name : ""))
        task.misMatchTolerance = options.misMatchTolerance
        // Go through all actions.
        let actions = task.actions ? task.actions : []
        actions.forEach(
          entry => processAction(entry)
        )

        // Take a screenshot after actions.
        if (!task.noScreenshot) {
          takeScreenshot(task)
        }
      })
    }
    else if (task === "reload") {
      it(task + ": should reload", () => {
        browser.refresh()
      })
    }
    else {
      it(sanitizeTag(task) + ": should look good", () => {
        // Open next page
        browser.url(baseUrl + task)
        takeScreenshot(sanitizeTag(task))
      })
    }
  })
})
