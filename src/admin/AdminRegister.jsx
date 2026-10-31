import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { withTimeout } from '../utils/timeout'
import { ref, set as dbSet, get, serverTimestamp } from 'firebase/database'
import { auth, db } from '../firebase/config'
import { useApp } from '../context/AppContext'
export default function AdminRegister() {
  const { t, notify } = useApp(), [f, setF] = useState({ name: '', phone: '', email: '', pw: '', pw2: '' }), [busy, setBusy] = useState(false), [done, setDone] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = async e => {
    e.preventDefault(); if (busy) return
    if (!f.name.trim()) return notify(t('vReq'), 'err')
    if (!/^01[3-9]\d{8}$/.test(f.phone)) return notify(t('phoneBad'), 'err')
    if (f.pw.length < 8) return notify(t('pwShort'), 'err')
    if (f.pw !== f.pw2) return notify(t('pwMismatch'), 'err')
    setBusy(true)
    const email = f.email.trim().toLowerCase()   // auth.token.email is always lowercase; rules compare against it
    try {
      let user
      try { user = (await createUserWithEmailAndPassword(auth, email, f.pw)).user }
      catch (e) { // account exists from an earlier attempt whose database write failed -> reuse it
        if (e.code !== 'auth/email-already-in-use') throw e
        user = (await signInWithEmailAndPassword(auth, email, f.pw)).user
      }
      await updateProfile(user, { displayName: f.name.trim() })
      const old = await withTimeout(get(ref(db, 'admins/' + user.uid)))
      if (!old.exists()) await withTimeout(dbSet(ref(db, 'admins/' + user.uid), { name: f.name.trim(), phone: f.phone, email, status: 'pending', createdAt: serverTimestamp() }))
      await signOut(auth); setDone(true)
    } catch (e) { console.error(e); notify(`${t('err')} [${e.code || e.message}]`, 'err') } finally { setBusy(false) }
  }
  return <div className="min-h-screen grid place-items-center p-4">
    {done ? <div className="card p-6 w-full max-w-sm grid gap-3"><p>{t('adminReqSent')}</p><Link className="btn" to="/admin/login">{t('backLogin')}</Link></div> :
    <form onSubmit={submit} className="card p-6 w-full max-w-sm grid gap-3">
      <h1 className="text-xl font-bold text-teal-600">{t('adminRegTitle')}</h1>
      <label>{t('name')}<input className="input" value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label>{t('phone')}<input className="input" inputMode="numeric" value={f.phone} onChange={set('phone')} /></label>
      <label>{t('email')}<input className="input" type="email" required value={f.email} onChange={set('email')} autoComplete="username" /></label>
      <label>{t('password')}<input className="input" type="password" required value={f.pw} onChange={set('pw')} autoComplete="new-password" /></label>
      <label>{t('confirmPw')}<input className="input" type="password" required value={f.pw2} onChange={set('pw2')} autoComplete="new-password" /></label>
      <button className="btn" disabled={busy}>{t('regAdmin')}</button>
      <Link className="text-sm text-teal-600 underline" to="/admin/login">{t('backLogin')}</Link></form>}</div>
}
