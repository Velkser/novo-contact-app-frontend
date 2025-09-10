// src/pages/ViewGroup.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ViewGroup() {
  const navigate = useNavigate()
  const { id } = useParams()
  const groups = useContactStore((state) => state.groups) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const fetchGroups = useContactStore((state) => state.fetchGroups)
  const fetchContacts = useContactStore((state) => state.fetchContacts)
  const deleteGroup = useContactStore((state) => state.deleteGroup)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const group = groups.find(g => g.id === parseInt(id))
  const [isDeleting, setIsDeleting] = useState(false)

  // Загружаем группы и контакты при монтировании
  useEffect(() => {
    fetchGroups()
    fetchContacts()
  }, [fetchGroups, fetchContacts])

  // Функция для получения контактов группы
  const getGroupContacts = () => {
    if (!group || !group.members) return []
    if (!contacts || contacts.length === 0) return []
    
    return group.members.map(member => 
      contacts.find(c => c.id === member.contact_id)
    ).filter(c => c)
  }

  const groupContacts = getGroupContacts()

  const handleDeleteGroup = async () => {
    if (window.confirm('Naozaj chcete odstrániť túto skupinu?')) {
      try {
        setIsDeleting(true)
        await deleteGroup(parseInt(id))
        navigate('/groups')
      } catch (error) {
        console.error('Error deleting group:', error)
        alert(`❌ Chyba mazania skupiny: ${error.message}`)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (!group) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Skupina nenájdená</h2>
          <p className="text-gray-500 mb-6">Zadaná skupina neexistuje alebo bola vymazaná</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/groups')}
              className="btn btn-primary"
            >
              Späť na skupiny
            </button>
            <Link 
              to="/add-group" 
              className="btn btn-success"
            >
              + Pridať skupinu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detail skupiny</h1>
        <p className="text-gray-600 mt-1">Zobrazenie detailných informácií o skupine</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start space-x-6">
              <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl w-20 h-20 flex items-center justify-center text-white text-2xl font-bold">
                {group.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{group.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {groupContacts.length} {groupContacts.length === 1 ? 'kontakt' : 'kontaktov'}
                  </span>
                  {group.description && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {group.description}
                    </span>
                  )}
                </div>
                
                {/* Теги */}
                <div className="flex flex-wrap gap-2">
                  {group.tags && group.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка звонка группе */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Hromadný hovor
              </h3>
              <Link
                to={`/schedule-group-call/${group.id}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" clipRule="evenodd" />
                </svg>
                <span>Naplánovať hovor skupine</span>
                </Link>
            </div>
            
            {group.script ? (
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <p className="text-gray-700 whitespace-pre-wrap">{group.script}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">Zatiaľ nie je nastavený žiadny skript pre túto skupinu.</p>
            )}
            
            {/* {callError && (
              <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg">
                {callError}
              </div>
            )} */}
          </div>

          {/* Список контактов в группе */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
                Kontakty v skupine
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {groupContacts.length} {groupContacts.length === 1 ? 'kontakt' : 'kontaktov'}
              </span>
            </div>
            
            {groupContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupContacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-lg border border-blue-100 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </div>
                    </div>
                    
                    {contact.email && (
                      <div className="mt-2 text-xs text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                        {contact.email}
                      </div>
                    )}
                    
                    {contact.company && (
                      <div className="mt-1 text-xs text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 0h2v2H9V5zm6 0h-2v2h2V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        {contact.company}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a1 1 0 00-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2h1V7a1 1 0 011-1h3a1 1 0 011 1v1H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-3z" />
                </svg>
                <p className="text-gray-500">Zatiaľ nie sú žiadne kontakty v tejto skupine</p>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={() => navigate('/groups')}
              className="btn btn-secondary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Späť
            </button>
            <Link
              to={`/edit-group/${group.id}`}
              className="btn btn-success flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Upraviť skupinu
            </Link>
            <button
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="btn btn-danger flex items-center disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
              {isDeleting ? 'Mažem...' : 'Vymazať skupinu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}