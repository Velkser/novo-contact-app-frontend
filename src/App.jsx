import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddContact from './pages/AddContact'
import EditContact from './pages/EditContact'
import ViewContact from './pages/ViewContact'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddContact />} />
            <Route path="/edit/:id" element={<EditContact />} />
            <Route path="/view/:id" element={<ViewContact />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App