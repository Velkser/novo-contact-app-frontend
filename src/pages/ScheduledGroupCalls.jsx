// src/pages/ScheduledGroupCalls.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ScheduledGroupCalls() {
  const navigate = useNavigate()
  const scheduledCalls = useContactStore((state) => state.scheduledCalls) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const groups = useContactStore((state) => state.groups) || []
  
  // 🔥 Исправлено: используем функции для групп, а не для контактов
  const fetchScheduledGroupCalls = useContactStore((state) => state.fetchScheduledGroupCalls)
  const updateScheduledGroupCall = useContactStore((state) => state.updateScheduledGroupCall)
  const deleteScheduledGroupCall = useContactStore((state) => state.deleteScheduledGroupCall)
  
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [statusFilter, setStatusFilter] = useState('all')

  // 🔥 Исправлено: загружаем запланированные звонки группам
  useEffect(() => {
    fetchScheduledGroupCalls()
  }, [fetchScheduledGroupCalls])

  // Фильтрация только звонков группам
  const filteredCalls = (scheduledCalls || []).filter(call => {
    // Только звонки группам (у них есть group_id)
    const isGroupCall = call.group_id !== undefined && call.group_id !== null
    
    if (!isGroupCall) return false
    
    if (statusFilter === 'all') return true
    return call.status === statusFilter
  })

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

  // Функция для получения имени группы по ID
  const getGroupName = (groupId) => {
    if (!groups || groups.length === 0) return 'Neznáma skupina'
    const group = groups.find(g => g.id === parseInt(groupId))
    return group ? group.name : 'Neznáma skupina'
  }

  // Функция для получения контактов группы
  const getGroupContacts = (groupId) => {
    if (!groups || groups.length === 0) return []
    const group = groups.find(g => g.id === parseInt(groupId))
    if (!group || !group.members) return []
    
    return group.members.map(member => 
      contacts.find(c => c.id === member.contact_id)
    ).filter(c => c)
  }

  // Функция для форматирования даты
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 🔥 Исправлено: обновляем звонок группы
  const handleUpdateCall = async (callId, updatedCall) => {
    try {
      await updateScheduledGroupCall(callId, updatedCall)
    } catch (error) {
      console.error('Error updating scheduled group call:', error)
      alert(`❌ Chyba aktualizácie hovoru skupiny: ${error.message}`)
    }
  }

  // 🔥 Исправлено: удаляем звонок группы
  const handleDeleteCall = async (callId) => {
    if (window.confirm('Naozaj chcete odstrániť tento naplánovaný hovor skupiny?')) {
      try {
        await deleteScheduledGroupCall(callId)
      } catch (error) {
        console.error('Error deleting scheduled group call:', error)
        alert(`❌ Chyba mazania hovoru skupiny: ${error.message}`)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Naplánované hovory skupinám</h1>
            <p className="text-gray-600 mt-1">Správa naplánovaných hovorov skupinám</p>

        </div>
        <Link
          to="/schedule-group-call"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" clipRule="evenodd" />
          </svg>
          <span>+ Naplánovať hovor skupine</span>
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
            Отфильтровано: {(scheduledCalls || []).filter(c => c.group_id && c.status === statusFilter).length} из {(scheduledCalls || []).filter(c => c.group_id).length}
          </div>
        )}
      </div>

      {/* Список запланированных звонков группам */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítavanie zaplánovaných hovorov skupinám...</p>
          </div>
        ) : (filteredCalls || []).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {statusFilter === 'all' ? 'Žiadne zaplánované hovory skupinám' : 'Žiadne hovory pre vybraný filter'}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'all' 
                ? 'Zatiaľ nemáte žiadne zaplánované hovory skupinám' 
                : 'Pre vybraný filter nie sú žiadne hovory skupinám'}
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skupina/Kontakt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Čas hovoru
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stav
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pokusy
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skript
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcie
                    </th>
                </tr>

              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredCalls || []).map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {getGroupName(call.group_id).split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getGroupName(call.group_id)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getGroupContacts(call.group_id).length} контактів
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {call.scheduled_time 
                          ? formatDateTime(call.scheduled_time)
                          : (call.start_time_window && call.end_time_window
                              ? `${formatDateTime(call.start_time_window)} - ${formatDateTime(call.end_time_window)}`
                              : 'N/A')
                        }
                      </div>
                      {call.next_retry_at && (
                        <div className="text-xs text-orange-600">
                          Ďalší pokus: {formatDateTime(call.next_retry_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        call.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        call.status === 'completed' ? 'bg-green-100 text-green-800' :
                        call.status === 'failed' ? 'bg-red-100 text-red-800' :
                        call.status === 'retrying' ? 'bg-orange-100 text-orange-800' :
                        call.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {call.status === 'pending' ? 'Čakajúci' :
                         call.status === 'completed' ? 'Dokončený' :
                         call.status === 'failed' ? 'Zlyhal' :
                         call.status === 'retrying' ? 'Opakuje sa' :
                         call.status === 'cancelled' ? 'Zrušený' : call.status}
                      </span>
                      
                      {call.retry_until_success && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 0h2v2H9V5zm6 0h-2v2h2V5z" clipRule="evenodd" />
                          </svg>
                          Повторять
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {call.call_attempts || 0} pokusov

                      </div>
                      {call.call_attempts > 0 && call.last_attempt_at && (
                        <div className="text-xs text-gray-500">
                          Последняя: {formatDateTime(call.last_attempt_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {call.script || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => {
                            // Здесь можно добавить вызов немедленного звонка группе
                            console.log('Call group now:', call.group_id)
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors rounded-lg hover:bg-gray-100 p-2"
                          title="Позвонить группе сейчас"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate(`/edit-group-call/${call.id}`)}
                          className="text-blue-600 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100 p-2"
                          title="Редактировать"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCall(call.id)}
                          className="text-red-600 hover:text-red-900 transition-colors rounded-lg hover:bg-gray-100 p-2"
                          title="Удалить"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}