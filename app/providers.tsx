"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
