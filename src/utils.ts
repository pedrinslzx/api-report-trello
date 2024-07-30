export function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}

export function generateContractRanking(contracts: Record<string, Record<string, number>>): [string, number][] {
    // 1. Agregar o número de cards por contrato
    const contractCounts: Record<string, number> = {};
    for (const person in contracts) {
      for (const contract in contracts[person]) {
        contractCounts[contract] = (contractCounts[contract] || 0) + contracts[person][contract];
      }
    }
  
    // 2. Converter para um array e ordenar
    const sortedContracts = Object.entries(contractCounts)
      .sort((a, b) => b[1] - a[1]); // Ordenar decrescentemente
  
    return sortedContracts;
  }