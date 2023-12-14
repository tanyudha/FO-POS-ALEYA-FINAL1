import { NuxtOptionsModule } from '@nuxt/types/config/module'

const vuetify: NuxtOptionsModule = [
  // https://go.nuxtjs.dev/vuetify
  '@nuxtjs/vuetify',
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  {
    customVariables: ['@/assets/variables.scss'],
    theme: {
      dark: false,
    },
  },
]

export default vuetify
