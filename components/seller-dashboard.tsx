"use client";

import { createStripeConnectLoginLink } from "@/actions/create-stripe-connect-login-link";
import {
  AccountStatus,
  getStripeConnectAccountStatus,
} from "@/actions/get-stripe-connect-account-status";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { CalendarDaysIcon, CogIcon, Loader2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createStripeConnectCustomer } from "@/actions/create-stripe-connect-customer";
import { createStripeConnectAccountLink } from "@/actions/create-stripe-connect-account-link";

function SellerDashboard() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null,
  );

  const router = useRouter();
  const { user } = useUser();
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  useEffect(() => {
    if (stripeConnectId) {
      fetchAccountStatus();
    }
  }, [stripeConnectId]);

  if (stripeConnectId === undefined) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2Icon className="animate-spin size-6 text-blue-600" />
      </div>
    );
  }

  const isReadyToAcceptPayments =
    accountStatus?.isActive && accountStatus?.payoutsEnabled;

  const handleManageAccount = async () => {
    try {
      if (stripeConnectId && accountStatus?.isActive) {
        const loginUrl = await createStripeConnectLoginLink(stripeConnectId);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.log("error ", error);
      setError(true);
    }
  };

  const fetchAccountStatus = async () => {
    if (stripeConnectId) {
      try {
        const status = await getStripeConnectAccountStatus(stripeConnectId);
        setAccountStatus(status);
      } catch (error) {
        console.log("error ", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Página de vendas</h2>
          <p className="text-blue-100 mt-2">
            Administre seu perfil de vendedor e seus pagamentos
          </p>
        </div>

        {/* Main Content */}
        {isReadyToAcceptPayments && (
          <>
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Venda ingressos para seus eventos
              </h2>
              <p className="text-gray-600 mb-8">
                Liste e gerencie seus ingressos para venda
              </p>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-center gap-4">
                  <Link
                    href="/seller/new-event"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Criar evento
                  </Link>
                  <Link
                    href="/seller/events"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <CalendarDaysIcon className="w-5 h-5" />
                    Meus eventos
                  </Link>
                </div>
              </div>
            </div>

            <hr className="my-8" />
          </>
        )}

        <div className="p-6">
          {/* Account Creation Section */}
          {!stripeConnectId && !accountCreatePending && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">
                Comece a aceitar pagamentos
              </h3>
              <p className="text-gray-600 mb-6">
                Crie sua conta de vendedor para começar a receber pagamentos de
                forma segura usando Stripe!
              </p>
              <button
                onClick={async () => {
                  setAccountCreatePending(true);
                  setError(false);
                  try {
                    await createStripeConnectCustomer();
                    setAccountCreatePending(false);
                  } catch (error) {
                    console.error(
                      "Error creating Stripe Connect customer:",
                      error,
                    );
                    setError(true);
                    setAccountCreatePending(false);
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar conta de vendedor
              </button>
            </div>
          )}

          {/* Account Status Section */}
          {stripeConnectId && accountStatus && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Status Card */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Status da conta
                  </h3>
                  <div className="mt-2 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        accountStatus.isActive
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {accountStatus.isActive ? "Ativa" : "Pendente"}
                    </span>
                  </div>
                </div>

                {/* Payments Status Card */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Pagamentos
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.chargesEnabled
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.chargesEnabled
                          ? "Pode aceitar pagamentos"
                          : "Não pode aceitar pagamentos"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.payoutsEnabled
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.payoutsEnabled
                          ? "Pode receber pagamentos"
                          : "Não pode receber pagamentos"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              {accountStatus.requiresInformation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-3">
                    Informações obrigatórias
                  </h3>
                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div className="mb-3">
                      <p className="text-yellow-800 font-medium mb-2">
                        Ações necessárias:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {accountStatus.requirements.eventually_due.length > 0 && (
                    <div>
                      <p className="text-yellow-800 font-medium mb-2">
                        Não obrigatórias, mas importantes:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.eventually_due.map(
                          (req) => (
                            <li key={req}>{req.replace(/_/g, " ")}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Only show Add Information button if there are requirements */}
                  {!accountLinkCreatePending && (
                    <button
                      onClick={async () => {
                        setAccountLinkCreatePending(true);
                        setError(false);
                        try {
                          const { url } =
                            await createStripeConnectAccountLink(
                              stripeConnectId,
                            );
                          router.push(url);
                        } catch (error) {
                          console.error(
                            "Error creating Stripe Connect account link:",
                            error,
                          );
                          setError(true);
                        }
                        setAccountLinkCreatePending(false);
                      }}
                      className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Completar informações
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {accountStatus.isActive && (
                  <button
                    onClick={handleManageAccount}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <CogIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={fetchAccountStatus}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Atualizar status
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg">
                  Unable to access Stripe dashboard. Please complete all
                  requirements first.
                </div>
              )}
            </div>
          )}

          {/* Loading States */}
          {accountCreatePending && (
            <div className="text-center py-4 text-gray-600">
              Creating your seller account...
            </div>
          )}
          {accountLinkCreatePending && (
            <div className="text-center py-4 text-gray-600">
              Preparing account setup...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
