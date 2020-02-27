module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:wdio/recommended"
  ],
  "plugins": [
    "wdio"
  ],
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-console": "off",
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ]
  }
};
