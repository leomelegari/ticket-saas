import Stripe from "stripe";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("Missing stripe key");
// }

export const stripe = new Stripe(
  "sk_test_51QOGBUAs3bxAU1CjuyVweOgliIJs7mgZF6xoGdirWx0HHQ3N9Z5SEOfyGOlhgvJEPWPBzFMShtCFf6OxJk0WF2Cw00x0ECdnpr",
  {
    apiVersion: "2024-11-20.acacia",
  },
);
