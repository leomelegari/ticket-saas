import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateEventImage = mutation({
  args: {
    eventId: v.id("events"),
    storageId: v.union(v.id("_storage"), v.null()),
  },
  async handler(ctx, { eventId, storageId }) {
    await ctx.db.patch(eventId, {
      imageStorageId: storageId ?? undefined,
    });
  },
});

export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  async handler(ctx, { storageId }) {
    await ctx.storage.delete(storageId);
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  async handler(ctx, { storageId }) {
    return await ctx.storage.getUrl(storageId);
  },
});
