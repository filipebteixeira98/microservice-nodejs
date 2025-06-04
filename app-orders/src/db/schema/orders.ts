import { pgTable, pgEnum, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: text().primaryKey(),
  customerId: text().notNull(),
  amount: integer().notNull(),
  status: orderStatusEnum().notNull().default('pending'),
  createdAt: timestamp().notNull().defaultNow(),
})
