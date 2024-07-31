export interface TrelloItemCard {
  name: string;
  link: string;
  members: string[];
  labels: string[];
  due: false | Date;
  created: Date;
  category: string | "";
  amount: number | "none";
}

export interface TrelloItemSeparator {
  name: string;
  category: "Separador";
}

export type TrelloItem = TrelloItemCard | TrelloItemSeparator;

export function parseTrello(input: string) {
  const trelloItems: TrelloItem[] = [];
  const lines = input.trim().split("\n");

  for (const line of lines) {
    let trelloItem = null as unknown as (typeof trelloItems)[number];

    if (line.trim() === "") {
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
              .map((s) => s.trim()) as [keyof TrelloItemCard, string],
        )
        .reduce(
          (obj, [key, item]) => ({
            ...obj,
            [key]: item.substring(1, item.length - 1),
          }),
          {} as Record<keyof TrelloItemCard, string>,
        );

      const members = entries.members
        .split(",")
        .map((m) => m.trim().replace(/"/g, ""));
      const labels = entries.labels
        .split(",")
        .map((l) => l.trim().replace(/"/g, ""));

      trelloItem = {
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

      trelloItem = {
        name: name.replace(/\\"/g, '"'),
        link: link.replace(/\\"/g, '"'),
        members,
        labels,
        due: dueStr !== "false" ? new Date(dueStr) : false,
        created: new Date(created.replace(/\\"/g, '"')),
        category: category ? category.replace(/\\"/g, '"') : "",
        amount: amount ? Number(amount.replace(/\\"/g, '"')) : "none",
      };
    }

    if (
      trelloItem.labels.find((a) => a.toLowerCase().includes("separador")) ||
      trelloItem.name.includes("__")
    ) {
      trelloItems.push({
        name: trelloItem.name.replace(/_/g, ""),
        category: "Separador",
      });
    } else {
      trelloItems.push(trelloItem);
    }
  }

  return trelloItems;
}
