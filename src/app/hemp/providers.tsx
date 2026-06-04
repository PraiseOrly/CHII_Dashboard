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

function HEMPRefine({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      resources={[
        { name: "overview",         list: "/hemp",                  meta: { label: "Overview"         } },
        { name: "healthx",          list: "/hemp/healthx",          meta: { label: "HealthX"          } },
        { name: "internships",      list: "/hemp/internships",      meta: { label: "Internships"      } },
        { name: "mission-students", list: "/hemp/mission-students", meta: { label: "Mission Students" } },
      ]}
      options={{ syncWithLocation: false, warnWhenUnsavedChanges: false, disableTelemetry: true }}
    >
      {children}
    </Refine>
  );
}

export default function HEMPProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <HEMPRefine>{children}</HEMPRefine>
    </Suspense>
  );
}
