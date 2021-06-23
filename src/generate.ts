
import { createWriteStream } from 'fs'
import { promisify } from 'util'
import stream from 'stream'
import { mkdirp } from 'fs-extra'
import { dirname, join, relative, extname, basename, trimExt } from 'upath'
import fetch from 'node-fetch'
import { joinURL, hasProtocol, parseURL, withoutTrailingSlash } from 'ufo'
import pLimit from 'p-limit'
import { Nuxt } from '@nuxt/kit'
import { ModuleOptions, MapToStatic, ResolvedImage } from './types'
import { hash, logger } from './utils'

const pipeline = promisify(stream.pipeline)

export function setupStaticGeneration (nuxt: Nuxt, options: ModuleOptions) {
  const staticImages: Record<string, string> = {} // url ~> hashed file name

  nuxt.hook('vue-renderer:ssr:prepareContext', (renderContext: any) => {
    renderContext.image = renderContext.image || {}
    renderContext.image.mapToStatic = <MapToStatic> function ({ url, format }: ResolvedImage) {
      if (!staticImages[url]) {
        const { pathname } = parseURL(url)
        const params: any = {
          name: trimExt(basename(pathname)),
          ext: (format && `.${format}`) || extname(pathname) || '.png',
          hash: hash(url),
          // TODO: pass from runtimeConfig to mapStatic as param
          publicPath: withoutTrailingSlash(nuxt.options.build.publicPath)
        }

        staticImages[url] = options.staticFilename.replace(/\[(\w+)]/g, (match, key) => params[key] || match)
      }
      return staticImages[url]
    }
  })

  nuxt.hook('generate:done', async () => {
    const limit = pLimit(8)
    const downloads = Object.entries(staticImages).map(([url, name]) => {
      if (!hasProtocol(url)) {
        url = joinURL(options.internalUrl, url)
      }
      return limit(() => downloadImage({
        url,
        name,
        outDir: nuxt.options.generate.dir
      }))
    })
    await Promise.all(downloads)
  })
}

async function downloadImage ({ url, name, outDir }: { url: string, name: string, outDir: string }) {
  try {
    const response = await fetch(url)
    if (!response.ok) { throw new Error(`Unexpected response ${response.statusText}`) }
    const dstFile = join(outDir, name)
    await mkdirp(dirname(dstFile))
    await pipeline(response.body, createWriteStream(dstFile))
    logger.success('Generated static image ' + relative(process.cwd(), dstFile))
  } catch (error: any) {
    logger.error(error.message)
  }
}
