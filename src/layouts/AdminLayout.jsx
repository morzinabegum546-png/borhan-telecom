import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'
const items = [['dashboard', 'dashboard'], ['offers', 'offers'], ['add-offer', 'addOffer'], ['active-offers', 'activeOffers'], ['expired-offers', 'expiredOffers'], ['orders', 'manageOrders'], ['settings', 'settings'], ['profile', 'profile']]
export default function AdminLayout() {
  const { t, logout, lang, setLang, dark, setDark } = useApp()
  return <div className="min-h-screen md:flex overflow-x-hidden">
    <aside className="md:w-60 bg-slate-900 text-slate-100 p-4 md:min-h-screen">
      <div className="font-bold text-teal-400 mb-4">{t('brand')} · Admin</div>
      <nav className="flex md:flex-col gap-1 overflow-x-auto">{items.map(([to, k]) =>
        <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded px-3 py-2 ${isActive ? 'bg-teal-600' : 'hover:bg-slate-800'}`}>{t(k)}</NavLink>)}</nav>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-ghost !text-white" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}>{lang === 'bn' ? 'EN' : 'বাং'}</button>
        <button className="btn btn-ghost !text-white" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
        <button className="btn" onClick={logout}>{t('logout')}</button></div>
    </aside>
    <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-8"><Outlet /></main></div>
}
