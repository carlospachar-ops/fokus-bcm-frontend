import type React from "react";

export type Col = {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
};

export type TableProps = {
  cols: Col[];
  rows: Record<string, any>[];
  emptyText?: string;
};
