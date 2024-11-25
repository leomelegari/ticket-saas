"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { XCircleIcon } from "lucide-react";

function ReleaseTicket({
  eventId,
  waitingListId,
}: {
  eventId: Id<"events">;
  waitingListId: Id<"waitingList">;
}) {
  const [isReleasing, setIsReleasing] = useState(false);
  const releaseTicket = useMutation(api.waitingList.releaseTicket);

  const handleRelease = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua reserva?")) {
      return;
    }

    try {
      setIsReleasing(true);
      await releaseTicket({
        eventId,
        waitingListId,
      });
    } catch (error) {
      console.log("error ", error);
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <Button
      onClick={handleRelease}
      disabled={isReleasing}
      className="w-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <XCircleIcon className="size-4" />
      {isReleasing ? "Cancelando..." : "Cancelar reserva"}
    </Button>
  );
}

export default ReleaseTicket;
