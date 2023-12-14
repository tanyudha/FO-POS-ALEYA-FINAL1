import { Middleware } from '@nuxt/types'

const shiftNotStarted: Middleware = ({ app, redirect }) => {
  if (app.$shift?.shift) {
    return redirect('/')
  }
}

export default shiftNotStarted
