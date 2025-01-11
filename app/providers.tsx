"use client";

import { NextUIProvider } from "@nextui-org/react";

import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
