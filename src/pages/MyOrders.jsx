import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database'
import { db } from '../firebase/config'
import { toList } from '../hooks'
import { useApp } from '../context/AppContext'
export default function MyOrders() {
  const { t, user, authReady } = useApp(), [list, setList] = useState([])
  useEffect(() => { if (!user) return; return onValue(query(ref(db, 'orders'), orderByChild('userId'), equalTo(user.uid)),
    s => setList(toList(s).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))), () => {}) }, [user])
  if (authReady && !user) return <Navigate to="/login" state={{ from: '/my-orders' }} replace />
  const badge = { pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-red-100 text-red-800' }
  return <><h1 className="text-2xl font-extrabold mb-4">{t('myOrders')}</h1>
    {!list.length ? <p className="card p-8 text-center">{t('noOrders')}</p> :
      <ul className="grid gap-3">{list.map(o => <li key={o.id} className="card p-3 grid gap-1">
        <div className="flex justify-between gap-2"><b>{o.offerTitle}</b><span className={`chip ${badge[o.status] || ''}`}>{t(o.status)}</span></div>
        <div className="text-sm text-slate-500">{o.operatorName} · 📞 {o.simNumber} · ৳{o.price}</div>
        <div className="text-xs text-slate-500">{t(o.paymentMethod || 'bkash')} · TrxID: <span className="font-mono">{o.trxId}</span></div></li>)}</ul>}</>
}
