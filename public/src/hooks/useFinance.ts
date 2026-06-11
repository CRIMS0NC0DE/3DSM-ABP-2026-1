import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import * as api from "../services/api";
import type { ApiFinanceEntry, CreateFinanceEntryInput } from "../services/api";

export type { ApiFinanceEntry };

export function useFinance(params?: { type?: "income" | "expense"; status?: string }) {
  const { token } = useAuth();
  const [entries, setEntries] = useState<ApiFinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.listFinanceEntries(token, { ...params, pageSize: 200 });
      setEntries(data.entries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar lançamentos.");
    }
  }, [token, params?.type, params?.status]);

  useEffect(() => {
    setLoading(true);
    fetchEntries().finally(() => setLoading(false));
  }, [fetchEntries]);

  const addEntry = useCallback(
    async (input: CreateFinanceEntryInput): Promise<void> => {
      if (!token) return;
      const { entry } = await api.createFinanceEntry(token, input);
      setEntries((prev) => [entry, ...prev]);
    },
    [token],
  );

  const removeEntry = useCallback(
    async (id: string): Promise<void> => {
      if (!token) return;
      await api.deleteFinanceEntry(token, id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [token],
  );

  return { entries, loading, error, addEntry, removeEntry, refresh: fetchEntries };
}
