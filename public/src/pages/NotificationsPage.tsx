interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

const notificationsMock: Notification[] = [
  {
    id: 1,
    title: "Novo lead cadastrado",
    message: "Você recebeu um novo lead interessado no Honda Civic.",
    time: "Agora",
  },
  {
    id: 2,
    title: "Pagamento confirmado",
    message: "O pagamento do financiamento foi aprovado.",
    time: "Há 2 horas",
  },
  {
    id: 3,
    title: "Veículo disponível",
    message: "O Toyota Corolla 2021 está disponível para test drive.",
    time: "Ontem",
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold bg-slate-900 text-white p-4 rounded-lg text-center mb-6">Notificações</h1>

        <div className="space-y-4">
          {notificationsMock.map((notif) => (
            <div
              key={notif.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">{notif.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                </div>
                <span className="text-xs text-gray-400">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

