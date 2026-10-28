import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import AuthorityHome from './pages/AuthorityHome'
import AdminHome from './pages/AdminHome'
const LOGIN = { citizen: '/login/user', authority: '/login/authority', admin: '/admin-login' }
function Guard({ role, children }) {
  const { ready, role: mine } = useAuth()
  if (!ready) return <p className="p-6">Loading…</p>
  return mine === role ? children : <Navigate to={LOGIN[role]} replace />
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/user" element={<Login role="citizen" />} />
        <Route path="/login/authority" element={<Login role="authority" />} />
        <Route path="/admin-login" element={<Login role="admin" />} />
        <Route path="/user" element={<Guard role="citizen"><UserHome /></Guard>} />
        <Route path="/authority" element={<Guard role="authority"><AuthorityHome /></Guard>} />
        <Route path="/admin" element={<Guard role="admin"><AdminHome /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
