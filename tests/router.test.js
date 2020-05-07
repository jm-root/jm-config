const env = require('../config/development')
const lib = require('../lib/index')

let router = null
beforeAll(() => {
  router = lib(env).router()
})

describe('service config.js', () => {
  var params = {
    root: 'test:abc',
    value: {
      KFC: 110,
      Google: {
        from: 'USA'
      }
    },
    expire: 0,
    json: false
  }

  var paramOne = {
    root: 'test:abc',
    key: 'xyz',
    value: {
      high: 123
    },
    expire: 600,
    json: false
  }

  test('help', async () => {
    let doc = await router.get('/')
    expect(doc).toEqual({
      status: 1,
      name: 'jm-config',
      version: '2.0.0'
    })
  })

  test('setConfigs', async () => {
    let doc = await router.post(`/${params.root}`, params)
    if (!doc.err) {
      expect(typeof doc.ret).toBe('boolean')
    }
  })

  test('listConfig', async () => {
    let doc = await router.get(`/${params.root}`)
    if (!doc.err) {
      expect(doc.rows).toEqual(Object.keys(params.value))
    }
  })

  test('listConfig with param all', async () => {
    let doc = await router.get(`/${params.root}`, { all: 1 })
    if (!doc.err) {
      expect(doc).toEqual(params.value)
    }
  })

  test('setConfig', async () => {
    let doc = await router.post(`/${paramOne.root}/${paramOne.key}`, paramOne)
    if (!doc.err) {
      expect(typeof doc.ret).toBe('boolean')
    }
  })

  test('getConfig', async () => {
    let doc
    for (let k of Object.keys(params.value)) {
      doc = await router.get(`/${params.root}/${k}`)
      if (!doc.err) {
        expect(doc.ret).toEqual(params.value[k])
      }
    }
    doc = await router.get(`/${paramOne.root}/${paramOne.key}`)
    expect(doc.ret).toEqual(paramOne.value)
  })

  test('delConfig', async () => {
    let doc = await router.delete(`/${paramOne.root}/${paramOne.key}`)
    expect(typeof doc.ret).toBe('boolean')
  })

  test('delConfig with param all', async () => {
    let doc = await router.delete(`/${paramOne.root}/${paramOne.key}`, { all: 1 })
    expect(typeof doc.ret).toBe('boolean')
  })

  test('delRoot', async () => {
    let doc = await router.delete(`/${paramOne.root}`)
    if (!doc.err) {
      expect(typeof doc.ret).toBe('boolean')
    }
  })
})
