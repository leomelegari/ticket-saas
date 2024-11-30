"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarDaysIcon, Loader2, TicketIcon } from "lucide-react";
import EventCard from "./event-card";

function EventList() {
  const events = useQuery(api.events.get);

  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin size-6 text-blue-600" />
      </div>
    );
  }

  const upcommingEvents = events
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);

  const pastEvents = events
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300">
            Eventos próximos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-500">
            Descubra e compre ingressos para eventos surpreendentes!
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 w-fit px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 ">
          <div className="flex w-fit items-center gap-2 text-gray-600 dark:text-slate-400">
            <CalendarDaysIcon className="size-5" />
            <span className="font-medium">
              {upcommingEvents.length} eventos próximos
            </span>
          </div>
        </div>
      </div>

      {/* upcoming event grid */}
      {upcommingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcommingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-12 text-center mb-12">
          <TicketIcon className="size-12 text-gray-400 dark:text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-slate-300">
            Nenhum evento próximo...
          </h3>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Volte mais tarde para novos eventos!
          </p>
        </div>
      )}

      {/* past event */}
      {upcommingEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-300 mb-6">
            Eventos finalizados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default EventList;
