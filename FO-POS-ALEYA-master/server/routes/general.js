import express from 'express'

const router = express.Router()

router.all('*', (req, res, next) => {
  // remove multiple slashes
  const url = req.url.replace(/\/{2,}/g, '/')
  return req
    .fetch({
      url: `${process.env.PROXY_URL}${url}`,
      method: req.method,
      data: req.body,
    })
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((error) => {
      next(error)
    })
})

export default router
