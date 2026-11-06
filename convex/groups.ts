import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// No 0/O or 1/I so codes are easy to read aloud.
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode() {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  return code;
}

export const createGroup = mutation({
  args: {},
  handler: async (ctx) => {
    let code = randomCode();
    while (
      await ctx.db
        .query("groups")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique()
    ) {
      code = randomCode();
    }
    await ctx.db.insert("groups", { code });
    return code;
  },
});

export const getGroup = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    return await ctx.db
      .query("groups")
      .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
      .unique();
  },
});
