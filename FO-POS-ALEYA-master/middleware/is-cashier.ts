import { Middleware } from '@nuxt/types'

const isCashier: Middleware = ({ app, redirect }) => {
  if (!app.$auth.isCashier) {
    return redirect('/404')
  }
}

export default isCashier
