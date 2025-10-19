import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ScanPage from './pages/ScanPage';
import Fridge from './pages/Fridge';
import FridgeInsidePage from './pages/FridgeInsidePage';
import FriendsPage from './pages/FriendsPage';
import Auction from './pages/Auction';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/fridgeInside" element={<FridgeInsidePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/auction" element={<Auction />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;