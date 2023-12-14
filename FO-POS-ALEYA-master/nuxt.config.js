import css from './configs/css'
import head from './configs/head'
import plugins from './configs/plugins'
import serverMiddleware from './configs/server-middleware'
import { publicRuntimeConfig } from './configs/env'
import { buildModules, modules } from './configs/modules'

export default {
  head,
  css,
  plugins,
  publicRuntimeConfig,
  components: true,
  buildModules,
  modules,
  serverMiddleware,
  build: {},
  // server runs at port 3001
  server: {
    port: 3001,
  },
}
