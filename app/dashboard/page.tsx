import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "./dashboard-content";

export const metadata = {
  title: "Dashboard — Cine List",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <DashboardContent />;
}
