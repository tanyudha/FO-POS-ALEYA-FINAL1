import { Middleware } from '@nuxt/types'

const authenticated: Middleware = ({ app, redirect }) => {
  if (!app.$auth.loggedIn) {
    return redirect('/login')
  }
}

export default authenticated
