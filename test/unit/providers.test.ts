import fs from 'fs-extra'

import { cleanDoubleSlashes } from '~/runtime/utils'
import * as local from '~/runtime/providers/ipx'
import * as cloudinary from '~/runtime/providers/cloudinary'
import * as twicpics from '~/runtime/providers/twicpics'
import * as fastly from '~/runtime/providers/fastly'
import * as imgix from '~/runtime/providers/imgix'
import * as imagekit from '~/runtime/providers/imagekit'

const images = [
  {
    args: ['/test.png', {}],
    local: { isStatic: true, url: '/_image/local/remote/_/_/http%3A%2F%2Flocalhost%3A3000%2Ftest.png' },
    cloudinary: { url: '/f_auto,q_auto/test' },
    twicpics: { url: '/test.png' },
    fastly: { url: '/test.png' },
    imgix: { url: '/test.png' },
    imagekit: { url: '/test.png' }
  },
  {
    args: ['/test.png', { width: 200 }],
    local: { isStatic: true, url: '/_image/local/remote/_/w_200/http%3A%2F%2Flocalhost%3A3000%2Ftest.png' },
    cloudinary: { url: '/f_auto,q_auto,w_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x-' },
    fastly: { url: '/test.png?width=200' },
    imgix: { url: '/test.png?w=200' },
    imagekit: { url: '/test.png?tr=w-200' }
  },
  {
    args: ['/test.png', { height: 200 }],
    local: { isStatic: true, url: '/_image/local/remote/_/h_200/http%3A%2F%2Flocalhost%3A3000%2Ftest.png' },
    cloudinary: { url: '/f_auto,q_auto,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=-x200' },
    fastly: { url: '/test.png?height=200' },
    imgix: { url: '/test.png?h=200' },
    imagekit: { url: '/test.png?tr=h-200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200 }],
    local: { isStatic: true, url: '/_image/local/remote/_/s_200_200/http%3A%2F%2Flocalhost%3A3000%2Ftest.png' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x200' },
    fastly: { url: '/test.png?width=200&height=200' },
    imgix: { url: '/test.png?w=200&h=200' },
    imagekit: { url: '/test.png?tr=w-200,h-200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain' }],
    local: { isStatic: true, url: '/_image/local/remote/_/f_contain,s_200_200/http%3A%2F%2Flocalhost%3A3000%2Ftest.png' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/contain=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain', format: 'jpeg' }],
    local: { isStatic: true, url: '/_image/local/remote/jpeg/f_contain,s_200_200/http%3A%2F%2Flocalhost%3A3000%2Ftest.png' },
    cloudinary: { url: '/f_jpeg,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/format=jpeg/contain=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds&format=jpeg' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill&fm=jpeg' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize,f-jpeg' }
  }
]

describe.skip('Providers', () => {
  test.skip('local', async () => {
    const providerOptions = {}
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = local(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime))
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.getImage).toEqual('function')

    for (const image of images) {
      const generated = runtime.getImage(image.args[0], { modifiers: image.args[1], ...providerData.runtimeOptions })
      generated.url = cleanDoubleSlashes(generated.url)
      expect(generated).toMatchObject(image.local)
    }
  })

  test('cloudinary', async () => {
    const providerOptions = {
      baseURL: ''
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = cloudinary(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime))
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.getImage).toEqual('function')

    for (const image of images) {
      const generated = runtime.getImage(image.args[0], { modifiers: image.args[1], ...providerData.runtimeOptions })
      expect(generated).toMatchObject(image.cloudinary)
    }
  })

  test('cloudinary fetch', async () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/fetch/'
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = cloudinary(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const runtime = (await import(providerData.runtime))

    // see: https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url
    const generated = runtime.getImage(
      'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png',
      {
        modifiers: {
          width: 300,
          height: 300
        },
        ...providerData.runtimeOptions
      }
    )
    expect(generated).toMatchObject({
      url: '/w_300,h_300/https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    })
  })

  test('cloudinary upload', async () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/upload/remote'
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = cloudinary(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const runtime = (await import(providerData.runtime))

    const generated = runtime.getImage(
      '1/13/Benedict_Cumberbatch_2011.png',
      {
        modifiers: {
          width: 300,
          height: 300
        },
        ...providerData.runtimeOptions
      }
    )
    expect(generated).toMatchObject({
      url: '/w_300,h_300/remote/1/13/Benedict_Cumberbatch_2011.png'
    })
  })

  test('twicpics', async () => {
    const providerOptions = {
      baseURL: ''
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = twicpics(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = await import(providerData.runtime)
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.getImage).toEqual('function')

    for (const image of images) {
      const generated = runtime.getImage(image.args[0], { modifiers: image.args[1], ...providerData.runtimeOptions })
      expect(generated).toMatchObject(image.twicpics)
    }
  })

  test('fastly', async () => {
    const providerOptions = {
      baseURL: ''
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = fastly(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime))
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.getImage).toEqual('function')

    for (const image of images) {
      const generated = runtime.getImage(image.args[0], { modifiers: image.args[1], ...providerData.runtimeOptions })
      expect(generated).toMatchObject(image.fastly)
    }
  })

  test('imgix', async () => {
    const providerOptions = {
      baseURL: ''
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = imgix(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime))
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.getImage).toEqual('function')

    for (const image of images) {
      const generated = runtime.getImage(image.args[0], { modifiers: image.args[1], ...providerData.runtimeOptions })
      expect(generated).toMatchObject(image.imgix)
    }
  })

  test('imagekit', async () => {
    const providerOptions = {
      baseURL: ''
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = imagekit(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime))
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.getImage).toEqual('function')

    for (const image of images) {
      const generated = runtime.getImage(image.args[0], { modifiers: image.args[1], ...providerData.runtimeOptions })
      expect(generated).toMatchObject(image.imagekit)
    }
  })
})
