// src/pages/ScheduledCalls.jsx
import { useState, useEffect } from 'react'
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ScheduledCalls() {
  const navigate = useNavigate()
  const scheduledCalls = useContactStore((state) => state.scheduledCalls) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const fetchScheduledCalls = useContactStore((state) => state.fetchScheduledCalls)
  const updateScheduledCall = useContactStore((state) => state.updateScheduledCall)
  const deleteScheduledCall = useContactStore((state) => state.deleteScheduledCall)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingCallId, setEditingCallId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchScheduledCalls()
  }, [fetchScheduledCalls])

  const filteredCalls = (scheduledCalls || []).filter(call => {
    if (statusFilter === 'all') return true
    return call.status === statusFilter
  })

  const getContactName = (contactId) => {
    if (!contacts || contacts.length === 0) return 'Neznámy kontakt'
    const contact = contacts.find(c => c.id === parseInt(contactId))
    return contact ? contact.name : 'Neznámy kontakt'
  }

  const getContactPhone = (contactId) => {
    if (!contacts || contacts.length === 0) return ''
    const contact = contacts.find(c => c.id === parseInt(contactId))
    return contact ? contact.phone : ''
  }

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

  const startEditing = (call) => {
    setEditingCallId(call.id)
    setEditForm({
      scheduled_time: call.scheduled_time ? call.scheduled_time.slice(0, 16) : '',
      start_time_window: call.start_time_window ? call.start_time_window.slice(0, 16) : '',
      end_time_window: call.end_time_window ? call.end_time_window.slice(0, 16) : '',
      script: call.script || '',
      notes: call.notes || '',
      retry_until_success: call.retry_until_success || false,
      retry_interval: call.retry_interval || 60
    })
  }

  const cancelEditing = () => {
    setEditingCallId(null)
    setEditForm({})
  }

  const saveChanges = async (callId) => {
    try {
      const updateData = {
        ...editForm,
        scheduled_time: editForm.scheduled_time ? new Date(editForm.scheduled_time).toISOString() : null,
        start_time_window: editForm.start_time_window ? new Date(editForm.start_time_window).toISOString() : null,
        end_time_window: editForm.end_time_window ? new Date(editForm.end_time_window).toISOString() : null,
        script: editForm.script || null,
        notes: editForm.notes || null,
        retry_until_success: editForm.retry_until_success,
        retry_interval: editForm.retry_interval
      }
      await updateScheduledCall(callId, updateData)
      setEditingCallId(null)
      setEditForm({})
    } catch (error) {
      console.error('Error updating scheduled call:', error)
      alert(`❌ Chyba aktualizácie hovoru: ${error.message}`)
    }
  }

  const handleDeleteCall = async (callId) => {
    if (window.confirm('Naozaj chcete odstrániť tento naplánovaný hovor?')) {
      try {
        await deleteScheduledCall(callId)
      } catch (error) {
        console.error('Error deleting scheduled call:', error)
        alert(`❌ Chyba mazania hovoru: ${error.message}`)
      }
    }
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setEditForm({ ...editForm, [name]: newValue })
  }

  return (
    <div className="max-w-full mx-auto px-2">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Naplánované hovory</h1>
          <p className="text-gray-600 mt-1">Správa naplánovaných hovorov</p>
        </div>
        <Link
          to="/schedule-call"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <span>+ Naplánovať hovor</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtre */}
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
            Filtrované: {(scheduledCalls || []).filter(c => c.status === statusFilter).length} z {(scheduledCalls || []).length}
          </div>
        )}
      </div>

      {/* Seznam hovory */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítavanie zaplánovaných hovorov...</p>
          </div>
        ) : (filteredCalls || []).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {statusFilter === 'all' ? 'Žiadne naplánované hovory' : 'Žiadne hovory pre vybraný filter'}
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'all' ? 'Zatiaľ nemáte žiadne naplánované hovory' : 'Pre vybraný filter nie sú žiadne hovory'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt/Skupina</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Čas hovoru</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opakovanie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skript</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcie</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredCalls || []).map((call) => (
                <React.Fragment key={call.id}>
                  {/* Hovor */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {getContactName(call.contact_id).split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{getContactName(call.contact_id)}</div>
                          <div className="text-sm text-gray-500">{getContactPhone(call.contact_id)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {call.scheduled_time ? (
                        <div>
                          <div className="text-sm text-gray-900">Presný čas: {formatDateTime(call.scheduled_time)}</div>
                          {call.next_retry_at && <div className="text-xs text-orange-600">Ďalší pokus: {formatDateTime(call.next_retry_at)}</div>}
                        </div>
                      ) : call.start_time_window && call.end_time_window ? (
                        <div>
                          <div className="text-sm text-gray-900">Časové okno: {formatDateTime(call.start_time_window)} - {formatDateTime(call.end_time_window)}</div>
                          {call.next_retry_at && <div className="text-xs text-orange-600">Ďalší pokus: {formatDateTime(call.next_retry_at)}</div>}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Neznámy typ</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        call.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        call.status === 'completed' ? 'bg-green-100 text-green-800' :
                        call.status === 'failed' ? 'bg-red-100 text-red-800' :
                        call.status === 'retrying' ? 'bg-orange-100 text-orange-800' :
                        call.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {call.status === 'pending' ? 'Čakajúci' :
                         call.status === 'completed' ? 'Dokončený' :
                         call.status === 'failed' ? 'Zlyhal' :
                         call.status === 'retrying' ? 'Opakuje sa' :
                         call.status === 'cancelled' ? 'Zrušený' : call.status}
                      </span>
                      {call.retry_until_success && <div className="text-xs text-green-600 mt-1">Opakovať</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{call.call_attempts || 0} pokusov</div>
                      {call.call_attempts > 0 && call.last_attempt_at && (
                        <div className="text-xs text-gray-500">Posledný: {formatDateTime(call.last_attempt_at)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-full truncate">{call.script || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => console.log('Call now:', call.contact_id)} className="text-blue-600 hover:text-blue-900 transition-colors rounded-lg hover:bg-gray-100 p-2" title="Zavolať teraz">📞</button>
                        <button onClick={() => startEditing(call)} className="text-blue-600 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100 p-2" title="Upraviť">✏️</button>
                        <button onClick={() => handleDeleteCall(call.id)} className="text-red-600 hover:text-red-900 transition-colors rounded-lg hover:bg-gray-100 p-2" title="Odstrániť">🗑️</button>
                      </div>
                    </td>
                  </tr>

                  {/* Form edit */}
                  {editingCallId === call.id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4">
                        <div className="bg-white rounded-lg border border-yellow-200 p-4 max-w-full overflow-x-auto">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Upraviť hovor</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Dátum a čas hovoru</label>
                              <input type="datetime-local" name="scheduled_time" value={editForm.scheduled_time || ''} onChange={handleEditChange} className="input-field" disabled={loading} min={new Date().toISOString().slice(0, 16)} />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Skript</label>
                              <textarea name="script" value={editForm.script || ''} onChange={handleEditChange} rows={4} className="input-field" placeholder="Skript pre hovor..." disabled={loading} />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Opakovať do úspechu</label>
                              <label className="inline-flex items-center">
                                <input type="checkbox" name="retry_until_success" checked={editForm.retry_until_success || false} onChange={handleEditChange} className="form-checkbox" disabled={loading} />
                                <span className="ml-2 text-sm text-gray-700">Áno</span>
                              </label>
                            </div>
                            {editForm.retry_until_success && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Interval opakovania (min)</label>
                                <select name="retry_interval" value={editForm.retry_interval || 60} onChange={handleEditChange} className="input-field" disabled={loading}>
                                  <option value={30}>30 minút</option>
                                  <option value={60}>1 hodina</option>
                                  <option value={120}>2 hodiny</option>
                                  <option value={240}>4 hodiny</option>
                                  <option value={1440}>1 deň</option>
                                </select>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-3">
                                                       <button
                              onClick={() => saveChanges(call.id)}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                              disabled={loading}
                            >
                              {loading ? 'Ukladám...' : 'Uložiť zmeny'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                              disabled={loading}
                            >
                              Zrušiť
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

