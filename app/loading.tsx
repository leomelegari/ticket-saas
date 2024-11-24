import { Loader2Icon } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2Icon className="animate-spin size-6 text-blue-600" />
    </div>
  );
}

export default Loading;
