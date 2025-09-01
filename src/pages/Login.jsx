// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom' // ← Добавлен Link
import useContactStore from '../store/useContactStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useContactStore((state) => state.login)
  const isAuthenticated = useContactStore((state) => state.isAuthenticated)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(credentials)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Nesprávny email alebo heslo')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Contact App</h1>
          <p className="text-gray-600">Prihláste sa do svojho účtu</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="input-field"
              placeholder="vas@email.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heslo
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Prihlasovanie...' : 'Prihlásiť sa'}
          </button>
        </form>
        
        {/* Добавлена ссылка на регистрацию */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Nemáte účet?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Zaregistrujte sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}