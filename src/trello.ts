export interface TrelloItem {
  name: string;
  link: string;
  members: string[];
  labels: string[];
  due: false | Date;
  created: Date;
  category: string | "";
  amount: number | 'none';
}

export function parseTrello(input: string) {
  const trelloItems: TrelloItem[] = [];
  const lines = input.trim().split("\n");

  for (const line of lines) {
    if (line.trim() === "" || line.includes("____________")) {
      continue;
    }

    // Nova regex para incluir category e amount
    const parts = line.match(
      /name="(.*?)";link="(.*?)";members="(.*?)";labels="(.*?)";due="(.*?)";created="(.*?)";category="(.*?)";amount="(.*?)"/,
    );

    if (!parts) {
      const entries = line
        .split(";")
        .map(
          (s) =>
            s
              .trim()
              .split("=")
              .map((s) => s.trim()) as [keyof TrelloItem, string],
        )
        .reduce(
          (obj, [key, item]) => ({ ...obj, [key]: item.substring(1, item.length - 1) }),
          {} as Record<keyof TrelloItem, string>,
        );

      const members = entries.members.split(",").map((m) => m.trim().replace(/"/g, ""));
      const labels = entries.labels
        .split(",")
        .map((l) => l.trim().replace(/"/g, ""));

      const trelloItem: TrelloItem = {
        name: entries.name.replace(/\\"/g, '"'),
        link: entries.link.replace(/\\"/g, '"'),
        members,
        labels,
        due: entries.due !== "false" ? new Date(entries.due) : false,
        created: new Date(entries.created.replace(/\\"/g, '"')),
        category: entries.category ? entries.category.replace(/\\"/g, '"') : "",
        amount: entries.amount
          ? Number(entries.amount.replace(/\\"/g, '"'))
          : 0,
      };

      trelloItems.push(trelloItem);

      // throw new Error(`Formato inválido na linha: ${line}`);
    } else {
      const [
        ,
        name,
        link,
        membersStr,
        labelsStr,
        dueStr,
        created,
        category,
        amount,
      ] = parts;
      const members = membersStr.split(",").map((m) => m.trim());
      const labels = labelsStr
        .split(",")
        .map((l) => l.trim().replace(/"/g, ""));

      const trelloItem: TrelloItem = {
        name: name.replace(/\\"/g, '"'),
        link: link.replace(/\\"/g, '"'),
        members,
        labels,
        due: dueStr !== "false" ? new Date(dueStr) : false,
        created: new Date(created.replace(/\\"/g, '"')),
        category: category ? category.replace(/\\"/g, '"') : "",
        amount: amount ? Number(amount.replace(/\\"/g, '"')) : 'none',
      };

      trelloItems.push(trelloItem);
    }
  }

  return trelloItems;
}
