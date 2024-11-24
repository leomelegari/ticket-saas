import SellerDashboard from "@/components/seller-dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function SellerPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div>
      <SellerDashboard />
    </div>
  );
}

export default SellerPage;
