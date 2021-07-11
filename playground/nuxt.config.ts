import type { NuxtConfig } from '@nuxt/types'
import type { } from '../src/types'

export default <NuxtConfig> {
  components: true,
  target: 'static',
  head: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  buildModules: [
    '../src/module.ts',
    '@nuxt/typescript-build'
  ],
  image: {
    domains: [
      'https://nuxtjs.org',
      'https://images.unsplash.com',
      'https://upload.wikimedia.org'
    ],
    screens: {
      750: 750
    },
    alias: {
      unsplash: 'https://images.unsplash.com', // ipx
      blog: '/remote/nuxt-org/blog' // cloudinary
    },
    twicpics: {
      baseURL: 'https://demo.twic.pics/'
    },
    storyblok: {
      baseURL: 'https://img2.storyblok.com/'
    },
    cloudflare: {
      baseURL: 'https://that-test.site/cdn-cgi/image/'
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
    },
    fastly: {
      baseURL: 'https://www.fastly.io'
    },
    glide: {
      baseURL: 'https://glide.herokuapp.com/1.0/'
    },
    imgix: {
      baseURL: 'https://assets.imgix.net'
    },
    imagekit: {
      baseURL: 'https://ik.imagekit.io/demo'
    },
    netlify: {
      baseURL: 'https://netlify-photo-gallery.netlify.app'
    },
    prismic: {},
    sanity: {
      projectId: 'zp7mbokg'
    },
    unsplash: {},
    vercel: {
      baseURL: 'https://image-component.nextjs.gallery/_next/image'
    },
    providers: {
      custom: {
        provider: '~/providers/custom',
        options: {
          baseURL: 'https://site.my'
        }
      }
    },
    presets: {
      s50: {
        modifiers: {
          width: 50,
          height: 50
        }
      }
    }
  }
}
