import express from 'express'
import { login, logout, startShift, endShift, checkActiveShift } from '../auth'

const router = express.Router()

router.post('/login', (req, res, next) => {
  login(req, req.body)
    .then((data) => {
      res.json({ data })
    })
    .catch((error) => {
      next(error)
    })
})

router.post('/check-active-shift', (req, res, next) => {
  checkActiveShift(req)
    .then((data) => {
      res.json({ data })
    })
    .catch(() => {
      next()
    })
})

router.post('/start-shift', (req, res, next) => {
  startShift(req, req.body)
    .then((data) => {
      res.json({ data })
    })
    .catch((error) => {
      next(error)
    })
})

router.post('/end-shift', (req, res, next) => {
  endShift(req, req.body)
    .then(() => {
      res.json({ data: { message: 'Shift berakhir' } })
    })
    .catch((error) => {
      next(error)
    })
})

router.post('/logout', (req, res) => {
  logout(req)

  res.json({ data: { message: 'Success' } })
})

export default router
