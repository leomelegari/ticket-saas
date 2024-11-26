"use client";

import EventCard from "@/components/event-card";
import JoinQueue from "@/components/join-queue";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  CalendarDaysIcon,
  Loader2Icon,
  MapPinIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

function EventPage() {
  const params = useParams();
  const { user } = useUser();

  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  const availability = useQuery(api.events.getEventAvailability, {
    eventId: params.id as Id<"events">,
  });

  const imageUrl = useQuery(
    api.storage.getUrl,
    event?.imageStorageId ? { storageId: event?.imageStorageId } : "skip",
  );

  if (!event || !availability) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2Icon className="animate-spin size-6 text-blue-600" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          {/* Event image */}
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* event details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* left column */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-300 mb-4">
                    {event.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-slate-400">
                    {event.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className=" bg-gray-50 dark:bg-slate-800 dark:border-slate-700 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 dark:text-slate-400 mb-1">
                      <CalendarDaysIcon className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">Data</span>
                    </div>
                    <p className="text-gray-900 dark:text-slate-400">
                      {new Date(event.eventDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className=" bg-gray-50 dark:bg-slate-800 dark:border-slate-700 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 dark:text-slate-400 mb-1">
                      <MapPinIcon className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">Local</span>
                    </div>
                    <p className="text-gray-900 dark:text-slate-400">
                      {event.location}
                    </p>
                  </div>

                  <div className=" bg-gray-50 dark:bg-slate-800 dark:border-slate-700 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 dark:text-slate-400 mb-1">
                      <TicketIcon className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">Preço</span>
                    </div>
                    <p className="text-gray-900 dark:text-slate-400">
                      R$ {event.price.toFixed(2)}
                    </p>
                  </div>

                  <div className=" bg-gray-50 dark:bg-slate-800 dark:border-slate-700 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 dark:text-slate-400 mb-1">
                      <UsersIcon className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">
                        Disponibilidade
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-slate-400">
                      {availability.totalTickets - availability.purchasedCount}{" "}
                      / {availability.totalTickets} restantes
                    </p>
                  </div>
                </div>

                {/* additional event info */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Informações do evento
                  </h3>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-400">
                    <li>
                      · Por favor, chegue 30 minutos antes do evento iniciar
                    </li>
                    <li>
                      · Os ingressos para esse evento não são reembolsáveis
                    </li>
                    <li>· Evento para maiores de 18 anos</li>
                  </ul>
                </div>
              </div>

              {/* right column - ticket purchase */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard eventId={params.id as Id<"events">} />

                  {user ? (
                    <JoinQueue
                      eventId={params.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                        Entre para comprar
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
