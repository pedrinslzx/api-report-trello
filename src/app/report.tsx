import { ReportItem } from "@/lib/report";
import { kv } from "@vercel/kv";

import { generateReport } from "@/lib/markdown/default";
import { marked } from "marked";

export async function CompleteReport() {
  const [startData, cris, diego, pedro] = await Promise.all([
    kv.get<Record<string, ReportItem[]>>("data"),
    kv.get<ReportItem[]>("cris"),
    kv.get<ReportItem[]>("diego"),
    kv.get<ReportItem[]>("pedro"),
  ]);

  const data = startData ? startData : { cris: cris ?? [], diego: diego ?? [], pedro: pedro ?? [] }

  console.log(data, { cris: cris ?? [], diego: diego ?? [], pedro: pedro ?? [] })

  if (!data) {
    return  <div>ERROR</div>
  }

  const report = generateReport(data);

  // Use remark to convert markdown into HTML string
  const processedContent = await marked.parse(report, { async: true });
  const contentHtml = processedContent.toString();

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 print:my-0 shadow print:shadow-none bg-white"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
