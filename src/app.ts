import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({
  port: 4000,
  host: '0.0.0.0',
})
