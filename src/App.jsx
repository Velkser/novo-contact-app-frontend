// src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddContact from './pages/AddContact'
import EditContact from './pages/EditContact'
import ViewContact from './pages/ViewContact'
import Login from './pages/Login'
import Register from './pages/Register'
import PromptTemplates from './pages/PromptTemplates'
import useContactStore from './store/useContactStore'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = useContactStore((state) => state.isAuthenticated)
  const fetchCurrentUser = useContactStore((state) => state.fetchCurrentUser)
  const fetchContacts = useContactStore((state) => state.fetchContacts) // ← Добавлено

  useEffect(() => {
    const initAuth = async () => {
      await fetchCurrentUser()
      setIsLoading(false)
    }
    
    initAuth()
  }, [fetchCurrentUser])

  // ← Добавлен новый useEffect для загрузки контактов
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts()
    }
  }, [isAuthenticated, fetchContacts])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítavanie...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/add" 
              element={isAuthenticated ? <AddContact /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/edit/:id" 
              element={isAuthenticated ? <EditContact /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/view/:id" 
              element={isAuthenticated ? <ViewContact /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/prompt-templates" 
              element={isAuthenticated ? <PromptTemplates /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App