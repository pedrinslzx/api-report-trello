import CATEGORY_POINTS, { CATEGORIES_WITH_DEFAULT_AMOUNT, CATEGORY_NAMES } from "./ranking";
import { TrelloItem } from "./trello";
import { generateContractRanking, toTitleCase } from "./utils";

export interface ReportItem {
  card: TrelloItem
  category: CATEGORY_NAMES
  points: number
}

export function calculeReport(cards: TrelloItem[]): ReportItem[] {
  return cards.map(card => {
    const findedCategory = CATEGORY_NAMES.find((c) => c === card.category)

    if (!findedCategory) return {
      card,
      category: 'Sem categoria',
      points: 0
    }

    const amount = CATEGORIES_WITH_DEFAULT_AMOUNT.includes(findedCategory as CATEGORY_NAMES) ? 1 : card.amount !== 'none' ? card.amount : 0

    return {
      card,
      category: findedCategory as CATEGORY_NAMES,
      points: CATEGORY_POINTS[findedCategory]?.point * amount
    }
  })
}

export function generateReport(data: Record<string, ReportItem[]>): string {
  let report = "";

  const contratos = {} as Record<string, Record<string, number>>

  for (const person in data) {
    report += `## ${toTitleCase(person)}\n\n`;
    let tableReport = '<div class="overview">\n\n';
    tableReport += "| Nome | Categoria | Pontos |\n";
    tableReport += "|---|---|---|\n";

    let totalPoints = 0;
    const categoryCounts: { [category: string]: number } = {};

    for (const item of data[person]) {
      const { card, points } = item;
      tableReport += `| ${card.name} | ${card.category} | ${points} |\n`;
      totalPoints += points;
      categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;


      const contratoNumber = card.name.split('-')[0].trim()

      if (contratoNumber) {
        contratos[person] = contratos[person] ?? {}
        contratos[person][String(contratoNumber)] = (contratos[person][String(contratoNumber)] || 0) + 1
      }
    }

    const averagePoints = totalPoints / data[person].length;
    const mostFrequentCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

    tableReport += "\n\n</div>\n\n";
    report += `- **Total de pontos:** ${totalPoints}\n`;
    report += `- **Média de pontos:** ${averagePoints.toFixed(2)}\n`;
    report += `- **Categoria mais frequente:** ${mostFrequentCategory}\n\n`;

    report += tableReport;
  }

  // Visão geral (adicione mais estatísticas conforme necessário)
  report += "## Visão Geral\n\n";
  // ... (cálculo de estatísticas gerais)


  const sortedContracts = generateContractRanking(contratos)

  // 3. Gerar o relatório Markdown
  report += "### Número de Cards/Demandas por contrato\n\n";
  report += "| Contrato | Quantidade |\n";
  report += "|---|---|\n";

  sortedContracts.map(([contract, count]) => {
    report += `| ${contract} | ${count} |\n`;
  })

  report += "\n\n";

  report += "## Legenda\n\n";
  report += "| Categoria | Pontos |  |\n";
  report += "|---|---|---|\n";

  Object.entries(CATEGORY_POINTS).filter(([, { point }]) => point !== 0).map(([category, data]) => {
    report += `|${category}|${data.point}|${data.obs}|\n`
  })

  return report;
}

export function generateCleanReport(data: Record<string, ReportItem[]>): string {
  let report = "";

  const contratos = {} as Record<string, Record<string, number>>

  for (const person in data) {
    report += `## ${toTitleCase(person)}\n\n`;

    let tableReport = "| Nome | Categoria | Pontos |\n";
    tableReport += "|---|---|---|\n";

    let totalPoints = 0;
    const categoryCounts: { [category: string]: number } = {};

    for (const item of data[person]) {
      const { card, points } = item;
      tableReport += `| ${card.name} | ${card.category} | ${points} |\n`;
      totalPoints += points;
      categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;


      const contratoNumber = card.name.split('-')[0].trim()

      if (contratoNumber) {
        contratos[person] = contratos[person] ?? {}
        contratos[person][String(contratoNumber)] = (contratos[person][String(contratoNumber)] || 0) + 1
      }
    }

    tableReport += "\n";

    report += tableReport;
  }

  return report;
}



export function generateReportMax(data: Record<string, ReportItem[]>): string {
  let report = "";

  const contratos = {} as Record<string, Record<string, number>>

  for (const person in data) {
    report += `## ${toTitleCase(person)}\n\n`;

    let tableReport = "| Nome | Categoria | Pontos |\n";
    tableReport += "|---|---|---|\n";

    let totalPoints = 0;
    const categoryCounts: { [category: string]: number } = {};

    for (const item of data[person]) {
      const { card, points } = item;
      tableReport += `| ${card.name} | ${card.category} | ${points} |\n`;
      totalPoints += points;
      categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;


      const contratoNumber = card.name.split('-')[0].trim()

      if (contratoNumber) {
        contratos[person] = contratos[person] ?? {}
        contratos[person][String(contratoNumber)] = (contratos[person][String(contratoNumber)] || 0) + 1
      }
    }

    tableReport += "\n";

    report += tableReport;
  }

  return report;
}