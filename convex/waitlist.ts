import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Landing page waitlist. Saves an email once; signing up twice is a no-op.
export const join = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) || clean.length > 200) {
      throw new Error("Invalid email");
    }
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", clean))
      .unique();
    if (!existing) await ctx.db.insert("waitlist", { email: clean });
    return "ok";
  },
});
