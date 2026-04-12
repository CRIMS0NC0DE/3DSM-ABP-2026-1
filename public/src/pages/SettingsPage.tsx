import { type ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface SettingsState {
  avatarUrl: string;
  name: string;
  email: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  notificationsEnabled: boolean;
  autoLogoutEnabled: boolean;
}

const SETTINGS_STORAGE_KEY = "crm-settings-state";

export default function SettingsPage() {
  const { user } = useAuth();

  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings) as SettingsState;
      return {
        ...parsed,
      };
    }

    return {
      avatarUrl: "",
      name: user?.nome ?? "",
      email: user?.email ?? "",
      bio: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      notificationsEnabled: true,
      autoLogoutEnabled: false,
    };
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field: keyof SettingsState, value: string | boolean) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setSuccessMessage(null);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSettings((current) => ({ ...current, avatarUrl: reader.result as string }));
        setAvatarFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      setSuccessMessage("As senhas não conferem. Corrija antes de salvar.");
      return;
    }

    // TODO: Quando houver API, envie aqui os dados para o endpoint de perfil:
    // fetch("/api/user/settings", { method: "PUT", body: JSON.stringify(settings) })
    //   .then(response => response.json())
    //   .then(...)
    setSuccessMessage("Configurações salvas localmente. Integre com API depois para persistir no servidor.");
    setSettings((current) => ({
      ...current,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleResetPreferences = () => {
    setSettings((current) => ({
      ...current,
      notificationsEnabled: true,
      autoLogoutEnabled: false,
    }));
    setSuccessMessage("Preferências restauradas para padrão.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Configurações</p>
              <h1 className="text-3xl font-bold text-slate-900">Gerenciar perfil</h1>
              <p className="mt-2 text-sm text-slate-500">
                Atualize seu avatar, nome, e-mail, senha e preferências de conta.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/5 px-4 py-3 text-sm text-slate-700">
              Todas as alterações são salvas localmente neste front-end.
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100">
                {settings.avatarUrl ? (
                  <img
                    src={settings.avatarUrl}
                    alt="Avatar do usuário"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl text-slate-400">
                    {settings.name ? settings.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-900">{settings.name || "Usuário"}</p>
                <p className="text-sm text-slate-500">{settings.email || "Seu e-mail"}</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                <span>Alterar avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              {avatarFileName ? (
                <p className="text-xs text-slate-500">Arquivo selecionado: {avatarFileName}</p>
              ) : null}
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-900">Dados do perfil</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Nome completo</span>
                  <input
                    value={settings.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Digite seu nome"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">E-mail</span>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="seu@email.com"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Biografia</span>
                  <textarea
                    value={settings.bio}
                    onChange={(event) => handleChange("bio", event.target.value)}
                    rows={4}
                    className="mt-2 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Conte um pouco sobre você ou sua empresa"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-900">Segurança</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600">Senha atual</span>
                  <input
                    type="password"
                    value={settings.currentPassword}
                    onChange={(event) => handleChange("currentPassword", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Digite sua senha atual"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Nova senha</span>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(event) => handleChange("newPassword", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Senha com ao menos 8 caracteres"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-600">Confirmar senha</span>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(event) => handleChange("confirmPassword", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Repita a nova senha"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-900">Preferências</h2>
              <div className="mt-6 space-y-4">
                <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">Notificações</p>
                    <p className="text-sm text-slate-500">Receba alertas novos de leads e atualizações.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={(event) => handleChange("notificationsEnabled", event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600"
                  />
                </label>


                <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">Logout automático</p>
                    <p className="text-sm text-slate-500">Saia automaticamente após inatividade.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoLogoutEnabled}
                    onChange={(event) => handleChange("autoLogoutEnabled", event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-900">Ações rápidas</h2>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Salvar configurações
                </button>
                <button
                  type="button"
                  onClick={handleResetPreferences}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Restaurar preferências
                </button>
              </div>
              {successMessage ? (
                <p className="mt-4 rounded-3xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </p>
              ) : null}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

