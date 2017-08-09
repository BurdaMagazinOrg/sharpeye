# SharpEye
This tool goes through a list of tasks with URLs or click paths, makes screenshots of them and compares them.

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
  // Specify directory, in which screenshots should be saved.
  screenshotDirectory: 'screenshots'
}

// Webdriver.io config overwrites.
// See the sharpeye.conf.js file in the root of the sharpeye module
exports.config = {
  // Define, which browser you want to use
  //
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
