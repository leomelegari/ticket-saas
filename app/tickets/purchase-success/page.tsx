import Ticket from "@/components/ticket";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function TicketSuccess() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const convex = getConvexClient();
  const tickets = await convex.query(api.events.getUserTickets, { userId });
  const lastTicket = tickets[tickets.length - 1];

  if (!lastTicket) {
    redirect("/");
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300">
            Ingresso adquirido com sucesso!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Sua compra foi confirmada e o ingresso está pronto para uso
          </p>
        </div>
        <Ticket ticketId={lastTicket._id} />
      </div>
    </div>
  );
}

export default TicketSuccess;
