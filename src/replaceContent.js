const replaceContent = () => {
  return function(selector, content, isXPath) {
    if (isXPath) {
      const xPathRes = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      const nodes = [];
      let node = xPathRes.iterateNext();

      while (node) {
        nodes.push(node);
        node = xPathRes.iterateNext();
      }
      if (nodes.length) {
        nodes.forEach(function(innerNode) {
          if (innerNode.childNodes.length) {
            innerNode.innerHTML = content;
          } else {
            innerNode.nodeValue = content;
          }
        });
      }
    } else {
      document.querySelectorAll(selector).forEach(function(elem) {
        elem.innerHTML = content;
      });
    }
  };
};

module.exports = replaceContent;
