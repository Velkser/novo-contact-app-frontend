// src/pages/Groups.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function Groups() {
  const navigate = useNavigate()
  const groups = useContactStore((state) => state.groups) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const fetchGroups = useContactStore((state) => state.fetchGroups)
  const fetchContacts = useContactStore((state) => state.fetchContacts)
  const deleteGroup = useContactStore((state) => state.deleteGroup)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [statusFilter, setStatusFilter] = useState('all')

  // Загружаем группы и контакты при монтировании
  useEffect(() => {
    fetchGroups()
    fetchContacts()
  }, [fetchGroups, fetchContacts])

  // Фильтрация групп
  const filteredGroups = (groups || []).filter(group => {
    if (statusFilter === 'all') return true
    return group.status === statusFilter
  })

  // Функция для получения контактов группы
  const getGroupContacts = (groupId) => {
    if (!groups || groups.length === 0) return []
    if (!contacts || contacts.length === 0) return []
    
    const group = groups.find(g => g.id === parseInt(groupId))
    if (!group || !group.members) return []
    
    // Получаем контакты по их ID из группы
    return group.members.map(member => 
      contacts.find(c => c.id === member.contact_id)
    ).filter(c => c)
  }

  // Функция для получения имени контакта по ID
  const getContactName = (contactId) => {
    if (!contacts || contacts.length === 0) return 'Neznámy kontakt'
    const contact = contacts.find(c => c.id === parseInt(contactId))
    return contact ? contact.name : 'Neznámy kontakt'
  }

  // Функция для получения телефона контакта по ID
  const getContactPhone = (contactId) => {
    if (!contacts || contacts.length === 0) return ''
    const contact = contacts.find(c => c.id === parseInt(contactId))
    return contact ? contact.phone : ''
  }

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Naozaj chcete odstrániť túto skupinu?')) {
      try {
        await deleteGroup(groupId)
      } catch (error) {
        console.error('Error deleting group:', error)
        alert(`❌ Chyba mazania skupiny: ${error.message}`)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Správa skupín</h1>
          <p className="text-gray-600 mt-1">Spravujte skupiny kontaktov</p>
        </div>
        <Link
          to="/add-group"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>+ Pridať skupinu</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Фильтры */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter podľa stavu
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="all">Všetky</option>
              <option value="pending">Čakajúce</option>
              <option value="completed">Dokončené</option>
              <option value="failed">Zlyhané</option>
              <option value="cancelled">Zrušené</option>
              <option value="retrying">Opakujúce sa</option>
            </select>
          </div>
        </div>
        
        {statusFilter !== 'all' && (
          <div className="mt-3 text-sm text-gray-600">
            Отфильтровано: {(groups || []).filter(g => g.status === statusFilter).length} из {(groups || []).length}
          </div>
        )}
      </div>

      {/* Список групп */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítavanie skupín...</p>
          </div>
        ) : (filteredGroups || []).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {statusFilter === 'all' ? 'Žiadne skupiny' : 'Žiadne skupiny pre vybraný filter'}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'all' 
                ? 'Zatiaľ nemáte žiadne skupiny kontaktov' 
                : 'Pre vybraný filter nie sú žiadne skupiny'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Späť na kontakty
              </button>
              <Link 
                to="/add" 
                className="btn btn-success"
              >
                + Pridať kontakt
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredGroups || []).map((group) => {
              // Получаем контакты группы
              const groupContacts = getGroupContacts(group.id)
              
              return (
                <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.description || 'Bez popisu'}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Link
                        to={`/view-group/${group.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                        title="Zobraziť detail"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link
                        to={`/edit-group/${group.id}`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                        title="Upraviť"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                        title="Vymazať"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Участники группы */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {groupContacts.slice(0, 3).map((contact, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    ))}
                    {groupContacts.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        +{groupContacts.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {groupContacts.length} {groupContacts.length === 1 ? 'kontakt' : 'kontaktov'}
                  </div>
                  
                  {/* Кнопки действий */}
                  <div className="flex space-x-2 mt-4">
                    <Link
                      to={`/schedule-group-call/${group.id}`}
                      className="flex-1 text-center px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      Naplánovať hovor
                    </Link>
                    <Link
                      to={`/view-group/${group.id}`}
                      className="flex-1 text-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      Zobraziť
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}