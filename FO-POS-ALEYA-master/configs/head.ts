import { NuxtOptionsHead } from '@nuxt/types/config/head'

// Global page headers (https://go.nuxtjs.dev/config-head)
const head: NuxtOptionsHead = {
  titleTemplate: '%s',
  title: 'Aleya Frozen',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: '' },
    { hid: 'robots', name: 'robots', content: 'noindex nofollow' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
}

export default head
