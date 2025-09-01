// src/pages/ScheduledCalls.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ScheduledCalls() {
  const navigate = useNavigate()
  const scheduledCalls = useContactStore((state) => state.scheduledCalls)
  const fetchScheduledCalls = useContactStore((state) => state.fetchScheduledCalls)
  const deleteScheduledCall = useContactStore((state) => state.deleteScheduledCall)
  const updateScheduledCall = useContactStore((state) => state.updateScheduledCall)
  const contacts = useContactStore((state) => state.contacts)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)

  const [statusFilter, setStatusFilter] = useState('all')
  const [editingCallId, setEditingCallId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchScheduledCalls()
  }, [fetchScheduledCalls])

  // Функция для получения имени контакта по ID
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId)
    return contact ? contact.name : 'Neznámy kontakt'
  }

  // Функция для получения телефона контакта по ID
  const getContactPhone = (contactId) => {
    const contact = contacts.find(c => c.id === contactId)
    return contact ? contact.phone : ''
  }

  // Функция для форматирования даты
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

  // Фильтрация по статусу
  const filteredCalls = scheduledCalls.filter(call => {
    if (statusFilter === 'all') return true
    return call.status === statusFilter
  })

  // Обработчик удаления
  const handleDelete = async (callId) => {
    if (window.confirm('Naozaj chcete odstrániť tento naplánovaný hovor?')) {
      try {
        await deleteScheduledCall(callId)
      } catch (error) {
        console.error('Error deleting scheduled call:', error)
      }
    }
  }

  // Начало редактирования
  const startEditing = (call) => {
    setEditingCallId(call.id)
    setEditForm({
      scheduled_time: call.scheduled_time.slice(0, 16), // Форматируем для input datetime-local
      script: call.script || '',
      notes: call.notes || '',
      status: call.status
    })
  }

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingCallId(null)
    setEditForm({})
  }

  // Сохранение изменений
  const saveChanges = async (callId) => {
    try {
        await updateScheduledCall(callId, {
        scheduled_time: new Date(editForm.scheduled_time).toISOString(),
        script: editForm.script || '',
        notes: editForm.notes || '',
        status: editForm.status
        });
        setEditingCallId(null);
        setEditForm({});
    } catch (error) {
        console.error('Error updating scheduled call:', error);
    }
    }

  // Обработчик изменения формы редактирования
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
        ...editForm,
        [name]: value
    });
    }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plánované hovory</h1>
          <p className="text-gray-600 mt-1">Spravujte svoje naplánované hovory</p>
        </div>
        <Link
          to="/schedule-call"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>Naplánovať hovor</span>
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
            >
              <option value="all">Všetky</option>
              <option value="pending">Čakajúce</option>
              <option value="completed">Dokončené</option>
              <option value="failed">Zlyhané</option>
              <option value="cancelled">Zrušené</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список запланированных звонков */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítavanie plánovaných hovorov...</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {statusFilter === 'all' ? 'Žiadne plánované hovory' : 'Žiadne hovory pre vybraný filter'}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'all' 
                ? 'Zatiaľ nemáte žiadne naplánované hovory' 
                : 'Pre vybraný filter nie sú žiadne hovory'}
            </p>
            <Link
              to="/schedule-call"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              + Naplánovať prvý hovor
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dátum a čas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stav
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
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {getContactName(call.contact_id).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getContactName(call.contact_id)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getContactPhone(call.contact_id)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCallId === call.id ? (
                        <input
                          type="datetime-local"
                          name="scheduled_time"
                          value={editForm.scheduled_time}
                          onChange={handleEditChange}
                          className="input-field text-sm py-1"
                        />
                      ) : (
                        <div>
                          <div className="text-sm text-gray-900">
                            {formatDateTime(call.scheduled_time)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(call.scheduled_time) > new Date() 
                              ? `za ${Math.ceil((new Date(call.scheduled_time) - new Date()) / (1000 * 60))} minút` 
                              : 'Už prebehlo'}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCallId === call.id ? (
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="input-field text-sm py-1"
                        >
                          <option value="pending">Čakajúci</option>
                          <option value="completed">Dokončený</option>
                          <option value="failed">Zlyhal</option>
                          <option value="cancelled">Zrušený</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          call.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          call.status === 'completed' ? 'bg-green-100 text-green-800' :
                          call.status === 'failed' ? 'bg-red-100 text-red-800' :
                          call.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {call.status === 'pending' ? 'Čakajúci' :
                           call.status === 'completed' ? 'Dokončený' :
                           call.status === 'failed' ? 'Zlyhal' :
                           call.status === 'cancelled' ? 'Zrušený' : call.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                        {editingCallId === call.id ? (
                            <textarea
                            name="notes"
                            value={editForm.notes || ''}
                            onChange={handleEditChange}
                            rows={2}
                            className="input-field text-sm py-1 w-full"
                            placeholder="Poznámky..."
                            />
                        ) : (
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                            {call.notes || '-'}
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingCallId === call.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveChanges(call.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Uložiť"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                            title="Zrušiť"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(call)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Upraviť"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(call.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Vymazať"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
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