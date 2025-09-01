// src/pages/ScheduleCall.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ScheduleCall() {
  const navigate = useNavigate()
  const { contactId } = useParams()
  const contacts = useContactStore((state) => state.contacts)
  const promptTemplates = useContactStore((state) => state.promptTemplates)
  const fetchPromptTemplates = useContactStore((state) => state.fetchPromptTemplates)
  const addScheduledCall = useContactStore((state) => state.addScheduledCall)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const contact = contactId ? contacts.find(c => c.id === parseInt(contactId)) : null
  
  const [formData, setFormData] = useState({
    contact_id: contactId ? parseInt(contactId) : '',
    scheduled_time: '',
    script: contact?.script || '',
    notes: ''
  })
  const [errors, setErrors] = useState({})

  // Загружаем шаблоны при монтировании
  useEffect(() => {
    fetchPromptTemplates()
  }, [fetchPromptTemplates])

  // Если есть contactId, устанавливаем скрипт из контакта
  useEffect(() => {
    if (contact && !formData.script) {
      setFormData(prev => ({
        ...prev,
        script: contact.script || '',
        contact_id: contact.id
      }))
    }
  }, [contact, formData.script])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.contact_id) {
      newErrors.contact_id = 'Kontakt je povinný'
    }
    
    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Dátum a čas sú povinné'
    } else {
      const scheduledTime = new Date(formData.scheduled_time)
      const now = new Date()
      if (scheduledTime < now) {
        newErrors.scheduled_time = 'Dátum a čas musia byť v budúcnosti'
      }
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
        await addScheduledCall({
          contact_id: parseInt(formData.contact_id),
          scheduled_time: new Date(formData.scheduled_time).toISOString(),
          script: formData.script,
          notes: formData.notes
        })
        navigate('/')
      } catch (err) {
        console.error('Error scheduling call:', err)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Naplánovať hovor</h1>
        <p className="text-gray-600">Naplánujte hovor s kontaktom</p>
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
              Kontakt *
            </label>
            <select
              name="contact_id"
              value={formData.contact_id}
              onChange={handleChange}
              className={`input-field ${errors.contact_id ? 'border-red-500' : ''}`}
              disabled={loading || contactId}
            >
              <option value="">-- Vyberte kontakt --</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} ({contact.phone})
                </option>
              ))}
            </select>
            {errors.contact_id && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dátum a čas hovoru *
            </label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              className={`input-field ${errors.scheduled_time ? 'border-red-500' : ''}`}
              disabled={loading}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.scheduled_time && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduled_time}</p>
            )}
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
                Môžete vybrať existujúcu šablónu alebo použiť skript z kontaktu
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skript
            </label>
            <textarea
              name="script"
              value={formData.script}
              onChange={handleChange}
              rows={6}
              className="input-field"
              placeholder="Skript pre hovor..."
              disabled={loading}
            />
            {contact && contact.script && (
              <p className="mt-1 text-sm text-gray-500">
                Automaticky načítaný skript z kontaktu: {contact.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poznámky
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Poznámky k hovoru..."
              disabled={loading}
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
              {loading ? 'Plánujem...' : 'Naplánovať hovor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}