import { images } from '../providers'

import { cleanDoubleSlashes } from '~/runtime/utils'
import * as ipx from '~/runtime/providers/ipx'
import * as cloudflare from '~/runtime/providers/cloudflare'
import * as cloudinary from '~/runtime/providers/cloudinary'
import * as twicpics from '~/runtime/providers/twicpics'
import * as fastly from '~/runtime/providers/fastly'
import * as glide from '~/runtime/providers/glide'
import * as imgix from '~/runtime/providers/imgix'
import * as unsplash from '~/runtime/providers/unsplash'
import * as imagekit from '~/runtime/providers/imagekit'
import * as netlify from '~/runtime/providers/netlify'
import * as prismic from '~/runtime/providers/prismic'
import * as sanity from '~/runtime/providers/sanity'

const emptyContext = { options: {} } as any

describe('Providers', () => {
  test('ipx', () => {
    const providerOptions = {}

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = ipx.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      generated.url = cleanDoubleSlashes(generated.url)
      expect(generated).toMatchObject(image.ipx)
    }
  })

  test('ipx router base', () => {
    const context = { ...emptyContext, nuxtContext: { base: '/app/' } }

    const src = '/images/test.png'
    const generated = ipx.getImage(src, { modifiers: {} }, context)
    generated.url = cleanDoubleSlashes(generated.url)
    expect(generated).toMatchObject({
      url: '/app/_ipx/_/images/test.png'
    })
  })

  test('cloudflare', () => {
    const providerOptions = {
      baseURL: '/'
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudflare.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudflare)
    }
  })

  test('cloudinary', () => {
    const providerOptions = {
      baseURL: '/'
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudinary.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudinary)
    }
  })

  test('cloudinary fetch', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/fetch/'
    }
    // see: https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url
    const remoteUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    const generated = cloudinary.getImage(
      remoteUrl,
      {
        modifiers: {
          width: 300,
          height: 300
        },
        ...providerOptions
      }, emptyContext
    )
    expect(generated).toMatchObject({
      url: `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_300,h_300/${remoteUrl}`
    })
  })

  test('cloudinary upload', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/upload/remote'
    }
    const generated = cloudinary.getImage(
      '/1/13/Benedict_Cumberbatch_2011.png',
      {
        modifiers: {
          width: 300,
          height: 300
        },
        ...providerOptions
      }, emptyContext
    )
    expect(generated).toMatchObject({
      url: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_300,h_300/remote/1/13/Benedict_Cumberbatch_2011.png'
    })
  })

  test('twicpics', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = twicpics.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.twicpics)
    }
  })

  test('glide', () => {
    const providerOptions = {
      baseURL: ''
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = glide.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.glide)
    }
  })

  test('fastly', () => {
    const providerOptions = {
      baseURL: ''
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = fastly.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.fastly)
    }
  })

  test('imgix', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imgix.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imgix)
    }
  })

  test('unsplash', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = unsplash.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.unsplash)
    }
  })

  test('imagekit', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imagekit.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imagekit)
    }
  })

  test('netlify', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = netlify.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.netlify)
    }
  })

  test('prismic', () => {
    const providerOptions = {
      baseURL: '' // Use empty base URL for the sake of simplicity
    }

    const EXISTING_QUERY_PARAMETERS =
      '?auto=compress,format&rect=0,0,200,200&w=100&h=100'

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = prismic.getImage(`${src}${EXISTING_QUERY_PARAMETERS}`, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.prismic)
    }
  })

  test('sanity', () => {
    const providerOptions = {
      baseURL: '',
      projectId: 'projectid'
    }

    for (const image of images) {
      const [, modifiers] = image.args
      const generated = sanity.getImage('image-test-300x450-png', { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.sanity)
    }
  })
})
