// https://developers.cloudflare.com/images/url-format

import { ProviderGetImage } from 'src'
import { joinURL, encodeQueryItem, withBase } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    dpr: 'dpr',
    fit: 'fit',
    gravity: 'g',
    quality: 'q',
    format: 'f',
    sharpen: 'sharpen'
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'scale-down',
      outside: 'crop',
      inside: 'pad'
    },
    gravity: {
      auto: 'auto',
      side: 'side'
    }
  },
  joinWith: ',',
  formatter: (key, val) => encodeQueryItem(key, val)
})

const defaultModifiers = {
  format: 'auto'
}

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/cdn-cgi/image/' } = {}) => {
  const mergeModifiers = { ...defaultModifiers, ...modifiers }
  const operations = operationsGenerator(mergeModifiers as any)

  /**
   * The path is not URL-encoded, so the resizing URL can be safely constructed by
   * concatenating /cdn-cgi/image/options and the original image URL,
   * e.g. /cdn-cgi/image/width=100/https://s3.example.com/bucket/image.png.
   */
  return {
    url: withBase(joinURL(operations, src), baseURL)
  }
}
