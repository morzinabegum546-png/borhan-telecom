import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { OPERATORS } from '../utils/offers'
import { useNotifs } from '../hooks'
const OFFER_SUB = [['/offers', 'all', '🔥'], ['/internet', 'internet', '📶'], ['/minutes', 'minute', '📞'], ['/combo', 'combo', '🎁'], ['/drive', 'drive', '🚗'], ['/sms', 'sms', '✉️'],
  ['/special', 'special', '⭐'], ['/discount', 'discount', '🏷️'], ['/latest', 'latest', '🆕'], ['/popular', 'popular', '❤️']]
const short = s => s.replace(/ ?(অফার|Offers)/, '')
const groupOf = p => p === '/' ? 'home' : p.startsWith('/operator') ? 'ops'
  : ['/login', '/register', '/my-orders', '/notifications'].includes(p) ? 'acct'
  : (OFFER_SUB.some(([to]) => to === p) || p === '/search' || p.startsWith('/offer/')) ? 'offers' : null
export default function UserLayout() {
  const { t, lang, setLang, dark, setDark, user, isAdmin, logout, notify } = useApp(), [menu, setMenu] = useState(false), nav = useNavigate(), { pathname } = useLocation()
  useEffect(() => { setMenu(false); window.scrollTo(0, 0) }, [pathname])
  const g = groupOf(pathname), customer = user && !isAdmin
  const { list, loaded } = useNotifs(customer ? user : null), unread = list.filter(n => !n.read).length, seen = useRef(null)
  const [ins, setIns] = useState(null)
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone
  useEffect(() => { const h = e => { e.preventDefault(); setIns(e) }; window.addEventListener('beforeinstallprompt', h); return () => window.removeEventListener('beforeinstallprompt', h) }, [])
  useEffect(() => { // toast for notifications that arrive while the app is open
    if (!loaded) { seen.current = null; return }
    if (seen.current) list.filter(n => !seen.current.has(n.id) && !n.read).forEach(n => notify(t(n.type === 'confirmed' ? 'nConfirmed' : 'nCancelled'), n.type === 'confirmed' ? 'ok' : 'err'))
    seen.current = new Set(list.map(n => n.id))
  }, [list, loaded])
  const tabs = [['home', '/', '🏠', t('home')], ['offers', '/offers', '📶', t('all')], ['ops', '/operator/grameenphone', '📡', t('operators')], ['acct', customer ? '/my-orders' : '/login', '👤', customer ? t('myOrders') : t('login')]]
  const round = 'w-10 h-10 grid place-items-center rounded-full bg-slate-100 dark:bg-white/10 text-lg active:scale-90 transition'
  return <div className="min-h-screen flex flex-col">
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm shadow-slate-900/5">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-12 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 min-w-0 font-extrabold text-teal-600 text-lg">
          <img src="/logo.png" alt="" width="34" height="34" className="w-[34px] h-[34px] rounded-lg shrink-0" /><span className="truncate">{t('brand')}</span></Link>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {customer && <Link to="/notifications" className={round + ' relative'} aria-label={t('notifs')}>🔔{unread > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold grid place-items-center">{unread}</span>}</Link>}
          <button className={round} aria-label={t('search')} onClick={() => nav('/search')}>🔍</button>
          <button className={round + ' !text-xs font-bold'} aria-label={t('language')} onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}>{lang === 'bn' ? 'EN' : 'বাং'}</button>
          <button className={round} aria-label="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button></div></div>
      <nav className="max-w-6xl mx-auto grid grid-cols-4 border-t border-slate-100 dark:border-white/5" aria-label="main">
        {tabs.map(([k, to, ic, label]) => <Link key={k} to={to} aria-current={g === k ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center h-12 text-[11px] font-semibold transition active:scale-95 ${g === k ? 'text-teal-600' : 'text-slate-500 dark:text-slate-400'}`}>
          <span className={`text-xl leading-none ${g === k ? '' : 'grayscale opacity-70'}`}>{ic}</span><span className="truncate max-w-full px-1">{label}</span>
          {g === k && <span className="absolute bottom-0 inset-x-4 h-[3px] rounded-t-full bg-teal-600" />}</Link>)}</nav>
      {(g === 'offers' || g === 'ops') && <div key={g} className="fade-up border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900/60">
        <div className="max-w-6xl mx-auto scroller !mx-auto !my-0 px-3 py-2 !gap-2" role="navigation" aria-label="sub">
          {g === 'offers' ? OFFER_SUB.map(([to, k, ic]) => <NavLink key={to} to={to} end className={({ isActive }) => `shrink-0 snap-start min-h-[36px] px-3.5 rounded-full text-sm font-semibold flex items-center gap-1.5 border transition active:scale-95 ${isActive ? 'bg-teal-600 border-teal-600 text-white shadow shadow-teal-600/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}><span>{ic}</span>{short(t(k))}</NavLink>)
            : OPERATORS.map(o => <NavLink key={o.id} to={`/operator/${o.id}`} className={({ isActive }) => `shrink-0 snap-start min-h-[36px] pl-1.5 pr-3.5 rounded-full text-sm font-semibold flex items-center gap-2 border transition active:scale-95 ${isActive ? 'bg-teal-600 border-teal-600 text-white shadow shadow-teal-600/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}>
              <img src={o.logo} alt="" className="w-6 h-6 rounded-full bg-white object-contain p-0.5" />{o.name}</NavLink>)}</div></div>}
      {menu && <><button className="fixed inset-0 top-12 bg-black/40 -z-10" aria-label="close" onClick={() => setMenu(false)} />
        <div className="fade-up absolute inset-x-0 top-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/10 shadow-xl">
          <div className="max-w-6xl mx-auto p-3 grid gap-2 sm:grid-cols-2">
            {customer ? <><Link className="btn" to="/my-orders">🧾 {t('myOrders')}</Link><button className="btn btn-ghost" onClick={logout}>{t('logout')}</button></>
              : !user && <><Link className="btn" to="/login">{t('login')}</Link><Link className="btn btn-ghost" to="/register">{t('register')}</Link></>}
            {ins && <button className="btn sm:col-span-2" onClick={async () => { ins.prompt(); await ins.userChoice; setIns(null) }}>📲 {t('install')}</button>}
            {ios && !standalone && <p className="text-sm text-slate-500 sm:col-span-2">📲 {t('iosHint')}</p>}
            <button className="btn btn-ghost" onClick={() => setDark(!dark)}>{dark ? '☀️ ' + t('lightMode') : '🌙 ' + t('darkMode')}</button>
            <button className="btn btn-ghost" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}>🌐 {t('language')}: {lang === 'bn' ? 'English' : 'বাংলা'}</button></div></div></>}
    </header>
    <main className="flex-1 min-w-0 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6"><Outlet /></main>
    <footer className="text-center text-xs sm:text-sm text-slate-500 py-6 px-4">© BORHAN TELECOM · {t('footer')}</footer>
  </div>
}
