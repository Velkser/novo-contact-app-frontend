// src/pages/AddContact.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function AddContact() {
  const navigate = useNavigate()
  const addContact = useContactStore((state) => state.addContact)
  const promptTemplates = useContactStore((state) => state.promptTemplates)
  const fetchPromptTemplates = useContactStore((state) => state.fetchPromptTemplates)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
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

  // Загружаем шаблоны при монтировании
  useEffect(() => {
    fetchPromptTemplates()
  }, [fetchPromptTemplates])

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
    e.preventDefault() // Предотвращаем отправку основной формы
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

  // Функция для применения шаблона
  const handleApplyTemplate = (templateId) => {
    const template = promptTemplates.find(t => t.id === templateId)
    if (template) {
      setFormData({
        ...formData,
        script: template.content
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await addContact(formData)
        navigate('/')
      } catch (err) {
        console.error('Error adding contact:', err)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pridať nový kontakt</h1>
        <p className="text-gray-600">Vyplňte údaje o kontakte</p>
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
              Meno a priezvisko *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Napr. Ján Novák"
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Выбор шаблона */}
          {promptTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vybrať šablónu (voliteľné)
              </label>
              <select
                onChange={(e) => handleApplyTemplate(parseInt(e.target.value))}
                className="input-field"
                value=""
              >
                <option value="">-- Vyberte šablónu --</option>
                {promptTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Môžete vybrať existujúcu šablónu alebo vytvoriť vlastný skript nižšie
              </p>
            </div>
          )}

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
                    type="button" // ← Важно: type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-purple-600 hover:text-purple-900"
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {/* Используем div вместо form для добавления тегов */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Pridať tag..."
                className="input-field text-sm py-1 px-3 flex-1"
                disabled={loading}
              />
              <button
                type="button" // ← Важно: type="button"
                onClick={handleAddTag}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agent Script (voliteľné)
            </label>
            <textarea
              name="script"
              value={formData.script}
              onChange={handleChange}
              rows={6}
              className="input-field"
              placeholder="Napíšte skript, ktorý bude agent používať pri hovore... alebo vyberte šablónu vyššie"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
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
              {loading ? 'Pridáva sa...' : 'Pridať kontakt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}