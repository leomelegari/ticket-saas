"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, DownloadIcon, Share2Icon } from "lucide-react";
import { useEffect } from "react";
import Ticket from "@/components/ticket";

export default function TicketPage() {
  const params = useParams();
  const { user } = useUser();
  const ticket = useQuery(api.tickets.getTicketWithDetails, {
    ticketId: params.id as Id<"tickets">,
  });

  useEffect(() => {
    if (!user) {
      redirect("/");
    }

    if (!ticket || ticket.userId !== user.id) {
      redirect("/tickets");
    }

    if (!ticket.event) {
      redirect("/tickets");
    }
  }, [user, ticket]);

  if (!ticket || !ticket.event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 space-y-8">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/tickets"
              className="flex items-center text-gray-600 dark:text-slate-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="size-6 sm:size-4 mr-2" />
              <span className="hidden sm:block">
                Voltar para meus ingressos
              </span>
            </Link>
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
          <div
            className={`bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border ${ticket.event.is_cancelled ? "border-red-200 dark:border-red-600" : "border-gray-100 dark:border-slate-800"}`}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-300">
              {ticket.event.name}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-slate-400">
              {new Date(ticket.event.eventDate).toLocaleDateString("pt-BR")} em{" "}
              {ticket.event.location}
            </p>
            <div className="mt-4 flex items-center gap-4">
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
            </div>
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
