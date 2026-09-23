"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HempPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/hemp/at-a-glance");
  }, [router]);
  return null;
}
