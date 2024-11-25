import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { TicketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import ReleaseTicket from "./release-ticket";

import { createStripeCheckoutSession } from "@/actions/create-stripe-checkout-session";

function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minuto${minutes === 1 ? "" : "s"} ${seconds} segundo${seconds === 1 ? "" : "s"}`,
        );
      } else {
        setTimeRemaining(`${seconds} segundo${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeRemaining();

    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  const handlePurchase = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);
      const { sessionUrl } = await createStripeCheckoutSession({
        eventId,
      });

      if (sessionUrl) {
        router.push(sessionUrl);
      }
    } catch (error) {
      console.log("error ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-amber-200 dark:border-amber-900">
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <TicketIcon className="size-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-300">
                  Ingresso reservado
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Reserva expira em {timeRemaining}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Um ingresso foi reservado para você. Complete a compra antes do
              tempo de expiração para garantir seu lugar neste evento!
            </div>
          </div>
        </div>

        <Button
          onClick={handlePurchase}
          disabled={isExpired || isLoading}
          className="w-full font-bold bg-gradient-to-r from-amber-500 dark:from-amber-800 to-amber-600 dark:to-amber-900 hover:from-amber-600 hover:dark:from-amber-900 hover:to-amber-700 dark:hover:to-amber-950 transform scale-[1.02] transition-all disabled:from-gray-400 dark:text-white disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Redirecionando..." : "Comprar agora ➞"}
        </Button>

        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
}

export default PurchaseTicket;
