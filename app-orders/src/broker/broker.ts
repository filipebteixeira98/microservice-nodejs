import amqp from 'amqplib'

if (!process.env.BROKER_URL) {
  throw new Error('BROKER_URL environment variable must be configured.')
}

export const broker = await amqp.connect(process.env.BROKER_URL)
