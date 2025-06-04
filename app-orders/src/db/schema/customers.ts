import { pgTable, pgEnum, text, date } from 'drizzle-orm/pg-core'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'cancelled',
])

export const customers = pgTable('customers', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  address: text().notNull(),
  state: text().notNull(),
  zipCode: text().notNull(),
  country: text().notNull(),
  dateOfBirth: date({ mode: 'date' }),
})
