export default function SidebarPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Preview</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Sidebar (sem login)</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Esta rota existe apenas para visualizar o layout do menu lateral. Se voc&ecirc; clicar em algum item do menu,
            pode acabar sendo redirecionado para <span className="font-medium text-slate-900">/login</span> caso a rota
            seja protegida.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Conte&uacute;do</p>
            <p className="mt-3 text-sm text-slate-700">
              Use este espa&ccedil;o para validar espa&ccedil;amentos, cores, estados ativos e o comportamento de colapso
              do sidebar.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Dica</p>
            <p className="mt-3 text-sm text-slate-700">
              Para sair do preview a qualquer momento, volte para{" "}
              <span className="font-medium text-slate-900">/login</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
