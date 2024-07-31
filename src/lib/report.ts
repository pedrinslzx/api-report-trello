import CATEGORY_POINTS, {
  CATEGORIES_WITH_DEFAULT_AMOUNT,
  CATEGORY_NAMES
} from "./ranking";
import { TrelloItem, TrelloItemCard } from "./trello";

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
  const data = cards.map((card) => {
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
      points: CATEGORY_POINTS[findResultCategory as CATEGORY_NAMES]?.point * amount,
    };
  });

  return data.reverse() as ReportItem[];
}
