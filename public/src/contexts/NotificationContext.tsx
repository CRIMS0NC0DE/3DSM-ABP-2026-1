import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

type Notification = { id: string; title?: string; message: string; level?: "info" | "success" | "error" };

type NotificationContextValue = {
  notifications: Notification[];
  notify: (notification: Omit<Notification, "id">) => void;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((n: Omit<Notification, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setNotifications((s) => [{ id, ...n }, ...s]);
    // auto-dismiss
    setTimeout(() => setNotifications((s) => s.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: string) => setNotifications((s) => s.filter((x) => x.id !== id)), []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
