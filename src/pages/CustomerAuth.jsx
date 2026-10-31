import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { ref, set as dbSet, serverTimestamp } from 'firebase/database'
import { auth, db } from '../firebase/config'
import { withTimeout } from '../utils/timeout'
import { useApp } from '../context/AppContext'
export default function CustomerAuth({ mode }) {
  const { t, notify } = useApp(), nav = useNavigate(), from = useLocation().state?.from || '/'
  const reg = mode === 'register'
  const [f, setF] = useState({ name: '', phone: '', email: '', pw: '', pw2: '' }), [busy, setBusy] = useState(false), [show, setShow] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = async e => {
    e.preventDefault(); if (busy) return
    if (reg) {
      if (!f.name.trim()) return notify(t('vReq'), 'err')
      if (!/^01[3-9]\d{8}$/.test(f.phone)) return notify(t('phoneBad'), 'err')
      if (f.pw.length < 6) return notify(t('pwShort'), 'err')
      if (f.pw !== f.pw2) return notify(t('pwMismatch'), 'err')
    }
    setBusy(true)
    try {
      if (reg) {
        const { user } = await createUserWithEmailAndPassword(auth, f.email.trim().toLowerCase(), f.pw)
        await updateProfile(user, { displayName: f.name.trim() })
        await withTimeout(dbSet(ref(db, 'users/' + user.uid), { name: f.name.trim(), phone: f.phone, email: f.email.trim().toLowerCase(), role: 'customer', createdAt: serverTimestamp() }))
        notify(t('regDone'))
      } else await signInWithEmailAndPassword(auth, f.email.trim().toLowerCase(), f.pw)
      nav(from, { replace: true })
    } catch (e) { console.error(e); notify(`${t('err')} [${e.code || e.message}]`, 'err') } finally { setBusy(false) }
  }
  const reset = async () => { try { await sendPasswordResetEmail(auth, f.email); notify(t('resetSent')) } catch { notify(t('err'), 'err') } }
  return <form onSubmit={submit} className="card p-6 w-full max-w-sm mx-auto grid gap-3">
    <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700" role="tablist">
      {[['/login', t('login'), !reg], ['/register', t('register'), reg]].map(([to, label, on]) => <Link key={to} to={to} state={{ from }} role="tab" aria-selected={on}
        className={`text-center py-2 font-medium ${on ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{label}</Link>)}</div>
    <h1 className="text-xl font-bold text-teal-600">{reg ? t('custReg') : t('custLogin')}</h1>
    {reg && <><label>{t('name')}<input className="input" value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label>{t('phone')}<input className="input" inputMode="numeric" value={f.phone} onChange={set('phone')} autoComplete="tel" /></label></>}
    <label>{t('email')}<input className="input" type="email" required value={f.email} onChange={set('email')} autoComplete="username" /></label>
    <label>{t('password')}<div className="flex gap-2"><input className="input" type={show ? 'text' : 'password'} required value={f.pw} onChange={set('pw')} autoComplete={reg ? 'new-password' : 'current-password'} />
      <button type="button" className="btn btn-ghost" onClick={() => setShow(!show)}>{show ? t('hide') : t('show')}</button></div></label>
    {reg && <label>{t('confirmPw')}<input className="input" type="password" value={f.pw2} onChange={set('pw2')} autoComplete="new-password" /></label>}
    <button className="btn" disabled={busy}>{reg ? t('register') : t('login')}</button>
    {!reg && <button type="button" className="text-sm text-teal-600 underline" onClick={reset} disabled={!f.email}>{t('forgot')}</button>}
    <p className="text-sm">{reg ? t('haveAcc') : t('noAcc')} <Link className="text-teal-600 underline" to={reg ? '/login' : '/register'} state={{ from }}>{reg ? t('login') : t('register')}</Link></p></form>
}
