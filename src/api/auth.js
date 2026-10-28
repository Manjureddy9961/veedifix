import { supabase as sb } from '../lib/supabase'
export const signUp = (email, password, name) => sb.auth.signUp({ email, password, options: { data: { name } } })
export const signIn = (email, password) => sb.auth.signInWithPassword({ email, password })
// Google opens the account chooser, so the user picks from the Gmail accounts signed in on their device
export const googleSignIn = () => sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin, queryParams: { prompt: 'select_account' } } })
export const signOut = () => sb.auth.signOut()
export const getProfile = async (id) => (await sb.from('profiles').select('*').eq('id', id).maybeSingle()).data
