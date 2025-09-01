// src/pages/PromptTemplates.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'

export default function PromptTemplates() {
  const navigate = useNavigate()
  const fetchPromptTemplates = useContactStore((state) => state.fetchPromptTemplates)
  const addPromptTemplate = useContactStore((state) => state.addPromptTemplate)
  const updatePromptTemplate = useContactStore((state) => state.updatePromptTemplate)
  const deletePromptTemplate = useContactStore((state) => state.deletePromptTemplate)
  const promptTemplates = useContactStore((state) => state.promptTemplates)
  const loading = useContactStore((state) => state.loading)
  const error = useContactStore((state) => state.error)
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  })

  useEffect(() => {
    fetchPromptTemplates()
  }, [fetchPromptTemplates])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await addPromptTemplate(formData)
      setFormData({ name: '', content: '' })
      setIsCreating(false)
    } catch (err) {
      console.error('Error creating template:', err)
    }
  }

  const handleUpdate = async (id, e) => {
    e.preventDefault()
    try {
      await updatePromptTemplate(id, formData)
      setEditingId(null)
      setFormData({ name: '', content: '' })
    } catch (err) {
      console.error('Error updating template:', err)
    }
  }

  const handleEdit = (template) => {
    setEditingId(template.id)
    setFormData({
      name: template.name,
      content: template.content
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Naozaj chcete odstrániť tento šablónu?')) {
      try {
        await deletePromptTemplate(id)
      } catch (err) {
        console.error('Error deleting template:', err)
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ name: '', content: '' })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Šablóny príkazov</h1>
          <p className="text-gray-600 mt-1">Spravujte svoje šablóny pre hovory</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Pridať šablónu</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Форма создания/редактирования */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isCreating ? 'Vytvoriť novú šablónu' : 'Upraviť šablónu'}
          </h2>
          
          <form onSubmit={isCreating ? handleCreate : (e) => handleUpdate(editingId, e)}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Názov šablóny *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder="Napr. Prvý kontakt"
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Obsah šablóny *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
                className="input-field"
                placeholder="Napíšte svoj príkaz pre hovor..."
                required
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Môžete použiť premenné ako &#123;&#123;meno&#125;&#125;, &#123;&#123;spoločnosť&#125;&#125;, &#123;&#123;téma&#125;&#125;
            </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn btn-primary disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (isCreating ? 'Vytváram...' : 'Ukladám...') : (isCreating ? 'Vytvoriť' : 'Uložiť')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={loading}
              >
                Zrušiť
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список шаблонов */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {promptTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Žiadne šablóny</h3>
            <p className="text-gray-500 mb-6">Zatiaľ nemáte žiadne šablóny príkazov</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              + Vytvoriť prvú šablónu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promptTemplates.map((template) => (
              <div key={template.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                      title="Upraviť"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                      title="Vymazať"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="text-gray-700 text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                  {template.content}
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  Vytvorené: {new Date(template.created_at).toLocaleDateString('sk-SK')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}