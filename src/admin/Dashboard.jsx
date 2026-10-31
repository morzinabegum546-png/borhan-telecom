import { useApp } from '../context/AppContext'
import { useAdminOffers } from '../hooks'
import { OPERATORS, effectiveStatus } from '../utils/offers'
export default function Dashboard() {
  const { t } = useApp(), { offers } = useAdminOffers(), c = s => offers.filter(o => effectiveStatus(o) === s).length
  const stats = [[t('total'), offers.length], [t('active'), c('active')], [t('expired'), c('expired')], [t('inactive'), c('inactive')], [t('totalOps'), OPERATORS.length]]
  return <><h1 className="text-2xl font-bold mb-4">{t('dashboard')}</h1>
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">{stats.map(([l, n]) => <div key={l} className="card p-4"><div className="text-3xl font-bold text-teal-600">{n}</div><div className="text-sm">{l}</div></div>)}</div>
    <h2 className="font-bold mt-6 mb-2">{t('recent')}</h2>
    <ul className="card divide-y divide-slate-200 dark:divide-slate-800">{offers.slice(0, 5).map(o => <li key={o.id} className="p-3 flex justify-between"><span>{o.title} · {o.operatorName}</span><span>{t(effectiveStatus(o))}</span></li>)}</ul></>
}
