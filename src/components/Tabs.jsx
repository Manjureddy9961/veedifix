export default function Tabs({ tabs, value, onChange }) {
  return <div className="flex gap-2 mb-3 overflow-x-auto">{tabs.map(([k, l]) => <button key={k} className={`pill2 ${value === k ? 'on' : ''}`} onClick={() => onChange(k)}>{l}</button>)}</div>
}
