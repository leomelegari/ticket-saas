import EventForm from "@/components/event-form";
import React from "react";

function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 dark:from-blue-900 to-blue-800 dark:to-blue-950 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Criar novo evento</h2>
          <p className="text-blue-100 mt-2">
            Crie seu evento e comece a vender os ingressos
          </p>
        </div>
        <div className="p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}

export default NewEventPage;
