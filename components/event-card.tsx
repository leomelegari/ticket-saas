"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  CalendarDaysIcon,
  CheckIcon,
  ListStartIcon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  TicketIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

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
            className="w-full"
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
        <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center">
            <CheckIcon className="size-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Comprado</span>
          </div>
          <Button
            size="sm"
            className="rounded-full bg-green-600 hover:bg-green-700"
            onClick={() => router.push(`/tickets/${userTicket._id}`)}
          >
            Ver ingresso
          </Button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div>
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {/* {renderQueuePosition()} */}
          {queuePosition.status === "expired" && (
            <div>
              <span>
                <XCircleIcon />
              </span>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden relative ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
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
              <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Evento finalizado
              </span>
            )}
          </div>
        </div>

        {/* price tag */}
        <div className="flex flex-row w-full justify-end items-end gap-2 ml-4">
          <span
            className={`px-4 py-1.5 font-semibold rounded-full ${
              isPastEvent
                ? "bg-gray-50 text-gray-500"
                : "bg-green-50 text-green-700"
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

        {/* event details */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="size-4 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="size-4 mr-2" />
            <span>
              {new Date(event.eventDate).toLocaleDateString()}{" "}
              {isPastEvent && "(Finalizado)"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
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
        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
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
