import { Link } from "react-router-dom";
import AuthCard from "../components/Auth/AuthCard";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

export default function ForgotPassword() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-200">
      <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-slate-400/20 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20 lg:block">
            <h1 className="text-4xl font-semibold">Recupere sua senha</h1>
            <p className="mt-4 max-w-sm text-slate-300">
              Informe seu e-mail e CPF para receber instruções de redefinição de senha rapidamente.
            </p>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl bg-sky-500/10 p-4">
                <p className="text-sm leading-6 text-slate-200">Processo rápido com foco em segurança e usabilidade.</p>
              </div>
              <div className="rounded-3xl bg-red-500/10 p-4">
                <p className="text-sm leading-6 text-slate-200">Suporte contínuo para manter seu acesso sem perda de tempo.</p>
              </div>
            </div>
          </div>

          <AuthCard title="Esqueci a minha senha">
            <div className="space-y-6">
              <Input label="E-mail" type="email" placeholder="Digite seu e-mail" />
              <Input label="CPF" placeholder="Digite seu CPF" />

              <Button type="submit" className="w-full bg-[#b81414] text-white hover:bg-[#9f1313]">
                Recuperar senha
              </Button>

              <p className="text-center text-sm text-slate-600">
                Lembrou a senha?{' '}
                <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
                  Entrar
                </Link>
              </p>
            </div>
          </AuthCard>
        </div>
      </main>
    </div>
  );
}
