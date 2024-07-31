import CATEGORY_POINTS, {
  CATEGORIES_WITH_DEFAULT_AMOUNT,
  CATEGORY_NAMES,
} from "./ranking";
import { TrelloItem, TrelloItemCard } from "./trello";
import {
  aggregateContractCategories,
  sortCardsPerContracts,
  toTitleCase,
} from "./utils";

export type ReportItem = ReportItemCard | ReportItemSeparador;

export interface ReportItemCard {
  card: TrelloItem;
  category: CATEGORY_NAMES;
  points: number;
}

export interface ReportItemSeparador {
  card: TrelloItem;
  category: "Separador";
}

export function calculeReport(cards: TrelloItem[]): ReportItem[] {
  return cards.map((card) => {
    const findResultCategory = CATEGORY_NAMES.find((c) => c === card.category);

    if (!findResultCategory)
      return {
        card,
        category: "Sem categoria",
        points: 0,
      };

    if (findResultCategory === "Separador") {
      return {
        card,
        category: "Separador",
      };
    }

    const amount = CATEGORIES_WITH_DEFAULT_AMOUNT.includes(
      findResultCategory as CATEGORY_NAMES,
    )
      ? 1
      : (card as TrelloItemCard).amount !== "none"
        ? ((card as TrelloItemCard).amount as number)
        : 0;

    return {
      card,
      category: findResultCategory as CATEGORY_NAMES,
      points: CATEGORY_POINTS[findResultCategory]?.point * amount,
    };
  });
}

export function generateReport(data: Record<string, ReportItem[]>): string {
  let report = "";

  const contratos = {} as Record<string, Record<string, string[]>>;

  for (const person in data) {
    report += `## ${toTitleCase(person)}\n\n`;
    let tableReport = '<div class="person-overview">\n\n';
    tableReport += "| Nome | Categoria | Pontos |\n";
    tableReport += "|---|---|---|\n";

    let totalPoints = 0;
    const categoryCounts: { [category: string]: number } = {};

    for (const item of data[person]) {
      if (item.category === "Separador") {
        tableReport += `| <b>${item.card.name}</b> | - | - |\n`;
        continue;
      }

      const { card, points } = item;
      tableReport += `| ${card.name} | ${card.category} | ${points} |\n`;
      totalPoints += points;
      categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;

      const contratoNumber = card.name.split("-")[0].trim();

      if (contratoNumber) {
        contratos[person] = contratos[person] ?? {};
        contratos[person][String(contratoNumber)] = [
          ...(contratos[person][String(contratoNumber)] || []),
          card.category,
        ];
      }
    }

    const mostFrequentCategory = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b,
    );

    tableReport += "\n\n</div>\n\n";
    report += `- **Total de cards/demandas:** ${data[person].filter((a) => a.category !== "Separador").length}\n`;
    report += `- **Total de pontos:** ${totalPoints}\n`;
    report += `- **Categoria mais frequente:** ${mostFrequentCategory}\n\n`;

    report += tableReport;
  }

  // Visão geral (adicione mais estatísticas conforme necessário)
  report += "## Visão Geral\n\n";
  // ... (cálculo de estatísticas gerais)

  const sortedCardsPerContracts = sortCardsPerContracts(contratos);

  // 3. Gerar o relatório Markdown
  report += "### Número de Cards/Demandas por contrato\n\n";
  report += '\n\n<div class="report-overview cards-per-contract">\n\n';
  report += "| Contrato | Quantidade |\n";
  report += "|---|---|\n";

  sortedCardsPerContracts.map(([contract, count]) => {
    report += `| ${contract} | ${count} |\n`;
  });

  report += "\n\n</div>\n\n";

  const sortedCategoriesPerContracts = aggregateContractCategories(contratos);

  // 3. Gerar o relatório Markdown
  report += "### Número de Categorias por contrato\n\n";
  report += '\n\n<div class="report-overview categories-per-contract">\n\n';

  Object.entries(sortedCategoriesPerContracts).map(([contract, categories]) => {
    report += "#### " + contract + "\n\n";
    report += "| Categoria | Quantidade |\n";
    report += "|---|---|\n";

    Object.entries(categories).map(([categories, count]) => {
      report += `| ${categories} | ${count} |\n`;
    });
    report += "\n\n";
  });

  report += "\n\n</div>\n\n";

  report += "\n\n";

  report += "## Legenda\n\n";
  report += '\n\n<div class="legenda">\n\n';
  report += "| Categoria | Pontos |  |\n";
  report += "|---|---|---|\n";

  Object.entries(CATEGORY_POINTS)
    .filter(([, { point }]) => point !== 0 || point < 0)
    .map(([category, data]) => {
      report += `|${category}|${data.point}|${data.obs}|\n`;
    });

  report += "\n\n</div>\n\n";

  return report;
}

export function generateCleanReport(
  data: Record<string, ReportItem[]>,
): string {
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
