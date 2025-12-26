import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({
  port: 4000,
  host: '0.0.0.0',
})
