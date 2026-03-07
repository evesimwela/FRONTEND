import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-blue-600">
          AsthmaHealth
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                Home
              </Link>
              <Link to="/predict" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                Predict
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-sm text-blue-600 hover:text-blue-800 font-medium border-l border-gray-300 pl-4">Hi, {user.username}</Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
