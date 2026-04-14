import { useMemo, useState } from "react";

interface Car {
  id: number;
  name: string;
  price: string;
  km: string;
  fuel: string;
  image: string;
  year: number;
}

// TODO: Remover mocks quando a integração com a API estiver pronta
const generateCars = (): Car[] => {
  const brands = ["Honda", "Toyota", "BMW", "Audi", "Ford", "Chevrolet"];
  const fuels = ["Flex", "Gasolina", "Diesel"];
  const cars: Car[] = [];
  const carImages = [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1469285994282-454cbe0dae8b?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=640&h=420&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=420&fit=crop",
  ];

  for (let i = 1; i <= 30; i++) {
    const brand = brands[i % brands.length];
    cars.push({
      id: i,
      name: `${brand} Modelo ${i}`,
      price: `R$ ${(50000 + i * 3000).toLocaleString()}`,
      km: `${(10000 + i * 2000).toLocaleString()} km`,
      fuel: fuels[i % fuels.length],
      image: carImages[i % carImages.length],
      year: 2015 + (i % 10),
    });
  }
  return cars;
};

const carsMock = generateCars(); // TODO: substituir por dados reais da API

export default function GaragePage() {
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("Todos");
  const [gridCols, setGridCols] = useState(3);

  const filteredCars = useMemo(() => {
    return carsMock.filter((car) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFuel =
        fuelFilter === "Todos" || car.fuel === fuelFilter;

      return matchesSearch && matchesFuel;
    });
  }, [search, fuelFilter]);

  const visibleCount = filteredCars.length;
  const totalCount = carsMock.length;

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Garagem</p>
              <h1 className="text-3xl font-bold text-slate-900">Catálogo de veículos</h1>
              <p className="mt-2 text-sm text-slate-500">
                Exibindo <strong>{visibleCount}</strong> de <strong>{totalCount}</strong> veículos.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/5 px-4 py-3 text-sm text-slate-700">
              Use os filtros para encontrar o carro ideal.
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.8fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Buscar</span>
                <input
                  type="text"
                  placeholder="Buscar por modelo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Combustível</span>
                <select
                  value={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Todos">Todos os Combustíveis</option>
                  <option value="Flex">Flex</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </label>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  Layout
                </span>
                <button
                  type="button"
                  onClick={() => setGridCols(1)}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${gridCols === 1
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  1 coluna
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols(2)}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${gridCols === 2
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  2 colunas
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols(3)}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${gridCols === 3
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  3 colunas
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div
            className={`grid gap-6 ${gridCols === 1
                ? "grid-cols-1"
                : gridCols === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
          >
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <article
                  key={car.id}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm"
                >
                  <div className="h-56 overflow-hidden bg-slate-200">
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">{car.name}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {car.fuel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Ano: {car.year}</p>
                    <p className="mt-4 text-xl font-bold text-slate-900">{car.price}</p>
                    <p className="mt-2 text-sm text-slate-500">{car.km}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Nenhum veículo encontrado. Ajuste a busca ou o filtro para ver resultados.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

