import type { Context } from '@nuxt/types'

const staticImageMap = {}

function updateImageMap () {
  if (typeof window.$nuxt !== 'undefined') {
    // Client-side navigation
    const pageImages = (window.$nuxt as any)._pagePayload?.data?.[0]?._img || {}
    Object.assign(staticImageMap, pageImages)
  } else if (typeof (window as any).__NUXT__ !== 'undefined') {
    // Initial load
    const pageImages = (window as any).__NUXT__?._img || {}
    Object.assign(staticImageMap, pageImages)
  }
}

export function useStaticImageMap (nuxtContext?: Context) {
  // Update on initialization
  updateImageMap()

  // Merge new mappings on route change
  if (nuxtContext) {
    nuxtContext.app.router?.afterEach(updateImageMap)
  }

  // Make sure manifest is initialized
  if ((window as any).onNuxtReady) {
    (window as any).onNuxtReady(function () {
      updateImageMap()

      window.$nuxt.$on('nuxtImage:updateImageMap', updateImageMap)
    })
  }

  return staticImageMap
}
