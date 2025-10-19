import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ScanPage from './pages/ScanPage'
import Fridge from './pages/Fridge'
import FridgeInsidePage from './pages/FridgeInsidePage'
import FriendsPage from './pages/FriendsPage'
import Auction from './pages/Auction'
import LoadCard from './pages/LoadCard'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/scan" element={<ScanPage/>} />
          <Route path="/fridge" element={<Fridge/>} />
          <Route path="/fridgeInside" element={<FridgeInsidePage/>} />
          <Route path="/friends" element={<FriendsPage/>} />
          <Route path="/auction" element={<Auction/>} />
          <Route path="/loadCard" element={<LoadCard/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App