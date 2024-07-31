import { ReportItem } from "../report";
import { toTitleCase } from "../utils";

export function generateReportMax(data: Record<string, ReportItem[]>): string {
  let report = "";

  const contratos = {} as Record<string, Record<string, number>>;

  for (const person in data) {
    report += `## ${toTitleCase(person)}\n\n`;

    let tableReport = "| Nome | Categoria | Pontos |\n";
    tableReport += "|---|---|---|\n";

    // let totalPoints = 0;
    const categoryCounts: { [category: string]: number } = {};

    for (const item of data[person]) {
      if (item.category === "Separador") {
        tableReport += `| <b>${item.card.name}</b> | - | - |\n`;
        continue;
      }
      const { card, points } = item;
      tableReport += `| ${card.name} | ${card.category} | ${points} |\n`;
      // totalPoints += points;
      categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;

      const contratoNumber = card.name.split("-")[0].trim();

      if (contratoNumber) {
        contratos[person] = contratos[person] ?? {};
        contratos[person][String(contratoNumber)] =
          (contratos[person][String(contratoNumber)] || 0) + 1;
      }
    }

    tableReport += "\n";

    report += tableReport;
  }

  return report;
}
