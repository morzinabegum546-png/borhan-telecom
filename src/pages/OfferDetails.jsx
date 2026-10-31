import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ref, onValue } from 'firebase/database'
import { db } from '../firebase/config'
import { useApp } from '../context/AppContext'
import { usePublicOffers } from '../hooks'
import BuyBox from '../components/BuyBox'
import OfferCard from '../components/OfferCard'
import { effectiveStatus, calcDiscount } from '../utils/offers'
export default function OfferDetails() {
  const { offerId } = useParams(), nav = useNavigate(), { t } = useApp(), { offers } = usePublicOffers()
  const [o, setO] = useState(undefined)
  useEffect(() => onValue(ref(db, 'offers/' + offerId), s => setO(s.exists() ? { id: s.key, ...s.val() } : null), () => setO(null)), [offerId])
  if (o === undefined) return <div className="skeleton h-72" />
  if (!o) return <p className="card p-8 text-center">{t('notFound')}</p>
  const st = effectiveStatus(o), d = calcDiscount(o.regularPrice, o.offerPrice)
  const related = offers.filter(x => x.id !== o.id && (x.operatorId === o.operatorId || x.categoryId === o.categoryId) && effectiveStatus(x) === 'active').slice(0, 3)
  return <>
    <button className="btn btn-ghost mb-4" onClick={() => nav(-1)}>← {t('back')}</button>
    <div className="card p-6 grid gap-3">
      {o.imageUrl && <img src={o.imageUrl} alt="" className="max-h-56 w-full object-cover rounded-xl" />}
      <h1 className="text-2xl font-bold">{o.title} <span className="text-base font-normal">({o.operatorName} · {t(st)})</span></h1>
      <p>{[o.internetData, o.minutes && `${o.minutes} ${t('minutes')}`, o.sms && `${o.sms} ${t('smsL')}`].filter(Boolean).join(' · ')}</p>
      <p className="text-3xl font-bold text-teal-600">৳{o.offerPrice} {Number(o.regularPrice) > Number(o.offerPrice) && <s className="text-base text-slate-500">৳{o.regularPrice}</s>} {d > 0 && <span className="text-base bg-amber-400 text-slate-900 rounded-full px-2">-{d}%</span>}</p>
      <p>{t('validity')}: {o.validity} {t('days')} · {t('start')}: {o.startDate} · {t('expiry')}: {o.expiryDate}</p>
      <h2 className="font-bold">{t('desc')}</h2><p className="whitespace-pre-line">{o.description}</p>
      <h2 className="font-bold">{t('terms')}</h2><p className="whitespace-pre-line">{o.terms}</p></div>
    <div className="mt-4"><BuyBox o={o} st={st} /></div>
    {!!related.length && <><h2 className="text-xl font-bold mt-8 mb-3">{t('related')}</h2><div className="grid gap-4 sm:grid-cols-3">{related.map(r => <OfferCard key={r.id} o={r} />)}</div></>}
  </>
}
