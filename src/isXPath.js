// Check if selector is XPath.
// @see webdriverio/build/lib/helpers/findElementStrategy.js
const isXPath = selector => {
  return (
    selector.indexOf("/") === 0 ||
    selector.indexOf("(") === 0 ||
    selector.indexOf("../") === 0 ||
    selector.indexOf("./") === 0 ||
    selector.indexOf("*/") === 0
  );
};

module.exports = isXPath;
