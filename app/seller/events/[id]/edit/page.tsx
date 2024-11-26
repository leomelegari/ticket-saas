"use client";

import EventForm from "@/components/event-form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { AlertCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

function EditEventPage() {
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 dark:from-blue-900 to-blue-800 dark:to-blue-950 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Editar evento</h2>
          <p className="text-blue-100 mt-2">
            Atualize os detalhes do seu evento
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
            <div className="flex gap-2 text-amber-800 dark:text-amber-400">
              <AlertCircleIcon className="size-5 shrink-0" />
              <p className="text-sm">
                Observação importante: Em caso de alteração na quantidade total
                de ingressos disponíveis, todos os ingressos previamente
                comercializados permanecerão válidos. É permitido somente o
                acréscimo no número total de ingressos, sendo vedada qualquer
                redução que resulte em quantidade inferior ao volume já
                comercializado.
              </p>
            </div>
          </div>
          <EventForm mode="edit" initialData={event} />
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;
