import { useEffect, useState } from 'react'
import { ref, set as dbSet } from 'firebase/database'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { usePayment } from '../hooks'
export default function PaymentSettings() {
  const { t, notify } = useApp(), pay = usePayment(), [f, setF] = useState({ bkash: '', nagad: '', rocket: '', note: '' }), [busy, setBusy] = useState(false)
  useEffect(() => setF(x => ({ ...x, ...pay })), [pay])
  const save = async e => {
    e.preventDefault()
    if (['bkash', 'nagad', 'rocket'].some(k => f[k] && !/^01[3-9]\d{8}$/.test(f[k]))) return notify(t('phoneBad'), 'err')
    setBusy(true)
    try { await dbSet(ref(db, 'appSettings/payment'), { bkash: f.bkash, nagad: f.nagad, rocket: f.rocket, note: f.note }); notify(t('saved')) }
    catch (e) { notify(`${t('err')} [${e.code || e.message}]`, 'err') } finally { setBusy(false) }
  }
  return <form onSubmit={save} className="card p-4 sm:p-6 grid gap-3 max-w-xl w-full"><h1 className="text-2xl font-extrabold">{t('settings')}</h1><p className="text-sm text-slate-500">{t('payNumbers')}</p>
    {['bkash', 'nagad', 'rocket'].map(k => <label key={k}>{t(k)}<input className="input" inputMode="numeric" placeholder="01XXXXXXXXX" value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value.trim() })} /></label>)}
    <label>{t('payNoteLbl')}<textarea className="input" rows="2" maxLength="200" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></label>
    <button className="btn" disabled={busy}>{t('save')}</button></form>
}
