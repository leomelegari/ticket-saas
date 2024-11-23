"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useMutation } from "convex/react";

function SyncUserWithConvex() {
  const { user } = useUser();

  // update user
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) {
      return;
    }

    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          name: user.fullName ?? "",
          email: user.emailAddresses[0]?.emailAddress ?? "",
        });
      } catch (error) {
        console.log("error ", error);
      }
    };

    syncUser();
  }, [user]);
  return null;
}

export default SyncUserWithConvex;
