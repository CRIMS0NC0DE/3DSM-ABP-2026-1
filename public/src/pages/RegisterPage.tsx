import { Link } from "react-router-dom";
import AuthCard from "../components/Auth/AuthCard";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-200">
      <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-slate-400/20 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20 lg:block">
            <h1 className="text-4xl font-semibold">Faça parte do nosso time</h1>
            <p className="mt-4 max-w-sm text-slate-300">
              Cadastre sua conta para acessar o painel e gerenciar seus leads com segurança e estilo.
            </p>
            <div className="mt-10 space-y-4">
              <div className="rounded-3xl bg-sky-500/10 p-4">
                <p className="text-sm leading-6 text-slate-200">Design moderno, cores coordenadas e fluxo simples.</p>
              </div>
              <div className="rounded-3xl bg-red-500/10 p-4">
                <p className="text-sm leading-6 text-slate-200">Acesso rápido, proteção de sessão e autenticação segura.</p>
              </div>
            </div>
          </div>

          <AuthCard title="Cadastre-se">
            <div className="space-y-6">
              <Input label="E-mail" type="email" placeholder="Digite seu e-mail" />
              <Input label="CPF" placeholder="Digite seu CPF" />
              <Input label="Senha" type="password" placeholder="Digite sua senha" />

              <Button type="submit" className="w-full bg-[#b81414] text-white hover:bg-[#9f1313]">
                Criar conta
              </Button>

              <p className="text-center text-sm text-slate-600">
                Já tem conta?{' '}
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
