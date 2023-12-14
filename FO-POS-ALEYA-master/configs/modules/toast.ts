import { NuxtOptionsModule } from '@nuxt/types/config/module'

const toast: NuxtOptionsModule = [
  // https://github.com/nuxt-community/community-modules/tree/master/packages/toast
  '@nuxtjs/toast',
  // vue-toasted module configuration (https://github.com/shakee93/vue-toasted#options)
  {
    position: 'top-right',
    className: 'tf-toast',
    duration: 3000,
    action: {
      text: 'close',
      onClick: (_e: any, toastObject: any) => {
        toastObject.goAway(0)
      },
    },
    register: [
      {
        name: 'error',
        message: 'Terjadi kesalahan',
      },
      {
        name: "asyncError",
        message: (error: any) => {
          return (
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Terjadi kesalahan"
          );
        },
      },
    ],
  },
]

export default toast
