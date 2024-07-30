export interface TrelloItem {
  name: string;
  link: string;
  members: string[];
  labels: string[];
  due: false | Date;
  created: Date;
}

export function parseTrello(input: string) {
  const trelloItems: TrelloItem[] = [];

  const lines = input.trim().split("\n");
  for (const line of lines) {
    if (line.trim() === "" || line.includes("____________")) {
      continue; // Ignorar linhas vazias e separadores
    }

    const parts = line.match(
      /name="(.*?)";link="(.*?)";members="(.*?)";labels="(.*?)";due="(.*?)";created="(.*?)"/,
    );
    if (!parts) {
      throw new Error(`Formato inválido na linha: ${line}`);
    }

    const [, name, link, membersStr, labelsStr, dueStr, created] = parts;
    const members = membersStr.split(",").map((m) => m.trim());
    const labels = labelsStr.split(",").map((l) => l.trim().replace(/"/g, ""));

    const trelloItem: TrelloItem = {
      name: name.replace(";", ""), // remove ponto e vírgula
      link: link.replace(";", ""),
      members,
      labels,
      due: dueStr !== "false" ? new Date(dueStr) : false,
      created: new Date(created.replace(";", "")), // remove ponto e vírgula
    };

    trelloItems.push(trelloItem);
  }

  return trelloItems;
}
