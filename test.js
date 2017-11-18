import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

const modules = rewire('.')

describe(`e2e`, () => {
  const jsonp = modules.default
  const url = 'https://api.github.com/users/kthjm'

  it(`timeout() => fail(true)`, () => {
    const limit = 50
    const spies = {
      appendScript: sinon.spy(),
      removeScript: sinon.spy(),
      deleteGlobalName: sinon.spy()
    }

    return modules.__with__(spies)(() =>
      jsonp(url, limit).catch(error => {
        const { appendScript, removeScript, deleteGlobalName } = spies
        assert.ok(appendScript.calledOnce)
        assert.ok(removeScript.calledOnce)
        assert.ok(deleteGlobalName.calledOnce)

        const script = appendScript.args[0][0]
        assert.ok(script.src.includes(`${url}?callback=jsonp_callback_`))

        assert.deepEqual(error, { timeout: true, onerror: false })
      })
    )
  })

  it(`script.onerror() => fail(undefined)`, () => {
    const script = {}

    const stubAndSpies = {
      createScript: sinon.stub().returns(script),
      appendScript: sinon.spy(),
      removeScript: sinon.spy(),
      deleteGlobalName: sinon.spy()
    }

    return modules.__with__(stubAndSpies)(
      () =>
        new Promise(resolve => {
          jsonp(url).catch(error => {
            const {
              appendScript,
              removeScript,
              deleteGlobalName
            } = stubAndSpies
            assert.ok(appendScript.calledOnce)
            assert.ok(removeScript.calledOnce)
            assert.ok(deleteGlobalName.calledOnce)

            assert.deepEqual(error, { timeout: false, onerror: {} })
            resolve()
          })

          script.onerror({})
        })
    )
  })

  it(`window[globalName]() => succeed()`, () => {
    const globalName = 'randomGlobalName'
    const stubAndSpies = {
      createGlobalName: sinon.stub().returns(globalName),
      appendScript: sinon.spy(),
      removeScript: sinon.spy(),
      deleteGlobalName: sinon.spy()
    }

    return modules.__with__(stubAndSpies)(
      () =>
        new Promise(resolve => {
          const callbackResponse = 'callbackResponse'

          jsonp(url).then(response => {
            const {
              appendScript,
              removeScript,
              deleteGlobalName
            } = stubAndSpies
            assert.ok(appendScript.calledOnce)
            assert.ok(removeScript.calledOnce)
            assert.ok(deleteGlobalName.calledOnce)

            assert.deepStrictEqual(response, callbackResponse)
            resolve()
          })

          window['randomGlobalName'](callbackResponse)
        })
    )
  })
})

describe(`unit`, () => {
  // https://github.com/babel/babel/issues/5426 (Error thrown when using Sinon #5426)
  it(`createGlobalName`, () => {
    const createGlobalName = modules.__get__('createGlobalName')

    const firstRandom = 1000
    const secondRandom = 2000
    const createRandom = sinon
      .stub()
      .onFirstCall()
      .returns(firstRandom)
      .onSecondCall()
      .returns(secondRandom)

    modules.__with__({ createRandom })(() => {
      const firstName = `jsonp_callback_${firstRandom}`
      const secondName = `jsonp_callback_${secondRandom}`
      window[firstName] = true
      assert.deepStrictEqual(createGlobalName(), secondName)
    })
  })

  it(`deleteGlobalName`, () => {
    const deleteGlobalName = modules.__get__('deleteGlobalName')
    const globalName = 'callbackName'

    window[globalName] = () => {}
    assert.ok(window[globalName])
    deleteGlobalName(globalName)
    assert.ok(!window[globalName])
  })

  describe(`createSrc`, () => {
    const createSrc = modules.__get__('createSrc')
    const globalName = 'callbackName'

    it(`!src.includes("?") => src?callback=globalName`, () => {
      const src = 'url'
      const result = createSrc(src, globalName)
      const expect = `${src}?callback=${globalName}`
      assert.deepStrictEqual(result, expect)
    })

    it(`src.includes("?") => src&callback=globalName`, () => {
      const src = 'url?param=value'
      const result = createSrc(src, globalName)
      const expect = `${src}&callback=${globalName}`
      assert.deepStrictEqual(result, expect)
    })
  })
})
