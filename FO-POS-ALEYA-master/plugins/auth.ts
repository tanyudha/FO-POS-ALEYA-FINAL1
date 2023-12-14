import { Plugin } from '@nuxt/types'
import ROLE from '@/utils/const/user-role'

interface User {
  id: number
  role: string
  username: string
  name: string
}

interface AuthPlugin {
  user: User | null
  loggedIn: boolean
  isCashier: boolean
  isEmployee: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: AuthPlugin
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $auth: AuthPlugin
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line
  interface Store<S> {
    $auth: AuthPlugin
  }
}

const auth: Plugin = ({ store, $axios, $config }, inject) => {
  const moduleName = 'auth-module'

  store.registerModule(moduleName, {
    namespaced: true,
    state: {
      user: null as User | null,
    },
    mutations: {
      setUser(state, payload) {
        state.user = payload
      },
    },
  })

  const authPlugin: AuthPlugin = {
    get user(): User | null {
      return store.state[moduleName].user
    },
    get loggedIn(): boolean {
      return !!store.state[moduleName].user
    },
    get isCashier(): boolean {
      return store.state[moduleName].user?.role === ROLE.KASIR
    },
    get isEmployee(): boolean {
      return store.state[moduleName].user?.role === ROLE.PEGAWAI
    },
    async login(username: string, password: string): Promise<void> {
      const res = await $axios.$post($config.appUrl + '/api/auth/login', {
        username,
        password,
      })
      const user: User = res.data
      store.commit(`${moduleName}/setUser`, user)
    },
    async logout(): Promise<void> {
      await $axios.$post($config.appUrl + '/api/auth/logout')
      store.commit(`${moduleName}/setUser`, null)
    },
    setUser(user: User): void {
      store.commit(`${moduleName}/setUser`, user)
    },
  }

  inject('auth', authPlugin)
}

export default auth
