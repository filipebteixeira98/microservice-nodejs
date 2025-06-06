import '@opentelemetry/auto-instrumentations-node/register'

import { trace } from '@opentelemetry/api'
import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { randomUUID } from 'node:crypto'
import { setTimeout } from 'node:timers/promises'

import { dispatchOrderCreated } from '../broker/messages/order-created.ts'

import { tracer } from '../tracer/tracer.ts'

import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)

app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.get('/health', (request, reply) => {
  return reply.status(200).send({ status: 'OK' })
})

app.post(
  '/orders',
  {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body

    console.log('Creating order with amount:', amount)

    const orderId = randomUUID()

    try {
      await db.insert(schema.orders).values({
        id: randomUUID(),
        customerId: 'c10057d3-9828-430c-8a3a-4c357bd6f639',
        amount,
      })
    } catch (error) {
      console.error('Error inserting order into database:', error)
    }

    const span = tracer.startSpan('It seems there is an error occurring')

    span.setAttribute('order_id', orderId)

    await setTimeout(1000)

    span.end()

    trace.getActiveSpan()?.setAttribute('order_id', orderId)

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: 'c10057d3-9828-430c-8a3a-4c357bd6f639',
      },
    })

    return reply.status(201).send()
  }
)

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('🛒[Orders] Server is running on http://localhost:3333')
})
