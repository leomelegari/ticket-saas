import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";

function Return() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* success header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center ">
            <div className="mb-4 flex justify-center">
              <CheckCircle2Icon className="size-16" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Conta conectada!</h2>
            <p className="text-green-100">
              Sua conta do Stripe foi conectada com sucesso
            </p>
          </div>

          {/* content */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-1">
                  O que acontece agora?
                </h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>➞ Você já pode criar eventos e vender ingressos</li>
                  <li>
                    ➞ Os pagamentos serão processados totalmente através da sua
                    conta Stripe
                  </li>
                  <li>➞ Os pagamentos serão transferidos automaticamente</li>
                </ul>
              </div>

              <Link
                className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                href="/seller"
              >
                Acessar dashboard
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Return;
