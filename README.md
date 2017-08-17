# SharpEye
This tool goes through a list of tasks with URLs or click paths, makes screenshots of them and compares them.

## Installation
You need to install selenium and the browsers you want to test.

## Usage
`npm install burdamagazinorg/sharpeye`

Configure your project as described in this document

Execute`./node_modules/.bin/sharpeye` once to create reference images.  
If you execute it again, the new screenshots will be compared to the reference.  
(You can also add `sharpeye` to the scripts section in you `package.json`)

If there is a difference, the diff image will be placed in the screenshot subdirectory `diff`.


## Configuration

Create a file `sharpeye.conf.js` and `sharpeye.tasks.js` in your project directory, with following contents:

sharpeye.conf.js:
```
// Options for sharpeye
exports.options = {
  // The base URL of the website.
  baseUrl: 'http://thunder.dd:8083',
  // Username of admin user.
  user: 'admin',
  // Password of admin user.
  pass: '1234',
  // Specify directories, in which screenshots should be saved.
  // They will get a postfix of '/screen', '/reference' and '/diff', respectively.
  screenBaseDirectory: process.cwd() + '/screenshots',
  referenceBaseDirectory: process.cwd() + '/screenshots',
  diffBaseDirectory: process.cwd() + '/screenshots'
}

// Webdriver.io config overwrites.
// See the sharpeye.conf.js file in the root of the sharpeye module
exports.config = {

  // Define, which browser you want to use
  // See: https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
  capabilities: [
    {
      browserName: 'firefox'
    },
    {
      browserName: 'chrome'
    }
  ]
};

```

sharpeye.tasks.js:

For taking a full-page screenshot of a URL, just specify the path as string. e.g.:
`/my/path`

To click some elements and take a screenshot afterwards, you can specify an object, with following properties:

- `name`: The name of the clickpath. Will be used for the screenshot filename
- `path`: The URL path to start from
- `element`: (optional) The element, from which a screenshot should be taken
- `viewport`: (optional) Whether the viewport should be captured, instead of the whole page
- `clickpath`: An array of objects, which specify, where to click and for what t wait for

The clickpath object have following properties:
- `selector`: The selector, on which should be clicked
- `wait`: The element, which should be waited for, after clicking
- `waitBefore`: (optional) time in milliseconds, to be waited, before clicking
- `offset`: (optional) an offset in y direction, to be scrolled (useful, when elements are hidden behind floating elements)

The clickpath can also contain an object, which switches the context to another frame. This object can have following properties:
- `switchToFrame`: ID of the (i)frame, to switch to, or `null`, to switch back to the default frame
- `wait`: After switching, element to wait for, before continuing


```
module.exports = [
  '/admin/content',
  { name: 'name of the click path',
    path: '/node/add/article',
    [element: 'selector for DOM-element from which the screenshot should be made'],
    [viewport: true // makes screenshot of the viewport, instead of the whole page],
    clickpath: [
      { selector: 'DOM selector', wait: 'DOM selector to wait until visible', [waitBefore: 'optional time in milliseconds, which should pass, before clicking']},
      { switchToFrame: 'ID of frame', wait: 'DOM selector to wait until visible inside frame' },
      { switchToFrame: null } // switch to default context
  ]},
]

```

Different types of selectors can be used: http://webdriver.io/guide/usage/selectors.html
