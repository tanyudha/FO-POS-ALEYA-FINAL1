import { Middleware } from '@nuxt/types'

const notAuthenticated: Middleware = ({ app, redirect }) => {
  if (app.$auth.loggedIn) {
    return redirect('/login')
  }
}

export default notAuthenticated
