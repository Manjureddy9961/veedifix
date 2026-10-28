import { supabase as sb } from '../lib/supabase'
const ok = (r) => { if (r.error) throw r.error; return r.data }
export const listCategories = async () => ok(await sb.from('categories').select('*').order('id'))
export const addCategory = async (name, icon) => ok(await sb.from('categories').insert({ name, icon }))
export const deleteCategory = async (id) => ok(await sb.from('categories').delete().eq('id', id))
export const listUsers = async () => ok(await sb.from('profiles').select('*').order('created_at', { ascending: false }))
export const setRole = async (id, role) => ok(await sb.from('profiles').update({ role }).eq('id', id))
