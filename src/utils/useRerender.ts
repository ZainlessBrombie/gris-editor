import { useReducer } from "react";

export function useRerender(): () => void {
  return useReducer((prev) => prev + 1, 0)[1];
}
