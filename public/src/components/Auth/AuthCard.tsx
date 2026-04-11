export default function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
      <div className="bg-rose-950 px-8 py-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}