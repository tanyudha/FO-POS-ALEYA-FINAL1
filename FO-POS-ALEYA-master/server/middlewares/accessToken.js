import { logout } from '../auth'

/*
 * url regex
 * slug - [\w]+(-[\w]+)*
 * query - \?[^&=]+=[^&=]*(&[^&=]+=[^&=]*)*
 */

const publicUrls = [/^\/login$/, /^\/logout$/]

const accessToken = (req, _res, next) => {
  if (publicUrls.find((url) => req.url.match(url))) {
    next()
  } else {
    const auth = req.session.userAuth

    if (auth && auth.token && auth.expired > Date.now()) {
      req.fetch.defaults.headers.common.authorization = `Bearer ${auth.token}`
      next()
    } else {
      logout(req)
      next()
    }
  }
}

export default accessToken
