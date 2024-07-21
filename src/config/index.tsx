import {
  AppLayout,
  AuthenticationPage,
  DashboardPage,
  LinkPage,
  RedirectLinkPage,
  SignInPage,
  SignUpPage,
} from "@/app";
import RequireAuth from "@/components/shared/require-auth";
import { createBrowserRouter } from "react-router-dom";

export const siteConfig = {
  title: "Shtnrr",
  description:
    "A fullstack url shortener created using React, Vite, Supabase, Typescript and also a chrome extension",
  icon: "/vite.svg",
  url: `https://${import.meta.env.VITE_PROJECT_DOMAIN}`,
  author: {
    name: "Abdullahi Salihu",
    email: "abdullahisalihuinusa@gmail.com",
    portfolio: "https://ttatyz.vercel.app/",
  },
};

export const pageRoutes = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <AuthenticationPage />,
        children: [
          {
            index: true,
            element: <SignInPage />,
          },
          {
            path: "/auth/sign-up",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: "/auth",
        element: <AuthenticationPage />,
        children: [
          {
            index: true,
            element: <SignInPage />,
          },
          {
            path: "/auth/sign-up",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            {/* @ts-ignore */}
            <LinkPage />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLinkPage />,
      },
    ],
  },
]);
