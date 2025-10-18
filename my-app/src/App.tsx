// ...existing code...
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Alice from './pages/Alice'
import TestUploadPage from './pages/TestUploadPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alice" element={<Alice />} />
          <Route path="/firebase" element={<TestUploadPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App