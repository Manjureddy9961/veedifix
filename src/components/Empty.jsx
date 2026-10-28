export default function Empty({ icon = '📭', text }) {
  return <div className="text-center py-10 text-slate-500"><span className="bob">{icon}</span><p className="mt-2">{text}</p></div>
}