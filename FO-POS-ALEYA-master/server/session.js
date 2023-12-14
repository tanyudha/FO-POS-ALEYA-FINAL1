import session from 'cookie-session'

const isDev = process.env.NODE_ENV === 'development'
const config = {
  name: 'front-office.sid',
  secret: 'nothing-to-see-here',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000, secure: !isDev },
}

export default session(config)
