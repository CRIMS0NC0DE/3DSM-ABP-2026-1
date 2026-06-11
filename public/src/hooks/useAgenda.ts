import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import * as api from "../services/api";
import type { ApiAgendaEvent, CreateAgendaEventInput } from "../services/api";

export type { ApiAgendaEvent };

export function useAgenda() {
  const { token } = useAuth();
  const [events, setEvents] = useState<ApiAgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.listAgendaEvents(token, { pageSize: 200 });
      setEvents(data.events);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar eventos.");
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    fetchEvents().finally(() => setLoading(false));
  }, [fetchEvents]);

  const addEvent = useCallback(
    async (input: CreateAgendaEventInput): Promise<void> => {
      if (!token) return;
      const { event } = await api.createAgendaEvent(token, input);
      setEvents((prev) => [...prev, event]);
    },
    [token],
  );

  const updateStatus = useCallback(
    async (id: string, status: ApiAgendaEvent["status"]): Promise<void> => {
      if (!token) return;
      const { event } = await api.updateAgendaEventStatus(token, id, status);
      setEvents((prev) => prev.map((e) => (e.id === id ? event : e)));
    },
    [token],
  );

  const removeEvent = useCallback(
    async (id: string): Promise<void> => {
      if (!token) return;
      await api.deleteAgendaEvent(token, id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    },
    [token],
  );

  return { events, loading, error, addEvent, updateStatus, removeEvent, refresh: fetchEvents };
}
