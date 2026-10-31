import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { usePublicOffers } from '../hooks'
import OpLogo from '../components/OpLogo'
import OfferCard from '../components/OfferCard'
import { OPERATORS, effectiveStatus } from '../utils/offers'
const CATS = [['/internet', 'internet', '📶'], ['/minutes', 'minute', '📞'], ['/combo', 'combo', '🎁'], ['/drive', 'drive', '🚗'], ['/popular', 'popular', '❤️'], ['/sms', 'sms', '✉️'], ['/special', 'special', '⭐'], ['/discount', 'discount', '🏷️'], ['/latest', 'latest', '🆕'], ['/offers', 'all', '🔥']]
export default function Home() {
  const { t, user, isAdmin, authReady } = useApp(), nav = useNavigate(), { offers, loading } = usePublicOffers()
  const clicks = useRef(0), timer = useRef(null)
  // One click (then 0.7s pause) -> customer login. 10 rapid consecutive clicks -> hidden admin login.
  // Navigation only, NOT security: admin access is enforced by Firebase rules.
  const secret = () => {
    clearTimeout(timer.current); clicks.current += 1
    if (clicks.current >= 10) { clicks.current = 0; nav('/admin/login'); return }
    timer.current = setTimeout(() => { clicks.current = 0; nav('/login') }, 700)
  }
  const live = offers.filter(o => effectiveStatus(o) === 'active')
  return <div className="grid gap-8 grid-cols-[minmax(0,1fr)]">
    <section className="rounded-3xl p-6 sm:p-10 md:p-14 text-white bg-gradient-to-br from-teal-600 via-slate-900 to-indigo-900 relative overflow-hidden shadow-xl shadow-teal-900/20">
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-teal-300/25 blur-2xl floaty" aria-hidden />
      <div className="absolute -left-10 bottom-0 w-56 h-56 rounded-full bg-indigo-400/25 blur-2xl floaty" style={{ animationDelay: '-3s' }} aria-hidden />
      <div className="relative max-w-xl fade-up">
        <span className="chip !bg-white/15 !text-white">📡 {live.length} {t('offersCount')}</span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold leading-tight">{t('welcome')}</h1>
        <p className="mt-3 text-base sm:text-lg text-white/85">{t('tagline')}</p>
        <div className="mt-6 grid grid-cols-2 sm:flex gap-3">
          <Link to="/search" className="btn !bg-white !text-teal-800 !shadow-lg">🔍 {t('searchOffers')}</Link>
          {authReady && (user
            ? <Link to={isAdmin ? '/admin/dashboard' : '/my-orders'} className="btn btn-ghost !text-white !bg-white/10 !border-white/30">{isAdmin ? t('dashboard') : '🧾 ' + t('myOrders')}</Link>
            : <button type="button" onClick={secret} className="btn btn-ghost !text-white !bg-white/10 !border-white/30">{t('customer')}</button>)}</div></div>
    </section>
    <section><div className="grid grid-cols-5 gap-1.5 sm:gap-3 sm:grid-cols-10">{CATS.map(([to, k, ic]) =>
      <Link key={to} to={to} className="tile"><span className="text-2xl">{ic}</span><span className="leading-tight">{t(k).replace(/ ?(অফার|Offers)/, '')}</span></Link>)}</div></section>
    <section><h2 className="text-lg sm:text-xl font-extrabold mb-3">{t('operators')}</h2>
      <div className="scroller sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">{OPERATORS.map(op => {
        const n = live.filter(o => o.operatorId === op.id).length
        return <Link key={op.id} to={`/operator/${op.id}`} className="card snap-start shrink-0 w-40 sm:w-auto p-4 grid gap-2 text-white border-0 transition active:scale-95" style={{ background: `linear-gradient(145deg, ${op.color}, ${op.color}99)` }}>
          <OpLogo op={op} size={52} />
          <span className="font-bold">{op.name}</span><span className="text-sm text-white/90">{n} {t('offersCount')}</span></Link> })}</div></section>
    <section><div className="flex items-center mb-3"><h2 className="text-lg sm:text-xl font-extrabold">{t('latest')}</h2><Link to="/latest" className="ml-auto text-teal-600 font-semibold text-sm">{t('viewAll')} →</Link></div>
      {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2].map(i => <div key={i} className="skeleton h-72" />)}</div>
        : !live.length ? <p className="card p-8 text-center text-slate-500">{t('noOffers')}</p>
        : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{live.slice(0, 4).map(o => <OfferCard key={o.id} o={o} />)}</div>}</section>
  </div>
}
