<template>
  <img
    :key="nSrc"
    :width="width"
    :height="height"
    :src="nSrc"
    :alt="nAlt"
    v-bind="nAttrs"
    @error="setFallbackImage"
  >
</template>

<script lang="ts">
import { generateAlt, useObserver, parseSize } from '~image'

const EMPTY_GIF =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export default {
  name: 'NuxtImg',
  props: {
    // input source
    src: { type: String, required: true },

    // <img> attributes
    width: { type: [String, Number], required: false, default: undefined },
    height: { type: [String, Number], required: false, default: undefined },
    alt: { type: String, required: false, default: undefined },
    loading: { type: String, default: undefined },

    // modifiers
    format: { type: String, required: false, default: undefined },
    quality: { type: [Number, String], required: false, default: undefined },
    background: { type: String, required: false, default: undefined },
    fit: { type: String, required: false, default: undefined },
    modifiers: { type: Object, required: false, default: undefined },

    // options
    preset: { type: String, required: false, default: undefined },
    provider: { type: String, required: false, default: undefined },
    responsive: { type: Boolean, required: false, default: false },
    fallback: { type: String, required: false, default: undefined }
  },
  data () {
    return {
      usePlaceholder: this.loading === 'lazy'
    }
  },
  computed: {
    nAlt () {
      return this.alt ?? generateAlt(this.src)
    },
    nSrc () {
      if (this.usePlaceholder) {
        return EMPTY_GIF
      }
      return this.$img(this.src, this.nModifiers, this.nOptions)
    },
    nAttrs () {
      const attrs: any = {}
      if (this.responsive) {
        const { sizes, srcSet } = this.getResponsive()
        attrs.sizes = sizes
        attrs.srcSet = srcSet
      }
      return attrs
    },
    nModifiers () {
      return {
        ...this.modifiers,
        width: this.width,
        height: this.height,
        format: this.format,
        quality: this.quality,
        background: this.background,
        fit: this.fit
      }
    },
    nOptions () {
      return {
        provider: this.provider,
        preset: this.preset
      }
    }
  },
  created () {
    if (process.server && process.static) {
      // Force compute sources into ssrContext
      this.getResponsive()
    }
  },
  mounted () {
    if (this.usePlaceholder) {
      this.observe()
    }
  },
  beforeDestroy () {
    this.unobserve()
  },
  methods: {
    getResponsive () {
      const sizes = this.$img.getSizes(this.src, {
        ...this.nOptions,
        modifiers: {
          ...this.nModifiers,
          width: parseSize(this.width),
          height: parseSize(this.height)
        }
      }, this.sizes)
      return {
        sizes: sizes.map(({ width }) => `(max-width: ${width}px) ${width}px`),
        srcSet: sizes.map(({ width, src }) => `${src} ${width}w`)
      }
    },
    observe () {
      this._removeObserver = useObserver(this.$el, () => {
        this.usePlaceholder = false
      })
    },
    unobserve () {
      if (this._removeObserver) {
        this._removeObserver()
        delete this._removeObserver
      }
    },
    setFallbackImage (event) {
      if (this._errored) { return }
      this._errored = true
      if (this.fallback) {
        event.target.src = this.fallback
      }
    }
  }
}
</script>
