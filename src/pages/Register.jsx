// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom' // ← Добавлен Link
import useContactStore from '../store/useContactStore'

export default function Register() {
  const navigate = useNavigate()
  const register = useContactStore((state) => state.register)
  const isAuthenticated = useContactStore((state) => state.isAuthenticated)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  })

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    const errors = []
    
    if (!userData.email) {
      errors.push('Email je povinný')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Neplatný email')
    }
    
    if (!userData.password) {
      errors.push('Heslo je povinné')
    } else if (userData.password.length < 8) {
      errors.push('Heslo musí mať minimálne 8 znakov')
    }
    
    if (!userData.first_name) {
      errors.push('Meno je povinné')
    }
    
    if (!userData.last_name) {
      errors.push('Priezvisko je povinné')
    }
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const errors = validateForm()
    if (errors.length > 0) {
      setError(errors.join(', '))
      setLoading(false)
      return
    }
    
    try {
      await register(userData)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registrácia zlyhala')
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
          <p className="text-gray-600">Vytvorte si nový účet</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meno *
            </label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Vaše meno"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priezvisko *
            </label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Vaše priezvisko"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="vas@email.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heslo *
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimálne 8 znakov
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registrujem...' : 'Vytvoriť účet'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Už máte účet?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Prihláste sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}