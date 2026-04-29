import { NextResponse } from "next/server";
import { getPersonCredits } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const personId = Number(id);

  if (isNaN(personId)) {
    return NextResponse.json({ error: "Invalid person id" }, { status: 400 });
  }

  try {
    const credits = await getPersonCredits(personId);
    return NextResponse.json(credits);
  } catch (err) {
    console.error("[tmdb/person/credits]", err);
    return NextResponse.json(
      { error: "Failed to fetch person credits" },
      { status: 500 },
    );
  }
}
