"use client";

import { useEffect, useState } from "react";

export default function DeviceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768); // mobile breakpoint
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-xl font-semibold">Not available on desktop</h1>
          <p className="text-gray-500 mt-2">
            Please open this app on a mobile device.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
