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
        <div className='flex flex-col'>
            <div>
                <nav className="bg-gray-700 h-26 flex items-center flex-row justify-between ">
          <span className='items-start ml-3'>
            <img src={Logo} alt="Logo" className='w-30 h-30 cursor-pointer' />
          </span>
                    <div className='items-end mr-3'>
                        <section className='flex gap-4 align-middle'>
                            <Link to="/profile" className='text-white'>
                            <i className='bx bxs-user-circle text-7xl hover:text-gray-400'></i>
                        </Link>
                        <button className='text-white hover:text-gray-400' onClick={()=>{handleLogout()}}>
                            <i className='text-5xl cursor-pointer bx bx-log-out'></i>
                        </button>
                        </section>
                    </div>
                </nav>

                <div className='flex '>
                    <nav className='w-80 h-full mr-10'>
                        <div className="bg-gray-100 p-4 h-150 flex flex-col ">

                            <Link
                                to=""   // équivaut à /dashboard
                                className=" mb-1.5 text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                            >
                                <i className='bx bxs-dashboard'></i>
                                Tableau de bord
                            </Link>

                            <Link
                                to="categories"
                                className="mb-1.5 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                            >
                                <i className='bx bxs-category'></i>
                                Catégories
                            </Link>

                            <Link
                                to="incomes"
                                className="mb-1.5 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                            >
                                <i className='bx bxs-wallet'></i>
                                Revenus
                            </Link>

                            <Link
                                to="expenses"
                                className="mb-1.5 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                            >
                                <i className='bx bx-money-withdraw'></i>
                                Dépenses
                            </Link>
                        </div>
                    </nav>

                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}
