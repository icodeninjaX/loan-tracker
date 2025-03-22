"use client";

import { useState, useEffect } from "react";

export default function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-max px-4 py-2 bg-yellow-600 text-white rounded-full text-sm font-medium shadow-lg">
      You are currently offline
    </div>
  );
}
