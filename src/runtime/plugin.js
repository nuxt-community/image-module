import Vue from 'vue'
import { createImage} from '~image'
import NuxtImg from '~image/components/nuxt-img.vue'
import NuxtPicture from '~image/components/nuxt-picture.vue'

<%=options.providers.map(p => `import * as ${p.importName} from '${p.runtime}'`).join('\n')%>

const imageOptions = <%= JSON.stringify(options.imageOptions, null, 2) %>

imageOptions.providers = {
<%=options.providers.map(p => `  ['${p.name}']: { provider: ${p.importName}, defaults: ${JSON.stringify(p.runtimeOptions)} }`).join(',\n') %>
}

if (Vue && 'component' in Vue) {
  // Vue 2
  Vue.component(NuxtImg.name, NuxtImg)
  Vue.component(NuxtPicture.name, NuxtPicture)
  Vue.component('NImg', NuxtImg)
  Vue.component('NPicture', NuxtPicture)
}

export default function (nuxtContext, inject) {
  const $img = createImage(imageOptions, nuxtContext)

  // Vue 3
  if (nuxtContext.app?.component) {
    nuxtContext.app.component(NuxtImg.name, NuxtImg)
    nuxtContext.app.component(NuxtPicture.name, NuxtPicture)
    nuxtContext.app.component('NImg', NuxtImg)
    nuxtContext.app.component('NPicture', NuxtPicture)
  }

  if (process.static && process.server) {
    nuxtContext.beforeNuxtRender(({ nuxtState }) => {
      const ssrData = nuxtState.data[0] || {}
      ssrData._img = nuxtState._img || {}
    })
  }
  
  inject('img', $img)
}
