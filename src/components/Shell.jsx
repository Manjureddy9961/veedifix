import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../api/auth'
const HOLD_MS = 3000 // long-press time on the logo to open the hidden admin login
export default function Shell({ children, title }) {
  const nav = useNavigate(), { user, profile } = useAuth(), t = useRef(), long = useRef(false)
  const down = () => { long.current = false; t.current = setTimeout(() => { long.current = true; nav('/admin-login') }, HOLD_MS) }
  const up = () => clearTimeout(t.current)
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-pri to-pri2 text-white px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl select-none cursor-pointer" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onContextMenu={(e) => e.preventDefault()} onClick={() => { if (!long.current) nav('/') }}><Logo />VeediFix</div>
          {user && <div className="flex items-center gap-3 text-sm"><span className="hidden sm:inline">{profile?.name || profile?.email}</span><button className="pill" onClick={async () => { await signOut(); nav('/') }}>Logout</button></div>}
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-3 pb-10">{title && <h1 className="text-2xl font-bold my-3">{title}</h1>}{children}</main>
    </div>
  )
}
