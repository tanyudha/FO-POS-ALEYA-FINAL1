import express from 'express'
import { NuxtOptionsServerMiddleware } from '@nuxt/types/config/server-middleware'
/*
 ** Server Middleware configuration
 ** See https://nuxtjs.org/api/configuration-servermiddleware
 */
const serverMiddleware: NuxtOptionsServerMiddleware[] = [
  express.json({ limit: '50mb' }),
  '@/server/session.js',
  '@/server/proxy.js',
]

export default serverMiddleware
