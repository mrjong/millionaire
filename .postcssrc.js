// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
      "browsers": [
        "> 1%",
        "last 10 versions"
      ]
    },
    "postcss-pxtorem": {
      "rootValue": 100,
      "unitPrecision": 5,
      "propList": ['*'],
      "selectorBlackList": [],
      "replace": true,
      "mediaQuery": false,
      "minPixelValue": 0
    }
  }
}
