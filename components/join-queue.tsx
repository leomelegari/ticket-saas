"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { WAITING_LIST_STATUS } from "@/convex/constants";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { ClockIcon, Divide, Loader2Icon, OctagonXIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

function JoinQueue({
  eventId,
  userId,
}: {
  eventId: Id<"events">;
  userId: string;
}) {
  const { toast } = useToast();
  const joinWaitingList = useMutation(api.events.joinWaitingList);
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId,
  });

  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const event = useQuery(api.events.getById, { eventId });

  const isEventOwner = userId === event?.userId;

  const handleJoinQueue = async () => {
    try {
      const result = await joinWaitingList({ eventId, userId });
      if (result.success) {
        console.log("Joined waiting list");
        toast({
          title: result.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.log("error ", error);
      if (
        error instanceof ConvexError &&
        error.message.includes("Você entrou na lista de espera muitas vezes")
      ) {
        toast({
          variant: "destructive",
          title: "Calma lá, amigo!",
          description: error.data,
          duration: 5000,
        });
      } else {
        console.error("Error joining waiting list: ", error);
        toast({
          variant: "destructive",
          title: "Humm... algo deu errado",
          description: "Erro ao entrar na fila, tente novamente.",
        });
      }
    }
  };

  if (queuePosition === undefined || availability === undefined || !event) {
    return (
      <div>
        <Loader2Icon className="animate-spin size-6 text-blue-600" />
      </div>
    );
  }

  if (userTicket) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  return (
    <div>
      {(!queuePosition ||
        queuePosition.status === WAITING_LIST_STATUS.EXPIRED ||
        (queuePosition.status === WAITING_LIST_STATUS.OFFERED &&
          queuePosition.offerExpiresAt &&
          queuePosition.offerExpiresAt <= Date.now())) && (
        <>
          {isEventOwner ? (
            <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg">
              <OctagonXIcon className="size-5" />
              <span>
                Você não pode comprar ingresso para seu próprio evento
              </span>
            </div>
          ) : isPastEvent ? (
            <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300 rounded-lg cursor-not-allowed">
              <ClockIcon className="size-5" />
              <span>Evento finalizado</span>
            </div>
          ) : availability.purchasedCount >= availability.totalTickets ? (
            <div className=" text-center p-4">
              <p className="text-lg font-semibold text-red-600">
                Desculpe, ingressos esgotados para este evento.
              </p>
            </div>
          ) : (
            <Button
              onClick={handleJoinQueue}
              disabled={isPastEvent || isEventOwner}
              className="w-full disabled:cursor-not-allowed dark:disabled:cursor-not-allowed font-semibold dark:bg-blue-900 dark:text-slate-50 dark:hover:bg-blue-800"
            >
              Comprar ingresso
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default JoinQueue;
