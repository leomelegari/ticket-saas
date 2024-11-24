"use server";

import { api } from "@/convex/_generated/api";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Convex URL is not set.");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // check if user already has a connected account
  const exisitingStripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    { userId },
  );

  // if has, just return the value
  if (exisitingStripeConnectId) {
    return { account: exisitingStripeConnectId };
  }

  // if hasnt, create a new connect account
  const account = await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      //   apple_pay: { requested: true },
      //   google_pay: { requested: true },
      transfers: { requested: true },
    },
  });

  // update user with stripe connect id
  await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  });

  return { account: account.id };
}
