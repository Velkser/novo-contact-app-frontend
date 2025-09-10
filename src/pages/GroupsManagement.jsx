// src/pages/GroupsManagement.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function GroupsManagement() {
  const navigate = useNavigate()
  const groups = useContactStore((state) => state.groups) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const fetchGroups = useContactStore((state) => state.fetchGroups)
  const createGroup = useContactStore((state) => state.createGroup)
  const updateGroup = useContactStore((state) => state.updateGroup)
  const deleteGroup = useContactStore((state) => state.deleteGroup)
  const addGroupMember = useContactStore((state) => state.addGroupMember)
  const removeGroupMember = useContactStore((state) => state.removeGroupMember)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [addingMemberGroupId, setAddingMemberGroupId] = useState(null)
  const [newGroup, setNewGroup] = useState({ name: '', description: '' })
  const [selectedContact, setSelectedContact] = useState('')
  const [newTag, setNewTag] = useState('')

  // Загружаем группы при монтировании
  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    try {
      await createGroup(newGroup)
      setNewGroup({ name: '', description: '' })
      setIsCreating(false)
    } catch (err) {
      console.error('Error creating group:', err)
      alert(`❌ Chyba vytvárania skupiny: ${err.message}`)
    }
  }

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Naozaj chcete odstrániť túto skupinu?')) {
      try {
        await deleteGroup(id)
      } catch (err) {
        console.error('Error deleting group:', err)
        alert(`❌ Chyba mazania skupiny: ${err.message}`)
      }
    }
  }

  const handleAddMember = async (groupId) => {
    if (selectedContact) {
      try {
        await addGroupMember(groupId, parseInt(selectedContact))
        setSelectedContact('')
        setAddingMemberGroupId(null)
      } catch (err) {
        console.error('Error adding member:', err)
        alert(`❌ Chyba pridávania člena: ${err.message}`)
      }
    }
  }

  const handleRemoveMember = async (groupId, contactId) => {
    try {
      await removeGroupMember(groupId, contactId)
    } catch (err) {
      console.error('Error removing member:', err)
      alert(`❌ Chyba odstraňovania člena: ${err.message}`)
    }
  }

  // Функция для получения контактов группы
  const getGroupContacts = (groupId) => {
    const group = groups.find(g => g.id === groupId)
    if (!group || !group.members) return []
    
    return group.members.map(member => 
      contacts.find(c => c.id === member.contact_id)
    ).filter(c => c)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Správa skupín</h1>
          <p className="text-gray-600 mt-1">Vytvárajte a spravujte skupiny kontaktov</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>+ Vytvoriť skupinu</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Форма создания группы */}
      {isCreating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vytvoriť novú skupinu</h2>
          
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Názov skupiny *
              </label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                className="input-field"
                placeholder="Napr. VIP klienti"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Popis (voliteľné)
              </label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                rows={3}
                className="input-field"
                placeholder="Popis skupiny..."
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn btn-primary disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Vytváram...' : 'Vytvoriť skupinu'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Zrušiť
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список групп */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítavanie skupín...</p>
          </div>
        ) : (groups || []).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Žiadne skupiny</h3>
            <p className="text-gray-500 mb-6">Zatiaľ nemáte žiadne skupiny kontaktov</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Späť na kontakty
              </button>
              <button 
                onClick={() => setIsCreating(true)}
                className="btn btn-success"
              >
                + Vytvoriť skupinu
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(groups || []).map((group) => {
              const groupContacts = getGroupContacts(group.id)
              
              return (
                <div key={group.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                      {group.description && (
                        <p className="text-gray-600 mt-1">{group.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {groupContacts.length} {groupContacts.length === 1 ? 'kontakt' : 'kontaktov'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/schedule-group-call/${group.id}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>Naplánovať hovor</span>
                      </button>
                      <button
                        onClick={() => setEditingGroupId(
                          editingGroupId === group.id ? null : group.id
                        )}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Форма добавления участника */}
                  <div className="mb-4">
                    <button
                      onClick={() => setAddingMemberGroupId(
                        addingMemberGroupId === group.id ? null : group.id
                      )}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {addingMemberGroupId === group.id ? 'Zrušiť' : '+ Pridať kontakt do skupiny'}
                    </button>
                    
                    {addingMemberGroupId === group.id && (
                      <div className="mt-3 flex gap-2">
                        <select
                          value={selectedContact}
                          onChange={(e) => setSelectedContact(e.target.value)}
                          className="input-field text-sm py-1 px-3 flex-1"
                          disabled={loading}
                        >
                          <option value="">-- Vyberte kontakt --</option>
                          {contacts
                            .filter(c => !groupContacts.some(gc => gc.id === c.id))
                            .map(contact => (
                              <option key={contact.id} value={contact.id}>
                                {contact.name} ({contact.phone})
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => handleAddMember(group.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                          disabled={loading || !selectedContact}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Список контактов в группе */}
                  <div className="space-y-3">
                    {groupContacts.length > 0 ? (
                      groupContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                              {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-500">{contact.phone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(group.id, contact.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Odstrániť zo skupiny"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Zatiaľ nie sú žiadne kontakty v tejto skupine</p>
                    )}
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