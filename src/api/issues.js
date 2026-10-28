import { supabase as sb } from '../lib/supabase'
const ok = (r) => { if (r.error) throw r.error; return r.data }
// Fetched separately and joined here, so it works even if Supabase's relationship cache is stale
export const listIssues = async () => {
  const [i, c, p] = await Promise.all([sb.from('issues').select('*').order('created_at', { ascending: false }), sb.from('categories').select('*'), sb.from('profiles').select('id,name,email')])
  const cm = Object.fromEntries(ok(c).map((x) => [x.id, x])), pm = Object.fromEntries((p.data || []).map((x) => [x.id, x]))
  return ok(i).map((x) => ({ ...x, categories: cm[x.category_id] || null, profiles: pm[x.user_id] || null }))
}
export const setStatus = async (id, status) => ok(await sb.from('issues').update({ status }).eq('id', id))
export const upvote = async (id) => ok(await sb.rpc('upvote', { p_issue: id }))
export const deleteIssue = async (id) => ok(await sb.from('issues').delete().eq('id', id))
export async function createIssue(f, file, uid) {
  let photo_url = null
  if (file) {
    const blob = await shrink(file), path = `${uid}/${Date.now()}.jpg`
    ok(await sb.storage.from('issue-photos').upload(path, blob, { contentType: 'image/jpeg' }))
    photo_url = sb.storage.from('issue-photos').getPublicUrl(path).data.publicUrl
  }
  return ok(await sb.from('issues').insert({ ...f, photo_url, user_id: uid }))
}
const shrink = (f) => new Promise((res, rej) => {
  const im = new Image()
  im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); c.toBlob((b) => (b ? res(b) : rej(new Error('Image error'))), 'image/jpeg', 0.7) }
  im.onerror = () => rej(new Error('Image error')); im.src = URL.createObjectURL(f)
})