import { useEffect, useState } from "react";
import Navbar from "../components/Layouts/Navbar";
import { useAuth } from "../contexts/useAuth";
import * as api from "../services/api";

export default function AdminLogsPage() {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await api.listAuditLogs(token);
        setLogs(data.logs || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (!user) return null;

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar user={user} onLogout={() => {}} />
        <div className="p-6 text-red-600">Acesso negado: apenas admins podem ver os logs.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900">
      <Navbar user={user} onLogout={() => {}} />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Logs de Auditoria</h1>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className="space-y-2">
            {logs.map((l) => (
              <div key={l.id} className="rounded-lg bg-white p-3 shadow">
                <div className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleString()}</div>
                <div className="font-semibold">{l.action} — {l.entityType} {l.entityId}</div>
                <div className="text-sm text-slate-700 mt-1">Usuário: {l.user?.name ?? l.userId}</div>
                <pre className="mt-2 text-xs text-slate-600 overflow-auto max-h-36">{JSON.stringify(l.changes, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
