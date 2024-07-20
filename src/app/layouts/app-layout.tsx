import Header from "@/components/shared/header";

import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-dvh relative bg-secondary/80 dark:bg-background">
      <div className="fixed inset-0 size-full bg-transparent bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Header />
      <main className="flex-1 z-10">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
