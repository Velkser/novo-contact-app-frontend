import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'
import { Link } from 'react-router-dom'

// Функция для получения статистики звонков
const getCallStats = (dialogs) => {
  if (!dialogs || dialogs.length === 0) return null
  
  const totalCalls = dialogs.length
  const lastCall = dialogs[dialogs.length - 1]
  
  return {
    totalCalls,
    lastCallDate: lastCall.date,
  }
}

export default function ViewContact() {
  const navigate = useNavigate()
  const { id } = useParams()
  const contacts = useContactStore((state) => state.contacts)
  const updateContactScript = useContactStore((state) => state.updateContactScript)
  const addTag = useContactStore((state) => state.addTag)
  const removeTag = useContactStore((state) => state.removeTag)
  
  const contact = contacts.find(c => c.id === parseInt(id))
  const [isEditingScript, setIsEditingScript] = useState(false)
  const [scriptText, setScriptText] = useState(contact?.script || '')
  const [newTag, setNewTag] = useState('')

  const handleSaveScript = () => {
    updateContactScript(parseInt(id), scriptText)
    setIsEditingScript(false)
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (newTag.trim() && !contact.tags.includes(newTag.trim())) {
      addTag(contact.id, newTag.trim())
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag) => {
     if (contact.tags.length > 1 || window.confirm('Naozaj chcete odstrániť tento tag?')) {
    removeTag(contact.id, tag)
  }
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

  // Получаем статистику звонков
  const callStats = getCallStats(contact.dialogs)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detail kontaktu</h1>
        <p className="text-gray-600">Zobrazenie detailných informácií o kontakte</p>
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
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                
                {/* Форма добавления тега */}
                <form onSubmit={handleAddTag} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Pridať tag..."
                    className="input-field text-sm py-1 px-3 w-32"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  >
                    +
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Статистика звонков */}
          {contact.dialogs && contact.dialogs.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                Štatistika hovorov
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">{contact.dialogs.length}</div>
                  <div className="text-sm text-gray-600">Celkom hovorov</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">
                    {contact.dialogs[contact.dialogs.length - 1]?.date.split(' ')[0] || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Posledný hovor</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">
                    {contact.tags?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Tagy</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Kontaktné údaje
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Telefón
                  </p>
                  <p className="font-medium text-lg">{contact.phone}</p>
                </div>
                {contact.email && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email
                    </p>
                    <p className="font-medium text-blue-600">{contact.email}</p>
                  </div>
                )}
                {contact.company && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                      Spoločnosť
                    </p>
                    <p className="font-medium">{contact.company}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Akcie
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white transition-colors flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                  <span>Zavolať</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white transition-colors flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                  <span>Odoslať SMS</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white transition-colors flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Odoslať email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Script Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 3a1 1 0 000 2v4a1 1 0 001 1h5a1 1 0 001-1V5a1 1 0 000-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Agent Script
              </h3>
              <button
                onClick={() => {
                  setIsEditingScript(!isEditingScript)
                  setScriptText(contact.script || '')
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isEditingScript ? 'Zrušiť' : 'Upraviť'}
              </button>
            </div>
            
            {isEditingScript ? (
              <div className="space-y-4">
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Napíšte skript, ktorý bude agent používať pri hovore..."
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveScript}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Uložiť skript
                  </button>
                  <button
                    onClick={() => setIsEditingScript(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Zrušiť
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-yellow-100">
                {contact.script ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.script}</p>
                ) : (
                  <p className="text-gray-500 italic">Zatiaľ nie je nastavený žiadny skript pre tohto kontakt.</p>
                )}
              </div>
            )}
          </div>

          {/* Dialog History */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
              História hovorov
            </h3>
            
            {contact.dialogs && contact.dialogs.length > 0 ? (
              <div className="space-y-6">
                {contact.dialogs.map((dialog) => (
                  <div key={dialog.id} className="bg-white rounded-lg border border-blue-100 p-4">
                    <div className="text-sm text-blue-600 font-medium mb-3">
                      📅 {dialog.date}
                    </div>
                    <div className="space-y-3">
                      {dialog.messages.map((message, index) => (
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-gray-500">Zatiaľ nie sú žiadne záznamy o hovoroch s týmto kontaktom.</p>
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