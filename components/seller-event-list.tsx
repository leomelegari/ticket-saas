"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Ban,
  Banknote,
  CalendarDays,
  Edit,
  InfoIcon,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import CancelEventButton from "./CancelEventButton";
import { Doc } from "@/convex/_generated/dataModel";
import { Metrics } from "@/convex/events";
import { useStorageUrl } from "@/hooks/use-storage-url";
import CancelEventButton from "./cancel-event-button";
// import { Metrics } from "@/convex/events";

export default function SellerEventList() {
  const { user } = useUser();
  const events = useQuery(api.events.getSellerEvents, {
    userId: user?.id ?? "",
  });

  if (!events) return null;

  const upcomingEvents = events.filter((e) => e.eventDate > Date.now());
  const pastEvents = events.filter((e) => e.eventDate <= Date.now());

  return (
    <div className="mx-auto space-y-8">
      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-300 mb-4">
          Eventos próximos
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {upcomingEvents.map((event) => (
            <SellerEventCard key={event._id} event={event} />
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-gray-500 dark:text-slate-400 text-center">
              Nenhum evento próximo
            </p>
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-300 mb-4">
            Eventos finalizados
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {pastEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SellerEventCard({
  event,
}: {
  event: Doc<"events"> & {
    metrics: Metrics;
  };
}) {
  const imageUrl = useStorageUrl(event.imageStorageId);
  const isPastEvent = event.eventDate < Date.now();

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border ${event.is_cancelled ? "border-red-200 dark:border-red-600" : "border-gray-200 dark:border-slate-700"} overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex flex-col items-start gap-6">
          {/* Event Image */}
          {imageUrl && (
            <div className="relative w-full sm:w-[200px] size-40 rounded-lg overflow-hidden shrink-0">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-300">
                  {event.name}
                </h3>
                <p className="mt-1 text-gray-500 dark:text-slate-400">
                  {event.description}
                </p>
                {event.is_cancelled && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Evento cancelado & reembolsado
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center w-full gap-2">
                {!isPastEvent && !event.is_cancelled && (
                  <div className="flex w-full justify-end flex-col gap-2 lg:flex-row">
                    <Link
                      href={`/seller/events/${event._id}/edit`}
                      className="w-full sm:w-fit flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-600 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                    <CancelEventButton eventId={event._id} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 mb-1">
                  <Ticket className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled
                      ? "Ingressos reembolsados"
                      : "Ingressos vendidos"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-400">
                  {event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm text-gray-500 dark:text-slate-400 font-normal">
                        {" "}
                        reembolsado
                      </span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm text-gray-500 font-normal">
                        /{event.totalTickets}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300  mb-1">
                  <Banknote className="w-4 h-4" />
                  <span className="text-sm font-medium ">
                    {event.is_cancelled ? "Valor reembolsado" : "Lucro"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-400">
                  R$
                  {event.is_cancelled
                    ? (event.metrics.refundedTickets * event.price).toFixed(2)
                    : event.metrics.revenue.toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 mb-1">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm font-medium">Data</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-400">
                  {new Date(event.eventDate).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 mb-1">
                  <InfoIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-400">
                  {event.is_cancelled
                    ? "Cancelado"
                    : isPastEvent
                      ? "Finalizado"
                      : "Ativo"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
