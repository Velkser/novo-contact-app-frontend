// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import ContactList from '../components/ContactList'
import useContactStore from '../store/useContactStore'
import { Link } from 'react-router-dom'

export default function Home() {
  const contacts = useContactStore((state) => state.contacts)
  const fetchContacts = useContactStore((state) => state.fetchContacts) // ← Добавлено
  const [searchTerm, setSearchTerm] = useState('')

  // ← Добавлено: загрузка контактов при монтировании
  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

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
          <h1 className="text-3xl font-bold text-gray-900">Správa kontaktov</h1>
          <p className="text-gray-600 mt-1">
            Celkom kontaktov: {contacts.length}
            {searchTerm && ` (Zobrazených: ${filteredContacts.length})`}
          </p>
        </div>
        <Link
          to="/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors whitespace-nowrap"
        >
          <span>+</span>
          <span>Pridať kontakt</span>
        </Link>
      </div>

      {/* Панель поиска */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
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
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Передаем отфильтрованные контакты напрямую */}
        <ContactList contacts={filteredContacts} />
      </div>
    </div>
  )
}