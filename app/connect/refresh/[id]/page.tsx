"use client";

import { createStripeConnectAccountLink } from "@/actions/create-stripe-connect-account-link";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Refresh() {
  const params = useParams();
  const connectedAccountId = params.id as string;

  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const createAccountLink = async () => {
      if (connectedAccountId) {
        setAccountLinkCreatePending(true);
        setError(false);
        try {
          const { url } =
            await createStripeConnectAccountLink(connectedAccountId);
          window.location.href = url;
        } catch (error) {
          console.log("error ", error);
          setError(true);
        }
        setAccountLinkCreatePending(false);
      }
    };

    createAccountLink();
  }, [connectedAccountId]);

  return (
    <div>
      <div>
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold">Gerenciar conta</h2>
            <p className="text-blue-100 mt-2">
              Complete sua conta para começar a vender ingressos
            </p>
          </div>

          {/* content */}
          <div className="p-6">
            {error ? (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircleIcon className="size-5 shrink-0 text-red-900 mb-1" />
                <div>
                  <h3 className="font-medium text-red-900">Algo deu errado</h3>
                  <p className="text-sm text-red-700">
                    Não conseguimos atualizar sua conta. Por favor, entre em
                    contato se o problema persistir
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2Icon className="size-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">
                  {accountLinkCreatePending
                    ? "Criando o link da sua conta..."
                    : "Redirecionando para o stripe..."}
                </p>
                {connectedAccountId && (
                  <p className="text-xs text-gray-500 mt-4">
                    ID da conta: ${connectedAccountId}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Refresh;
