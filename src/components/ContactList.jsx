import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ContactList({ contacts }) {
  // Если contacts не передан, используем пустой массив
  const contactsToShow = contacts || []

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {contactsToShow.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="text-5xl mb-4">📇</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {contacts && contacts.length > 0 ? 'Žiadne výsledky' : 'Žiadne kontakty'}
          </h3>
          <p className="text-gray-500 mb-4">
            {contacts && contacts.length > 0 
              ? 'Vašim kritériám nezodpovedajú žiadne kontakty' 
              : 'Zatiaľ nemáte žiadne kontakty v databáze'
            }
          </p>
          <Link 
            to="/add" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            + Pridať prvý kontakt
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactsToShow.map((contact) => (
            <motion.div
              key={contact.id}
              variants={item}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-blue-600 font-medium">{contact.phone}</p>
                </div>
                <div className="flex space-x-1">
                  <Link
                    to={`/view/${contact.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                    title="Zobraziť detail"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link
                    to={`/edit/${contact.id}`}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                    title="Upraviť"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {contact.email && (
                <p className="text-gray-600 text-sm mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {contact.email}
                </p>
              )}
              
              {contact.company && (
                <p className="text-gray-600 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  {contact.company}
                </p>
              )}
              
              {/* Отображаем теги */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                  {contact.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{contact.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}