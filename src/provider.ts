import { normalize, resolve, dirname } from 'upath'
import { writeJson, mkdirp } from 'fs-extra'
import { parseURL } from 'ufo'
import { resolveAlias, tryResolvePath, useNuxt } from '@nuxt/kit'
import { hash } from './utils'
import type { ModuleOptions, InputProvider, ImageModuleProvider, ProviderSetup } from './types'
import { ipxSetup } from './ipx'

const BuiltInProviders = [
  'cloudinary',
  'fastly',
  'glide',
  'imagekit',
  'imgix',
  'ipx',
  'netlify',
  'prismic',
  'sanity',
  'static',
  'twicpics',
  'storyblok',
  'vercel'
]

export const providerSetup: Record<string, ProviderSetup> = {
  // IPX
  ipx: ipxSetup,
  static: ipxSetup,

  // https://vercel.com/docs/more/adding-your-framework#images
  async vercel (_providerOptions, moduleOptions, nuxt) {
    const imagesConfig = resolve(nuxt.options.rootDir, '.vercel_build_output/config/images.json')
    await mkdirp(dirname(imagesConfig))
    await writeJson(imagesConfig, {
      domains: moduleOptions.domains.map(domain => parseURL(domain, 'https://').host),
      sizes: Array.from(new Set(Object.values(moduleOptions.screens || {})))
    })
  }
}

export function resolveProviders (options: ModuleOptions): ImageModuleProvider[] {
  const providers: ImageModuleProvider[] = []

  for (const key in options) {
    if (BuiltInProviders.includes(key)) {
      providers.push(resolveProvider(key, { provider: key, options: options[key] }))
    }
  }

  for (const key in options.providers) {
    providers.push(resolveProvider(key, options.providers[key]))
  }

  return providers
}

export function resolveProvider (key: string, input: InputProvider): ImageModuleProvider {
  const nuxt = useNuxt()
  if (typeof input === 'string') {
    input = { name: input }
  }

  if (!input.name) {
    input.name = key
  }

  if (!input.provider) {
    input.provider = input.name
  }

  input.provider = BuiltInProviders.includes(input.provider)
    ? require.resolve('./runtime/providers/' + input.provider)
    : tryResolvePath(resolveAlias(input.provider, nuxt.options.alias))

  const setup = input.setup || providerSetup[input.name]

  return <ImageModuleProvider> {
    ...input,
    setup,
    runtime: normalize(input.provider!),
    importName: `${key}Runtime$${hash(input.provider!, 4)}`,
    runtimeOptions: input.options
  }
}

export function detectProvider (userInput?: string, isStatic: boolean = false) {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER
  }

  if (userInput && userInput !== 'auto') {
    return userInput
  }

  if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_BUILDER) {
    return 'vercel'
  }

  return isStatic ? 'static' : 'ipx'
}
