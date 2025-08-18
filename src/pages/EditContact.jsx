import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function EditContact() {
  const navigate = useNavigate()
  const { id } = useParams()
  const contacts = useContactStore((state) => state.contacts)
  const updateContact = useContactStore((state) => state.updateContact)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    script: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const contact = contacts.find(c => c.id === parseInt(id))
    if (contact) {
      setFormData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        company: contact.company || '',
        script: contact.script || '',
        tags: contact.tags || []
      })
    } else {
      navigate('/')
    }
  }, [id, contacts, navigate])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Meno je povinné'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefón je povinný'
    } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Neplatné telefónne číslo'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neplatný email'
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

  const handleAddTag = (e) => {
    e.preventDefault()
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      updateContact(parseInt(id), {
        ...formData,
        tags: formData.tags
      })
      navigate('/')
    }
  }

  if (!formData.name) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="text-2xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Načítavanie...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upraviť kontakt</h1>
        <p className="text-gray-600">Upravte údaje o kontakte</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meno a priezvisko *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Napr. Ján Novák"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefónne číslo *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="Napr. +421 901 234 567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Napr. jan.novak@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Spoločnosť
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Napr. ABC s.r.o."
            />
          </div>

          {/* Теги */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tagy
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-purple-600 hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Pridať tag..."
                className="input-field text-sm py-1 px-3 flex-1"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                +
              </button>
            </form>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agent Script
            </label>
            <textarea
              name="script"
              value={formData.script}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Napíšte skript, ktorý bude agent používať pri hovore..."
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Späť
            </button>
            <button
              type="submit"
              className="btn btn-success"
            >
              Uložiť zmeny
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}