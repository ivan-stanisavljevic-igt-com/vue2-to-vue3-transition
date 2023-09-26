# betting

> Betting Web App

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production with minification without SourceMaps
npm run build nomaps

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

For dev machine (website and server on different urls):
Format the local website url to be with valid domain syntax (example : localhost.com, map this ulr in host file).
To support calls - add CORS extension to browser (will add something like "Access-Control-Allow-Origin: *" header to each response).
When explicit Access-Control-Allow-Origin header is required - run Chrome with disabled security. Example shortcut with target - "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=C:\xtemp
