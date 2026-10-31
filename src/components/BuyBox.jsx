import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ref, push, update, serverTimestamp } from 'firebase/database'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { usePayment } from '../hooks'
const isPhone = s => /^01[3-9]\d{8}$/.test(s)
export default function BuyBox({ o, st }) {
  const { t, user, isAdmin, notify } = useApp(), loc = useLocation(), pay = usePayment()
  const avail = ['bkash', 'nagad', 'rocket'].filter(m => pay[m])
  const [f, setF] = useState({ method: '', sim: '', sender: '', trx: '' }), [busy, setBusy] = useState(false), [done, setDone] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value }), method = f.method || avail[0]
  if (st !== 'active') return <p className="card p-4">{t('unavailable')}</p>
  if (isAdmin) return null
  if (!user) return <Link className="btn" to="/login" state={{ from: loc.pathname }}>{t('loginToBuy')}</Link>
  if (done) return <p className="card p-4 text-teal-700">{t('orderPlaced')} <Link className="underline" to="/my-orders">{t('myOrders')}</Link></p>
  if (!avail.length) return <p className="card p-4">{t('noPay')}</p>
  const copy = n => { navigator.clipboard?.writeText(n); notify(t('copied')) }
  const order = async e => {
    e.preventDefault(); if (busy) return
    const trx = f.trx.trim().toUpperCase()
    if (!isPhone(f.sim) || !isPhone(f.sender)) return notify(t('phoneBad'), 'err')
    if (!/^[A-Z0-9]{6,20}$/.test(trx)) return notify(t('trxBad'), 'err')
    setBusy(true)
    try {
      const id = push(ref(db, 'orders')).key
      // one atomic write: the order + a unique TrxID marker (a reused TrxID makes the whole write fail)
      await update(ref(db), { ['orders/' + id]: { offerId: o.id, offerTitle: o.title, operatorName: o.operatorName, price: Number(o.offerPrice), simNumber: f.sim,
        paymentMethod: method, senderNumber: f.sender, trxId: trx, userId: user.uid, userName: user.displayName || '', userEmail: user.email, status: 'pending', createdAt: serverTimestamp() }, ['trx/' + trx]: user.uid })
      setDone(true); notify(t('orderPlaced'))
    } catch (e) { notify(e.code === 'PERMISSION_DENIED' ? t('trxUsed') : `${t('err')} [${e.code || e.message}]`, 'err') } finally { setBusy(false) }
  }
  return <form onSubmit={order} className="card p-4 grid gap-3"><h2 className="font-bold">{t('buy')} · ৳{o.offerPrice}</h2>
    <div className="grid gap-2">{avail.map(m => <label key={m} className={`flex items-center gap-2 rounded-xl border p-3 ${method === m ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-white/10'}`}>
      <input type="radio" name="m" checked={method === m} onChange={() => setF({ ...f, method: m })} /><span className="font-semibold">{t(m)}</span>
      <span className="ml-auto font-mono">{pay[m]}</span><button type="button" className="chip" onClick={() => copy(pay[m])}>{t('copy')}</button></label>)}</div>
    <p className="text-sm">{t('sendTo')} · {t('amount')}: <b>৳{o.offerPrice}</b></p>{pay.note && <p className="text-xs text-slate-500">{pay.note}</p>}
    <label>{t('orderFor')}<input className="input" inputMode="numeric" value={f.sim} onChange={set('sim')} /></label>
    <label>{t('senderNo')}<input className="input" inputMode="numeric" value={f.sender} onChange={set('sender')} /></label>
    <label>{t('trxId')}<input className="input uppercase" value={f.trx} onChange={set('trx')} autoCapitalize="characters" /></label>
    <p className="text-xs text-slate-500">{t('payNote')}</p><button className="btn" disabled={busy}>{t('placeOrder')}</button></form>
}
