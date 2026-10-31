import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import OpLogo from './OpLogo'
import { opById, effectiveStatus, calcDiscount } from '../utils/offers'
export default function OfferCard({ o }) {
  const { t } = useApp(), op = opById(o.operatorId), st = effectiveStatus(o), d = calcDiscount(o.regularPrice, o.offerPrice), c = op?.color || '#0d9488'
  const badge = { active: 'bg-emerald-400/90 text-emerald-950', expired: 'bg-red-400/90 text-red-950', inactive: 'bg-slate-300/90 text-slate-800' }[st]
  return <article className="card overflow-hidden flex flex-col fade-up">
    <div className="relative p-4 text-white" style={{ background: `linear-gradient(135deg, ${c}, ${c}b3)` }}>
      {o.imageUrl && <img src={o.imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25" />}
      <div className="relative flex items-center gap-2 text-sm font-semibold">
        <OpLogo op={op} size={36} />{o.operatorName}
        <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${badge}`}>{t(st)}</span></div>
      <div className="relative mt-3 text-3xl font-extrabold leading-none">{o.internetData || (o.minutes ? `${o.minutes} ${t('minutes')}` : o.sms ? `${o.sms} ${t('smsL')}` : '—')}</div>
      {d > 0 && <span className="absolute right-3 bottom-3 rounded-full bg-amber-300 text-slate-900 px-2.5 py-0.5 text-sm font-extrabold shadow">-{d}%</span>}
    </div>
    <div className="p-4 flex flex-col gap-3 flex-1">
      <h3 className="font-bold leading-snug">{o.title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {o.internetData && <span className="chip">📶 {o.internetData}</span>}{o.minutes && <span className="chip">📞 {o.minutes} {t('minutes')}</span>}{o.sms && <span className="chip">✉️ {o.sms} {t('smsL')}</span>}
        <span className="chip">⏳ {o.validity} {t('days')}</span></div>
      {o.description && <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{o.description}</p>}
      <div className="flex items-end gap-2 mt-auto">
        <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">৳{o.offerPrice}</span>
        {Number(o.regularPrice) > Number(o.offerPrice) && <s className="text-slate-400 mb-1">৳{o.regularPrice}</s>}</div>
      <p className="text-xs text-slate-500">{t('expiry')}: {o.expiryDate}</p>
      <Link to={`/offer/${o.id}`} className="btn w-full">{t('details')}</Link></div></article>
}
