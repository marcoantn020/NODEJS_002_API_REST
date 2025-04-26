import fastify from 'fastify'
import { transactionsRoute } from './routes/transactions.route'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

// app.register(require('fastify-cors'))
app.register(transactionsRoute, { prefix: '/transactions' })
