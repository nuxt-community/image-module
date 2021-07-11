export interface Provider {
  name: string
  samples: {
    src: string,
    from?: string,
    link?: string,
    width?: number,
    height?: number,
    [key: string]: any
  }[]
}

export const providers: Provider[] = [
  // IPX
  {
    name: 'static',
    samples: [
      {
        src: '/images/colors.jpg',
        from: 'Jeremy Thomas',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      },
      {
        src: '/images/everest.jpg',
        from: 'Mount Everest Wikipedia page (alias)',
        width: 300,
        height: 300,
        link: 'https://en.wikipedia.org/wiki/Mount_Everest'
      },
      {
        src: '/images/tacos.svg',
        from: 'Illustration from Icons8',
        width: 300,
        height: 300,
        link: 'https://icons8.com/illustrations/illustration/abstract-1419'
      },
      {
        src: '/unsplash/photo-1606112219348-204d7d8b94ee',
        from: 'Photo by Omid Armin',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      }
    ]
  },
  // Cloudflare
  {
    name: 'cloudflare',
    samples: [
      {
        src: 'https://s3.that-test.site/burger.jpeg',
        height: 300,
        fit: 'contain'
      }
    ]
  },
  // Cloudinary
  {
    name: 'cloudinary',
    samples: [
      {
        src: '/remote/nuxt-org/blog/going-full-static/main'
      },
      {
        src: '/blog/going-full-static/main',
        width: 200,
        height: 200,
        fit: 'cropping'
      },
      {
        src: '/remote/nuxt-org/blog/going-full-static/main',
        width: 200,
        height: 200,
        fit: 'thumbnail',
        roundCorner: 'max'
      }
    ]
  },
  // Fastly
  {
    name: 'fastly',
    samples: [
      { src: '/image.jpg' },
      { src: '/plant.jpeg' }
    ]
  },
  // ImageKit
  {
    name: 'imagekit',
    samples: [
      {
        src: '/girl.jpeg'
      },
      {
        src: '/girl.jpeg',
        width: 400,
        height: 300,
        fit: 'fill'
      },
      {
        src: '/girl.jpeg',
        width: 200,
        height: 300,
        modifiers: {
          focus: 'auto'
        }
      },
      {
        src: '/girl.jpeg',
        width: 150,
        height: 150,
        modifiers: {
          focus: 'face'
        }
      },
      {
        src: '/girl.jpeg',
        width: 150,
        height: 150,
        modifiers: {
          focus: 'face',
          radius: 'max'
        }
      }
    ]
  },
  // imgix
  {
    name: 'imgix',
    samples: [
      {
        src: 'blog/woman-hat.jpg',
        width: 300,
        height: 300,
        fit: 'cover'
      }
    ]
  },
  // Glide
  {
    name: 'glide',
    samples: [
      { src: '/kayaks.jpg', width: 1000, quality: 70, modifiers: { gam: 0.9, sharp: 8 } }
    ]
  },
  // Netlify
  {
    name: 'netlify',
    samples: [
      {
        src: '/images/apple.jpg',
        width: 101,
        fit: 'contain'
      },
      {
        src: '/images/apple.jpg',
        width: 200,
        height: 200,
        fit: 'fill'
      }
    ]
  },
  // Prismic
  {
    name: 'prismic',
    samples: [
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900'
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        width: 200
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        height: 200
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        width: 200,
        height: 200,
        fit: 'crop'
      }
    ]
  },
  // TwicPics
  {
    name: 'twicpics',
    samples: [
      { src: '/football.jpg' },
      { src: '/football.jpg', width: 250, height: 400, focus: 'auto' }
    ]
  },
  // Sanity
  {
    name: 'sanity',
    samples: [
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'fill'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'cover'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'contain'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        modifiers: {
          crop: {
            _type: 'sanity.imageCrop',
            bottom: 0.36903637222484653,
            left: 0.23801369863013686,
            right: 0,
            top: 0.009840969925995906
          },
          hotspot: {
            _type: 'sanity.imageHotspot',
            height: 0.6063612029601636,
            width: 0.21575342465753433,
            x: 0.4469178082191783,
            y: 0.32778302629507167
          }
        }
      }
    ]
  },
  // Storyblok
  {
    name: 'storyblok',
    samples: [
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Original'
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Resized static',
        width: 500,
        height: 500
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Proportional to Width',
        width: 500
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Proportional to Height',
        height: 500
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Fit in with background CCCCCC',
        width: 200,
        height: 200,
        fit: 'in',
        filters: { fill: 'CCCCCC' }
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Change image format',
        width: 200,
        format: 'webp'
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Resized without Smart Crop',
        width: 600,
        height: 130
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Resized with Smart Crop (Facial detection)',
        width: 600,
        height: 130,
        smart: true
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Custom focal point (Focus on the bottom of the image)',
        width: 600,
        height: 130,
        operations: { filters: { focal: '450x500:550x600' } }
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Custom focal point (Focus on the top of the image)',
        width: 600,
        height: 130,
        operations: { filters: { focal: '450x0:550x100' } }
      }
    ]
  },
  // Unsplash
  {
    name: 'unsplash',
    samples: [
      {
        src: '/photo-1606112219348-204d7d8b94ee',
        width: 300,
        height: 300,
        fit: 'cover',
        quality: 75,
        format: 'auto',
        from: 'Photo by Omid Armin',
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'

      }
    ]
  },
  // Vercel
  {
    name: 'vercel',
    samples: [
      {
        src: 'colors.jpg',
        width: 750,
        quality: 75
      }
    ]
  }
]
