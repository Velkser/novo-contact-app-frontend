// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'
import ContactList from '../components/ContactList'

export default function Home() {
  const navigate = useNavigate()
  const contacts = useContactStore((state) => state.contacts)
  const groups = useContactStore((state) => state.groups)
  const fetchContacts = useContactStore((state) => state.fetchContacts)
  const fetchGroups = useContactStore((state) => state.fetchGroups)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [searchTerm, setSearchTerm] = useState('')

  // Загружаем контакты и группы при монтировании
  useEffect(() => {
    fetchContacts()
    fetchGroups()
  }, [fetchContacts, fetchGroups])

  // Фильтрация контактов
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.tags && contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    
    return matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Správa kontaktov</h1>
          <p className="text-gray-600 mt-1">
            Celkom kontaktov: {contacts.length}
            {groups.length > 0 && `, Skupín: ${groups.length}`}
            {searchTerm && ` (Zobrazených: ${filteredContacts.length})`}
          </p>
        </div>

      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Панель поиска */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6.037 6.037 0 002 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hľadať kontakty (meno, telefón, email, firma, tagy)..."
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
        
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Nájdené kontakty: {filteredContacts.length} z {contacts.length}
          </div>
        )}
      </div>
      
      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/add" 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-blue-100 rounded-lg p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pridať kontakt</h3>
            <p className="text-gray-600 text-sm">Vytvorte nový kontakt</p>
          </div>
        </Link>
        
        <Link 
          to="/add-group" 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-purple-100 rounded-lg p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pridať skupinu</h3>
            <p className="text-gray-600 text-sm">Vytvorte novú skupinu kontaktov</p>
          </div>
        </Link>
        
        <Link 
          to="/scheduled-calls" 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="bg-green-100 rounded-lg p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h.01a1 1 0 100-2H7zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Zaplánované hovory</h3>
            <p className="text-gray-600 text-sm">Spravujte naplánované hovory</p>
          </div>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ContactList contacts={filteredContacts} />
      </div>
    </div>
  )
}