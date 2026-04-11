import { Link } from "react-router-dom";
import Logo from "../../assets/logo_1000.svg";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="1000 Valle Multimarcas" className="h-10 w-auto" />
          <span className="text-xl font-semibold text-slate-900">1000 Valle</span>
        </Link>
      </div>

      <div className="flex gap-8 text-white">
        <Link to="/" className="border-b-2 border-white pb-1 font-medium text-white">
          Home
        </Link>
        <Link
          to="/#about"
          className="font-medium text-white border-b-2 border-transparent pb-1 transition-colors duration-200 hover:border-white hover:text-white"
        >
          Conheça a 1000
        </Link>
        <Link
          to="/points"
          className="font-medium text-white border-b-2 border-transparent pb-1 transition-colors duration-200 hover:border-white hover:text-white"
        >
          Pontos
        </Link>
        <Link
          to="/#news"
          className="font-medium text-white border-b-2 border-transparent pb-1 transition-colors duration-200 hover:border-white hover:text-white"
        >
          Notícias
        </Link>
      </div>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-slate-700 text-white px-5 py-2 rounded-lg transition hover:bg-slate-800"
        >
          Entrar
        </Link>
        <Link
          to="/register"
          className="bg-red-500 text-white px-5 py-2 rounded-lg transition hover:bg-red-600"
        >
          Cadastrar
        </Link>
      </div>

    </nav>
  )
}