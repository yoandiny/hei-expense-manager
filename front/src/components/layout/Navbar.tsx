import { Link, Outlet } from 'react-router-dom'
import Logo from '../../assets/logo.png'

export default function Navbar() {

  return (
    <div className='flex flex-col'>
    <div>
      <nav className="bg-gray-800">
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
            <div className="hidden md:block">
              
            </div>
          </div>
          <div className="hidden md:block">
          </div>
          <div className="-mr-2 flex md:hidden">
           
          </div>
        </div>
      </div>
    </nav>
    <div className='flex '>
      <nav className='w-100 h-full mr-10'>
      <div className="bg-gray-100 p-4 h-150 flex flex-col mb-1">
        <Link
                  to="/dashboard"
                  className="text-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-large"
                >
                  Tableau de bord
                </Link>

                <Link
                  to="/categories"
                  className="text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-large"
                >
                  Catégories
                </Link>

                <Link
                  to="/transactions"
                  className="text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Transactions
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
