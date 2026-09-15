import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full border-collapse">{children}</table>;
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="text-left py-2 border-b text-sm text-slate-600">{children}</th>;
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="py-2 border-b text-sm">{children}</td>;
}