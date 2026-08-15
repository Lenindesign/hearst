"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function EntertainmentRouteFallback() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/hearst-plus/entertainment/a-e/") return;

    router.replace("/hearst-plus/entertainment/?channel=a-e");
  }, [pathname, router]);

  return null;
}
