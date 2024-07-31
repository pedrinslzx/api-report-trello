import {
  CATEGORIES_MUST_BE_AGGREGATED,
  CATEGORY_NAMES
} from "../ranking";
import { ReportItem } from "../report";
import {
  aggregateCategories,
  aggregateContractCategories,
  aggregateOneCategory,
  sortCardsPerContracts,
  toTitleCase,
} from "../utils";


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

  const sortedCategories = aggregateCategories(contratos);

  console.log(sortedCategories);

  const persons = Object.values(sortedCategories)
    .map((obj) => Object.keys(obj))
    .reduce(
      (l, c) => [...l, ...c.filter((b) => !l.includes(b))],
      [] as string[],
    );

  // 3. Gerar o relatório Markdown
  report += "### Por Categoria\n\n";
  report += '\n\n<div class="report-overview per-category">\n\n';

  report += `| Categoria | Todos | ${persons.map((a) => toTitleCase(a)).join(" | ")} |\n`;
  report += `|---|---|${persons.map(() => "---").join("|")}|\n`;

  Object.entries(sortedCategories)
    .filter((a) => !CATEGORIES_MUST_BE_AGGREGATED.includes(a[0] as never))
    .map(([category, data]) => {
      report += `| **${category}** | **${Object.values(data).reduce((l, c) => l + c, 0)}** | `;

      persons.map((person) => {
        report += `${data[person as unknown as number] ?? 0} |`;
      });
      report += "\n";
    });

  if (Object.keys(sortedCategories).includes("Banco de Imagens")) {
    const bancoDeImagens = aggregateOneCategory(data, "Banco de Imagens");
    report += `| **Fotos tratadas** | **${Object.values(bancoDeImagens).reduce((l, c) => l + c, 0)}** | `;

    persons.map((person) => {
      report += `${bancoDeImagens[person] ?? 0} |`;
    });
  }

  for (const category in CATEGORIES_MUST_BE_AGGREGATED) {
    if (Object.keys(sortedCategories).includes(category)) {
      const bancoDeImagens = aggregateOneCategory(
        data,
        category as CATEGORY_NAMES,
      );
      report += `| **Fotos tratadas** | **${Object.values(bancoDeImagens).reduce((l, c) => l + c, 0)}** | `;

      persons.map((person) => {
        report += `${bancoDeImagens[person] ?? 0} |`;
      });
    }
  }

  report += "\n\n</div>\n\n";

  report += "\n\n";

  // report += "## Legenda\n\n";
  // report += '\n\n<div class="legenda">\n\n';
  // report += "| Categoria | Pontos |  |\n";
  // report += "|---|---|---|\n";

  // Object.entries(CATEGORY_POINTS)
  //   .filter(([, { point }]) => (point !== 0 && point > 0) || point === -2)
  //   .map(([category, data]) => {
  //     if (data.point === -2) {
  //       report += `| &nbsp; | &nbsp; | &nbsp; |\n`;
  //       report += `| **${category.substring(1)}** | &nbsp; | &nbsp; |\n`;
  //     } else {
  //       report += `|${category}|${data.point}|${data.obs ?? "&nbsp;"}|\n`;
  //     }
  //   });

  // report += "\n\n</div>\n\n";

  return report;
}

