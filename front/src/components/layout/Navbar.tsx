import { Link, Outlet } from 'react-router-dom'
import Logo from '../../assets/logo.png'

export default function Navbar() {

  return (
    <div className='flex flex-col'>
    <div>
      <nav className="bg-gray-700 h-26 flex items-center flex-row justify-between ">
      <span className='items-start ml-3'>
        <img src={Logo} alt="Logo" className='w-30 h-30' />
      </span>
      <div className='items-end mr-3'>
        <Link to="/profile"
        className='text-white '
        >
           <i className='bx bxs-user-circle text-7xl' ></i>
          </Link>
      </div>
          
    </nav>
    <div className='flex '>
      <nav className='w-100 h-full mr-10'>
      <div className="bg-gray-100 p-4 h-150 flex flex-col ">
        <Link
                  to="/dashboard"
                  className="mb-1.5 text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                >
                  <i className='bx bxs-dashboard'></i>
                  Tableau de bord
                </Link>

                <Link
                  to="/categories"
                  className="mb-1.5 text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                >
                  <i className='bx bxs-category' ></i>
                  Catégories
                </Link>

                <Link
                  to="/incomes"
                  className="mb-1.5 text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                >
                  <i className='bx bxs-wallet' ></i>
                  Revenus
                </Link>

                <Link
                  to="/expenses"
                  className="mb-1.5 text-black-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium"
                >
                  <i className='bx bx-money-withdraw' ></i>
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
