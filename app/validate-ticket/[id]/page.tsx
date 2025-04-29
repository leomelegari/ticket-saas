"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, DownloadIcon, Share2Icon, TicketXIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import Ticket from "@/components/ticket";

export default function ValidateTicket() {
  // to validate the ticket we should:
  // - ensure the user logged in belongs to the event owner (need to improve this by implementing a member/employee type of user refering to the event owner)
  //  - check if the ticket status is "valid"
  //  - check if event is valid and not past
  //  - update the ticket status to "used"

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const params = useParams();
  const { user } = useUser();
  const ticket = useQuery(api.tickets.getTicketWithDetails, {
    ticketId: params.id as Id<"tickets">,
  });

  // send ticketId, event owner id, and current user id
  // we need to check if the  request is being sent from the owner

  const validateTicket = useMutation(api.tickets.validateTicket);

  useEffect(() => {
    if (ticket && ticket.event && user) {
      startTransition(async () => {
        const result = await validateTicket({
          userId: user.id,
          eventOwnerId: ticket.event!.userId,
          ticketId: ticket._id,
        });
        if (result?.success === false) {
          setError(result);
        }
      });
    }
  }, [ticket]);

  if (!ticket || !ticket.event) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col text-center justify-center items-center">
          <TicketXIcon className="size-44 text-red-700" />
          <h3 className="text-3xl font-bold text-red-800 dark:text-green-400">
            Calma lá!
          </h3>
          <p className="text-3xl font-medium text-red-800 dark:text-green-400">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 space-y-8">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                <DownloadIcon className="w-4 h-4" />
                <span className="text-sm">Salvar</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                <Share2Icon className="w-4 h-4" />
                <span className="text-sm">Compartilhar</span>
              </button>
            </div>
          </div>

          {/* Event Info Summary */}
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-3xl font-bold text-green-900 dark:text-green-400">
              Validado com sucesso!
            </h1>
            <span className="text-base font-normal text-gray-900 dark:text-slate-300">
              O ingresso para o evento <strong>{ticket.event.name}</strong> foi
              confirmado e validado!
            </span>
            <span>Agora, basta seguir as orientações da portaria.</span>
            <span>
              <strong>Bom divertimento! 🥳</strong>
            </span>
            {/* <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ticket.event.is_cancelled
                    ? "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-400"
                    : "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                }`}
              >
                {ticket.event.is_cancelled ? "Cancelado" : "Válido"}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400">
                Adquirido em{" "}
                {new Date(ticket.purchasedAt).toLocaleDateString("pt-BR")}
              </span>
            </div> */}
            {ticket.event.is_cancelled && (
              <p className="mt-4 text-sm text-red-600">
                Este evento foi cancelado. Um reembolso será processado caso
                ainda não tenha sido.
              </p>
            )}
          </div>
        </div>

        {/* Ticket Component */}
        <Ticket ticketId={ticket._id} />

        {/* Additional Information */}
        <div
          className={`mt-8 rounded-lg p-4 ${
            ticket.event.is_cancelled
              ? "bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900 border"
              : "bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900 border"
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              ticket.event.is_cancelled
                ? "text-red-900 dark:text-red-500"
                : "text-blue-900 dark:text-blue-500"
            }`}
          >
            Precisa de ajuda?
          </h3>
          <p
            className={`mt-1 text-sm ${
              ticket.event.is_cancelled
                ? "text-red-700"
                : "text-blue-700 dark:text-blue-600"
            }`}
          >
            {ticket.event.is_cancelled
              ? "Para dúvidas sobre reembolsos ou cancelamentos, por favor, entre em contato com nosso suporte através do email suporte@eventhive.com.br"
              : "Se você estiver tendo problemas com seu ingresso, por favor, entre em contato com nosso suporte através do email suporte@eventhive.com.br"}
          </p>
        </div>
      </div>
    </div>
  );
}
