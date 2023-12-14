const axios = require('axios')

const fetch = (req, _res, next) => {
  const headers = { ...req.headers }

  delete headers['content-length']

  req.fetch = axios.create({ baseURL: process.env.PROXY_URL })
  req.fetch.defaults.headers.common = headers

  next()
}

export default fetch
