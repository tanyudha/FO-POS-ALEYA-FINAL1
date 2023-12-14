import { NuxtOptionsModule } from '@nuxt/types/config/module'
import axios from './modules/axios'
import pwa from './modules/pwa'
import vuetify from './modules/vuetify'
import toast from './modules/toast'

// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
export const buildModules: NuxtOptionsModule[] = [
  '@nuxt/typescript-build',
  '@nuxtjs/stylelint-module',
  vuetify,
]

// Modules (https://go.nuxtjs.dev/config-modules)
export const modules: NuxtOptionsModule[] = [axios, pwa, toast]
