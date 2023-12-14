import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

declare module 'vue/types/vue' {
  interface Vue {
    $api: NuxtAxiosInstance
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $api: NuxtAxiosInstance
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line
  interface Store<S> {
    $api: NuxtAxiosInstance
  }
}

const api: Plugin = ({ app, $axios, $config }, inject) => {
  const apiInstance = $axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  })

  apiInstance.setBaseURL($config.appUrl + '/api')
  apiInstance.onError(async (error: any) => {
    // logout when 401
    if (
      process.client &&
      error.response?.status === 401 &&
      app.$auth.loggedIn
    ) {
      await app.$auth.logout()
      if (app.router) {
        app.router.go(0)
      }
    }

    throw error
  })
  inject('api', apiInstance)
}

export default api
