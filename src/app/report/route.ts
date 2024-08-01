import { calculeReport, ReportItem } from "@/lib/report";
import { parseTrello, TrelloItem } from "@/lib/trello";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const dataToSave = await req.json();

    const trelloItems = Object.entries(dataToSave as Record<string, string>)
      .map(([key, value]) => [key, parseTrello(value)] as const)
      .reduce(
        (l, n) => ({ ...l, [n[0]]: n[1] }),
        {} as Record<string, TrelloItem[]>,
      );

    const reportItems = Object.entries(trelloItems)
      .map(([key, value]) => [key, calculeReport(value)] as const)
      .reduce(
        (l, n) => ({ ...l, [n[0]]: n[1] }),
        {} as Record<string, ReportItem[]>,
      );

    await kv.set('data', reportItems)
    await kv.set('person', Object.keys(reportItems))
    await Promise.all(Object.keys(reportItems).map(person => kv.set(person, reportItems[person])))

    return NextResponse.json({ message: 'Dados salvos' })
  } catch (e) {
    return NextResponse.json({ error: e })
  }
}
