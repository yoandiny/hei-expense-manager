import { Link, Outlet } from 'react-router-dom'
import Logo from '../../assets/logo.png'

export default function Navbar() {

  return (
    <div className='flex flex-col'>
    <div>
      <nav className="bg-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-23">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  className="h-30 w-30"
                  src={Logo}
                  alt="Logo"
                />
              </Link>
            </div>
            <div className=" block">
              <Link to="/profile" className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-2xl font-medium">
                <i className=' text-2xl bx bxs-user-circle' ></i>
              </Link>
            </div>
          </div>
          
        </div>
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
