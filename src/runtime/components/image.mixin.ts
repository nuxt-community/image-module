import { parseSize } from '../utils'
import type { DefineMixin } from '../../types/vue'

const defineMixin: DefineMixin = (opts: any) => opts

// @vue/component
export const imageMixin = defineMixin({
  props: {
    // input source
    src: { type: String, required: true },

    // modifiers
    format: { type: String, default: undefined },
    quality: { type: [Number, String], default: undefined },
    background: { type: String, default: undefined },
    fit: { type: String, default: undefined },
    modifiers: { type: Object as () => Record<string, any>, default: undefined },

    // options
    preset: { type: String, default: undefined },
    provider: { type: String, default: undefined },

    sizes: { type: [Object, String] as unknown as () => string | Record<string, any>, default: undefined },
    densities: { type: String, default: undefined },

    // <img> attributes
    width: { type: [String, Number], default: undefined },
    height: { type: [String, Number], default: undefined },
    alt: { type: String, default: undefined },
    referrerpolicy: { type: String, default: undefined },
    usemap: { type: String, default: undefined },
    longdesc: { type: String, default: undefined },
    ismap: { type: Boolean, default: undefined },
    crossorigin: { type: [Boolean, String] as unknown as () => boolean | '' | 'anonymous' | 'use-credentials', default: undefined, validator: val => ['anonymous', 'use-credentials', '', true, false].includes(val) },
    loading: { type: String, default: undefined },
    decoding: { type: String as () => 'async' | 'auto' | 'sync', default: undefined, validator: val => ['async', 'auto', 'sync'].includes(val) }
  },
  computed: {
    nImgAttrs (): {
      width?: number
      height?: number
      alt?: string
      referrerpolicy?: string
      usemap?: string
      longdesc?: string
      ismap?: boolean
      crossorigin?: '' | 'anonymous' | 'use-credentials'
      loading?: string
      decoding?: 'async' | 'auto' | 'sync'
      } {
      return {
        width: parseSize(this.width),
        height: parseSize(this.height),
        alt: this.alt,
        referrerpolicy: this.referrerpolicy,
        usemap: this.usemap,
        longdesc: this.longdesc,
        ismap: this.ismap,
        crossorigin: this.crossorigin === true ? 'anonymous' : this.crossorigin || undefined,
        loading: this.loading,
        decoding: this.decoding
      }
    },
    nModifiers (): { width?: number, height?: number, format?: string, quality?: string | number, background?: string, fit?: string } & Record<string, any> {
      return {
        ...this.modifiers,
        width: parseSize(this.width),
        height: parseSize(this.height),
        format: this.format,
        quality: this.quality,
        background: this.background,
        fit: this.fit
      }
    },
    nOptions (): { provider?: string, preset?: string } {
      return {
        provider: this.provider,
        preset: this.preset
      }
    }
  }
})
