import { pgTable, uuid, text, varchar, timestamp, pgEnum ,primaryKey, boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const userRoleEnum = pgEnum("user_role", ["ADMIN", "FRONT_DESK"]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  password:varchar("password").notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("FRONT_DESK"),
  isVerified:boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().notNull()
},(table) => [{
    pk: primaryKey({ columns: [table.id] }),
}]);

export const enquiries = pgTable("enquiries", {
    id: uuid("id").defaultRandom().unique(),
    studentName: varchar("student_name", { length: 120 }).notNull(),
    studentEmail: varchar("student_email", { length: 150 }),
    studentPhone: varchar("student_phone", { length: 20 }),
    course: varchar("course", { length: 100 }).notNull(),
    status: enquiryStatusEnum("status").notNull().default("PENDING"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull()
},(table) => [{
    pk: primaryKey({ columns: [table.id] }),
}]);


export const enquiryComments = pgTable("enquiry_comments", {
    id: uuid("id").defaultRandom().unique(),
    enquiryId: uuid("enquiry_id").notNull().references(() => enquiries.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(), 
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull()
},(table) => [{
    pk: primaryKey({ columns: [table.id] }),
}]);



//========================================== Relations ============================================================


export const usersRelations = relations(users, ({ many }) => ({
    enquiries: many(enquiries),
    comments: many(enquiryComments),
}));


export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
    creator: one(users, {
        fields: [enquiries.createdBy],
        references: [users.id],
    }),
    comments: many(enquiryComments),
}));


export const enquiryCommentsRelations = relations(enquiryComments,({ one }) => ({
    enquiry: one(enquiries, {
        fields: [enquiryComments.enquiryId], references: [enquiries.id]
    }),
    creator: one(users, {
        fields: [enquiryComments.createdBy],references: [users.id]}),
    }));