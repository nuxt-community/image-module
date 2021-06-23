import { defineNuxtModule, addPlugin } from '@nuxt/kit'
import { resolve } from 'upath'
import defu from 'defu'

import { setupStaticGeneration } from './generate'
import { resolveProviders, detectProvider } from './provider'
import { pick, pkg } from './utils'
import type { ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>(nuxt => ({
  name: pkg.name,
  configKey: 'image',
  defaults: {
    staticFilename: '[publicPath]/image/[hash][ext]',
    provider: 'auto',
    presets: {},
    dir: resolve(nuxt.options.srcDir, nuxt.options.dir.static),
    domains: [],
    sharp: {},
    // https://tailwindcss.com/docs/breakpoints
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
    internalUrl: '',
    providers: {},
    static: {}
  },
  async setup (options, nuxt) {
    options.provider = detectProvider(options.provider, nuxt.options.target === 'static')
    options[options.provider] = options[options.provider] || {}

    const imageOptions = pick(options, [
      'screens',
      'presets',
      'provider'
    ])

    options.static = options.static || {}
    options.static.domains = options.domains

    const providers = resolveProviders(options)

    // Transpile and alias runtime
    const runtimeDir = resolve(__dirname, 'runtime')
    nuxt.options.alias['~image'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir, '@nuxt/image', 'allowlist', 'defu', 'ufo')

    // Add plugin
    addPlugin({
      fileName: 'image.js',
      src: resolve(runtimeDir, 'plugin.js'),
      options: {
        imageOptions,
        providers
      }
    })

    // Run setup
    for (const p of providers) {
      if (typeof p.setup === 'function') {
        await p.setup(p, options, nuxt)
      }
    }

    // Transform asset urls that pass to `src` attribute on image components
    nuxt.options.build.loaders = defu({
      vue: { transformAssetUrls: { 'nuxt-img': 'src', 'nuxt-picture': 'src', NuxtPicture: 'src', NuxtImg: 'src' } }
    }, nuxt.options.build.loaders || {})

    nuxt.hook('generate:before', () => {
      setupStaticGeneration(nuxt, options)
    })

    const LruCache = await import('lru-cache').then(r => r.default || r)
    const cache = new LruCache()
    nuxt.hook('vue-renderer:context', (ssrContext: any) => {
      ssrContext.cache = cache
    })

    nuxt.hook('listen', (_: any, listener: any) => {
      options.internalUrl = `http://localhost:${listener.port}`
    })
  }
}))
