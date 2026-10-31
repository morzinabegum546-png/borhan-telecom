import { useEffect, useState } from 'react'
import { ref, query, orderByChild, limitToLast, onValue, update, push, serverTimestamp } from 'firebase/database'
import { toList } from '../hooks'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
export default function AdminOrders() {
  const { t, notify } = useApp(), [list, setList] = useState([])
  useEffect(() => onValue(query(ref(db, 'orders'), orderByChild('createdAt'), limitToLast(200)), s => setList(toList(s).reverse())), [])
  const act = async (o, status) => {
    try { const nid = push(ref(db, 'notifications/' + o.userId)).key   // order status + customer notification in one atomic write
      await update(ref(db), { ['orders/' + o.id + '/status']: status, ['notifications/' + o.userId + '/' + nid]: { type: status, orderId: o.id, offerTitle: o.offerTitle, createdAt: serverTimestamp(), read: false } })
      notify(t(status))
    } catch (e) { notify(`${t('err')} [${e.code || e.message}]`, 'err') }
  }
  return <><h1 className="text-2xl font-bold mb-4">{t('manageOrders')}</h1>
    {!list.length ? <p className="card p-8 text-center">{t('noOrders')}</p> :
      <div className="grid gap-3 lg:grid-cols-2">{list.map(o => <div key={o.id} className="card p-3 grid gap-2">
        <div className="flex justify-between gap-2"><div className="font-bold">{o.offerTitle}<div className="text-xs font-normal text-slate-500">{o.operatorName} · ৳{o.price}</div></div><span className="chip h-fit">{t(o.status)}</span></div>
        <div className="text-sm">{o.userName} · {o.userEmail}</div><a href={`tel:${o.simNumber}`} className="font-mono text-teal-600 font-bold">📞 {o.simNumber}</a>
        <div className="text-sm rounded-lg bg-slate-100 dark:bg-white/5 p-2">{t(o.paymentMethod || 'bkash')} · {o.senderNumber}<br /><b className="font-mono">{o.trxId}</b> · ৳{o.price}</div>
        {o.status === 'pending' && <div className="grid grid-cols-2 gap-2"><button className="btn" onClick={() => act(o, 'confirmed')}>{t('confirmed')}</button><button className="btn btn-ghost" onClick={() => act(o, 'cancelled')}>{t('cancelled')}</button></div>}</div>)}</div>}</>
}
