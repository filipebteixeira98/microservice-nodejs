import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.post('/orders', () => {
  return {
    message: 'Order created successfully',
  }
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('🛒[Orders] Server is running on http://localhost:3333')
})
