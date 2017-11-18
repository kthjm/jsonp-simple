# jsonp simple

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![CircleCI](https://img.shields.io/circleci/project/github/kthjm/jsonp-simple.svg?style=flat-square)](https://circleci.com/gh/kthjm/jsonp-simple)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/jsonp-simple.svg?style=flat-square)](https://codecov.io/gh/kthjm/jsonp-simple)

## Installation
```shell
```
## Usage
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
