import { NextResponse } from "next/server";

import { getSchoolDetail } from "@/lib/affordable-schools/engine";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;
  const detail = await getSchoolDetail(slug);

  if (!detail) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

