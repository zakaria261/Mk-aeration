import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const quoteRequests = sqliteTable(
  "quote_requests",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    service: text("service").notNull(),
    profile: text("profile").notNull(),
    city: text("city").notNull(),
    postcode: text("postcode").notNull(),
    timing: text("timing").notNull(),
    description: text("description").notNull(),
    name: text("name").notNull(),
    company: text("company").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    consentAt: integer("consent_at").notNull(),
    createdAt: integer("created_at").notNull(),
    ipHash: text("ip_hash").notNull(),
    notified: integer("notified").notNull().default(0),
  },
  (table) => [
    index("quote_requests_created_at").on(table.createdAt),
    index("quote_requests_ip_created").on(table.ipHash, table.createdAt),
  ],
);
