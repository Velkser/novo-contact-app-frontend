// src/pages/EditGroup.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function EditGroup() {
  const navigate = useNavigate()
  const { id } = useParams()
  const groups = useContactStore((state) => state.groups) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const updateGroup = useContactStore((state) => state.updateGroup)
  const deleteGroup = useContactStore((state) => state.deleteGroup)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const group = groups.find(g => g.id === parseInt(id))
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_ids: []
  })
  const [errors, setErrors] = useState({})

  // Инициализируем форму данными группы
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        contact_ids: group.members ? group.members.map(m => m.contact_id) : []
      })
    }
  }, [group])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Názov skupiny je povinný'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleContactToggle = (contactId) => {
    setFormData(prev => {
      const isSelected = prev.contact_ids.includes(contactId)
      return {
        ...prev,
        contact_ids: isSelected 
          ? prev.contact_ids.filter(id => id !== contactId)
          : [...prev.contact_ids, contactId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await updateGroup(parseInt(id), {
          name: formData.name,
          description: formData.description,
          contact_ids: formData.contact_ids
        })
        navigate('/groups')
      } catch (err) {
        console.error('Error updating group:', err)
        alert(`❌ Chyba aktualizácie skupiny: ${err.message}`)
      }
    }
  }

  const handleDeleteGroup = async () => {
    if (window.confirm('Naozaj chcete odstrániť túto skupinu?')) {
      try {
        await deleteGroup(parseInt(id))
        navigate('/groups')
      } catch (err) {
        console.error('Error deleting group:', err)
        alert(`❌ Chyba mazania skupiny: ${err.message}`)
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upraviť skupinu</h1>
        <p className="text-gray-600 mt-1">Upravte údaje o skupine</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Názov skupiny *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Napr. VIP klienti"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Popis (voliteľné)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Popis skupiny..."
              disabled={loading}
            />
          </div>

          {/* Выбор контактов для группы */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vybrať kontakty do skupiny
            </label>
            <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c.656-.126 1.283-.356 1.857M7 20v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <p>Žiadne kontakty na výber</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map(contact => (
                    <label key={contact.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.contact_ids.includes(contact.id)}
                        onChange={() => handleContactToggle(contact.id)}
                        className="form-checkbox"
                        disabled={loading}
                      />
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Vybrané kontakty: {formData.contact_ids.length}
            </p>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Späť
            </button>
            <button
              type="button"
              onClick={handleDeleteGroup}
              className="btn btn-danger disabled:opacity-50"
              disabled={loading}
            >
              Vymazať skupinu
            </button>
            <button
              type="submit"
              className="btn btn-success disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Ukladám...' : 'Uložiť zmeny'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}