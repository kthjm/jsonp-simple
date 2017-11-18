// @flow

const createRandom = () => Math.floor(Math.random() * 10000)

const createGlobalName = () => {
  const random = createRandom()
  const name = `jsonp_callback_${random}`
  return window[name] ? createGlobalName() : name
}

const createSrc = (src, globalName) =>
  src.includes('?')
    ? `${src}&callback=${globalName}`
    : `${src}?callback=${globalName}`

const createScript = src => {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  return script
}

const createExit = ({ script, globalName, resolve, reject }) => {
  return { succeed, fail }

  function succeed(res) {
    resolve(res)
    rm()
  }
  function fail(timeout) {
    reject(timeout)
    rm()
  }
  function rm() {
    removeScript(script)
    deleteGlobalName(globalName)
  }
}

const createError = obj =>
  Object.assign({ timeout: false, onerror: false }, obj)

const appendScript = script =>
  document.head && document.head.appendChild(script)

const removeScript = script =>
  document.head && document.head.removeChild(script)

const deleteGlobalName = globalName => {
  delete window[globalName]
}

export default (src: string, limit: number = 2000): Promise<*> =>
  new Promise((resolve, reject) => {
    // create
    const globalName = createGlobalName()
    const script = createScript(createSrc(src, globalName))
    const { succeed, fail } = createExit({
      resolve,
      reject,
      globalName,
      script
    })

    // prepare three exit
    const timeout = setTimeout(
      () => fail(createError({ timeout: true })),
      limit
    )
    script.onerror = e => {
      clearTimeout(timeout)
      fail(createError({ onerror: e }))
    }
    window[globalName] = res => {
      clearTimeout(timeout)
      succeed(res)
    }

    // action
    appendScript(script)
  })
