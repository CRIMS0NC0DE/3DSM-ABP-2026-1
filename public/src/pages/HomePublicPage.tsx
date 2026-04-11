import NavBarHome from "../components/Layouts/NavBarHome";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: "url('/viper-blue.png')",
          backgroundPosition: "center top",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-slate-950/70 to-slate-950/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/20 via-transparent to-slate-950/90" />

      <div className="relative z-10">
        <NavBarHome />

        <div className="mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-8 py-16 lg:px-16">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex rounded-full bg-slate-800/80 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200 shadow-lg shadow-slate-950/40">
              1000 Valle Multimarcas
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Venda e compre carros com autoridade no maior varejo local do Vale.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Acesse nosso painel de gestão e aproveite as melhores condições em seminovos e zero km, com notícias de mercado e pontos de venda na região.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl bg-slate-900/80 p-6 text-slate-100 shadow-xl shadow-slate-950/40">
                <p className="text-3xl font-bold">50+</p>
                <p className="mt-2 text-sm text-slate-400">Marcas e modelos</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6 text-slate-100 shadow-xl shadow-slate-950/40">
                <p className="text-3xl font-bold">10k+</p>
                <p className="mt-2 text-sm text-slate-400">Clientes atendidos</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6 text-slate-100 shadow-xl shadow-slate-950/40">
                <p className="text-3xl font-bold">15 anos</p>
                <p className="mt-2 text-sm text-slate-400">No mercado automotivo</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6 text-slate-100 shadow-xl shadow-slate-950/40">
                <p className="text-3xl font-bold">24/7</p>
                <p className="mt-2 text-sm text-slate-400">Atualizações de notícias</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative z-10 border-t border-slate-800 bg-slate-950/95 py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 text-sm text-slate-200 scrollbar-none sm:px-6">
          <span className="whitespace-nowrap rounded-full bg-slate-800/80 px-4 py-2 font-semibold text-sky-300">Barra de notícias</span>
          <div className="flex gap-3 whitespace-nowrap">
            <a
              href="https://www.autoesporte.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-800/80 px-4 py-2 transition hover:bg-slate-700"
            >
              Autoesporte: elétricos ganham novo fôlego em 2026
            </a>
            <a
              href="https://quatrorodas.abril.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-800/80 px-4 py-2 transition hover:bg-slate-700"
            >
              Quatro Rodas: mercado seminovo cresce com ofertas promocionais
            </a>
            <a
              href="https://motor1.uol.com.br/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-800/80 px-4 py-2 transition hover:bg-slate-700"
            >
              Motor1 Brasil: novos lançamentos e tendências de vendas em alta
            </a>
            <a
              href="https://www.uol.com.br/carros/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-800/80 px-4 py-2 transition hover:bg-slate-700"
            >
              UOL Carros: financiamento automotivo se mantém atraente para compradores
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 border-t border-slate-800 bg-slate-950/95 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold text-white">Conheça a 1000 Valle Multimarcas</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Há mais de 15 anos no mercado, a 1000 Valle Multimarcas oferece os melhores negócios em carros seminovos e zero km. Nossa equipe combina transparência com condições competitivas para entregar a melhor experiência de compra e venda.
          </p>
        </div>
      </section>

      <section id="news" className="relative z-10 bg-slate-900/95 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Redes sociais</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Siga a 1000 Valle Multimarcas</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Conecte-se com a nossa empresa nas redes sociais para receber novidades, ofertas e atendimento direto pelos canais oficiais.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Instagram</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Acompanhe nossas novidades e ofertas</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Siga nosso perfil no Instagram para ver lançamentos, promoções e conteúdos exclusivos sobre carros seminovos e ofertas do dia.
              </p>
              <a
                href="https://www.instagram.com/1000vallemultimarcas/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Instagram
              </a>
            </article>

            <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Facebook</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Acesse nossa página oficial</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Fique por dentro das publicações e comunique-se diretamente pela nossa página no Facebook.</p>
              <a
                href="https://www.facebook.com/1000vallemultimarcasoficial/?locale=pt_BR"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Facebook
              </a>
            </article>

            <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">WhatsApp</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Fale conosco diretamente</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Envie uma mensagem direta pelo WhatsApp para atendimento rápido e personalizado sobre nossos carros e promoções.
              </p>
              <a
                href="https://api.whatsapp.com/send/?phone=551239393737&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                WhatsApp
              </a>
            </article>

            <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">LinkedIn</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Conecte-se com nossa empresa</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Conheça nossa história profissional, vagas e parcerias através do perfil corporativo no LinkedIn.
              </p>
              <a
                href="https://www.linkedin.com/company/1000vallemultimarcas?originalSubdomain=br"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                LinkedIn
              </a>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
