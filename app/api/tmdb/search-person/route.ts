import { NextResponse } from "next/server";
import { searchPeople } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const people = await searchPeople(query);
    return NextResponse.json(people);
  } catch (err) {
    console.error("[tmdb/search-person]", err);
    return NextResponse.json(
      { error: "Failed to search people" },
      { status: 500 },
    );
  }
}
