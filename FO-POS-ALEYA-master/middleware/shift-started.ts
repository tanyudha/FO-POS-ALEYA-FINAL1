import { Middleware } from '@nuxt/types'

const shiftStarted: Middleware = ({ app, redirect }) => {
  if (app.$auth.isCashier && !app.$shift.shift) {
    return redirect('/start-shift')
  }
}

export default shiftStarted
