
import { lazyRetry } from "@utils/globalFunction";
import type { ComponentType } from "react";

type ImportFn<T extends ComponentType<object>> = () => Promise<{
  default: T;
}>;

export const lazy = <T extends ComponentType<object>>(
  importFn: ImportFn<T>,
) => ({
  lazy: () =>
    lazyRetry(importFn).then((module) => ({
      Component: module.default,
    })),
});


export const authRoutes = [
  {
    path: "/",
    ...lazy(() => import("@/view/modules/Auth/Login")),
  },
  {
    path: "/register",
    ...lazy(() => import("@/view/modules/Auth/Register")),
  },
];

export const appRoutes = [
  {
    path: "/dashboard",
    ...lazy(() => import("@/view/modules/Dashboard")),
  },
  {
    path: "/profile",
    ...lazy(() => import("@/view/modules/Profile")),
  },
];

export const errorRoutes = [
  {
    path: "*",
    ...lazy(() => import("@/view/error/NotFound")),
  },
];
