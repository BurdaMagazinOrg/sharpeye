module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
	"mocha": true
    },
    "plugins": [
      "wdio"
    ],
    "extends": "plugin:wdio/recommended",
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
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
