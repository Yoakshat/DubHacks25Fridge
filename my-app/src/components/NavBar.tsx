import { Link } from 'react-router-dom'
import '../styles/NavBar.css'

export default function NavBar() {
  return (
    <nav className="app-nav">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/alice">Alice</Link>
      <Link className="nav-link" to="/firebase">Firebase</Link>
      <Link className="nav-link" to="/signup">Signup</Link>
      <Link className="nav-link" to="/login">Login</Link>
      <Link className="nav-link" to="/scan">Scan</Link>
      <Link className="nav-link" to="/fridge">Fridge</Link>
    </nav>
  )
}