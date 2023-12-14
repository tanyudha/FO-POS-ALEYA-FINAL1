import { NuxtOptionsRuntimeConfig } from '@nuxt/types/config/runtime'

// Public Runtime Config (https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#publicruntimeconfig)
export const publicRuntimeConfig: NuxtOptionsRuntimeConfig = {
  env: process.env.NODE_ENV,
  appUrl: process.env.APP_URL,
  axios: {
    browserBaseURL: process.env.APP_URL + '/api',
  },
}

// Private Runtime Config (https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#privateruntimeconfig)
export const privateRuntimeConfig: NuxtOptionsRuntimeConfig = {}
