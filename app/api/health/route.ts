import { NextResponse } from "next/server";
import type { HealthResponse } from "@/lib/schemas/health";

export function GET() {
  const body: HealthResponse = {
    ok: true,
    service: "agentic-next-pwa-template",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body);
}
