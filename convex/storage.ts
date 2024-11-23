import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  async handler(ctx, { storageId }) {
    return await ctx.storage.getUrl(storageId);
  },
});
