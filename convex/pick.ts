import { query } from "./_generated/server";
import { v } from "convex/values";
import { choose } from "./pickLogic";

// A query, so every phone watching it gets a new pick when someone responds.
export const getPick = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    const restaurants = await ctx.db.query("restaurants").collect();
    const responses = await ctx.db
      .query("responses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();
    return choose(restaurants, responses);
  },
});
