import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateOrCreateUserStripeConnectId = mutation({
  args: { userId: v.string(), stripeConnectId: v.string() },
  async handler(ctx, { stripeConnectId, userId }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      throw new Error("User not found!");
    }

    await ctx.db.patch(user._id, { stripeConnectId });
  },
});

export const getUsersStripeConnectId = query({
  args: { userId: v.string() },
  async handler(ctx, { userId }) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.neq(q.field("stripeConnectId"), undefined))
      .first();

    return user?.stripeConnectId;
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  async handler(ctx, { userId }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return user;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { email, name, userId }) => {
    // check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    // update if exists
    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name,
        email,
      });

      return existingUser._id;
    }

    // create if not exists
    const newUserId = await ctx.db.insert("users", {
      userId,
      name,
      email,
      stripeConnectId: undefined,
    });

    return newUserId;
  },
});
