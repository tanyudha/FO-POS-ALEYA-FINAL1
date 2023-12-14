import { NuxtOptionsPlugin } from '@nuxt/types/config/plugin'

// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
const plugins: NuxtOptionsPlugin[] = [
  '@/plugins/auth',
  '@/plugins/api',
  '@/plugins/dayjs',
  '@/plugins/shift',
  '@/plugins/axios',
]

export default plugins
