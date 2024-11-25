import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import SellerEventList from "@/components/seller-event-list";

export default async function SellerEventsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/seller"
                className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-300">
                  Meus eventos
                </h1>
                <p className="mt-1 text-gray-500 dark:text-slate-400">
                  Gerencie seus eventos e recebimentos
                </p>
              </div>
            </div>
            <Link
              href="/seller/new-event"
              className="flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar evento
            </Link>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <SellerEventList />
        </div>
      </div>
    </div>
  );
}
