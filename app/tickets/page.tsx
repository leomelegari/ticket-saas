"use client";

import TicketCard from "@/components/ticket-card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { TicketIcon } from "lucide-react";

function Tickets() {
  const { user } = useUser();
  const tickets = useQuery(api.events.getUserTickets, {
    userId: user?.id ?? "",
  });

  if (!tickets) {
    return null;
  }

  const validTickets = tickets.filter((t) => t.status === "valid");
  const otherTickets = tickets.filter((t) => t.status !== "valid");

  const upcomingTickets = validTickets.filter(
    (t) => t.event && t.event.eventDate > Date.now(),
  );
  const pastTickets = validTickets.filter(
    (t) => t.event && t.event.eventDate <= Date.now(),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300">
              Meus ingressos
            </h1>
            <p className="mt-2 text-gray-600 dark:text-slate-500">
              Gerencie e visualize seus ingressos
            </p>
          </div>
          <div className="bg-white w-fit dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <TicketIcon className="w-5 h-5" />
              <span className="font-medium">
                {tickets.length} - Ingressos totais
              </span>
            </div>
          </div>
        </div>

        {upcomingTickets.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-4">
              Eventos próximos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticketId={ticket._id} />
              ))}
            </div>
          </div>
        )}

        {pastTickets.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Eventos finalizados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticketId={ticket._id} />
              ))}
            </div>
          </div>
        )}

        {otherTickets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-4">
              Outros ingressos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticketId={ticket._id} />
              ))}
            </div>
          </div>
        )}

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <TicketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Sem ingressos</h3>
            <p className="text-gray-600 mt-1">
              Quando você comprar ingressos, eles aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tickets;
