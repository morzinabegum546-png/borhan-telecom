import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ref, get, set as dbSet, push, update, serverTimestamp } from 'firebase/database'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { OPERATORS, CATEGORIES, calcDiscount, todayDhaka, opById } from '../utils/offers'
const empty = { operatorId: '', title: '', categoryId: '', internetData: '', minutes: '', sms: '', regularPrice: '', offerPrice: '', validity: '', startDate: todayDhaka(), expiryDate: '', description: '', terms: '', status: 'active' }
export default function OfferForm() {
  const { offerId } = useParams(), { t, notify, user } = useApp(), nav = useNavigate()
  const [f, setF] = useState(empty), [busy, setBusy] = useState(false)
  useEffect(() => { if (offerId) get(ref(db, 'offers/' + offerId)).then(s => s.exists() && setF({ ...empty, ...s.val() })) }, [offerId])
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const disc = calcDiscount(f.regularPrice, f.offerPrice)
  const submit = async e => {
    e.preventDefault(); if (busy) return
    const reg = Number(f.regularPrice), off = Number(f.offerPrice)
    if (!f.operatorId || !String(f.title).trim() || !f.categoryId || !f.expiryDate || !f.startDate || !f.validity) return notify(t('vReq'), 'err')
    if (!isFinite(reg) || !isFinite(off) || reg <= 0 || off < 0 || off > reg) return notify(t('vPrice'), 'err')
    if (f.expiryDate < f.startDate) return notify(t('vDate'), 'err')
    setBusy(true)
    try {
      const data = { operatorId: f.operatorId, operatorName: opById(f.operatorId).name, categoryId: f.categoryId, title: String(f.title).trim(), internetData: f.internetData, minutes: f.minutes, sms: f.sms,
        regularPrice: reg, offerPrice: off, discountPercentage: disc, validity: Number(f.validity), startDate: f.startDate, expiryDate: f.expiryDate, description: f.description, terms: f.terms, status: f.status, updatedAt: serverTimestamp() }
      if (offerId) await update(ref(db, 'offers/' + offerId), data)
      else await dbSet(push(ref(db, 'offers')), { ...data, createdAt: serverTimestamp(), createdBy: user.uid })
      notify(t('saved')); nav('/admin/offers')
    } catch { notify(t('err'), 'err') } finally { setBusy(false) }
  }
  const T = (k, label, type = 'text') => <label>{label}<input className="input" type={type} value={f[k]} onChange={set(k)} /></label>
  return <form onSubmit={submit} className="card p-4 sm:p-6 grid gap-3 max-w-2xl w-full">
    <h1 className="text-2xl font-bold">{t('addOffer')}</h1>
    <label>{t('operator')}<select className="input" value={f.operatorId} onChange={set('operatorId')}><option value="" />{OPERATORS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
    {T('title', t('title'))}
    <label>{t('category')}<select className="input" value={f.categoryId} onChange={set('categoryId')}><option value="" />{CATEGORIES.map(c => <option key={c} value={c}>{t(c)}</option>)}</select></label>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{T('internetData', t('data'))}{T('minutes', t('minutes'))}{T('sms', t('smsL'))}</div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{T('regularPrice', t('regular'), 'number')}{T('offerPrice', t('price'), 'number')}<label>{t('discountPct')}<input className="input" readOnly value={disc} /></label></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{T('validity', t('validity') + ' (' + t('days') + ')', 'number')}{T('startDate', t('start'), 'date')}{T('expiryDate', t('expiry'), 'date')}</div>
    <label>{t('desc')}<textarea className="input" rows="3" value={f.description} onChange={set('description')} /></label>
    <label>{t('terms')}<textarea className="input" rows="3" value={f.terms} onChange={set('terms')} /></label>
    <label>{t('status')}<select className="input" value={f.status} onChange={set('status')}><option value="active">{t('active')}</option><option value="inactive">{t('inactive')}</option></select></label>
    <button className="btn" disabled={busy}>{busy ? t('saving') : t('save')}</button></form>
}
