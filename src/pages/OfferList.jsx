import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePublicOffers } from '../hooks'
import OfferCard from '../components/OfferCard'
import OpLogo from '../components/OpLogo'
import { OPERATORS, CATEGORIES, effectiveStatus, calcDiscount, opById } from '../utils/offers'
const PAGE = 10
const Chip = ({ on, children, ...p }) => <button type="button" {...p} className={`shrink-0 snap-start min-h-[40px] rounded-full px-4 text-sm font-semibold border transition active:scale-95 flex items-center gap-2 ${on ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}>{children}</button>
export default function OfferList({ cat }) {
  const { t } = useApp(), { opId } = useParams(), { offers, loading } = usePublicOffers()
  const [q, setQ] = useState(''), [op, setOp] = useState(''), [c, setC] = useState(['all', 'search'].includes(cat) ? '' : cat || ''), [sort, setSort] = useState('latest'), [shown, setShown] = useState(PAGE)
  const fixedOp = opId && opById(opId) ? opId : op
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    let r = offers.filter(o => effectiveStatus(o) === 'active')
      .filter(o => !fixedOp || o.operatorId === fixedOp)
      .filter(o => !c || c === 'latest' || (c === 'discount' ? calcDiscount(o.regularPrice, o.offerPrice) > 0 : o.categoryId === c))
      .filter(o => !s || [o.title, o.operatorName, o.categoryId, o.internetData, o.minutes, o.sms, o.offerPrice, calcDiscount(o.regularPrice, o.offerPrice) + '%'].join(' ').toLowerCase().includes(s))
    if (sort === 'price') r = [...r].sort((a, b) => a.offerPrice - b.offerPrice)
    if (sort === 'discount') r = [...r].sort((a, b) => calcDiscount(b.regularPrice, b.offerPrice) - calcDiscount(a.regularPrice, a.offerPrice))
    return r
  }, [offers, q, fixedOp, c, sort])
  const cur = opId && opById(opId)
  return <>
    <h1 className="text-xl sm:text-2xl font-extrabold mb-3 flex items-center gap-3">{cur && <OpLogo op={cur} size={44} />}{cur ? cur.name : t(cat || 'all')}</h1>
    <div className="grid gap-2">
      <input className="input" type="search" placeholder={'🔍 ' + t('searchPh')} aria-label={t('search')} value={q} onChange={e => { setQ(e.target.value); setShown(PAGE) }} />
      {!opId && <div className="scroller !mb-0"><Chip on={!op} onClick={() => setOp('')}>{t('allOps')}</Chip>
        {OPERATORS.map(o => <Chip key={o.id} on={op === o.id} onClick={() => setOp(op === o.id ? '' : o.id)}><img src={o.logo} alt="" className="w-5 h-5 object-contain bg-white rounded-full p-0.5" />{o.name}</Chip>)}</div>}
      <div className="scroller !mb-0">{[['latest', 'latest'], ['price', 'lowPrice'], ['discount', 'highDisc']].map(([k, l]) => <Chip key={k} on={sort === k} onClick={() => setSort(k)}>{t(l)}</Chip>)}</div>
    </div>
    <p className="text-sm text-slate-500 my-2">{list.length} {t('offersCount')}</p>
    {loading ? <div className="grid gap-4 sm:grid-cols-2">{[1, 2].map(i => <div key={i} className="skeleton h-72" />)}</div>
      : !list.length ? <p className="card p-8 text-center">{t('noOffers')}</p>
      : <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, shown).map(o => <OfferCard key={o.id} o={o} />)}</div>
        {shown < list.length && <button className="btn btn-ghost mx-auto mt-6 block w-full sm:w-auto" onClick={() => setShown(shown + PAGE)}>{t('viewAll')} ↓</button>}</>}
  </>
}
