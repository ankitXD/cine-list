import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AddContent from "./add-content";

export const metadata = {
  title: "Add Movies — Cine List",
};

export default async function AddPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <AddContent />;
}
