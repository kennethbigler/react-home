import type { ReactElement } from "react";
import { Chip } from "@mui/material";

export const getCSV = (arr: string[] = []): ReactElement[] => {
  const style = { marginRight: 5, marginBottom: 5 };
  return arr.map((item) => <Chip key={item} label={item} style={style} />);
};

const SUB_BULLET_PREFIX = "* ";

/** Split expr entries into groups; empty strings start a new list. */
export const groupExpr = (expr: string[]): string[][] =>
  expr
    .reduce<string[][]>(
      (groups, desc) => {
        if (desc === "") {
          groups.push([]);
        } else {
          groups[groups.length - 1].push(desc);
        }
        return groups;
      },
      [[]],
    )
    .filter((group) => group.length > 0);

export interface ExprItem {
  text: string;
  children: string[];
}

/** Parse a group into top-level items with optional nested sub-bullets. */
export const parseExprGroup = (group: string[]): ExprItem[] =>
  group.reduce<ExprItem[]>((items, desc) => {
    if (desc.startsWith(SUB_BULLET_PREFIX)) {
      const text = desc.slice(SUB_BULLET_PREFIX.length);
      const parent = items[items.length - 1];
      if (parent) {
        parent.children.push(text);
      } else {
        items.push({ text, children: [] });
      }
    } else {
      items.push({ text: desc, children: [] });
    }
    return items;
  }, []);
