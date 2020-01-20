const replaceContent = () => {
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

module.exports = replaceContent
