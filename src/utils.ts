export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}

export function sortCardsPerContracts(
  contracts: Record<string, Record<string, string[]>>,
): [string, number][] {
  // 1. Agregar o número de cards por contrato
  const contractCounts: Record<string, number> = {};
  for (const person in contracts) {
    for (const contract in contracts[person]) {
      contractCounts[contract] =
        (contractCounts[contract] || 0) + contracts[person][contract].length;
    }
  }

  // 2. Converter para um array e ordenar
  const sortedContracts = Object.entries(contractCounts).sort(
    (a, b) => b[1] - a[1],
  ); // Ordenar decrescentemente

  return sortedContracts;
}

export function aggregateContractCategories(
  contracts: Record<string, Record<string, string[]>>,
): Record<string, { [category: number]: number }> {
  const categoryCounts: Record<string, Record<string, number>> = {};
  console.log(contracts);

  for (const person in contracts) {
    for (const contract in contracts[person]) {
      categoryCounts[contract] = categoryCounts[contract] || {};

      for (const categoryIndex in contracts[person][contract]) {
        const category = contracts[person][contract][categoryIndex];

        categoryCounts[contract][category] =
          (categoryCounts[contract][category] || 0) + 1;
      }

      categoryCounts[contract] = Object.entries(categoryCounts[contract])
        .sort((a, b) => b[1] - a[1])
        .reduce(
          (l, o) => ({ ...l, [o[0]]: o[1] }),
          {} as Record<string, number>,
        );
    }
  }

  console.log(categoryCounts);

  return categoryCounts;
}
