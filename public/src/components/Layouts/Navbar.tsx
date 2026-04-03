
export default function Navbar() {
    return (
        <nav className="w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <span className="text-xl font-bold text-blue">
            </span>

            <ul className="flex gap-6 text-sm font-medium">
                <li><a href="#" className="hover:text-blue-400">Dashboard</a></li>
                <li><a href="#" className="hover:text-blue-400">Leads</a></li>
                <li><a href="#" className="hover:text-blue-400">Relatórios</a></li>

            </ul>


            <div className="text-sm text-gray-400">Olá, Usuário!</div>
        </nav>
    )
}