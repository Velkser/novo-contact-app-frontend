// src/App.jsx (обновленный фрагмент)

import React, { useState, useEffect } from 'react'
import useContactStore from './store/useContactStore'



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddContact from './pages/AddContact'
import EditContact from './pages/EditContact'
import ViewContact from './pages/ViewContact'
import Login from './pages/Login'
import Register from './pages/Register'
import PromptTemplates from './pages/PromptTemplates'
import ScheduleCall from './pages/ScheduleCall'
import ScheduledCalls from './pages/ScheduledCalls'
import AddGroup from './pages/AddGroup'  // ← Добавлено
import Groups from './pages/Groups'      // ← Добавлено
import ScheduleGroupCall from './pages/ScheduleGroupCall'  // ← Добавлено
import ScheduledGroupCalls from './pages/ScheduledGroupCalls'

import EditGroup from './pages/EditGroup'  // ← Добавлено
import ViewGroup from './pages/ViewGroup'  // ← Добавлено


function App() {
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = useContactStore((state) => state.isAuthenticated)
  const fetchCurrentUser = useContactStore((state) => state.fetchCurrentUser)

  useEffect(() => {
    const initAuth = async () => {
      await fetchCurrentUser()
      setIsLoading(false)
    }
    
    initAuth()
  }, [fetchCurrentUser])

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
            {/* Новые маршруты для групп */}
            <Route 
              path="/groups" 
              element={isAuthenticated ? <Groups /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/add-group" 
              element={isAuthenticated ? <AddGroup /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/edit-group/:id" 
              element={isAuthenticated ? <EditGroup /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/view-group/:id" 
              element={isAuthenticated ? <ViewGroup /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/schedule-group-call" 
              element={isAuthenticated ? <ScheduleGroupCall /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/schedule-group-call/:groupId/" 
              element={isAuthenticated ? <ScheduleGroupCall /> : <Navigate to="/login" />} 
            />
             <Route 
              path="/scheduled-group-calls" 
              element={isAuthenticated ? <ScheduledGroupCalls /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/prompt-templates" 
              element={isAuthenticated ? <PromptTemplates /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/scheduled-calls" 
              element={isAuthenticated ? <ScheduledCalls /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/schedule-call" 
              element={isAuthenticated ? <ScheduleCall /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/schedule-call/:contactId" 
              element={isAuthenticated ? <ScheduleCall /> : <Navigate to="/login" />} 
            />

          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App