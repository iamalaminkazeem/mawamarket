import { prisma } from "@/lib/db/prisma";

export async function nextOrderNumber(): Promise<string> {
  const counter = await prisma.orderCounter.upsert({
    where: { id: "main" },
    update: { lastSeq: { increment: 1 } },
    create: { id: "main", lastSeq: 1 },
  });
  return `MM-${String(counter.lastSeq).padStart(6, "0")}`;
}
