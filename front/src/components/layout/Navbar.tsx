import { Link, Outlet } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <div className="flex flex-col min-h-screen bg-green-50">
            <nav className="bg-green-700 h-20 flex items-center justify-between px-6 shadow-lg">
                <span onClick={() => navigate("/dashboard")} className="flex items-center cursor-pointer">
                    <img src={Logo} alt="Logo" className="w-20 h-20 object-contain"/>
                </span>
                <div className="flex items-center gap-6">
                    <Link to="/profile" className="text-white hover:text-yellow-400">
                        <i className="bx bxs-user-circle text-5xl"></i>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-yellow-400 transition-colors cursor-pointer"
                    >
                        <i className="bx bx-log-out text-4xl"></i>
                    </button>
                </div>
            </nav>
            <div className="flex flex-1">
                <aside className="w-72 bg-white border-r border-green-200 shadow-md p-6">
                    <div className="flex flex-col gap-3">
                        <Link
                            to=""
                            className="flex items-center gap-3 px-4 py-2 text-green-800 rounded-lg hover:bg-yellow-400 hover:text-green-900 transition-colors text-lg font-semibold"
                        >
                            <i className="bx bxs-dashboard text-xl"></i>
                            Dashboard
                        </Link>

                        <Link
                            to="categories"
                            className="flex items-center gap-3 px-4 py-2 text-green-800 rounded-lg hover:bg-yellow-400 hover:text-green-900 transition-colors text-lg font-semibold"
                        >
                            <i className="bx bxs-category text-xl"></i>
                            Categories
                        </Link>

                        <Link
                            to="incomes"
                            className="flex items-center gap-3 px-4 py-2 text-green-800 rounded-lg hover:bg-yellow-400 hover:text-green-900 transition-colors text-lg font-semibold"
                        >
                            <i className="bx bxs-wallet text-xl"></i>
                            Incomes
                        </Link>

                        <Link
                            to="expenses"
                            className="flex items-center gap-3 px-4 py-2 text-green-800 rounded-lg hover:bg-yellow-400 hover:text-green-900 transition-colors text-lg font-semibold"
                        >
                            <i className="bx bx-money-withdraw text-xl"></i>
                            Expenses
                        </Link>
                    </div>
                </aside>

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
