import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ref, update, remove, serverTimestamp } from 'firebase/database'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { useAdminOffers } from '../hooks'
import OpLogo from '../components/OpLogo'
import { OPERATORS, effectiveStatus, opById } from '../utils/offers'
export default function AdminOffers({ only }) {
  const { t, notify } = useApp(), { offers, loading } = useAdminOffers(), [q, setQ] = useState(''), [op, setOp] = useState('')
  const list = offers.filter(o => (!only || effectiveStatus(o) === only) && (!op || o.operatorId === op) && (!q || o.title?.toLowerCase().includes(q.toLowerCase())))
  const toggle = async o => { try { await update(ref(db, 'offers/' + o.id), { status: o.status === 'active' ? 'inactive' : 'active', updatedAt: serverTimestamp() }) } catch { notify(t('err'), 'err') } }
  const del = async o => { if (!confirm(t('confirmDel'))) return; try { await remove(ref(db, 'offers/' + o.id)); notify(t('deleted')) } catch { notify(t('err'), 'err') } }
  return <><div className="grid gap-2 mb-4 sm:flex"><h1 className="text-2xl font-extrabold sm:mr-auto">{t(only ? only + 'Offers' : 'offers')}</h1>
    <input className="input sm:!w-48" type="search" placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} />
    <select className="input sm:!w-44" value={op} onChange={e => setOp(e.target.value)}><option value="">{t('allOps')}</option>{OPERATORS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
    <Link className="btn" to="/admin/add-offer">+ {t('addOffer')}</Link></div>
    {loading ? <div className="skeleton h-40" /> : !list.length ? <p className="card p-8 text-center">{t('noOffers')}</p> :
    <div className="grid gap-3 lg:grid-cols-2">{list.map(o => <div key={o.id} className="card p-3 grid gap-2">
      <div className="flex items-center gap-3"><OpLogo op={opById(o.operatorId)} size={40} /><div className="min-w-0 flex-1"><div className="font-bold truncate">{o.title}</div>
        <div className="text-xs text-slate-500">{o.operatorName} · ৳{o.offerPrice} · {o.expiryDate}</div></div><span className="chip">{t(effectiveStatus(o))}</span></div>
      <div className="grid grid-cols-3 gap-2"><Link className="btn btn-ghost !px-2" to={`/admin/edit-offer/${o.id}`}>{t('edit')}</Link>
        <button className="btn btn-ghost !px-2" onClick={() => toggle(o)}>{o.status === 'active' ? t('deactivate') : t('activate')}</button>
        <button className="btn !bg-red-600 !px-2" onClick={() => del(o)}>{t('del')}</button></div></div>)}</div>}</>
}
