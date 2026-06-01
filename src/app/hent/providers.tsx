"use client";
import { Suspense } from "react";
import { Refine } from "@refinedev/core";
import type { DataProvider } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataProvider: DataProvider = {
  getList:   async () => ({ data: [], total: 0 }),
  getOne:    async () => ({ data: {} as any }), // eslint-disable-line @typescript-eslint/no-explicit-any
  create:    async () => ({ data: {} as any }), // eslint-disable-line @typescript-eslint/no-explicit-any
  update:    async () => ({ data: {} as any }), // eslint-disable-line @typescript-eslint/no-explicit-any
  deleteOne: async () => ({ data: {} as any }), // eslint-disable-line @typescript-eslint/no-explicit-any
  getApiUrl: () => "",
};

function HENTRefine({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      resources={[
        { name: "overview",      list: "/hent",                    meta: { label: "Overview"                 } },
        { name: "ventures",      list: "/hent/ventures",           show: "/hent/ventures/show/:id", meta: { label: "Ventures" } },
        { name: "hackathons",    list: "/hent/hackathons",         meta: { label: "Hackathons"               } },
        { name: "mentorship",    list: "/hent/mentorship",         meta: { label: "Mentorship & Fellowships" } },
        { name: "fieldvisits",   list: "/hent/fieldvisits",        meta: { label: "Field Visits"             } },
        { name: "masterclasses", list: "/hent/masterclasses",      meta: { label: "Masterclasses"            } },
      ]}
      options={{ syncWithLocation: false, warnWhenUnsavedChanges: false, disableTelemetry: true }}
    >
      {children}
    </Refine>
  );
}

export default function HENTProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <HENTRefine>{children}</HENTRefine>
    </Suspense>
  );
}
