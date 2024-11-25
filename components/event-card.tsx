"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  CalendarDaysIcon,
  CheckIcon,
  CircleArrowRightIcon,
  LoaderCircleIcon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  TicketIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import PurchaseTicket from "./purchase-ticket";

function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const imageUrl = useQuery(
    api.storage.getUrl,
    event?.imageStorageId ? { storageId: event?.imageStorageId } : "skip",
  );

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event.userId;

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status !== "waiting") {
      return null;
    }

    if (availability.purchasedCount >= availability.totalTickets) {
      return (
        <div className=" flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TicketIcon className="size-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Ingressos esgotados</span>
          </div>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      return (
        <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center">
            <CircleArrowRightIcon className="size-5 text-amber-500 mr-2" />
            <span className="text-amber-700 font-medium">
              Você é o próximo! (Posição na fila: {queuePosition.position})
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircleIcon className="size-4 mr-1 animate-spin text-amber-500" />
            <span className="text-amber-600 text-sm">
              Aguardando ingresso...
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center">
          <LoaderCircleIcon className="size-4 mr-2 animate-spin text-blue-500" />
          <span className="text-blue-700">Posição na fila</span>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          {queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) {
      return null;
    }

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-600"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/seller/events/${eventId}/edit`);
            }}
          >
            <PencilIcon className="size-5" />
            Editar
          </Button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between p-3 bg-green-50 dark:bg-green-800 rounded-lg border border-green-100 dark:border-green-900">
          <div className="flex items-center">
            <CheckIcon className="size-5 text-green-600 dark:text-green-300 mr-2" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              Já adquirido
            </span>
          </div>
          <Button
            className="rounded-full dark:text-slate-100 bg-green-600 hover:bg-green-700"
            onClick={() => router.push(`/tickets/${userTicket._id}`)}
          >
            Ver ingresso
          </Button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-4">
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-red-700 font-medium flex items-center">
                <XCircleIcon className="size-5 mr-2" />
                Expirado
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-lg hover:dark:bg-slate-800 transition-all duration-300 border border-gray-100 dark:border-slate-800 cursor-pointer overflow-hidden relative ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      {/* Event image */}

      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="size-3" />
                  Seu evento
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {event.name}
              </h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 mt-2">
                Evento finalizado
              </span>
            )}
          </div>
          {/* price tag */}
          <div className="flex flex-row justify-end items-end gap-2 ml-4">
            <span
              className={`px-4 py-1.5 font-semibold rounded-full shrink-0 ${
                isPastEvent
                  ? "bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-100"
                  : "bg-green-50 dark:bg-green-800 text-green-700 dark:text-green-100"
              }`}
            >
              R$ {event.price.toFixed(2)}
            </span>
            {availability.purchasedCount >= availability.totalTickets && (
              <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                Esgotado
              </span>
            )}
          </div>
        </div>

        {/* event details */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600 dark:text-slate-400">
            <MapPinIcon className="size-4 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-slate-400">
            <CalendarDaysIcon className="size-4 mr-2" />
            <span>
              {new Date(event.eventDate).toLocaleDateString("pt-BR")}{" "}
              {isPastEvent && "(Finalizado)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-slate-400">
            <TicketIcon className="size-4 mr-2" />
            <span>
              {availability.totalTickets - availability.purchasedCount} /{" "}
              {availability.totalTickets} disponíveis
              {!isPastEvent && availability.activeOffers > 0 && (
                <span className="text-amber-600 text-sm ml-2">
                  ({availability.activeOffers}){" "}
                  {availability.activeOffers === 1 ? "pessoa" : "pessoas"}{" "}
                  tentando comprar
                </span>
              )}
            </span>
          </div>
        </div>

        {/* event description */}
        <p className="mt-4 text-gray-600 dark:text-slate-400 text-sm line-clamp-2">
          {event.description}
        </p>

        <div onClick={(e) => e.stopPropagation()}>
          {!isPastEvent && renderTicketStatus()}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
