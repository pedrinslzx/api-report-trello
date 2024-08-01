import { ReportItem } from "@/lib/report";
import { kv } from "@vercel/kv";

import { generateReport } from "@/lib/markdown/default";
import { marked } from 'marked';
import { notFound } from "next/navigation";

export default async function Home() {
  const data = await kv.get<Record<string, ReportItem[]>>('data')

  if(!data) {
    notFound()
  }

  const report = generateReport(data)

  // Use remark to convert markdown into HTML string
  const processedContent = await marked.parse(report, {async: true});
  const contentHtml = processedContent.toString();
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 print:my-0 shadow print:shadow-none bg-white" dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
