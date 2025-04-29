import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "@clerk/nextjs/server";

export const getValidTicketsForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.or(q.eq(q.field("status"), "valid"), q.eq(q.field("status"), "used")),
      )
      .collect();
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, { ticketId, status }) => {
    await ctx.db.patch(ticketId, { status });
  },
});

export const getUserTicketForEvent = query({
  args: { eventId: v.id("events"), userId: v.string() },
  async handler(ctx, { eventId, userId }) {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId),
      )
      .first();

    return ticket;
  },
});

export const getTicketWithDetails = query({
  args: { ticketId: v.id("tickets") },
  async handler(ctx, { ticketId }) {
    const ticket = await ctx.db.get(ticketId);

    if (!ticket) {
      return null;
    }

    const event = await ctx.db.get(ticket.eventId);

    return {
      ...ticket,
      event,
    };
  },
});

export const validateTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    userId: v.string(),
    eventOwnerId: v.string(),
  },
  async handler(ctx, { ticketId, eventOwnerId, userId }) {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) {
      return null;
    }

    const event = await ctx.db.get(ticket.eventId);
    if (!event) {
      return null;
    }

    if (userId !== eventOwnerId) {
      return {
        success: false,
        message:
          "Para validar o ingresso é necessário estar logado na conta do criador do evento ou ser membro do time do criador",
      };
    }

    await ctx.db.patch(ticketId, { status: "used" });

    return { success: true, message: "Ingresso validado com sucesso!" };
  },
});
