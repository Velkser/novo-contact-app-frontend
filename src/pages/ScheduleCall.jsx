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
    call_type: 'exact', // 'exact' или 'window'
    scheduled_time: '',
    start_time_window: '',
    end_time_window: '',
    retry_until_success: false,
    retry_interval: 60, // минуты между попытками
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
    
    if (formData.call_type === 'exact') {
      if (!formData.scheduled_time) {
        newErrors.scheduled_time = 'Dátum a čas sú povinné'
      } else {
        const scheduledTime = new Date(formData.scheduled_time)
        const now = new Date()
        if (scheduledTime < now) {
          newErrors.scheduled_time = 'Dátum a čas musia byť v budúcnosti'
        }
      }
    } else {
      if (!formData.start_time_window) {
        newErrors.start_time_window = 'Začiatok časového okna je povinný'
      }
      if (!formData.end_time_window) {
        newErrors.end_time_window = 'Koniec časového okna je povinný'
      }
      if (formData.start_time_window && formData.end_time_window) {
        const start = new Date(formData.start_time_window)
        const end = new Date(formData.end_time_window)
        const now = new Date()
        if (start < now) {
          newErrors.start_time_window = 'Začiatok okna musí byť v budúcnosti'
        }
        if (end <= start) {
          newErrors.end_time_window = 'Koniec okna musí byť neskôr ako začiatok'
        }
      }
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

  // Функция для применения шаблона
  const handleApplyTemplate = (templateId) => {
    const template = promptTemplates.find(t => t.id === parseInt(templateId))
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
        // Подготавливаем данные для отправки
        const callData = {
          contact_id: parseInt(formData.contact_id),
          call_type: formData.call_type,
          script: formData.script,
          notes: formData.notes,
          retry_until_success: formData.retry_until_success,
          retry_interval: formData.retry_interval
        }
        
        // Добавляем временные данные в зависимости от типа звонка
        if (formData.call_type === 'exact') {
          callData.scheduled_time = formData.scheduled_time
        } else {
          callData.start_time_window = formData.start_time_window
          callData.end_time_window = formData.end_time_window
        }
        
        console.log('Submitting call data:', callData)
        
        await addScheduledCall(callData)
        navigate('/')
      } catch (err) {
        console.error('Error scheduling call:', err)
        alert(`❌ Chyba plánovania hovoru: ${err.message}`)
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

          {/* Выбор типа звонка */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Typ hovoru *
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="call_type"
                  value="exact"
                  checked={formData.call_type === 'exact'}
                  onChange={handleChange}
                  className="form-radio"
                  disabled={loading}
                />
                <span className="ml-2">Presný čas</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="call_type"
                  value="window"
                  checked={formData.call_type === 'window'}
                  onChange={handleChange}
                  className="form-radio"
                  disabled={loading}
                />
                <span className="ml-2">Časové okno</span>
              </label>
            </div>
          </div>

          {/* Конкретное время звонка */}
          {formData.call_type === 'exact' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Presný dátum a čas hovoru *
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
          )}

          {/* Временное окно */}
          {formData.call_type === 'window' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Začiatok časového okna *
                </label>
                <input
                  type="datetime-local"
                  name="start_time_window"
                  value={formData.start_time_window}
                  onChange={handleChange}
                  className={`input-field ${errors.start_time_window ? 'border-red-500' : ''}`}
                  disabled={loading}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.start_time_window && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_time_window}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Koniec časového okna *
                </label>
                <input
                  type="datetime-local"
                  name="end_time_window"
                  value={formData.end_time_window}
                  onChange={handleChange}
                  className={`input-field ${errors.end_time_window ? 'border-red-500' : ''}`}
                  disabled={loading}
                  min={formData.start_time_window}
                />
                {errors.end_time_window && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_time_window}</p>
                )}
              </div>
            </div>
          )}

          {/* Опция повторных звонков */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="retry_until_success"
                checked={formData.retry_until_success}
                onChange={handleChange}
                className="form-checkbox"
                disabled={loading}
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Opakovať hovory, kým sa nepodarí dostať sa k klientovi
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-600">
              Ak hovor zlyhá, systém automaticky skúsi zavolať znova
            </p>
            
            {formData.retry_until_success && (
              <div className="mt-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interval opakovania (minúty)
                </label>
                <select
                  name="retry_interval"
                  value={formData.retry_interval}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value={30}>Každých 30 minút</option>
                  <option value={60}>Každú hodinu</option>
                  <option value={120}>Každé 2 hodiny</option>
                  <option value={240}>Každé 4 hodiny</option>
                  <option value={1440}>Raz denne</option>
                </select>
              </div>
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
              Skript (voliteľné)
            </label>
            <textarea
              name="script"
              value={formData.script}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Napíšte skript, ktorý bude agent používať pri hovore..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poznámky (voliteľné)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Doplňujúce poznámky k hovoru..."
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
              {loading ? 'Plánujem...' : 'Naplánovať hovor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}