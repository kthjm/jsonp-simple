# jsonp-simple

[![npm](https://img.shields.io/npm/v/jsonp-simple.svg?style=flat-square)](https://www.npmjs.com/package/jsonp-simple)
[![npm](https://img.shields.io/npm/dm/jsonp-simple.svg?style=flat-square)](https://www.npmjs.com/package/jsonp-simple)
[![cdn](https://img.shields.io/badge/jsdelivr-link-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/jsonp-simple/dist/jsonp-simple.min.js)

[![CircleCI](https://img.shields.io/circleci/project/github/kthjm/jsonp-simple.svg?style=flat-square)](https://circleci.com/gh/kthjm/jsonp-simple)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/jsonp-simple.svg?style=flat-square)](https://codecov.io/gh/kthjm/jsonp-simple)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Usage

### Browser
```html
<script src="https://cdn.jsdelivr.net/npm/jsonp-simple/dist/jsonp-simple.min.js"></script>
<script>
  jsonpSimple("https://api.github.com/repos/kthjm/jsonp-simple", 4000)
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
</script>
```

### Node (bundle for Browser)
```shell
yarn add jsonp-simple
```
```js
import jsonp from "jsonp-simple"

jsonp("https://api.github.com/repos/kthjm/jsonp-simple", 4000)
.then((res) => console.log(res))
.catch((err) => console.error(err))
```
## API

### `jsonp(src[, limit])`

`src: string`

`limit: number = 2000`

### `error`

`timeout: boolean`

`onerror: Event | false`

## License
MIT (http://opensource.org/licenses/MIT)
