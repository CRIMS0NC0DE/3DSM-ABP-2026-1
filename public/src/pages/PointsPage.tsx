const pointsData = [
  {
    title: "Unidade Cassiopeia",
    location: "Avenida Cassiopeia, 295 - Jardim Satélite, São José dos Campos - SP, Brasil",
    phone: "(12) 3939-3737",
    hours: "09:00 às 18:00",
    pinLabel: "Cassiopeia",
  },
  {
    title: "Unidade Gisele Martins",
    location: "Rua Gisele Martins, 287 - Morumbi, São José dos Campos - SP",
    phone: "(12) 3939-3737",
    hours: "09:00 às 18:00",
    pinLabel: "Gisele Martins",
  },
  {
    title: "Pouso Alegre",
    location: "Av. Pinto Cobra, 840 - Santa Cecília, Pouso Alegre - MG",
    phone: "(35) 3112-1024",
    hours: "09:00 às 18:00",
    pinLabel: "Pouso Alegre",
  },
  {
    title: "Caraguatatuba - Litoral Norte",
    location: "Av. José Herculano, 1086 - Sala F108 - Portal de Sta Marina, Caraguatatuba - SP",
    phone: "(12) 3600-8206",
    hours: "09:00 às 18:00",
    pinLabel: "Caraguatatuba",
  },
];

export default function PointsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm shadow-slate-200/20">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pontos de login</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
                Localize as unidades no mapa com pin de Google Maps
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Todos os endereços das lojas e pontos de venda estão listados abaixo. Use os pins para visualizar rapidamente onde cada unidade está localizada.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/20">
            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_22%)]" />
              <div className="relative">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Mapa de localizações</p>
                    <h2 className="mt-3 text-2xl font-semibold">Pontos via pin</h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-cyan-200">4 unidades</span>
                </div>

                <div className="relative h-[400px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30" />
                  <div className="absolute inset-0 bg-slate-950/75" />

                  <div className="absolute left-10 top-16 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/90 px-4 py-3 shadow-lg shadow-slate-950/30">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500 text-sm text-white shadow-lg shadow-red-900/30">📍</span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">São José</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">Cassiopeia</p>
                    </div>
                  </div>

                  <div className="absolute right-10 top-24 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/90 px-4 py-3 shadow-lg shadow-slate-950/30">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500 text-sm text-white shadow-lg shadow-red-900/30">📍</span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Litoral</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">Caraguatatuba</p>
                    </div>
                  </div>

                  <div className="absolute left-16 bottom-24 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/90 px-4 py-3 shadow-lg shadow-slate-950/30">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500 text-sm text-white shadow-lg shadow-red-900/30">📍</span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Pouso Alegre</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">Ponto MG</p>
                    </div>
                  </div>

                  <div className="absolute right-16 bottom-20 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/90 px-4 py-3 shadow-lg shadow-slate-950/30">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500 text-sm text-white shadow-lg shadow-red-900/30">📍</span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Morumbi</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">Gisele Martins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            {pointsData.map((point) => (
              <div key={point.title} className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-200/20">
                <div className="flex items-start gap-4">
                  <div className="mt-1 grid h-12 w-12 place-items-center rounded-3xl bg-red-500 text-xl text-white shadow-lg shadow-red-900/20">
                    📍
                  </div>
                  <div className="grow">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{point.title}</p>
                    <p className="mt-3 text-sm text-slate-700">{point.location}</p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-slate-900">Telefone</p>
                        <p>{point.phone}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Horário</p>
                        <p>{point.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
