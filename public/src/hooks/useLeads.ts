import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import * as api from "../services/api";
import type { ApiLead, AssignableUser } from "../services/api";

export type { ApiLead, AssignableUser };

export function useLeads({ paused = false }: { paused?: boolean } = {}) {
  const { token } = useAuth();
  const [leads, setLeads] = useState<ApiLead[]>([]);
  const [archivedLeads, setArchivedLeads] = useState<ApiLead[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArchived, setLoadingArchived] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.listLeads(token);
      setLeads(data.leads);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar leads.");
    }
  }, [token]);

  const fetchAssignable = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.listAssignable(token);
      setAssignableUsers(data.users);
    } catch {
      setAssignableUsers([]);
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLeads(), fetchAssignable()]).finally(() => setLoading(false));
  }, [fetchLeads, fetchAssignable]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, [fetchLeads, paused]);

  const moveLead = useCallback(
    async (leadId: string, newStatus: string) => {
      if (!token) return;
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      try {
        await api.updateLeadStatus(token, leadId, newStatus);
      } catch {
        fetchLeads();
      }
    },
    [token, fetchLeads],
  );

  const delegateLead = useCallback(
    async (leadId: string, attendantId: string): Promise<void> => {
      if (!token) return;
      const { lead } = await api.assignLead(token, leadId, attendantId);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? lead : l)));
    },
    [token],
  );

  const addLead = useCallback(
    async (input: Parameters<typeof api.createLead>[1]): Promise<void> => {
      if (!token) return;
      const { lead } = await api.createLead(token, input);
      setLeads((prev) => [lead, ...prev]);
    },
    [token],
  );

  const updateLead = useCallback(
    async (leadId: string, input: Parameters<typeof api.updateLead>[2]): Promise<void> => {
      if (!token) return;
      const { lead } = await api.updateLead(token, leadId, input);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? lead : l)));
    },
    [token],
  );

  const archiveLeads = useCallback(async (): Promise<string> => {
    if (!token) return "Sessão expirada.";
    const { message } = await api.archiveLeads(token);
    await fetchLeads();
    return message;
  }, [token, fetchLeads]);

  const fetchArchived = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoadingArchived(true);
    try {
      const data = await api.listArchivedLeads(token);
      setArchivedLeads(data.leads);
    } catch {
      setArchivedLeads([]);
    } finally {
      setLoadingArchived(false);
    }
  }, [token]);

  const unarchiveLead = useCallback(
    async (leadId: string): Promise<void> => {
      if (!token) return;
      await api.unarchiveLead(token, leadId);
      setArchivedLeads((prev) => prev.filter((l) => l.id !== leadId));
      await fetchLeads();
    },
    [token, fetchLeads],
  );

  return {
    leads,
    archivedLeads,
    assignableUsers,
    loading,
    loadingArchived,
    error,
    moveLead,
    delegateLead,
    addLead,
    updateLead,
    archiveLeads,
    fetchArchived,
    unarchiveLead,
    refresh: fetchLeads,
  };
}
