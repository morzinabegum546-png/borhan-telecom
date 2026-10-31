import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { ref, update } from 'firebase/database'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { useNotifs } from '../hooks'
export default function Notifications() {
  const { t, user, authReady } = useApp(), { list } = useNotifs(user)
  useEffect(() => { const u = list.filter(n => !n.read); if (user && u.length) update(ref(db), Object.fromEntries(u.map(n => [`notifications/${user.uid}/${n.id}/read`, true]))).catch(() => {}) }, [list, user])
  if (authReady && !user) return <Navigate to="/login" state={{ from: '/notifications' }} replace />
  return <><h1 className="text-2xl font-extrabold mb-4">🔔 {t('notifs')}</h1>
    {!list.length ? <p className="card p-8 text-center">{t('noNotifs')}</p> : <ul className="grid gap-2">{list.map(n => <li key={n.id} className={`card p-3 flex gap-3 ${n.read ? '' : 'border-teal-500'}`}>
      <span className="text-2xl">{n.type === 'confirmed' ? '✅' : '❌'}</span><div><p className="font-semibold">{t(n.type === 'confirmed' ? 'nConfirmed' : 'nCancelled')}</p>
      <p className="text-sm text-slate-500">{n.offerTitle} · {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p></div></li>)}</ul>}</>
}
