import { useParams, useNavigate } from 'react-router-dom'
import useContactStore from '../store/useContactStore'
import { Link } from 'react-router-dom'

export default function ViewContact() {
  const navigate = useNavigate()
  const { id } = useParams()
  const contacts = useContactStore((state) => state.contacts)
  
  const contact = contacts.find(c => c.id === parseInt(id))

  if (!contact) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl text-gray-600">Kontakt nenájdený</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Späť na zoznam
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail kontaktu</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Meno a priezvisko</h2>
            <p className="text-gray-900">{contact.name}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Telefónne číslo</h2>
            <p className="text-gray-900">{contact.phone}</p>
          </div>

          {contact.email && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Email</h2>
              <p className="text-gray-900">{contact.email}</p>
            </div>
          )}

          {contact.company && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Spoločnosť</h2>
              <p className="text-gray-900">{contact.company}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Späť
          </button>
          <Link
            to={`/edit/${contact.id}`}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Upraviť
          </Link>
        </div>
      </div>
    </div>
  )
}