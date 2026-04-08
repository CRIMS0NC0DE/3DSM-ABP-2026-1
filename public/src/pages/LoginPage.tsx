import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { getApiErrorMessage, useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(email, senha);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),_transparent_28%)]" />
      <div className="absolute inset-y-0 left-[-12rem] w-80 rotate-12 bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-y-0 right-[-12rem] w-80 -rotate-12 bg-orange-400/10 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/40 backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between border-r border-white/10 bg-slate-900/70 p-10 md:flex">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
                CRM 1000 Valle
              </span>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">
                Login com JWT e controle de acesso para o painel comercial.
              </h1>
              <p className="max-w-lg text-sm text-slate-300">
                Entre com seu e-mail e senha para acessar o dashboard. A sessao sera mantida com token
                JWT validado pelo backend.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-200">Autenticacao com hash `bcrypt` e token `JWT`.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-200">Protecao de rotas e renovacao visual da sessao no front.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-3">
                <span className="text-sm uppercase tracking-[0.3em] text-cyan-300">Acesso restrito</span>
                <div>
                  <h2 className="text-3xl font-semibold text-white">Entrar</h2>
                  <p className="mt-2 text-sm text-slate-300">Use as credenciais cadastradas no PostgreSQL.</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {errorMessage}
                  </div>
                ) : null}

                <Button type="submit" isLoading={isSubmitting} className="w-full">
                  Entrar no dashboard
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

