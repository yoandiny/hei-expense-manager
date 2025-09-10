
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl">Page not found</p>
      <Link to="/dashboard" className="mt-4 text-blue-500 hover:underline">
        Go back to Dashboard
        </Link>
    </div>
  )
}

export default NotFound
