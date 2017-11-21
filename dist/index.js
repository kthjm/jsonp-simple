'use strict'

//

var createRandom = function createRandom() {
  return Math.floor(Math.random() * 10000)
}

var createGlobalName = function createGlobalName() {
  var random = createRandom()
  var name = 'jsonp_callback_' + random
  return window[name] ? createGlobalName() : name
}

var createSrc = function createSrc(src, globalName) {
  return src.includes('?')
    ? src + '&callback=' + globalName
    : src + '?callback=' + globalName
}

var createScript = function createScript(src) {
  var script = document.createElement('script')
  script.src = src
  script.async = true
  return script
}

var createExit = function createExit(_ref) {
  var script = _ref.script,
    globalName = _ref.globalName,
    resolve = _ref.resolve,
    reject = _ref.reject

  return { succeed: succeed, fail: fail }

  function succeed(res) {
    resolve(res)
    rm()
  }
  function fail(err) {
    reject(err)
    rm()
  }
  function rm() {
    removeScript(script)
    deleteGlobalName(globalName)
  }
}

var createError = function createError(obj) {
  return {
    timeout: obj.timeout || false,
    onerror: obj.onerror || false
  }
}

var appendScript = function appendScript(script) {
  return document.head && document.head.appendChild(script)
}

var removeScript = function removeScript(script) {
  return document.head && document.head.removeChild(script)
}

var deleteGlobalName = function deleteGlobalName(globalName) {
  delete window[globalName]
}

var index = function(src) {
  var limit =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000

  if (typeof src !== 'string') {
    throw new TypeError('jsonp argument "src" must be "string"')
  }

  return new Promise(function(resolve, reject) {
    // create
    var globalName = createGlobalName()
    var script = createScript(createSrc(src, globalName))

    var _createExit = createExit({
        resolve: resolve,
        reject: reject,
        globalName: globalName,
        script: script
      }),
      succeed = _createExit.succeed,
      fail = _createExit.fail

    // prepare three exit

    var timeout = setTimeout(function() {
      return fail(createError({ timeout: true }))
    }, limit)
    script.onerror = function(e) {
      clearTimeout(timeout)
      fail(createError({ onerror: e }))
    }
    window[globalName] = function(res) {
      clearTimeout(timeout)
      succeed(res)
    }

    // action
    appendScript(script)
  })
}

module.exports = index
