import express from 'express'

import fetch from './middlewares/fetch'
import accessToken from './middlewares/accessToken'
import errorHandler from './middlewares/errorHandler'

import generalRoutes from './routes/general'
import authRoutes from './routes/auth'

const app = express()
app.set('trust proxy', 1)

app.use(fetch)
app.use(accessToken)

app.use('/auth', authRoutes)
app.use(generalRoutes)

app.use(errorHandler)

// Export the server middleware
export default {
  path: '/api',
  handler: app,
}
