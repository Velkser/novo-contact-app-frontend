// src/pages/ViewContact.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ViewContact() {
  const navigate = useNavigate()
  const { id } = useParams()
  const contacts = useContactStore((state) => state.contacts)
  const makeImmediateCall = useContactStore((state) => state.makeImmediateCall)
  const fetchContactDialogs = useContactStore((state) => state.fetchContactDialogs)
  const addContactDialog = useContactStore((state) => state.addContactDialog)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const contact = contacts.find(c => c.id === parseInt(id))
  const [isCalling, setIsCalling] = useState(false)
  const [callError, setCallError] = useState('')
  const [contactDialogs, setContactDialogs] = useState([])

  // Загружаем диалоги при монтировании компонента
  useEffect(() => {
    if (contact) {
      loadContactDialogs()
    }
  }, [contact, fetchContactDialogs])

  const loadContactDialogs = async () => {
    try {
      const dialogs = await fetchContactDialogs(contact.id)
      setContactDialogs(dialogs || [])
    } catch (error) {
      console.error('Error loading dialogs:', error)
      setContactDialogs([])
    }
  }

  const handleMakeCall = async () => {
    if (!contact) return
    
    try {
      setIsCalling(true)
      setCallError('')
      
      const callData = {
        contact_id: contact.id,
        script: contact.script || 'Здравствуйте! Это автоматический звонок.'
      }
      
      const result = await makeImmediateCall(callData)
      
      if (result && result.call_sid) {
        alert(`✅ Звонок успешно инициирован! SID: ${result.call_sid}`)
        // Перезагружаем диалоги после звонка
        await loadContactDialogs()
      } else {
        alert('✅ Звонок успешно инициирован! (симуляция)')
      }
      
    } catch (error) {
      console.error('Error making call:', error)
      setCallError(error.message || 'Ошибка при совершении звонка')
      alert(`❌ Ошибка звонка: ${error.message || 'Неизвестная ошибка'}`)
    } finally {
      setIsCalling(false)
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!contact) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Kontakt nenájdený</h2>
          <p className="text-gray-500 mb-6">Zadaný kontakt neexistuje alebo bol vymazaný</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Späť na zoznam
            </button>
            <Link 
              to="/add" 
              className="btn btn-success"
            >
              + Pridať kontakt
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detail kontaktu</h1>
        <p className="text-gray-600 mt-1">Zobrazenie detailných informácií o kontakte</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start space-x-6">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl w-20 h-20 flex items-center justify-center text-white text-2xl font-bold">
                {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{contact.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {contact.phone}
                  </span>
                  {contact.company && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                      {contact.company}
                    </span>
                  )}
                </div>
                
                {/* Теги */}
                <div className="flex flex-wrap gap-2">
                  {contact.tags && contact.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка звонка */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Rýchly hovor
              </h3>
              <button
                onClick={handleMakeCall}
                disabled={isCalling || loading}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                  isCalling || loading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isCalling || loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Vytáčam...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>Zavolať teraz</span>
                  </>
                )}
              </button>
            </div>
            
            {contact.script ? (
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <p className="text-gray-700 whitespace-pre-wrap">{contact.script}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">Zatiaľ nie je nastavený žiadny skript pre tohto kontakt.</p>
            )}
            
            {callError && (
              <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg">
                {callError}
              </div>
            )}
          </div>

          {/* Script Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 3a1 1 0 000 2v4a1 1 0 001 1h5a1 1 0 001-1V5a1 1 0 000-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0h2v2H9V8zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                Agent Script
              </h3>
              <Link
                to={`/edit/${contact.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Upraviť
              </Link>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-yellow-100">
              {contact.script ? (
                <p className="text-gray-700 whitespace-pre-wrap">{contact.script}</p>
              ) : (
                <p className="text-gray-500 italic">Zatiaľ nie je nastavený žiadny skript pre tohto kontakt.</p>
              )}
            </div>
          </div>

          {/* Dialog History */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
                História hovorov
              </h3>
              <button
                onClick={loadContactDialogs}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {loading ? 'Načítavam...' : 'Obnoviť'}
              </button>
            </div>
            
            {contactDialogs && contactDialogs.length > 0 ? (
              <div className="space-y-6">
                {contactDialogs.map((dialog) => (
                  <div key={dialog.id} className="bg-white rounded-lg border border-blue-100 p-4">
                    <div className="text-sm text-blue-600 font-medium mb-3">
                      📅 {formatDateTime(dialog.date)}
                    </div>
                    <div className="space-y-3">
                      {dialog.messages && dialog.messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === 'agent' 
                              ? 'bg-blue-100 text-blue-900 rounded-tl-none' 
                              : 'bg-green-100 text-green-900 rounded-tr-none'
                          }`}>
                            <div className="text-xs font-medium mb-1">
                              {message.role === 'agent' ? 'Agent' : 'Client'}
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {dialog.transcript && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{dialog.transcript}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-gray-500">Zatiaľ nie sú žiadne záznamy o hovoroch s týmto kontaktom.</p>
                <button
                  onClick={loadContactDialogs}
                  disabled={loading}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Načítavam...' : 'Načítať históriu'}
                </button>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Späť
            </button>
            <Link
              to={`/edit/${contact.id}`}
              className="btn btn-success flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Upraviť kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}