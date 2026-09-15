import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Toast = { id: number; message: string; tone: "error" | "success" };

const ToastContext = createContext<{ notify: (message: string, tone?: Toast["tone"]) => void } | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, tone: Toast["tone"] = "error") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`max-w-sm rounded-sm border-l-2 bg-white px-4 py-3 text-sm text-iron-950 shadow-lg ${
              t.tone === "error" ? "border-plate-red" : "border-plate-green"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}