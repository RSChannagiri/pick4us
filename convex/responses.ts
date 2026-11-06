import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitResponse = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.string(),
    cravings: v.array(v.string()),
    limits: v.array(v.string()),
    budget: v.number(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    if (!name) throw new Error("Name is required");
    const existing = (
      await ctx.db
        .query("responses")
        .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
        .collect()
    ).find((r) => r.name.toLowerCase() === name.toLowerCase());

    const answer = { ...args, name };
    if (existing) {
      await ctx.db.replace(existing._id, answer);
    } else {
      await ctx.db.insert("responses", answer);
    }
  },
});

export const listResponses = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    return await ctx.db
      .query("responses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();
  },
});
