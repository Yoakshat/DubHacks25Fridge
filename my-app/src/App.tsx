// ...existing code...
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Alice from './pages/Alice'
import Signup from './pages/Signup'
import Login from './pages/Login'
import TestUploadPage from './pages/TestUploadPage'
import Fridge from './pages/Fridge'
import Auction from './pages/Auction'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alice" element={<Alice />} />
          <Route path="/firebase" element={<TestUploadPage />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/fridge" element={<Fridge/>} />
          <Route path="/auction" element={<Auction/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App