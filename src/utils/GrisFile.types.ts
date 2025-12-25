export type GrisFileEntry =
  | { type: "double"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "string"; value: string }
  | { type: "object"; value: Map<string, GrisFileEntry> }
  | { type: "array"; value: GrisFileEntry[] };
