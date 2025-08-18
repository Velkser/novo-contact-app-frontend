import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Novo Contact App
          </Link>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Kontakty
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}