// src/pages/ScheduleGroupCall.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function ScheduleGroupCall() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const groups = useContactStore((state) => state.groups) || []
  const contacts = useContactStore((state) => state.contacts) || []
  const promptTemplates = useContactStore((state) => state.promptTemplates) || []
  const fetchPromptTemplates = useContactStore((state) => state.fetchPromptTemplates)
  const addScheduledGroupCall = useContactStore((state) => state.addScheduledGroupCall)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const group = groupId ? groups.find(g => g.id === parseInt(groupId)) : null
  const groupContacts = group ? 
    (group.members || []).map(member => 
      contacts.find(c => c.id === member.contact_id)
    ).filter(c => c) : []
  
  const [formData, setFormData] = useState({
    group_id: groupId ? parseInt(groupId) : '',
    start_time_window: '',
    end_time_window: '',
    script: group?.script || '',
    notes: '',
    retry_until_success: false,
    retry_interval: 60
  })
  const [errors, setErrors] = useState({})

  // Загружаем шаблоны при монтировании
  useEffect(() => {
    fetchPromptTemplates()
  }, [fetchPromptTemplates])

  // Устанавливаем группу при наличии groupId
  useEffect(() => {
    if (group) {
      setFormData(prev => ({
        ...prev,
        group_id: group.id,
        script: group.script || ''
      }))
    }
  }, [group])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.group_id) {
      newErrors.group_id = 'Skupina je povinná'
    }
    
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
        const callData = {
          group_id: parseInt(formData.group_id),
          start_time_window: new Date(formData.start_time_window).toISOString(),
          end_time_window: new Date(formData.end_time_window).toISOString(),
          script: formData.script || null,
          notes: formData.notes || null,
          retry_until_success: formData.retry_until_success,
          retry_interval: formData.retry_interval
        }
        
        await addScheduledGroupCall(callData)
        navigate('/groups')
      } catch (err) {
        console.error('Error scheduling group call:', err)
        alert(`❌ Chyba plánovania hovoru: ${err.message}`)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Naplánovať hovor pre skupinu</h1>
        <p className="text-gray-600 mt-1">Naplánujte hovor pre celú skupinu kontaktov</p>
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
              Skupina *
            </label>
            <select
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              className={`input-field ${errors.group_id ? 'border-red-500' : ''}`}
              disabled={loading || groupId}
            >
              <option value="">-- Vyberte skupinu --</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.members?.length || 0} kontaktov)
                </option>
              ))}
            </select>
            {errors.group_id && (
              <p className="mt-1 text-sm text-red-600">{errors.group_id}</p>
            )}
            
            {/* Информация о контактах в группе */}
            {groupContacts.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Kontakty v skupine ({groupContacts.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupContacts.slice(0, 5).map(contact => (
                    <span key={contact.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  ))}
                  {groupContacts.length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{groupContacts.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Временное окно */}
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
              rows={6}
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
              placeholder="Doplňujúce poznámky..."
              disabled={loading}
            />
          </div>

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
            <p className="mt-1 text-sm text-gray-500">
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
              {loading ? 'Plánujem...' : 'Naplánovať hovor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// // src/pages/ScheduleGroupCall.jsx
// import { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import useContactStore from '../store/useContactStore'

// export default function ScheduleGroupCall() {
//   const navigate = useNavigate()
//   const { groupId } = useParams()
//   const groups = useContactStore((state) => state.groups)
//   const contacts = useContactStore((state) => state.contacts)
//   const addScheduledGroupCall = useContactStore((state) => state.addScheduledGroupCall)
//   const loading = useContactStore((state) => state.loading)
//   const error = useContactStore((state) => state.error)
  
//   const group = groupId ? groups.find(g => g.id === parseInt(groupId)) : null
  
//   const [formData, setFormData] = useState({
//     group_id: groupId ? parseInt(groupId) : '',
//     scheduled_time: '',
//     script: group?.script || '',
//     notes: '',
//     retry_until_success: false,
//     retry_interval: 60
//   })
//   const [errors, setErrors] = useState({})

//   // Получаем контакты группы
//   const getGroupContacts = () => {
//     if (!group || !group.members) return []
//     return group.members.map(member => 
//       contacts.find(c => c.id === member.contact_id)
//     ).filter(c => c)
//   }

//   const groupContacts = getGroupContacts()

//   const validateForm = () => {
//     const newErrors = {}
    
//     if (!formData.group_id) {
//       newErrors.group_id = 'Skupina je povinná'
//     }
    
//     if (!formData.scheduled_time) {
//       newErrors.scheduled_time = 'Dátum a čas sú povinné'
//     } else {
//       const scheduledTime = new Date(formData.scheduled_time)
//       const now = new Date()
//       if (scheduledTime < now) {
//         newErrors.scheduled_time = 'Dátum a čas musia byť v budúcnosti'
//       }
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     const newValue = type === 'checkbox' ? checked : value
    
//     setFormData({
//       ...formData,
//       [name]: newValue
//     })
    
//     // Очищаем ошибку при изменении поля
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (validateForm()) {
//       try {
//         const callData = {
//           group_id: parseInt(formData.group_id),
//           scheduled_time: new Date(formData.scheduled_time).toISOString(),
//           script: formData.script || null,
//           notes: formData.notes || null,
//           retry_until_success: formData.retry_until_success,
//           retry_interval: formData.retry_interval
//         }
        
//         await addScheduledGroupCall(callData)
//         navigate('/groups')
//       } catch (err) {
//         console.error('Error scheduling group call:', err)
//         alert(`❌ Chyba plánovania hovoru: ${err.message}`)
//       }
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Naplánovať hovor pre skupinu</h1>
//         <p className="text-gray-600 mt-1">Naplánujte hovor pre celú skupinu kontaktov</p>
//       </div>
      
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Skupina *
//             </label>
//             <select
//               name="group_id"
//               value={formData.group_id}
//               onChange={handleChange}
//               className={`input-field ${errors.group_id ? 'border-red-500' : ''}`}
//               disabled={loading || groupId}
//             >
//               <option value="">-- Vyberte skupinu --</option>
//               {groups.map(group => (
//                 <option key={group.id} value={group.id}>
//                   {group.name} ({getGroupContacts(group.id).length} kontaktov)
//                 </option>
//               ))}
//             </select>
//             {errors.group_id && (
//               <p className="mt-1 text-sm text-red-600">{errors.group_id}</p>
//             )}
            
//             {/* Информация о контактах в группе */}
//             {groupContacts.length > 0 && (
//               <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Kontakty v skupine ({groupContacts.length}):
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {groupContacts.slice(0, 5).map((contact, index) => (
//                     <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                     </span>
//                   ))}
//                   {groupContacts.length > 5 && (
//                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       +{groupContacts.length - 5}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Dátum a čas hovoru *
//             </label>
//             <input
//               type="datetime-local"
//               name="scheduled_time"
//               value={formData.scheduled_time}
//               onChange={handleChange}
//               className={`input-field ${errors.scheduled_time ? 'border-red-500' : ''}`}
//               disabled={loading}
//               min={new Date().toISOString().slice(0, 16)}
//             />
//             {errors.scheduled_time && (
//               <p className="mt-1 text-sm text-red-600">{errors.scheduled_time}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Skript (voliteľné)
//             </label>
//             <textarea
//               name="script"
//               value={formData.script}
//               onChange={handleChange}
//               rows={6}
//               className="input-field"
//               placeholder="Napíšte skript, ktorý bude agent používať pri hovore..."
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Poznámky (voliteľné)
//             </label>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               rows={3}
//               className="input-field"
//               placeholder="Doplňujúce poznámky..."
//               disabled={loading}
//             />
//           </div>

//           {/* Опция повторных звонков */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 name="retry_until_success"
//                 checked={formData.retry_until_success}
//                 onChange={handleChange}
//                 className="form-checkbox"
//                 disabled={loading}
//               />
//               <span className="ml-2 text-sm font-medium text-gray-700">
//                 Opakovať hovory, kým sa nepodarí dostať sa k klientovi
//               </span>
//             </label>
//             <p className="mt-1 text-sm text-gray-500">
//               Ak hovor zlyhá, systém automaticky skúsi zavolať znova
//             </p>
            
//             {formData.retry_until_success && (
//               <div className="mt-3">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Interval opakovania (minúty)
//                 </label>
//                 <select
//                   name="retry_interval"
//                   value={formData.retry_interval}
//                   onChange={handleChange}
//                   className="input-field"
//                   disabled={loading}
//                 >
//                   <option value={30}>Každých 30 minút</option>
//                   <option value={60}>Každú hodinu</option>
//                   <option value={120}>Každé 2 hodiny</option>
//                   <option value={240}>Každé 4 hodiny</option>
//                   <option value={1440}>Raz denne</option>
//                 </select>
//               </div>
//             )}
//           </div>

//           <div className="flex space-x-4 pt-6">
//             <button
//               type="button"
//               onClick={() => navigate('/groups')}
//               className="btn btn-secondary"
//               disabled={loading}
//             >
//               Späť
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Plánujem...' : 'Naplánovať hovor'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }