"use client";

import React from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/hooks/use-storage-url";
import { useQuery } from "convex/react";
import {
  CalendarDaysIcon,
  IdCardIcon,
  Loader2Icon,
  MapPinIcon,
  TicketIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import QRCode from "react-qr-code";

function Ticket({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });
  const user = useQuery(api.users.getUserById, {
    userId: ticket?.userId ?? "",
  });
  const imageUrl = useStorageUrl(ticket?.event?.imageStorageId);

  if (!ticket || !ticket.event || !user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2Icon className="animate-spin size-6 text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl border ${ticket.event.is_cancelled ? "border-red-200 dark:border-red-500" : "border-gray-100 dark:border-slate-800"}`}
    >
      {/* Event header w/ image */}
      <div className="relative">
        {imageUrl && (
          <div className="relative w-full aspect-[21/9]">
            <Image
              src={imageUrl}
              alt={ticket.event.name}
              fill
              className={`object-cover object-center ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90"></div>
          </div>
        )}
        <div
          className={`px-6 py-4 ${imageUrl ? "absolute bottom-0 left-0 right-0" : ticket.event.is_cancelled ? "bg-red-600 dark:bg-red-900" : "bg-blue-600 dark:bg-blue-900"}`}
        >
          <h2
            className={`text-2xl font-bold ${imageUrl || !imageUrl ? "text-white dark:text-slate-300" : "text-black"}`}
          >
            {ticket.event.name}
          </h2>
          {ticket.event.is_cancelled && (
            <p className="text-red-300 dark:text-red-500 mt-1">
              Este evento foi cancelado
            </p>
          )}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Event Details */}
          <div className="space-y-4">
            <div className="flex items-start text-gray-600 dark:text-slate-400 ">
              <CalendarDaysIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-blue-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  Data
                </p>
                <p className="font-medium">
                  {new Date(ticket.event.eventDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="flex items-start text-gray-600 dark:text-slate-400 ">
              <MapPinIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-blue-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  Local
                </p>
                <p className="font-medium">{ticket.event.location}</p>
              </div>
            </div>

            <div className="flex items-start text-gray-600 dark:text-slate-400">
              <UserIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-blue-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  Titular do Ingresso
                </p>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-start text-gray-600 dark:text-slate-400 break-all">
              <IdCardIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-blue-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  ID do Titular do Ingresso
                </p>
                <p className="font-medium">{user.userId}</p>
              </div>
            </div>

            <div className="flex items-start text-gray-600 dark:text-slate-400">
              <TicketIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-blue-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-300">
                  Preço
                </p>
                <p className="font-medium">
                  R$ {ticket.event.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex flex-col items-center justify-center border-l border-gray-200 dark:border-slate-700 pl-6">
            <div
              className={`bg-gray-100 p-4 rounded-lg ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
            >
              <QRCode value={ticket._id} className="w-32 h-32" />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-300 break-all text-center max-w-[200px] md:max-w-full">
              Ticket ID: {ticket._id}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-slate-300 mb-2">
            Informações importantes
          </h3>
          {ticket.event.is_cancelled ? (
            <p className="text-sm text-red-600">
              Este evento foi cancelado. Um reembolso será processado
              automaticamente caso ainda não tenha sido.
            </p>
          ) : (
            <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
              <li>• Por favor, chegue ao evento 30 minutos antes do início</li>
              <li>• Tenha seu QRCode em mãos para validação da entrada</li>
              <li>• Este ingresso é intransferível</li>
            </ul>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div
        className={`${ticket.event.is_cancelled ? "bg-red-50 dark:bg-red-900" : "bg-gray-50 dark:bg-slate-700"} px-6 py-4 flex justify-between items-center`}
      >
        <span className="text-sm text-gray-500 dark:text-slate-300">
          Data da compra: {new Date(ticket.purchasedAt).toLocaleString("pt-BR")}
        </span>
        <span
          className={`text-sm font-medium ${ticket.event.is_cancelled ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}
        >
          {ticket.event.is_cancelled ? "Cancelado" : "Ingresso válido"}
        </span>
      </div>
    </div>
  );
}

export default Ticket;
