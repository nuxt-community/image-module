import { relative, resolve } from 'upath'
import { update as updaterc } from 'rc9'
import { mkdirp, readFile, writeFile } from 'fs-extra'
import { lt } from 'semver'

import type { ProviderSetup } from './types'

export const ipxSetup: ProviderSetup = async (_providerOptions, moduleOptions, nuxt) => {
  const isStatic = nuxt.options.target === 'static'
  const runtimeDir = resolve(__dirname, 'runtime')
  const ipxOptions = {
    dir: resolve(nuxt.options.rootDir, moduleOptions.dir),
    domains: moduleOptions.domains,
    sharp: moduleOptions.sharp
  }

  // Add IPX middleware unless nuxtrc or user added a custom middleware
  const hasUserProvidedIPX = !!nuxt.options.serverMiddleware
    .find((mw: { path: string }) => mw.path && mw.path.startsWith('/_ipx'))

  if (!hasUserProvidedIPX) {
    const { createIPX, createIPXMiddleware } = await import('ipx')
    const ipx = createIPX(ipxOptions)
    nuxt.options.serverMiddleware.push({
      path: '/_ipx',
      handle: createIPXMiddleware(ipx)
    })
  }

  // Warn if unhandled /_ipx endpoint only if not using `modules`
  const installedInModules = nuxt.options.modules.some(
    (mod: string | (() => any)) => typeof mod === 'string' && mod.includes('@nuxt/image')
  )

  if (!isStatic && !hasUserProvidedIPX && !installedInModules && lt(nuxt.constructor?.version || '3.0.0', '2.16.0')) {
    // eslint-disable-next-line no-console
    console.warn('[@nuxt/image] If you would like to use the `ipx` provider at runtime.\nMake sure to follow the instructions at https://image.nuxtjs.org/providers/ipx .')
  }

  if (nuxt.options.dev || hasUserProvidedIPX) {
    return
  }

  // In production, add IPX module to nuxtrc (used in Nuxt 2.16+)
  nuxt.hook('build:done', async () => {
    const handler = await readFile(resolve(runtimeDir, 'ipx.js'), 'utf-8')
    const distDir = resolve(nuxt.options.buildDir, 'dist')
    const apiDir = resolve(distDir, 'api')
    const apiFile = resolve(apiDir, 'ipx.js')
    const relativeApiFile = '~~/' + relative(nuxt.options.rootDir, apiFile)

    await mkdirp(apiDir)
    await writeFile(apiFile, handler.replace(/.__IPX_OPTIONS__./, JSON.stringify(ipxOptions)))

    updaterc({ serverMiddleware: [{ path: '/_ipx', handler: relativeApiFile }] }, { dir: distDir, name: 'nuxtrc' })
  })
}
