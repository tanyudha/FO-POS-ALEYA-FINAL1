import { Plugin } from '@nuxt/types'

interface Shift {
  id: number
}

interface ShiftPlugin {
  shift: Shift | null
  isTransactionAllowed: boolean
  startShift: (startingCash: number) => Promise<void>
  checkActiveShift: () => Promise<void>
  endShift: (id: number, actualEndingCash: number) => Promise<void>
  checkCashierAvailable: () => Promise<void>
  setShift: (shift: Shift) => void
}

declare module 'vue/types/vue' {
  interface Vue {
    $shift: ShiftPlugin
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $shift: ShiftPlugin
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line
  interface Store<S> {
    $shift: ShiftPlugin
  }
}

const shift: Plugin = ({ store, $axios, $config }, inject) => {
  const moduleName = 'shift-module'

  store.registerModule(moduleName, {
    namespaced: true,
    state: {
      shift: null as Shift | null,
      isTransactionAllowed: false,
    },
    mutations: {
      setShift(state, payload) {
        state.shift = payload
      },
      setTransactionAllowed(state, payload) {
        state.isTransactionAllowed = payload
      },
    },
  })

  const shiftPlugin: ShiftPlugin = {
    get shift(): Shift | null {
      return store.state[moduleName].shift
    },
    get isTransactionAllowed(): boolean {
      return !!store.state[moduleName].isTransactionAllowed
    },
    async startShift(startingCash: number): Promise<void> {
      const res = await $axios.$post($config.appUrl + '/api/auth/start-shift', {
        starting_cash: startingCash,
      })
      const shift: Shift = res.data
      store.commit(`${moduleName}/setShift`, shift)
    },
    async checkActiveShift(): Promise<void> {
      const res = await $axios.$post(
        $config.appUrl + '/api/auth/check-active-shift'
      )
      const shift: Shift = res.data
      store.commit(`${moduleName}/setShift`, shift)
    },
    async checkCashierAvailable(): Promise<void> {
      try {
        const res = await $axios.$get('/shift/is-cashier-available')
        store.commit(`${moduleName}/setTransactionAllowed`, !!res)
      } catch {
        store.commit(`${moduleName}/setTransactionAllowed`, false)
      }
    },
    async endShift(id: number, actualEndingCash: number): Promise<void> {
      await $axios.$post($config.appUrl + '/api/auth/end-shift', {
        id,
        actual_ending_cash: actualEndingCash,
      })
      store.commit(`${moduleName}/setShift`, null)
    },
    setShift(shift: Shift): void {
      store.commit(`${moduleName}/setShift`, shift)
    },
  }

  inject('shift', shiftPlugin)
}

export default shift
