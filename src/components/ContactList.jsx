import useContactStore from '../store/useContactStore'
import { Link } from 'react-router-dom'

export default function ContactList() {
  const { contacts, deleteContact } = useContactStore()

  return (
    <div className="space-y-4">
      {contacts.length === 0 ? (
        <p className="text-gray-500">Žiadne kontakty. Pridajte prvý kontakt.</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div>
              <h3 className="font-semibold text-lg">{contact.name}</h3>
              <p className="text-gray-600">{contact.phone}</p>
              {contact.company && <p className="text-sm text-gray-500">{contact.company}</p>}
            </div>
            <div className="space-x-2">
              <Link
                to={`/view/${contact.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Zobraziť
              </Link>
              <Link
                to={`/edit/${contact.id}`}
                className="text-green-600 hover:underline text-sm"
              >
                Upraviť
              </Link>
              <button
                onClick={() => deleteContact(contact.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Vymazať
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}