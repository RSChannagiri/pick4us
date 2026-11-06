import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Admin only (not callable from the web): remove one waitlist email.
export const remove = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const row = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email.trim().toLowerCase()))
      .unique();
    if (row) await ctx.db.delete(row._id);
    return row ? "removed" : "not found";
  },
});
