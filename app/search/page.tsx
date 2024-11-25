"use client";

import EventCard from "@/components/event-card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchResults = useQuery(api.events.search, { searchTerm: query });

  if (!searchResults) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2Icon className="animate-spin size-6 text-blue-600" />
      </div>
    );
  }

  const upcomingEvents = searchResults
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);
  const pastEvents = searchResults
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Results Header */}
        <div className="flex items-center gap-3 mb-8">
          <SearchIcon className="w-6 h-6 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-300">
              Resultados para &quot;{query}&quot;
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">
              Encontrado {searchResults.length} evento
              {searchResults.length > 1 && "s"}
            </p>
          </div>
        </div>

        {/* No Results State */}
        {searchResults.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-xl shadow-sm">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-300">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mt-1">
              Tente mudar os termos de busca ou procure por todos eventos
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-6">
              Eventos próximos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-6">
              Eventos finalizados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
