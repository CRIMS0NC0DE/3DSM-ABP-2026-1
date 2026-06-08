import { useNotifications } from "../../contexts/NotificationContext";

export default function NotificationToast() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {notifications.map((n) => (
        <div key={n.id} className="max-w-sm rounded-xl bg-white p-4 shadow-lg border">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {n.title && <div className="font-semibold text-slate-900">{n.title}</div>}
              <div className="text-sm text-slate-700 mt-1">{n.message}</div>
            </div>
            <button onClick={() => dismiss(n.id)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
