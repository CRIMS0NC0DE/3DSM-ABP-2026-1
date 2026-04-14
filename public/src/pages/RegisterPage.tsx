import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthCard from "../components/Auth/AuthCard";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { getApiErrorMessage, useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    const senhaLimpa = senha.trim();

    if (senhaLimpa.length < 6) {
      setErrorMessage("A senha deve ter no minimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(nome, email, senhaLimpa);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-200">
      <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-slate-400/20 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">

        <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden relative rounded-[2rem] overflow-hidden bg-slate-950 text-white shadow-2xl shadow-slate-900/20 lg:flex lg:flex-col lg: min-h-[500px]">
            <img
              src="/register-foto.png"
              alt=""
              className="absolute inset-x-50 bottom-20 mx-auto w-15/10 object-contain"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="relative z-10 p-10">
              <h1 className="text-4xl font-semibold">Faça parte do nosso time</h1>
              <p className="mt-4 max-w-sm text-slate-300 text-top">
                Cadastre sua conta para acessar o painel e gerenciar seus leads com segurança e estilo.
              </p>
              <div className="mt-10 space-y-4">
              </div>
            </div>
          </div>

          <AuthCard title="Cadastre-se">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Nome"
                type="text"
                placeholder="Coloque seu nome completo"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                autoComplete="name"
                required
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
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
                autoComplete="new-password"
                required
              />

              {errorMessage ? (
                <div className="rounded-2xl border border-[#b81414]/50 bg-[#b81414]/15 px-4 py-3 text-sm text-[#690b0b] shadow-sm shadow-[#b81414]/20">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full bg-[#b81414] text-white hover:bg-[#9f1313]"
              >
                Criar conta
              </Button>

              <p className="text-center text-sm text-slate-600">
                Já tem conta?{" "}
                <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
                  Entrar
                </Link>
              </p>
            </form>
          </AuthCard>
        </div>
      </main>
    </div >
  );
}
