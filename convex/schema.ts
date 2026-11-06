import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    name: v.string(),
    cuisines: v.array(v.string()),
    dietary: v.array(v.string()),
    price: v.number(),
  }),
  groups: defineTable({
    code: v.string(),
  }).index("by_code", ["code"]),
  responses: defineTable({
    groupId: v.id("groups"),
    name: v.string(),
    cravings: v.array(v.string()),
    limits: v.array(v.string()),
    budget: v.number(),
  }).index("by_group", ["groupId"]),
});
