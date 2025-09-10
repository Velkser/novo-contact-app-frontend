// src/pages/AddGroup.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function AddGroup() {
  const navigate = useNavigate()
  const contacts = useContactStore((state) => state.contacts)
  const addGroup = useContactStore((state) => state.addGroup)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedContacts: []
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Názov skupiny je povinný'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData({
      ...formData,
      [name]: newValue
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
      const isSelected = prev.selectedContacts.includes(contactId)
      return {
        ...prev,
        selectedContacts: isSelected 
          ? prev.selectedContacts.filter(id => id !== contactId)
          : [...prev.selectedContacts, contactId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const groupData = {
          name: formData.name,
          description: formData.description,
          contact_ids: formData.selectedContacts
        }
        
        await addGroup(groupData)
        navigate('/groups')
      } catch (err) {
        console.error('Error adding group:', err)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vytvoriť novú skupinu</h1>
        <p className="text-gray-600 mt-1">Vytvorte skupinu kontaktov</p>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>Žiadne kontakty na výber</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map(contact => (
                    <label key={contact.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedContacts.includes(contact.id)}
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
              Vybrané kontakty: {formData.selectedContacts.length}
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
              type="submit"
              className="btn btn-primary disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Vytváram...' : 'Vytvoriť skupinu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}