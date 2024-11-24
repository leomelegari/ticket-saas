"use server";

import { stripe } from "@/lib/stripe";

export async function createStripeConnectLoginLink(stripeAccountId: string) {
  if (!stripeAccountId) {
    throw new Error("No stripe account ID provided");
  }

  try {
    // create an account to the user so they can access the dashboard and see the incomings
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
    return loginLink.url;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to create stripe login link");
  }
}
