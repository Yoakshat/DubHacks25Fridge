import { Link } from 'react-router-dom'
import '../styles/NavBar.css'

export default function NavBar() {
  return (
    <nav className="app-nav">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/alice">Alice</Link>
      <Link className="nav-link" to="/bob">Bob</Link>
      <Link className="nav-link" to="/kidsCreation">Kid's Creation</Link>
    </nav>
  )
}