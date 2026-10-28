import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../api/auth'
export const HOME = { citizen: '/user', authority: '/authority', admin: '/admin' }
const Ctx = createContext({})
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [profile, setProfile] = useState(null), [ready, setReady] = useState(false)
  useEffect(() => {
    const load = async (s) => { const u = s?.user || null; setUser(u); setProfile(u ? await getProfile(u.id) : null); setReady(true) }
    supabase.auth.getSession().then(({ data }) => load(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { setTimeout(() => load(s), 0) })
    return () => data.subscription.unsubscribe()
  }, [])
  return <Ctx.Provider value={{ user, profile, ready, role: profile?.role }}>{children}</Ctx.Provider>
}
