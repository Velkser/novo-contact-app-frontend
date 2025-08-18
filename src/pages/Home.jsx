import ContactList from '../components/ContactList'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Moje kontakty</h1>
        <Link
          to="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Pridať kontakt
        </Link>
      </div>
      <ContactList />
    </div>
  )
}